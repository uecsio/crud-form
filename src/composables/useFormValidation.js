/**
 * Form Validation Composable
 *
 * Handles vue3-form-generator validation state tracking.
 */

import { ref } from 'vue'

export function useFormValidation() {
  const isValid = ref(true)
  const fieldErrors = ref({})

  /**
   * Handles the field-validated event from vue3-form-generator
   * @param {Array} errors - Array of error messages
   * @param {Object} field - Field schema object
   */
  const onFieldValidated = (errors, field) => {
    if (errors && errors.length > 0) {
      fieldErrors.value[field.model] = errors
    } else {
      delete fieldErrors.value[field.model]
    }

    // Form is valid when there are no field errors
    isValid.value = Object.keys(fieldErrors.value).length === 0
  }

  /**
   * Validates a single field value against its validators
   * @param {Object} field - Field configuration
   * @param {any} value - Field value
   * @param {Object} model - Full form model
   * @returns {Promise<Array>} Array of validation errors
   */
  const validateField = async (field, value, model = {}) => {
    const errors = []

    if (!field.validator) return errors

    const validators = Array.isArray(field.validator)
      ? field.validator
      : [field.validator]

    for (const validator of validators) {
      try {
        const result = await validator(value, field, model)
        if (result && result.length) {
          errors.push(...(Array.isArray(result) ? result : [result]))
        }
      } catch (error) {
        console.error(`Validation error for ${field.model}:`, error)
        errors.push('Validation error occurred')
      }
    }

    return errors
  }

  /**
   * Validates entire form
   * @param {Object} schema - Form schema
   * @param {Object} formData - Form data
   * @returns {Promise<Object>} Validation results
   */
  const validateForm = async (schema, formData) => {
    const results = {
      isValid: true,
      errors: {}
    }

    const validationPromises = schema.fields.map(async (field) => {
      const value = formData[field.model]
      const errors = await validateField(field, value, formData)

      if (errors.length > 0) {
        results.isValid = false
        results.errors[field.model] = errors
      }
    })

    await Promise.all(validationPromises)
    return results
  }

  /**
   * Resets validation state
   */
  const resetValidation = () => {
    isValid.value = true
    fieldErrors.value = {}
  }

  return {
    isValid,
    fieldErrors,
    onFieldValidated,
    validateField,
    validateForm,
    resetValidation
  }
}
