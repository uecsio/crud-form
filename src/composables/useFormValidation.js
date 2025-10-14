/**
 * Form Validation Composable
 * 
 * Handles FormKit validation configuration, error styling, and async validation.
 */

import { registerAsyncValidations, registerCustomValidation } from '../registry/validationRegistry.js'

export function useFormValidation() {
  /**
   * Adds error styling via JavaScript as a fallback
   */
  const addErrorStyling = () => {
    // Wait for DOM to be ready
    setTimeout(() => {
      const errorMessages = document.querySelectorAll('.formkit-message')
      errorMessages.forEach(message => {
        const outer = message.closest('.formkit-outer')
        if (outer) {
          const label = outer.querySelector('.formkit-label')
          const input = outer.querySelector('.formkit-input, .formkit-select, .formkit-textarea')
          
          if (label) {
            label.style.color = 'var(--cui-danger)'
          }
          
          if (input) {
            input.style.borderColor = 'var(--cui-danger)'
          }
        }
      })
    }, 100)
  }

  /**
   * Initializes async validations
   */
  const initializeAsyncValidations = () => {
    registerAsyncValidations()
  }

  /**
   * Creates a custom async validation rule
   * @param {string} name - Validation rule name
   * @param {Function} rule - Async validation function
   * @param {Function} message - Error message function
   * @param {Object} options - Validation options
   */
  const createAsyncValidation = (name, rule, message, options = {}) => {
    registerCustomValidation(name, {
      rule,
      message,
      blocking: options.blocking !== false,
      skipEmpty: options.skipEmpty !== false,
      debounce: options.debounce || 0,
      async: true,
      ...options
    })
  }

  /**
   * Validates a single field asynchronously
   * @param {Object} field - Field configuration
   * @param {any} value - Field value
   * @returns {Promise<Array>} Array of validation errors
   */
  const validateFieldAsync = async (field, value) => {
    const errors = []
    
    if (!field.validation) return errors
    
    const rules = field.validation.split('|')
    
    for (const ruleString of rules) {
      const [ruleName, ...args] = ruleString.split(':')
      
      // Check if it's a custom async validation
      const { isCustomValidation, getValidationConfig } = require('../registry/validationRegistry.js')
      
      if (isCustomValidation(ruleName)) {
        const config = getValidationConfig(ruleName)
        
        if (config && config.async) {
          try {
            // Create a mock node object
            const mockNode = { value }
            const isValid = await config.rule(mockNode, ...args)
            
            if (!isValid) {
              const errorMessage = config.message ? config.message({ args }) : 'Validation failed'
              errors.push({
                name: ruleName,
                message: errorMessage,
                blocking: config.blocking
              })
            }
          } catch (error) {
            console.error(`Async validation error for ${ruleName}:`, error)
            if (config.blocking) {
              errors.push({
                name: ruleName,
                message: 'Validation error occurred',
                blocking: true
              })
            }
          }
        }
      }
    }
    
    return errors
  }

  /**
   * Validates entire form asynchronously
   * @param {Object} schema - Form schema
   * @param {Object} formData - Form data
   * @returns {Promise<Object>} Validation results
   */
  const validateFormAsync = async (schema, formData) => {
    const results = {
      isValid: true,
      errors: {},
      loading: false
    }

    results.loading = true

    try {
      const validationPromises = schema.fields.map(async (field) => {
        const value = formData[field.model]
        const errors = await validateFieldAsync(field, value)
        
        if (errors.length > 0) {
          results.isValid = false
          results.errors[field.model] = errors
        }
      })

      await Promise.all(validationPromises)
    } finally {
      results.loading = false
    }

    return results
  }

  return {
    addErrorStyling,
    initializeAsyncValidations,
    createAsyncValidation,
    validateFieldAsync,
    validateFormAsync
  }
}
