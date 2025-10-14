/**
 * Schema Converter Utility
 * 
 * Converts custom schema format to FormKit schema format.
 * Handles field type mapping, validation rules, and field configuration.
 * Supports custom components and validations.
 */

import { getComponentConfig, isCustomComponent } from '../registry/componentRegistry.js'
import { getValidationConfig, isCustomValidation } from '../registry/validationRegistry.js'

/**
 * Maps custom field types to FormKit field types
 * @param {string} fieldType - Custom field type
 * @returns {string} FormKit field type
 */
export const getFormKitType = (fieldType) => {
  const typeMap = {
    'input': 'text',
    'email': 'email',
    'password': 'password',
    'number': 'number',
    'date': 'date',
    'textarea': 'textarea',
    'select': 'select',
    'checkbox': 'checkbox',
    'radios': 'radio',
    'file': 'file'
  }
  return typeMap[fieldType] || 'text'
}

/**
 * Generates validation rules string for FormKit
 * @param {Object} field - Field configuration
 * @returns {string} Validation rules string
 */
export const getValidationRules = (field) => {
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
  
  return rules.join('|')
}

/**
 * Converts a single field to FormKit field configuration
 * @param {Object} field - Custom field configuration
 * @param {Function} t - Translation function
 * @returns {Object} FormKit field configuration
 */
export const convertToFormKitField = (field, t) => {
  // Check if this is a custom component
  if (isCustomComponent(field.type)) {
    return convertCustomField(field, t)
  }

  // Standard FormKit field conversion
  const baseField = {
    $formkit: getFormKitType(field.type),
    name: field.model,
    label: field.required ? `${t(field.label)} *` : t(field.label),
    placeholder: field.placeholder ? t(field.placeholder) : undefined,
    help: field.help ? t(field.help) : undefined,
    validation: getValidationRules(field),
    disabled: field.disabled,
    readonly: field.readonly,
  }

  // Add max length validation directly if specified
  if (field.maxLength) {
    baseField.maxLength = field.maxLength
  }
  
  // Add numeric max validation if specified
  if (field.max && field.type === 'number') {
    baseField.max = field.max
  }

  // Add type-specific properties
  switch (field.type) {
    case 'number':
      return {
        ...baseField,
        number: true,
        min: field.min,
        max: field.max,
        step: field.step
      }
    
    case 'textarea':
      return {
        ...baseField,
        rows: field.rows || 3
      }
    
    case 'select':
    case 'radios':
      return {
        ...baseField,
        options: field.values?.map(option => ({
          label: t(option.name),
          value: option.value
        })) || []
      }
    
    case 'file':
      return {
        ...baseField,
        accept: field.accept,
        multiple: field.multiple
      }
    
    default:
      return baseField
  }
}

/**
 * Converts a custom field to FormKit field configuration
 * @param {Object} field - Custom field configuration
 * @param {Function} t - Translation function
 * @returns {Object} FormKit field configuration
 */
export const convertCustomField = (field, t) => {
  const componentConfig = getComponentConfig(field.type)
  
  // Use custom converter if available
  if (componentConfig.converter) {
    return componentConfig.converter(field, t)
  }
  
  // Default custom field conversion
  const baseField = {
    $formkit: componentConfig.component,
    name: field.model,
    label: field.required ? `${t(field.label)} *` : t(field.label),
    placeholder: field.placeholder ? t(field.placeholder) : undefined,
    help: field.help ? t(field.help) : undefined,
    validation: getValidationRules(field),
    disabled: field.disabled,
    readonly: field.readonly,
    ...componentConfig.props,
    ...field.props // Allow field-specific props to override component defaults
  }
  
  // Handle file-specific props
  if (field.type === 'file') {
    // For FormKit FileUpload input, we need to pass props differently
    if (field.accept) baseField.accept = field.accept
    if (field.multiple !== undefined) baseField.multiple = field.multiple
    if (field.maxSize) baseField.maxSize = field.maxSize
  }
  
  return baseField
}

/**
 * Converts custom schema to FormKit schema
 * @param {Object} schema - Custom schema configuration
 * @param {Function} t - Translation function
 * @returns {Array} FormKit schema array
 */
export const convertToFormKitSchema = (schema, t) => {
  const formKitSchema = []
  
  // Group fields by rows for better layout
  const fieldsPerRow = 3
  let currentRow = []
  
  schema.fields.forEach((field, index) => {
    const formKitField = convertToFormKitField(field, t)
    currentRow.push(formKitField)
    
    // Create a new row every 3 fields or at the end
    if (currentRow.length === fieldsPerRow || index === schema.fields.length - 1) {
      formKitSchema.push({
        $el: 'div',
        attrs: { class: 'row mb-3' },
        children: currentRow.map(fieldSchema => ({
          $el: 'div',
          attrs: { 
            class: `col-${field.cols?.xs || 12} col-sm-${field.cols?.sm || 12} col-md-${field.cols?.md || 12} col-lg-${field.cols?.lg || 12}` 
          },
          children: [fieldSchema]
        }))
      })
      currentRow = []
    }
  })
  
  return formKitSchema
}
