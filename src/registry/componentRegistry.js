/**
 * Component Registry
 * 
 * Manages custom field components and their configurations.
 * Allows dynamic registration of custom field types.
 */

// Built-in component mappings
const builtInComponents = {
  'input': 'FormKit',
  'email': 'FormKit',
  'password': 'FormKit',
  'number': 'FormKit',
  'date': 'FormKit',
  'textarea': 'FormKit',
  'select': 'FormKit',
  'checkbox': 'FormKit',
  'radios': 'FormKit',
  'file': 'FormKit'
}

// Custom component registry
const customComponents = new Map()

/**
 * Registers a custom field component
 * @param {string} type - Field type name
 * @param {Object} config - Component configuration
 */
export const registerCustomComponent = (type, config) => {
  customComponents.set(type, {
    component: config.component,
    props: config.props || {},
    validation: config.validation || {},
    converter: config.converter || null,
    ...config
  })
}

/**
 * Gets component configuration for a field type
 * @param {string} type - Field type
 * @returns {Object} Component configuration
 */
export const getComponentConfig = (type) => {
  // Check custom components first
  if (customComponents.has(type)) {
    return customComponents.get(type)
  }
  
  // Fall back to built-in components
  if (builtInComponents[type]) {
    return {
      component: builtInComponents[type],
      props: {},
      validation: {},
      converter: null
    }
  }
  
  // Default to FormKit text input
  return {
    component: 'FormKit',
    props: {},
    validation: {},
    converter: null
  }
}

/**
 * Checks if a field type is custom
 * @param {string} type - Field type
 * @returns {boolean} True if custom component
 */
export const isCustomComponent = (type) => {
  return customComponents.has(type)
}

/**
 * Gets all registered custom component types
 * @returns {Array} Array of custom component types
 */
export const getCustomComponentTypes = () => {
  return Array.from(customComponents.keys())
}

