/**
 * Example: User Registration Schema
 *
 * This example shows a user registration form schema.
 */

// User registration schema
export const userRegistrationSchema = {
  fields: [
    {
      type: 'input',
      model: 'firstName',
      label: 'users.form.firstName',
      placeholder: 'users.form.firstNamePlaceholder',
      required: true,
      minLength: 2,
      maxLength: 50
    },
    {
      type: 'input',
      model: 'lastName',
      label: 'users.form.lastName',
      placeholder: 'users.form.lastNamePlaceholder',
      required: true,
      minLength: 2,
      maxLength: 50
    },
    {
      type: 'email',
      model: 'email',
      label: 'users.form.email',
      placeholder: 'users.form.emailPlaceholder',
      required: true,
      validation: 'email_unique:/api/users/check-email',
      maxLength: 255
    },
    {
      type: 'input',
      model: 'username',
      label: 'users.form.username',
      placeholder: 'users.form.usernamePlaceholder',
      required: true,
      minLength: 3,
      maxLength: 20,
      pattern: '^[a-zA-Z0-9_]+$',
      validation: 'username_available:/api/users/check-username'
    },
    {
      type: 'password',
      model: 'password',
      label: 'users.form.password',
      placeholder: 'users.form.passwordPlaceholder',
      required: true,
      minLength: 8
    },
    {
      type: 'password',
      model: 'confirmPassword',
      label: 'users.form.confirmPassword',
      placeholder: 'users.form.confirmPasswordPlaceholder',
      required: true
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
      required: true
    }
  ]
}

// Enhanced user registration schema with password confirmation
export const enhancedUserRegistrationSchema = {
  fields: [
    ...userRegistrationSchema.fields
  ]
}
