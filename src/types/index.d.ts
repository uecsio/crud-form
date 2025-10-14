import { Component, Ref, ComputedRef } from 'vue'

// Form Schema Types
export interface FieldConfig {
  type: string
  model: string
  label: string
  placeholder?: string
  required?: boolean
  validation?: string
  maxLength?: number
  minLength?: number
  min?: number
  max?: number
  pattern?: string
  disabled?: boolean
  readonly?: boolean
  help?: string
  rows?: number
  step?: number
  accept?: string
  multiple?: boolean
  values?: Array<{ name: string; value: string | number }>
  cols?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  props?: Record<string, any>
  transforms?: Array<(value: any) => any>
  imageType?: string
}

export interface FormSchema {
  fields: FieldConfig[]
}

// Component Props Types
export interface CrudFormProps {
  schema: FormSchema
  model?: Record<string, any>
  modelId?: string | number
  path: string
  extraQueryString?: string
  redirectRoute: string
  redirectParams?: Record<string, any>
  formTitle?: string
  apiBaseUrl?: string
}

// Validation Types
export interface ValidationRule {
  name: string
  rule: (node: any, ...args: any[]) => boolean | Promise<boolean>
  message: (context: { args: any[] }) => string
  blocking?: boolean
}

export interface AsyncValidationConfig {
  debounce?: number
  skipEmpty?: boolean
  async?: boolean
}

export interface ValidationConfig {
  rule: (node: any, ...args: any[]) => boolean | Promise<boolean>
  message: (context: { args: any[] }) => string
  debounce?: number
  skipEmpty?: boolean
  async?: boolean
}

// Component Registry Types
export interface ComponentConfig {
  component: string | Component
  props?: Record<string, any>
  validation?: Record<string, any>
  converter?: (field: FieldConfig, t: (key: string) => string) => any
}

// Form Data Composable Return Type
export interface UseFormDataReturn {
  formData: Record<string, any>
  formLoaded: Ref<boolean>
  isLoading: Ref<boolean>
  isCreateForm: ComputedRef<boolean>
  loadFormData: () => Promise<void>
  handleSubmit: (formData: Record<string, any>) => Promise<void>
  handleCancel: () => void
}

// Form Validation Composable Return Type
export interface UseFormValidationReturn {
  addErrorStyling: () => void
  initializeAsyncValidations: () => void
  createAsyncValidation: (
    name: string,
    rule: (node: any, ...args: any[]) => Promise<boolean>,
    message: (context: { args: any[] }) => string,
    config?: AsyncValidationConfig
  ) => void
  validateFormAsync: (
    schema: FormSchema,
    formData: Record<string, any>
  ) => Promise<{ isValid: boolean; errors: any[] }>
  validateFieldAsync: (
    field: FieldConfig,
    value: any
  ) => Promise<{ isValid: boolean; errors: any[] }>
}

// Form Navigation Composable Return Type
export interface UseFormNavigationReturn {
  navigateBack: () => void
  navigateTo: (route: string, params?: Record<string, any>) => void
  canNavigateAway: ComputedRef<boolean>
}

// Plugin Options
export interface CrudFormPluginOptions {
  globalConfig?: Record<string, any>
}

// Vue Component Declaration
declare module 'vue' {
  interface GlobalComponents {
    CrudForm: Component<CrudFormProps>
  }
}

// Export all types
export type {
  FieldConfig,
  FormSchema,
  CrudFormProps,
  ValidationRule,
  AsyncValidationConfig,
  ValidationConfig,
  ComponentConfig,
  UseFormDataReturn,
  UseFormValidationReturn,
  UseFormNavigationReturn,
  CrudFormPluginOptions
}
