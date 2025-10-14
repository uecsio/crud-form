/**
 * Example: Async Validation Usage
 * 
 * This file demonstrates how to use async validations in forms.
 */

import { registerAsyncValidations } from '../registry/validationRegistry.js'
import { useFormValidation } from '../composables/useFormValidation.js'

// Initialize async validations
registerAsyncValidations()

// Example schema with async validations
export const userRegistrationSchema = {
  fields: [
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
      validation: 'required|length:3,20|username_available:/api/users/check-username',
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
    }
  ]
}

// Example schema for article creation with async validations
export const articleCreationSchema = {
  fields: [
    {
      type: 'input',
      model: 'title',
      label: 'articles.form.title',
      placeholder: 'articles.form.titlePlaceholder',
      required: true,
      validation: 'required|length:5,100',
      maxLength: 100
    },
    {
      type: 'input',
      model: 'slug',
      label: 'articles.form.slug',
      placeholder: 'articles.form.slugPlaceholder',
      required: true,
      validation: 'required|matches:^[a-z0-9-]+$|username_available:/api/articles/check-slug',
      maxLength: 100
    },
    {
      type: 'rich_text',
      model: 'content',
      label: 'articles.form.content',
      placeholder: 'articles.form.contentPlaceholder',
      required: true,
      validation: 'required|rich_text_min_words:100|content_clean:/api/content/validate',
      minHeight: 300,
      showToolbar: true
    },
    {
      type: 'file',
      model: 'featuredImage',
      label: 'articles.form.featuredImage',
      required: false,
      validation: 'file_size:10|image_dimensions:800,600',
      accept: 'image/*',
      multiple: false
    }
  ]
}

// Example of creating custom async validation
export const createCustomAsyncValidation = () => {
  const { createAsyncValidation } = useFormValidation()

  // Custom validation: Check if product SKU is unique
  createAsyncValidation('sku_unique', 
    async (node, apiEndpoint) => {
      const sku = node.value
      if (!sku) return true
      
      try {
        const response = await fetch(`${apiEndpoint}?sku=${encodeURIComponent(sku)}`)
        const data = await response.json()
        return !data.exists
      } catch (error) {
        console.error('SKU validation error:', error)
        return true
      }
    },
    (context) => 'This SKU is already in use',
    {
      debounce: 500,
      skipEmpty: true,
      blocking: true
    }
  )

  // Custom validation: Check if domain is available
  createAsyncValidation('domain_available',
    async (node, apiEndpoint) => {
      const domain = node.value
      if (!domain) return true
      
      try {
        const response = await fetch(`${apiEndpoint}?domain=${encodeURIComponent(domain)}`)
        const data = await response.json()
        return data.available
      } catch (error) {
        console.error('Domain validation error:', error)
        return true
      }
    },
    (context) => 'This domain is not available',
    {
      debounce: 1000,
      skipEmpty: true,
      blocking: true
    }
  )
}

// Example schema using custom async validations
export const productSchema = {
  fields: [
    {
      type: 'input',
      model: 'name',
      label: 'products.form.name',
      placeholder: 'products.form.namePlaceholder',
      required: true,
      validation: 'required|length:3,100',
      maxLength: 100
    },
    {
      type: 'input',
      model: 'sku',
      label: 'products.form.sku',
      placeholder: 'products.form.skuPlaceholder',
      required: true,
      validation: 'required|matches:^[A-Z0-9-]+$|sku_unique:/api/products/check-sku',
      maxLength: 50
    },
    {
      type: 'input',
      model: 'domain',
      label: 'products.form.domain',
      placeholder: 'products.form.domainPlaceholder',
      required: false,
      validation: 'domain_available:/api/domains/check',
      maxLength: 100
    }
  ]
}

// Example of using async validation in a component
export const useAsyncValidationExample = () => {
  const { validateFormAsync, validateFieldAsync } = useFormValidation()

  // Validate single field
  const validateEmail = async (email) => {
    const field = {
      model: 'email',
      validation: 'required|email|email_unique:/api/users/check-email'
    }
    
    const errors = await validateFieldAsync(field, email)
    return errors
  }

  // Validate entire form
  const validateUserForm = async (formData) => {
    const results = await validateFormAsync(userRegistrationSchema, formData)
    
    if (!results.isValid) {
      console.log('Form validation errors:', results.errors)
    }
    
    return results
  }

  return {
    validateEmail,
    validateUserForm
  }
}
