# @uecsio/crud-form

A powerful Vue 3 CRUD form component with FormKit integration, async validation, and customizable field types.

## Features

- 🚀 **Vue 3 Composition API** - Built with modern Vue 3 features
- 📝 **FormKit Integration** - Leverages FormKit for robust form handling
- ⚡ **Async Validation** - Built-in support for asynchronous validation rules
- 🎨 **Customizable Fields** - Register custom field types and components
- 🌐 **i18n Support** - Full internationalization support
- 🎯 **TypeScript Ready** - Complete TypeScript definitions included
- 🔧 **Flexible Configuration** - Highly configurable for various use cases

## Installation

```bash
npm install @uecsio/crud-form
```

## Peer Dependencies

Make sure you have the following peer dependencies installed:

```bash
npm install vue@^3.0.0 @formkit/core@^1.6.0 @formkit/vue@^1.6.0 @formkit/i18n@^1.6.0 @coreui/vue@^5.5.0 @fortawesome/fontawesome-svg-core@^7.1.0 @fortawesome/free-solid-svg-icons@^7.1.0 @fortawesome/vue-fontawesome@^3.1.2 vue-i18n@^9.0.0 vue-router@^4.0.0
```

## Quick Start

### 1. Register the Plugin

```javascript
import { createApp } from 'vue'
import CrudForm from '@uecsio/crud-form'

const app = createApp(App)
app.use(CrudForm)
```

### 2. Use the Component

```vue
<template>
  <CrudForm
    :schema="userSchema"
    :model="userModel"
    :model-id="userId"
    path="/users"
    redirect-route="users.list"
    :redirect-params="{ page: 1 }"
    form-title="Edit User"
    api-base-url="/api"
  />
</template>

<script setup>
import { CrudForm } from '@uecsio/crud-form'

const userSchema = {
  fields: [
    {
      type: 'input',
      model: 'name',
      label: 'users.form.name',
      placeholder: 'users.form.namePlaceholder',
      required: true,
      validation: 'required|length:2,50',
      maxLength: 50
    },
    {
      type: 'email',
      model: 'email',
      label: 'users.form.email',
      required: true,
      validation: 'required|email'
    },
    {
      type: 'textarea',
      model: 'bio',
      label: 'users.form.bio',
      rows: 4,
      maxLength: 500
    }
  ]
}

const userModel = {
  name: '',
  email: '',
  bio: ''
}

const userId = 123 // For edit mode, omit for create mode
</script>
```

## Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `schema` | Object | ✅ | - | Form schema configuration |
| `model` | Object | ❌ | `{}` | Default form data |
| `modelId` | String/Number | ❌ | - | Model ID for edit mode |
| `path` | String | ✅ | - | API endpoint path |
| `extraQueryString` | String | ❌ | `''` | Additional query parameters |
| `redirectRoute` | String | ✅ | - | Route name to redirect after save |
| `redirectParams` | Object | ❌ | `{}` | Parameters for redirect route |
| `formTitle` | String | ❌ | `''` | Form header title |
| `apiBaseUrl` | String | ❌ | `'/api'` | Base URL for API calls |

## Schema Configuration

### Basic Field Types

```javascript
const schema = {
  fields: [
    {
      type: 'input',           // Field type
      model: 'fieldName',      // Form data property
      label: 'Field Label',    // Display label
      placeholder: 'Placeholder text',
      required: true,          // Required validation
      validation: 'required|email', // Validation rules
      maxLength: 100,          // Max length for text inputs
      disabled: false,         // Disable field
      readonly: false,         // Read-only field
      cols: {                  // Bootstrap grid columns
        xs: 12,
        sm: 6,
        md: 4,
        lg: 3
      }
    }
  ]
}
```

### Supported Field Types

- `input` - Text input
- `email` - Email input
- `password` - Password input
- `number` - Number input
- `date` - Date input
- `textarea` - Multi-line text
- `select` - Dropdown select
- `checkbox` - Single checkbox
- `radios` - Radio button group
- `file` - File upload

### Select and Radio Fields

```javascript
{
  type: 'select',
  model: 'category',
  label: 'Category',
  values: [
    { name: 'Option 1', value: 'opt1' },
    { name: 'Option 2', value: 'opt2' }
  ],
  required: true,
  validation: 'required'
}
```

