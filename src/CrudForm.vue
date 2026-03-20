<template>
  <div class="crud-form">
    <div class="bg-white rounded-lg shadow">
      <div v-if="formTitle" class="px-6 py-4 border-b border-gray-200">
        <strong>{{ formTitle }}</strong>
      </div>
      <div class="p-6">
        <vue-form-generator
          v-if="formLoaded"
          :schema="translatedSchema"
          :model="formData"
          :options="formOptions"
          @field-validated="onFieldValidated"
        />

        <!-- Submit Button -->
        <div class="crud-form-submit-container">
          <div class="form-group valid field-submit p-0 crud-form-submit-wrapper">
            <button
              type="button"
              :disabled="isLoading || !isValid"
              class="w-full justify-center inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="onSubmit"
            >
              <font-awesome-icon
                v-if="isLoading"
                icon="spinner"
                spin
                class="-ml-1 mr-2"
              />
              <font-awesome-icon
                v-else
                icon="floppy-disk"
                class="-ml-1 mr-2"
              />
              {{ t('common.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Import composables
import { useFormData } from './composables/useFormData.js'
import { useFormValidation } from './composables/useFormValidation.js'

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
const { t, te } = useI18n()
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

// Translate schema labels and placeholders via i18n
// Only translate if the key exists in i18n messages to avoid double-translation
// when schemas already pre-translate values with i18n.global.t()
const translateIfExists = (value) => value && te(value) ? t(value) : value
const translatedSchema = computed(() => ({
  ...props.schema,
  fields: props.schema.fields.map(field => ({
    ...field,
    label: translateIfExists(field.label),
    placeholder: translateIfExists(field.placeholder),
  }))
}))

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

<style>
@import './styles/formStyles.css';
</style>
