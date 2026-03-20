/**
 * @uecsio/crud-form
 *
 * A Vue 3 CRUD form component with vue3-form-generator,
 * Tailwind CSS styling, async validation, and customizable field types.
 */

import VueFormGenerator from '@kevinkosterr/vue3-form-generator'
import CrudForm from './CrudForm.vue'
import FieldEditor from './components/FieldEditor.vue'
import FieldDatepicker from './components/FieldDatepicker.vue'
import { useFormData } from './composables/useFormData.js'
import { useFormValidation } from './composables/useFormValidation.js'
import { useFormNavigation } from './composables/useFormNavigation.js'

import { createDebouncedValidator, createApiValidator } from './plugins/asyncValidationPlugin.js'

// Export the main component
export { default as CrudForm } from './CrudForm.vue'

// Export built-in field components
export { default as FieldEditor } from './components/FieldEditor.vue'
export { default as FieldDatepicker } from './components/FieldDatepicker.vue'

// Export composables
export { useFormData } from './composables/useFormData.js'
export { useFormValidation } from './composables/useFormValidation.js'
export { useFormNavigation } from './composables/useFormNavigation.js'


// Re-export vue3-form-generator composables for custom field components
export {
  useFieldProps,
  useFieldEmits,
  useFormModel,
  useFieldAttributes,
  useValidation,
  validators,
} from '@kevinkosterr/vue3-form-generator'

// Export async validation utilities
export { createDebouncedValidator, createApiValidator, debounce } from './plugins/asyncValidationPlugin.js'

// Export examples
export { userRegistrationSchema, enhancedUserRegistrationSchema } from './examples/userRegistrationExample.js'
export { userRegistrationSchema as asyncValidationExample, articleCreationSchema, productSchema } from './examples/asyncValidationExample.js'
export { exampleSchemaWithRichText } from './examples/richTextExample.js'

// Default export for easy importing
export default {
  install(app, options = {}) {
    // Register vue3-form-generator so consuming apps don't need to
    app.use(VueFormGenerator, {
      messages: options.messages || {},
      components: options.components || [],
    })

    app.component('CrudForm', CrudForm)

    // Register built-in field components
    app.component('FieldEditor', FieldEditor)
    app.component('FieldDatepicker', FieldDatepicker)

    // Provide apiClient for useFormData composable
    if (options.apiClient) {
      app.provide('crudFormApiClient', options.apiClient)
    }

    if (options.globalConfig) {
      app.provide('crudFormConfig', options.globalConfig)
    }
  },

  CrudForm,
  useFormData,
  useFormValidation,
  useFormNavigation,

  createDebouncedValidator,
  createApiValidator
}
