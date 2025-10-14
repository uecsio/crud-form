/**
 * Example: Rich Text Editor Registration and Usage
 * 
 * This file demonstrates how to register and use custom components
 * with custom validations in the CrudForm system.
 */

import { registerCustomComponent } from '../registry/componentRegistry.js'
import { registerCustomValidation, registerRichTextValidation } from '../registry/validationRegistry.js'
import RichTextEditor from '../components/RichTextEditor.vue'

// Register custom validation rules
registerRichTextValidation()

// Register the rich text editor component
registerCustomComponent('rich_text', {
  component: RichTextEditor,
  props: {
    minHeight: 120,
    showToolbar: true
  },
  validation: {
    rich_text_min_words: true
  },
  converter: (field, t) => {
    return {
      $formkit: RichTextEditor,
      name: field.model,
      label: field.required ? `${t(field.label)} *` : t(field.label),
      placeholder: field.placeholder ? t(field.placeholder) : undefined,
      help: field.help ? t(field.help) : undefined,
      validation: getValidationRules(field),
      disabled: field.disabled,
      readonly: field.readonly,
      minHeight: field.minHeight || 120,
      showToolbar: field.showToolbar !== false,
      validationMessages: {
        required: t('validation.required'),
        rich_text_min_words: t('validation.richTextMinWords')
      }
    }
  }
})

// Example schema with rich text editor
export const exampleSchemaWithRichText = {
  fields: [
    {
      type: 'input',
      model: 'title',
      label: 'articles.form.title',
      placeholder: 'articles.form.titlePlaceholder',
      required: true,
      maxLength: 255
    },
    {
      type: 'rich_text',
      model: 'content',
      label: 'articles.form.content',
      placeholder: 'articles.form.contentPlaceholder',
      required: true,
      minHeight: 200,
      showToolbar: true,
      validation: 'rich_text_min_words:50', // Custom validation
      props: {
        // Additional props specific to this field
        allowImages: true,
        allowTables: true
      }
    },
    {
      type: 'select',
      model: 'status',
      label: 'articles.form.status',
      required: false,
      values: [
        {
          name: 'articles.status.draft',
          value: 'draft'
        },
        {
          name: 'articles.status.published',
          value: 'published'
        }
      ]
    }
  ]
}

// Helper function to get validation rules (reused from schemaConverter)
const getValidationRules = (field) => {
  const rules = []
  
  if (field.required) {
    rules.push('required')
  }
  
  if (field.type === 'email') {
    rules.push('email')
  }
  
  // Handle string length validation
  if (field.minLength && field.maxLength) {
    rules.push(`length:${field.minLength},${field.maxLength}`)
  } else if (field.minLength) {
    rules.push(`length:${field.minLength},`)
  } else if (field.maxLength) {
    rules.push(`length:0,${field.maxLength}`)
  }
  
  // Handle numeric validation
  if (field.min) {
    rules.push(`min:${field.min}`)
  }
  
  if (field.max) {
    rules.push(`max:${field.max}`)
  }
  
  if (field.pattern) {
    rules.push(`matches:${field.pattern}`)
  }
  
  // Add custom validation rules
  if (field.validation) {
    rules.push(field.validation)
  }
  
  return rules.join('|')
}
