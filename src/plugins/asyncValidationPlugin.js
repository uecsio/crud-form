/**
 * Async Validation Utilities
 *
 * Provides debouncing and async validation helpers
 * compatible with vue3-form-generator's validator interface.
 */

/**
 * Wraps an async validator with debounce support
 * @param {Function} validator - Async validator function (value, field, model) => errors[]
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @returns {Function} Debounced validator function
 */
export const createDebouncedValidator = (validator, debounceMs = 300) => {
  let timeoutId = null
  let lastResolve = null

  return (value, field, model) => {
    return new Promise((resolve) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        if (lastResolve) lastResolve([])
      }

      lastResolve = resolve

      timeoutId = setTimeout(async () => {
        try {
          const errors = await validator(value, field, model)
          resolve(errors)
        } catch (error) {
          console.error('Async validation error:', error)
          resolve([])
        }
        lastResolve = null
      }, debounceMs)
    })
  }
}

/**
 * Creates a validator that checks a value against an API endpoint
 * @param {string} paramName - Query parameter name
 * @param {string} errorMessage - Error message when validation fails
 * @param {Object} options - Options
 * @returns {Function} Validator function for use with registerCustomValidation
 */
export const createApiValidator = (paramName, errorMessage, options = {}) => {
  const { checkField = 'exists', invertCheck = false } = options

  return async (value, field, model, apiEndpoint) => {
    if (!value) return []
    try {
      const response = await fetch(`${apiEndpoint}?${paramName}=${encodeURIComponent(value)}`)
      const data = await response.json()
      const isInvalid = invertCheck ? !data[checkField] : data[checkField]
      return isInvalid ? [errorMessage] : []
    } catch (error) {
      console.error(`Validation error for ${paramName}:`, error)
      return []
    }
  }
}

/**
 * Debounce utility
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
