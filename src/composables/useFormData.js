/**
 * Form Data Management Composable
 * 
 * Handles form data loading, submission, and state management.
 * Includes API integration and form submission logic.
 */

import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export function useFormData(props) {
  const router = useRouter()
  const { t } = useI18n()

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
      // Initialize form with default model data
      Object.assign(formData, props.model)
    } else {
      // Load existing data
      const extraCriteria = props.extraQueryString ? `?${props.extraQueryString}` : ''
      const url = `${props.apiBaseUrl}${props.path}/${props.modelId}${extraCriteria}`
      
      try {
        const response = await fetch(url)
        if (!response.ok) {
          console.warn(`API endpoint not found: ${url} (${response.status})`)
          // For edit mode, initialize with empty data if API doesn't exist
          Object.assign(formData, props.model)
          return
        }
        
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          console.warn(`API endpoint returned non-JSON response: ${url}`)
          // Initialize with default model data
          Object.assign(formData, props.model)
          return
        }
        
        const data = await response.json()
        Object.assign(formData, data)
      } catch (error) {
        console.error('Error loading form data:', error)
        // Fallback: initialize with default model data
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
      // Apply transforms
      props.schema.fields.filter(el => el.transforms).forEach(el => {
        el.transforms.forEach(transformFunction => {
          const fieldName = el.model
          formData[fieldName] = transformFunction(formData[fieldName])
        })
      })

      const url = isCreateForm.value 
        ? `${props.apiBaseUrl}${props.path}`
        : `${props.apiBaseUrl}${props.path}/${props.modelId}`

      const method = isCreateForm.value ? 'POST' : 'PATCH'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const contentType = response.headers.get('content-type')
        let errorMessage = `HTTP error! status: ${response.status}`
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
          } catch (e) {
            // Use default error message
          }
        }
        
        throw new Error(errorMessage)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response format')
      }

      const savedModel = await response.json()

      // Handle image uploads if any
      const imageFields = props.schema.fields.filter(field => field.type === 'imageUpload')
      for (const imageField of imageFields) {
        if (formData[imageField.model]) {
          const imageType = imageField.imageType || 'default'
          const imageUrl = `${props.apiBaseUrl}image/${savedModel.id}/${imageType}`
          
          await fetch(imageUrl, {
            method: 'POST',
            body: formData[imageField.model]
          })
        }
      }

      // Success message
      console.log(t('messages.orderCreated'))

      // Redirect
      if (props.redirectRoute === 'prev') {
        router.back()
      } else {
        router.push({ name: props.redirectRoute, params: props.redirectParams })
      }

    } catch (error) {
      console.error('Error saving data:', error)
      console.log(t('messages.networkError'))
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
    // State
    formData,
    formLoaded,
    isLoading,
    isCreateForm,
    
    // Methods
    loadFormData,
    handleSubmit,
    handleCancel
  }
}
