/**
 * Complete Example: User Registration with Async Validations
 * 
 * This example shows a complete user registration form with multiple
 * async validations including email uniqueness, username availability,
 * and file upload validation.
 */

import { registerAsyncValidations } from '../registry/validationRegistry.js'
import { useFormValidation } from '../composables/useFormValidation.js'

// Initialize async validations
registerAsyncValidations()

// User registration schema with async validations
export const userRegistrationSchema = {
  fields: [
    {
      type: 'input',
      model: 'firstName',
      label: 'users.form.firstName',
      placeholder: 'users.form.firstNamePlaceholder',
      required: true,
      validation: 'required|length:2,50',
      maxLength: 50
    },
    {
      type: 'input',
      model: 'lastName',
      label: 'users.form.lastName',
      placeholder: 'users.form.lastNamePlaceholder',
      required: true,
      validation: 'required|length:2,50',
      maxLength: 50
    },
    {
      type: 'input',
      model: 'email',
      label: 'users.form.email',
      placeholder: 'users.form.emailPlaceholder',
      required: true,
      validation: 'required|email|email_unique:/api/users/check-email',
      maxLength: 255
    },
    {
      type: 'input',
      model: 'username',
      label: 'users.form.username',
      placeholder: 'users.form.usernamePlaceholder',
      required: true,
      validation: 'required|length:3,20|matches:^[a-zA-Z0-9_]+$|username_available:/api/users/check-username',
      maxLength: 20
    },
    {
      type: 'input',
      model: 'password',
      label: 'users.form.password',
      placeholder: 'users.form.passwordPlaceholder',
      required: true,
      validation: 'required|length:8,',
      type: 'password'
    },
    {
      type: 'input',
      model: 'confirmPassword',
      label: 'users.form.confirmPassword',
      placeholder: 'users.form.confirmPasswordPlaceholder',
      required: true,
      validation: 'required',
      type: 'password'
    },
    {
      type: 'file',
      model: 'avatar',
      label: 'users.form.avatar',
      required: false,
      validation: 'file_size:5|image_dimensions:200,200',
      accept: 'image/*',
      multiple: false
    },
    {
      type: 'textarea',
      model: 'bio',
      label: 'users.form.bio',
      placeholder: 'users.form.bioPlaceholder',
      required: false,
      validation: 'content_clean:/api/content/validate',
      rows: 4,
      maxLength: 500
    },
    {
      type: 'checkbox',
      model: 'acceptTerms',
      label: 'users.form.acceptTerms',
      required: true,
      validation: 'required'
    }
  ]
}

// Custom validation for password confirmation
export const setupPasswordConfirmationValidation = () => {
  const { createAsyncValidation } = useFormValidation()

  createAsyncValidation('password_match', 
    async (node) => {
      const form = node.parent
      const password = form.value?.password
      const confirmPassword = node.value
      
      return password === confirmPassword
    },
    () => 'Passwords do not match',
    {
      debounce: 300,
      skipEmpty: true,
      blocking: true
    }
  )
}

// Enhanced user registration schema with password confirmation
export const enhancedUserRegistrationSchema = {
  fields: [
    {
      type: 'input',
      model: 'firstName',
      label: 'users.form.firstName',
      placeholder: 'users.form.firstNamePlaceholder',
      required: true,
      validation: 'required|length:2,50',
      maxLength: 50
    },
    {
      type: 'input',
      model: 'lastName',
      label: 'users.form.lastName',
      placeholder: 'users.form.lastNamePlaceholder',
      required: true,
      validation: 'required|length:2,50',
      maxLength: 50
    },
    {
      type: 'input',
      model: 'email',
      label: 'users.form.email',
      placeholder: 'users.form.emailPlaceholder',
      required: true,
      validation: 'required|email|email_unique:/api/users/check-email',
      maxLength: 255
    },
    {
      type: 'input',
      model: 'username',
      label: 'users.form.username',
      placeholder: 'users.form.usernamePlaceholder',
      required: true,
      validation: 'required|length:3,20|matches:^[a-zA-Z0-9_]+$|username_available:/api/users/check-username',
      maxLength: 20
    },
    {
      type: 'input',
      model: 'password',
      label: 'users.form.password',
      placeholder: 'users.form.passwordPlaceholder',
      required: true,
      validation: 'required|length:8,',
      type: 'password'
    },
    {
      type: 'input',
      model: 'confirmPassword',
      label: 'users.form.confirmPassword',
      placeholder: 'users.form.confirmPasswordPlaceholder',
      required: true,
      validation: 'required|password_match',
      type: 'password'
    },
    {
      type: 'file',
      model: 'avatar',
      label: 'users.form.avatar',
      required: false,
      validation: 'file_size:5|image_dimensions:200,200',
      accept: 'image/*',
      multiple: false
    },
    {
      type: 'textarea',
      model: 'bio',
      label: 'users.form.bio',
      placeholder: 'users.form.bioPlaceholder',
      required: false,
      validation: 'content_clean:/api/content/validate',
      rows: 4,
      maxLength: 500
    },
    {
      type: 'checkbox',
      model: 'acceptTerms',
      label: 'users.form.acceptTerms',
      required: true,
      validation: 'required'
    }
  ]
}

// Example usage in a Vue component
export const useUserRegistration = () => {
  const { validateFormAsync, validateFieldAsync } = useFormValidation()

  // Validate email field specifically
  const validateEmailField = async (email) => {
    const field = {
      model: 'email',
      validation: 'required|email|email_unique:/api/users/check-email'
    }
    
    const errors = await validateFieldAsync(field, email)
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Validate username field specifically
  const validateUsernameField = async (username) => {
    const field = {
      model: 'username',
      validation: 'required|length:3,20|matches:^[a-zA-Z0-9_]+$|username_available:/api/users/check-username'
    }
    
    const errors = await validateFieldAsync(field, username)
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Validate entire registration form
  const validateRegistrationForm = async (formData) => {
    const results = await validateFormAsync(enhancedUserRegistrationSchema, formData)
    
    if (!results.isValid) {
      console.log('Registration form validation errors:', results.errors)
    }
    
    return results
  }

  // Submit registration form
  const submitRegistration = async (formData) => {
    // First validate the form
    const validation = await validateRegistrationForm(formData)
    
    if (!validation.isValid) {
      return {
        success: false,
        errors: validation.errors
      }
    }

    // Submit to API
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  return {
    validateEmailField,
    validateUsernameField,
    validateRegistrationForm,
    submitRegistration
  }
}

// Initialize password confirmation validation
setupPasswordConfirmationValidation()
