<template>
  <div class="crud-form">
    <CCard>
      <CCardHeader v-if="formTitle">
        <strong>{{ formTitle }}</strong>
      </CCardHeader>
      <CCardBody>
        <FormKit
          v-if="formLoaded"
          type="form"
          :value="formData"
          @submit="handleSubmit"
          :disabled="isLoading"
          :submit-attrs="{ style: 'display: none;' }"
        >
          <FormKitSchema :schema="formKitSchema" />
          
          <!-- Submit Button -->
          <CRow class="mt-4">
            <CCol :xs="12" class="d-flex justify-content-end">
              <CCol :xs="3" class="d-flex justify-content-end">
                <CButton
                  type="submit"
                  color="info"
                  :disabled="isLoading"
                  class="w-100"
                >
                  <CSpinner v-if="isLoading" size="sm" class="me-2" />
                  <FontAwesomeIcon v-else :icon="faCloudUploadAlt" class="me-2" />
                  {{ $t('common.save') }}
                </CButton>
              </CCol>
            </CCol>
          </CRow>
        </FormKit>
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'

// Import composables
import { useFormData } from './composables/useFormData.js'
import { useFormValidation } from './composables/useFormValidation.js'

// Import utilities
import { convertToFormKitSchema } from './utils/schemaConverter.js'

// Import plugins
import { asyncValidationPlugin } from './plugins/asyncValidationPlugin.js'

// Props
const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  model: {
    type: Object,
    required: false,
    default: () => ({})
  },
  modelId: {
    type: [String, Number],
    required: false,
  },
  path: {
    type: String,
    required: true,
  },
  extraQueryString: {
    type: String,
    required: false,
    default: ''
  },
  redirectRoute: {
    type: String,
    required: true,
  },
  redirectParams: {
    type: Object,
    default: () => ({})
  },
  formTitle: {
    type: String,
    required: false,
    default: ''
  },
  apiBaseUrl: {
    type: String,
    required: false,
    default: '/api'
  }
})

// Composables
const { t } = useI18n()
const { 
  formData, 
  formLoaded, 
  isLoading, 
  isCreateForm, 
  loadFormData, 
  handleSubmit 
} = useFormData(props)

const { 
  addErrorStyling, 
  initializeAsyncValidations 
} = useFormValidation()

// Computed
const formKitSchema = computed(() => {
  return convertToFormKitSchema(props.schema, t)
})

// Lifecycle
onMounted(() => {
  loadFormData()
  // Initialize async validations
  initializeAsyncValidations()
  // Add error styling as fallback
  addErrorStyling()
})
</script>

<style lang="scss" scoped>
@use './styles/formStyles.scss';
</style>