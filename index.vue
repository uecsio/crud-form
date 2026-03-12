<template>
  <div class="crud-form">
    <div class="bg-white rounded-lg shadow">
      <div v-if="formTitle" class="px-6 py-4 border-b border-gray-200">
        <strong>{{ formTitle }}</strong>
      </div>
      <div class="p-6">
        <vue-form-generator
          v-if="formLoaded"
          :schema="schema"
          :model="formData"
          :options="formOptions"
          @field-validated="onFieldValidated"
        />

        <!-- Submit Button -->
        <div class="mt-6 flex justify-end">
          <button
            type="button"
            :disabled="isLoading || !isValid"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            @click="onSubmit"
          >
            <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <svg
              v-else
              class="-ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// Import composables
import { useFormData } from './src/composables/useFormData.js'
import { useFormValidation } from './src/composables/useFormValidation.js'

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
  },
  formOptions: {
    type: Object,
    required: false,
    default: () => ({
      validateAfterLoad: false,
      validate: 'onChanged'
    })
  }
})

// Composables
const { t } = useI18n()
const {
  formData,
  formLoaded,
  isLoading,
  loadFormData,
  handleSubmit
} = useFormData(props)

const {
  isValid,
  onFieldValidated
} = useFormValidation()

// Methods
const onSubmit = () => {
  if (isValid.value && !isLoading.value) {
    handleSubmit(formData)
  }
}

// Lifecycle
onMounted(() => {
  loadFormData()
})
</script>

<style scoped>
@import './src/styles/formStyles.css';
</style>