## Async Validation

### Built-in Async Validators

```javascript
{
  type: 'input',
  model: 'email',
  label: 'Email',
  validation: 'required|email|email_unique:/api/users/check-email'
}
```

### Custom Async Validators

```javascript
import { registerCustomValidation } from '@uecsio/crud-form'

// Register custom validation
registerCustomValidation('username_available', 
  async (node, apiUrl) => {
    const response = await fetch(`${apiUrl}?username=${node.value}`)
    const data = await response.json()
    return !data.exists
  },
  () => 'Username is already taken',
  {
    debounce: 500,
    skipEmpty: true,
    async: true
  }
)

// Use in schema
{
  type: 'input',
  model: 'username',
  label: 'Username',
  validation: 'required|username_available:/api/users/check-username'
}
```

## Custom Components

### Register Custom Field Type

```javascript
import { registerCustomComponent } from '@uecsio/crud-form'
import MyCustomComponent from './MyCustomComponent.vue'

registerCustomComponent('customField', {
  component: 'MyCustomComponent',
  props: {
    // Default props for this field type
    customProp: 'defaultValue'
  },
  validation: {
    // Default validation rules
  },
  converter: (field, t) => {
    // Custom schema converter
    return {
      $formkit: 'MyCustomComponent',
      name: field.model,
      label: t(field.label),
      // ... other props
    }
  }
})
```

### Use Custom Component

```javascript
{
  type: 'customField',
  model: 'customData',
  label: 'Custom Field',
  props: {
    // Field-specific props
    customProp: 'specificValue'
  }
}
```

## Composables

### useFormData

```javascript
import { useFormData } from '@uecsio/crud-form'

const props = {
  schema: mySchema,
  path: '/users',
  apiBaseUrl: '/api'
}

const {
  formData,      // Reactive form data
  formLoaded,    // Loading state
  isLoading,     // Submit loading state
  isCreateForm,  // Boolean: create vs edit mode
  loadFormData,  // Function to load form data
  handleSubmit,  // Function to handle form submission
  handleCancel   // Function to handle form cancellation
} = useFormData(props)
```

### useFormValidation

```javascript
import { useFormValidation } from '@uecsio/crud-form'

const {
  addErrorStyling,           // Add error styling to form
  initializeAsyncValidations, // Initialize async validations
  createAsyncValidation,     // Create custom async validation
  validateFormAsync,         // Validate entire form
  validateFieldAsync         // Validate single field
} = useFormValidation()
```

## Examples

### User Registration Form

```javascript
import { userRegistrationSchema } from '@uecsio/crud-form'

const registrationSchema = userRegistrationSchema
```

### Rich Text Editor

```javascript
import { richTextExample } from '@uecsio/crud-form'

const blogPostSchema = richTextExample
```

### Async Validation Example

```javascript
import { asyncValidationExample } from '@uecsio/crud-form'

const formWithAsyncValidation = asyncValidationExample
```

## Styling

The component includes built-in SCSS styles that integrate with CoreUI. You can customize the appearance by overriding CSS variables:

```scss
.crud-form {
  --cui-primary: #your-primary-color;
  --cui-danger: #your-error-color;
  --cui-border-color: #your-border-color;
}
```

## API Integration

The component automatically handles:

- **GET** requests to load existing data (edit mode)
- **POST** requests to create new records
- **PATCH** requests to update existing records
- File upload handling for image fields
- Error handling and user feedback

### API Endpoints Expected

- `GET /api/{path}/{id}` - Load existing record
- `POST /api/{path}` - Create new record
- `PATCH /api/{path}/{id}` - Update existing record
- `POST /api/image/{id}/{type}` - Upload images

## TypeScript Support

Full TypeScript definitions are included. Import types as needed:

```typescript
import type { 
  CrudFormProps, 
  FormSchema, 
  FieldConfig,
  AsyncValidationConfig 
} from '@uecsio/crud-form'
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### 0.1.1
- Initial release
- Basic CRUD functionality
- Async validation support
- Custom component registration
- TypeScript definitions
- FontAwesome icon integration
