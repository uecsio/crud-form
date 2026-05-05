/**
 * Form Data Management Composable
 *
 * Handles form data loading, submission, and state management.
 * Uses @uecsio/api-client for API integration.
 */

import { ref, reactive, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useFormMappers } from './useFormMappers.js'

export function useFormData(props, mappers = {}) {
  const router = useRouter()
  const { t } = useI18n()
  const apiClient = inject('crudFormApiClient')
  const { applyAfterLoad, applyBeforeSubmit } = useFormMappers(mappers)

  // Reactive data
  const formData = reactive({})
  const formLoaded = ref(false)
  const isLoading = ref(false)

  // Computed
  const isCreateForm = computed(() => !props.modelId)

  /**
   * Loads form data for create or edit mode
   */
  const loadFormData = async () => {
    if (isCreateForm.value) {
      const mappedModel = applyAfterLoad({ ...props.model })
      Object.assign(formData, mappedModel)
    } else {
      const params = props.extraQueryString
        ? new URLSearchParams(props.extraQueryString)
        : undefined

      try {
        const data = await apiClient.get(`${props.path}/${props.modelId}`, { params })
        const mappedData = applyAfterLoad(data)
        Object.assign(formData, mappedData)
      } catch (error) {
        console.error('Error loading form data:', error)
        Object.assign(formData, props.model)
      }
    }

    // Initialize image fields
    props.schema.fields
      .filter(field => field.type === 'imageUpload')
      .forEach(field => {
        formData[field.model] = []
      })

    formLoaded.value = true
  }

  /**
   * Handles form submission
   * @param {Object} formData - Form data to submit
   */
  const handleSubmit = async (formData) => {
    isLoading.value = true

    try {
      // Build submission data with only schema-defined fields
      const schemaFieldNames = props.schema.fields.map(f => f.model)
      const submitData = {}
      for (const key of schemaFieldNames) {
        if (key in formData) {
          submitData[key] = formData[key]
        }
      }

      // Apply transforms
      props.schema.fields.filter(el => el.transforms).forEach(el => {
        el.transforms.forEach(transformFunction => {
          const fieldName = el.model
          submitData[fieldName] = transformFunction(submitData[fieldName])
        })
      })

      // Apply beforeSubmit mappers (does not mutate the model)
      const mappedSubmitData = applyBeforeSubmit(submitData)

      const savedModel = isCreateForm.value
        ? await apiClient.post(props.path, mappedSubmitData)
        : await apiClient.patch(`${props.path}/${props.modelId}`, mappedSubmitData)

      // Handle image uploads if any
      const imageFields = props.schema.fields.filter(field => field.type === 'imageUpload')
      for (const imageField of imageFields) {
        if (formData[imageField.model]) {
          const imageType = imageField.imageType || 'default'
          await apiClient.upload(`image/${savedModel.id}/${imageType}`, formData[imageField.model])
        }
      }

      // Redirect
      if (props.redirectRoute === 'prev') {
        router.back()
      } else {
        router.push({ name: props.redirectRoute, params: props.redirectParams })
      }

    } catch (error) {
      console.error('Error saving data:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Handles form cancellation
   */
  const handleCancel = () => {
    if (props.redirectRoute === 'prev') {
      router.back()
    } else {
      router.push({ name: props.redirectRoute, params: props.redirectParams })
    }
  }

  return {
    formData,
    formLoaded,
    isLoading,
    isCreateForm,
    loadFormData,
    handleSubmit,
    handleCancel
  }
}
