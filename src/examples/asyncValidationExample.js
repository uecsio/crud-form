/**
 * Example: Async Validation Usage
 *
 * This file demonstrates example schemas with async validations.
 */

// Example schema with async validations
export const userRegistrationSchema = {
  fields: [
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

// Example schema for article creation
export const articleCreationSchema = {
  fields: [
    {
      type: 'input',
      model: 'title',
      label: 'articles.form.title',
      placeholder: 'articles.form.titlePlaceholder',
      required: true,
      minLength: 5,
      maxLength: 100
    },
    {
      type: 'input',
      model: 'slug',
      label: 'articles.form.slug',
      placeholder: 'articles.form.slugPlaceholder',
      required: true,
      pattern: '^[a-z0-9-]+$',
      validation: 'username_available:/api/articles/check-slug',
      maxLength: 100
    },
    {
      type: 'rich_text',
      model: 'content',
      label: 'articles.form.content',
      placeholder: 'articles.form.contentPlaceholder',
      required: true,
      validation: 'rich_text_min_words:100|content_clean:/api/content/validate',
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

// Example schema for product
export const productSchema = {
  fields: [
    {
      type: 'input',
      model: 'name',
      label: 'products.form.name',
      placeholder: 'products.form.namePlaceholder',
      required: true,
      minLength: 3,
      maxLength: 100
    },
    {
      type: 'input',
      model: 'sku',
      label: 'products.form.sku',
      placeholder: 'products.form.skuPlaceholder',
      required: true,
      pattern: '^[A-Z0-9-]+$',
      maxLength: 50
    },
    {
      type: 'input',
      model: 'domain',
      label: 'products.form.domain',
      placeholder: 'products.form.domainPlaceholder',
      required: false,
      maxLength: 100
    }
  ]
}

