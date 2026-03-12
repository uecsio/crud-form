# @uecsio/crud-form

A Vue 3 CRUD form component powered by [vue3-form-generator](https://github.com/kevinkosterr/vue3-form-generator) with Tailwind CSS styling, i18n support, and customizable field types.

## Features

- **Vue 3 Composition API** — Built with modern Vue 3 features
- **vue3-form-generator** — Schema-based form rendering with built-in field types
- **Tailwind CSS** — Styled with Tailwind utility classes (provided by consuming app)
- **i18n Support** — Automatic translation of field labels and placeholders via vue-i18n
- **Validation** — Built-in and custom validators with error styling
- **Customizable Fields** — Register custom field types and components
- **TypeScript Ready** — Complete TypeScript definitions included

## Installation

```bash
npm install @uecsio/crud-form
```

## Peer Dependencies

```bash
npm install vue@^3.0.0 @uecsio/api-client tailwindcss@>=3.0
```

## Quick Start

### 1. Register the Plugin

```javascript
import { createApp } from 'vue'
import { ApiClient } from '@uecsio/api-client'
import CrudFormPlugin from '@uecsio/crud-form'
import '@uecsio/crud-form/dist/crud-form.css'

const app = createApp(App)

// Create or import your ApiClient instance
const apiClient = new ApiClient({
  baseUrl: 'https://api.example.com',
  getToken: () => localStorage.getItem('token'),
  saveToken: (token) => localStorage.setItem('token', token),
  clearToken: () => localStorage.removeItem('token'),
  onUnauthorized: () => {
    router.push('/login')
  }
})

app.use(CrudFormPlugin, {
  apiClient,
  // Custom error messages keyed by validator function name
  messages: {
    passwordMatchValidator: 'Passwords do not match',
  }
})
```

The `apiClient` instance handles base URL, authentication tokens, and 401 redirects — the CrudForm component uses it for all API calls automatically.

### 2. Use the Component

```vue
<template>
  <CrudForm
    :schema="userSchema"
    :model="userModel"
    :model-id="userId"
    path="users"
    redirect-route="users.list"
    form-title="Edit User"
  />
</template>

<script setup>
const userSchema = {
  fields: [
    {
      type: 'input',
      inputType: 'text',
      model: 'name',
      label: 'userName',
      placeholder: 'userName',
      required: true,
      min: 2,
      max: 50
    },
    {
      type: 'input',
      inputType: 'email',
      model: 'email',
      label: 'userEmail',
      placeholder: 'userEmail',
      required: true,
      max: 255
    },
    {
      type: 'textarea',
      model: 'bio',
      label: 'userBio',
      placeholder: 'userBio',
      max: 500
    }
  ]
}

const userModel = {
  name: '',
  email: '',
  bio: ''
}

const userId = 123 // For edit mode; omit for create mode
</script>
```

## Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `schema` | Object | Yes | — | vue3-form-generator schema with `fields` array |
| `model` | Object | No | `{}` | Default form data |
| `modelId` | String/Number | No | — | Model ID for edit mode |
| `path` | String | Yes | — | API endpoint path |
| `extraQueryString` | String | No | `''` | Additional query parameters |
| `redirectRoute` | String | Yes | — | Route name to redirect after save |
| `redirectParams` | Object | No | `{}` | Parameters for redirect route |
| `formTitle` | String | No | `''` | Form header title |
| `formOptions` | Object | No | `{ validateAfterLoad: false, validate: 'onChanged' }` | vue3-form-generator options |

## Schema Format

Schemas follow the [vue3-form-generator](https://kevinkosterr.github.io/vue3-form-generator/) format. Labels and placeholders are automatically translated via vue-i18n — just use i18n keys as values.

### Field Properties

```javascript
{
  type: 'input',           // Field type (see below)
  inputType: 'text',       // HTML input type (text, email, password, phone, etc.)
  model: 'fieldName',      // Key in the form model
  label: 'i18nKey',        // Label text or i18n key (auto-translated)
  placeholder: 'i18nKey',  // Placeholder text or i18n key (auto-translated)
  required: true,          // Adds required validation automatically
  min: 4,                  // Min length/value — validated automatically
  max: 128,                // Max length/value — validated automatically
  disabled: false,
  readonly: false,
  validator: [],            // Array of validator functions
  transforms: [],           // Array of transform functions applied before submit
}
```

### Supported Field Types

| Type | Description |
|------|-------------|
| `input` | Text input (use `inputType` for email, password, phone, etc.) |
| `password` | Password input with strength indicator |
| `number` | Number input |
| `textarea` | Multi-line text |
| `select` | Native `<select>` dropdown |
| `checkbox` | Single checkbox |
| `radio` | Radio button group |
| `switch` | Toggle switch |
| `color` | Color picker |

### Select Fields

```javascript
{
  type: 'select',
  model: 'role',
  label: 'userRole',
  required: true,
  placeholder: 'Choose a role',  // Shown as first empty option
  options: [
    { name: 'Administrator', value: 'admin' },
    { name: 'Editor', value: 'editor' }
  ]
}
```

## Validation

### Built-in Validators

Fields with `required`, `min`, and `max` properties are validated automatically by vue3-form-generator — no need to add validators manually.

### Custom Validators

Validators are **named functions** that receive `(value, field, model)` and return a **boolean** (`true` = valid):

```javascript
export function passwordMatchValidator(value, field, model) {
  if (!model.password) return true
  return value === model.password
}

// Use in schema
{
  type: 'input',
  inputType: 'password',
  model: 'confirmPassword',
  label: 'confirmPassword',
  validator: [passwordMatchValidator]
}
```

Error messages are set globally via the plugin `messages` option, keyed by the function name:

```javascript
app.use(CrudFormPlugin, {
  apiClient,
  messages: {
    passwordMatchValidator: 'Passwords do not match',
  }
})
```

> **Note:** Async validators are not supported by vue3-form-generator's synchronous validation loop. Async checks (e.g., uniqueness) should be validated server-side on submit.

### Transforms

Transform functions modify field values before form submission:

```javascript
{
  model: 'email',
  transforms: [
    (value) => value ? value.trim().toLowerCase() : null
  ]
}
```

## Custom Components

```javascript
import { registerCustomComponent } from '@uecsio/crud-form'
import MyCustomField from './MyCustomField.vue'

registerCustomComponent('myField', {
  component: MyCustomField,
  fieldType: 'myField',
  props: { customProp: 'default' },
  converter: (field, t) => ({
    type: 'myField',
    model: field.model,
    label: field.label ? t(field.label) : '',
    // ...
  })
})
```

## Composables

### useFormData

```javascript
import { useFormData } from '@uecsio/crud-form'

const { formData, formLoaded, isLoading, isCreateForm, loadFormData, handleSubmit, handleCancel } = useFormData(props)
```

### useFormValidation

```javascript
import { useFormValidation } from '@uecsio/crud-form'

const { isValid, fieldErrors, onFieldValidated, validateField, validateForm, resetValidation } = useFormValidation()
```

## Styling

The package includes CSS that bundles the vue3-form-generator legacy theme with custom overrides. Import it in your app entry:

```javascript
import '@uecsio/crud-form/dist/crud-form.css'
```

The form card wrapper uses Tailwind utility classes (`bg-white`, `rounded-lg`, `shadow`, etc.), so the consuming app must have Tailwind CSS configured.

Error states automatically apply red borders and labels to fields with validation errors.

## API Integration

The component uses `@uecsio/api-client` for all HTTP requests. Pass your `apiClient` instance via the plugin options — the client's `baseUrl` and authentication are used automatically.

The component automatically handles:

- **GET** `{path}/{id}` — Load existing record (edit mode)
- **POST** `{path}` — Create new record
- **PATCH** `{path}/{id}` — Update existing record
- **UPLOAD** `image/{id}/{type}` — Upload images (for `imageUpload` fields)

## TypeScript

```typescript
import type {
  CrudFormProps,
  FormSchema,
  FieldConfig,
  ValidationConfig,
  ComponentConfig,
  UseFormDataReturn,
  UseFormValidationReturn
} from '@uecsio/crud-form'
```

## License

MIT
