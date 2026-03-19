/**
 * @uecsio/crud-form
 *
 * A Vue 3 CRUD form component with vue3-form-generator,
 * Tailwind CSS styling, async validation, and customizable field types.
 */

import VueFormGenerator from '@kevinkosterr/vue3-form-generator'
import CrudForm from './CrudForm.vue'
import { useFormData } from './composables/useFormData.js'
import { useFormValidation } from './composables/useFormValidation.js'
import { useFormNavigation } from './composables/useFormNavigation.js'

import { createDebouncedValidator, createApiValidator } from './plugins/asyncValidationPlugin.js'

// Export the main component
export { default as CrudForm } from './CrudForm.vue'
export { default as FilterForm } from './FilterForm.vue'

// Export composables
export { useFormData } from './composables/useFormData.js'
export { useFormValidation } from './composables/useFormValidation.js'
export { useFormNavigation } from './composables/useFormNavigation.js'


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
      messages: options.messages || {}
    })

    app.component('CrudForm', CrudForm)

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
