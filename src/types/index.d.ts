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
  validator?: ValidatorFunction | ValidatorFunction[]
}

export interface FormSchema {
  fields: FieldConfig[]
}

// vue3-form-generator compatible field schema
export interface GeneratorFieldSchema {
  type: string
  model: string
  label?: string
  placeholder?: string
  help?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  validator?: ValidatorFunction | ValidatorFunction[]
  styleClasses?: string
  inputType?: string
  values?: Array<{ name: string; id: string | number }>
  rows?: number
  min?: number
  max?: number
  step?: number
  maxlength?: number
  accept?: string
  multiple?: boolean
}

export interface GeneratorSchema {
  fields: GeneratorFieldSchema[]
}

// Validator function type (vue3-form-generator compatible)
export type ValidatorFunction = (
  value: any,
  field: GeneratorFieldSchema,
  model: Record<string, any>
) => string[] | Promise<string[]>

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
  formOptions?: {
    validateAfterLoad?: boolean
    validate?: 'onChanged' | 'onBlur'
  }
}

// Validation Types
export interface ValidationConfig {
  validator: ValidatorFunction
  message?: string
  skipEmpty?: boolean
  debounce?: number
}

// Component Registry Types
export interface ComponentConfig {
  component: string | Component
  fieldType?: string
  props?: Record<string, any>
  validation?: Record<string, any>
  converter?: (field: FieldConfig, t: (key: string) => string) => GeneratorFieldSchema
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
  isValid: Ref<boolean>
  fieldErrors: Ref<Record<string, string[]>>
  onFieldValidated: (errors: string[], field: GeneratorFieldSchema) => void
  validateField: (
    field: FieldConfig,
    value: any,
    model?: Record<string, any>
  ) => Promise<string[]>
  validateForm: (
    schema: FormSchema,
    formData: Record<string, any>
  ) => Promise<{ isValid: boolean; errors: Record<string, string[]> }>
  resetValidation: () => void
}

// Form Navigation Composable Return Type
export interface UseFormNavigationReturn {
  navigateTo: (route: string, params?: Record<string, any>) => void
  handleCancel: (route: string, params?: Record<string, any>) => void
  handleSuccess: (route: string, params?: Record<string, any>) => void
}

// API Client interface (compatible with @uecsio/api-client)
export interface ApiClientInstance {
  get<T = any>(path: string, options?: Record<string, any>): Promise<T>
  post<T = any>(path: string, data?: any, options?: Record<string, any>): Promise<T>
  patch<T = any>(path: string, data?: any, options?: Record<string, any>): Promise<T>
  upload<T = any>(path: string, formData: any, options?: Record<string, any>): Promise<T>
}

// Plugin Options
export interface CrudFormPluginOptions {
  apiClient?: ApiClientInstance
  messages?: Record<string, string>
  globalConfig?: Record<string, any>
}

// Vue Component Declaration
declare module 'vue' {
  interface GlobalComponents {
    CrudForm: Component<CrudFormProps>
  }
}

// Exports
export declare const CrudForm: Component<CrudFormProps>
export declare function useFormData(props: CrudFormProps): UseFormDataReturn
export declare function useFormValidation(): UseFormValidationReturn
export declare function useFormNavigation(): UseFormNavigationReturn
export declare function registerCustomComponent(type: string, config: ComponentConfig): void
export declare function getComponentConfig(type: string): ComponentConfig
export declare function registerCustomValidation(name: string, config: ValidationConfig): void
export declare function getValidationConfig(name: string): ValidationConfig | null
export declare function createDebouncedValidator(validator: ValidatorFunction, debounceMs?: number): ValidatorFunction
export declare function createApiValidator(paramName: string, errorMessage: string, options?: Record<string, any>): ValidatorFunction
export declare function debounce(func: Function, wait: number): Function
