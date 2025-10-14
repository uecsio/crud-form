/**
 * FormKit Async Validation Plugin
 * 
 * Handles async validation rules and provides loading states.
 * Integrates with the custom validation registry.
 */

import { getValidationConfig, isCustomValidation } from '../registry/validationRegistry.js'

/**
 * Async validation plugin for FormKit
 */
export const asyncValidationPlugin = (node) => {
  // Only apply to input nodes
  if (node.type !== 'input') return

  // Store original validation function
  const originalValidate = node.validate

  // Override validation to handle async rules
  node.validate = async function() {
    const rules = this.rules
    const asyncRules = []
    const syncRules = []

    // Separate async and sync rules
    for (const rule of rules) {
      const ruleName = rule.name
      
      if (isCustomValidation(ruleName)) {
        const config = getValidationConfig(ruleName)
        if (config && config.async) {
          asyncRules.push({ rule, config })
        } else {
          syncRules.push(rule)
        }
      } else {
        syncRules.push(rule)
      }
    }

    // Run sync validations first
    if (syncRules.length > 0) {
      const syncResult = await originalValidate.call(this, syncRules)
      if (syncResult.length > 0) {
        return syncResult // Return sync errors immediately
      }
    }

    // Run async validations
    if (asyncRules.length > 0) {
      this.setLoading(true)
      
      try {
        const asyncResults = await Promise.allSettled(
          asyncRules.map(async ({ rule, config }) => {
            // Apply debounce if specified
            if (config.debounce > 0) {
              await new Promise(resolve => setTimeout(resolve, config.debounce))
            }

            // Skip empty values if configured
            if (config.skipEmpty && (!this.value || this.value === '')) {
              return { rule, valid: true }
            }

            // Run the async validation
            const isValid = await rule.rule(this, ...rule.args)
            return { rule, valid: isValid }
          })
        )

        const errors = []
        for (const result of asyncResults) {
          if (result.status === 'fulfilled' && !result.value.valid) {
            const { rule } = result.value
            const message = rule.message ? rule.message({ args: rule.args }) : 'Validation failed'
            errors.push({
              name: rule.name,
              message,
              blocking: rule.blocking !== false
            })
          } else if (result.status === 'rejected') {
            console.error('Async validation error:', result.reason)
            // Optionally add error for failed validation
            if (rule.blocking !== false) {
              errors.push({
                name: rule.name,
                message: 'Validation error occurred',
                blocking: true
              })
            }
          }
        }

        return errors
      } finally {
        this.setLoading(false)
      }
    }

    return []
  }
}

/**
 * Debounce utility for async validations
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Creates a debounced async validation rule
 */
export const createDebouncedAsyncRule = (rule, debounceMs = 300) => {
  let timeoutId
  let lastPromise = null

  return async (node, ...args) => {
    // Cancel previous timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Cancel previous promise if still pending
    if (lastPromise) {
      // Note: We can't actually cancel a fetch request, but we can ignore its result
      lastPromise = null
    }

    return new Promise((resolve) => {
      timeoutId = setTimeout(async () => {
        try {
          lastPromise = rule(node, ...args)
          const result = await lastPromise
          resolve(result)
        } catch (error) {
          console.error('Debounced async validation error:', error)
          resolve(true) // Allow on error
        }
      }, debounceMs)
    })
  }
}
