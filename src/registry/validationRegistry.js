/**
 * Validation Registry
 * 
 * Manages custom validation rules and their configurations.
 * Allows dynamic registration of custom validation rules.
 */

// Built-in validation rules
const builtInValidations = new Set([
  'required', 'email', 'length', 'min', 'max', 'matches', 'number'
])

// Custom validation registry
const customValidations = new Map()

/**
 * Registers a custom validation rule
 * @param {string} name - Validation rule name
 * @param {Object} config - Validation configuration
 */
export const registerCustomValidation = (name, config) => {
  customValidations.set(name, {
    rule: config.rule,
    message: config.message,
    blocking: config.blocking !== false, // Default to blocking
    skipEmpty: config.skipEmpty !== false, // Default to skip empty
    debounce: config.debounce || 0,
    async: config.async || false, // Support async validation
    ...config
  })
}

/**
 * Gets validation configuration for a rule name
 * @param {string} name - Validation rule name
 * @returns {Object} Validation configuration
 */
export const getValidationConfig = (name) => {
  // Check custom validations first
  if (customValidations.has(name)) {
    return customValidations.get(name)
  }
  
  // Return null for built-in validations (handled by FormKit)
  if (builtInValidations.has(name)) {
    return null
  }
  
  // Unknown validation rule
  return null
}

/**
 * Checks if a validation rule is custom
 * @param {string} name - Validation rule name
 * @returns {boolean} True if custom validation
 */
export const isCustomValidation = (name) => {
  return customValidations.has(name)
}

/**
 * Gets all registered custom validation rules
 * @returns {Array} Array of custom validation rule names
 */
export const getCustomValidationRules = () => {
  return Array.from(customValidations.keys())
}

/**
 * Example custom validation: Rich text editor content validation
 */
export const registerRichTextValidation = () => {
  registerCustomValidation('rich_text_min_words', {
    rule: (node, minWords) => {
      const text = node.value || ''
      const wordCount = text.replace(/<[^>]*>/g, '').trim().split(/\s+/).length
      return wordCount >= parseInt(minWords)
    },
    message: (context) => {
      const minWords = context.args[0]
      return `Content must have at least ${minWords} words`
    },
    blocking: true,
    skipEmpty: false
  })
}

/**
 * Async validation examples
 */
export const registerAsyncValidations = () => {
  // Email uniqueness validation
  registerCustomValidation('email_unique', {
    rule: async (node, apiEndpoint) => {
      const email = node.value
      if (!email) return true // Skip empty values
      
      try {
        const response = await fetch(`${apiEndpoint}?email=${encodeURIComponent(email)}`)
        const data = await response.json()
        return !data.exists // Return true if email is available
      } catch (error) {
        console.error('Email validation error:', error)
        return true // Allow on error to not block user
      }
    },
    message: (context) => 'This email is already taken',
    blocking: true,
    skipEmpty: true,
    debounce: 500, // Wait 500ms after user stops typing
    async: true
  })

  // Username availability validation
  registerCustomValidation('username_available', {
    rule: async (node, apiEndpoint) => {
      const username = node.value
      if (!username || username.length < 3) return true
      
      try {
        const response = await fetch(`${apiEndpoint}?username=${encodeURIComponent(username)}`)
        const data = await response.json()
        return data.available
      } catch (error) {
        console.error('Username validation error:', error)
        return true
      }
    },
    message: (context) => 'This username is not available',
    blocking: true,
    skipEmpty: true,
    debounce: 300,
    async: true
  })

  // File upload validation
  registerCustomValidation('file_size', {
    rule: async (node, maxSizeMB) => {
      const files = node.value
      if (!files || files.length === 0) return true
      
      const maxSizeBytes = maxSizeMB * 1024 * 1024
      
      for (const file of files) {
        if (file.size > maxSizeBytes) {
          return false
        }
      }
      return true
    },
    message: (context) => {
      const maxSize = context.args[0]
      return `File size must be less than ${maxSize}MB`
    },
    blocking: true,
    skipEmpty: true,
    async: true
  })

  // Image dimensions validation
  registerCustomValidation('image_dimensions', {
    rule: async (node, minWidth, minHeight) => {
      const files = node.value
      if (!files || files.length === 0) return true
      
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue
        
        try {
          const dimensions = await getImageDimensions(file)
          if (dimensions.width < minWidth || dimensions.height < minHeight) {
            return false
          }
        } catch (error) {
          console.error('Image validation error:', error)
          return false
        }
      }
      return true
    },
    message: (context) => {
      const [minWidth, minHeight] = context.args
      return `Image must be at least ${minWidth}x${minHeight} pixels`
    },
    blocking: true,
    skipEmpty: true,
    async: true
  })

  // API-based content validation (e.g., profanity filter)
  registerCustomValidation('content_clean', {
    rule: async (node, apiEndpoint) => {
      const content = node.value
      if (!content) return true
      
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        })
        const data = await response.json()
        return data.isClean
      } catch (error) {
        console.error('Content validation error:', error)
        return true // Allow on error
      }
    },
    message: (context) => 'Content contains inappropriate language',
    blocking: true,
    skipEmpty: true,
    debounce: 1000,
    async: true
  })
}

/**
 * Helper function to get image dimensions
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>} Image dimensions
 */
const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    
    img.src = url
  })
}
