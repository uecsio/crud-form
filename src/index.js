/**
 * @uecsio/crud-form
 * 
 * A powerful Vue 3 CRUD form component with FormKit integration,
 * async validation, and customizable field types.
 */

import CrudForm from './CrudForm.vue'
import { useFormData } from './composables/useFormData.js'
import { useFormValidation } from './composables/useFormValidation.js'
import { useFormNavigation } from './composables/useFormNavigation.js'
import { convertToFormKitSchema } from './utils/schemaConverter.js'
import { registerCustomComponent, getComponentConfig } from './registry/componentRegistry.js'
import { registerCustomValidation, getValidationConfig } from './registry/validationRegistry.js'
import { asyncValidationPlugin } from './plugins/asyncValidationPlugin.js'

// Export the main component
export { default as CrudForm } from './CrudForm.vue'

// Export composables
export { useFormData } from './composables/useFormData.js'
export { useFormValidation } from './composables/useFormValidation.js'
export { useFormNavigation } from './composables/useFormNavigation.js'

// Export utilities
export { convertToFormKitSchema } from './utils/schemaConverter.js'

// Export registry functions
export { registerCustomComponent, getComponentConfig } from './registry/componentRegistry.js'
export { registerCustomValidation, getValidationConfig } from './registry/validationRegistry.js'

// Export plugins
export { asyncValidationPlugin } from './plugins/asyncValidationPlugin.js'

// Export examples
export { userRegistrationSchema, enhancedUserRegistrationSchema } from './examples/userRegistrationExample.js'
export { userRegistrationSchema as asyncValidationExample, articleCreationSchema, productSchema } from './examples/asyncValidationExample.js'
export { exampleSchemaWithRichText } from './examples/richTextExample.js'

// Default export for easy importing
export default {
  install(app, options = {}) {
    // Register the component globally
    app.component('CrudForm', CrudForm)
    
    // Provide default options if needed
    if (options.globalConfig) {
      app.provide('crudFormConfig', options.globalConfig)
    }
  },
  
  // Named exports for individual usage
  CrudForm,
  useFormData,
  useFormValidation,
  useFormNavigation,
  convertToFormKitSchema,
  registerCustomComponent,
  registerCustomValidation,
  asyncValidationPlugin
}
