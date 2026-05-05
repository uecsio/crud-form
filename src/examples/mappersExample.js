/**
 * Example: Product Form with Mappers
 *
 * This example demonstrates how to use mappers to reshape data between the API
 * and the form model. The API stores categories and producers together in a
 * single `tagItems` relation, but the form schema splits them into separate
 * fields for a better editing experience.
 *
 * Usage in a Vue component:
 *
 *   <CrudForm
 *     :schema="productSchema"
 *     :model="productModel"
 *     :model-id="productId"
 *     path="products"
 *     redirect-route="products.list"
 *     :mappers="productMappers"
 *   />
 */

// ---------------------------------------------------------------------------
// Mapper functions (reusable, testable)
// ---------------------------------------------------------------------------

/**
 * afterLoad: splits tagItems into categories and producers
 *
 * API response:
 *   { name: 'T-Shirt', tagItems: [{ id: 1, type: 'category' }, { id: 2, type: 'producer' }] }
 *
 * Mapped model:
 *   { name: 'T-Shirt', categories: [{ id: 1, type: 'category' }], producers: [{ id: 2, type: 'producer' }] }
 */
export function splitTagItems(data) {
  const tagItems = data.tagItems ?? []

  data.categories = tagItems.filter(t => t.type === 'category')
  data.producers = tagItems.filter(t => t.type === 'producer')
  delete data.tagItems

  return data
}

/**
 * beforeSubmit: merges categories and producers back into tagItems
 *
 * Form model:
 *   { name: 'T-Shirt', categories: [{ id: 1 }], producers: [{ id: 2 }] }
 *
 * Mapped submit data:
 *   { name: 'T-Shirt', tagItems: [{ id: 1 }, { id: 2 }] }
 */
export function mergeTagItems(data) {
  data.tagItems = [
    ...(data.categories ?? []),
    ...(data.producers ?? [])
  ]
  delete data.categories
  delete data.producers

  return data
}

/**
 * afterLoad: converts ISO date strings to Date objects for date picker fields
 */
export function parseDates(data) {
  if (data.publishedAt) {
    data.publishedAt = new Date(data.publishedAt)
  }
  if (data.expiresAt) {
    data.expiresAt = new Date(data.expiresAt)
  }

  return data
}

/**
 * beforeSubmit: converts Date objects back to ISO strings for the API
 */
export function formatDates(data) {
  if (data.publishedAt instanceof Date) {
    data.publishedAt = data.publishedAt.toISOString()
  }
  if (data.expiresAt instanceof Date) {
    data.expiresAt = data.expiresAt.toISOString()
  }

  return data
}

// ---------------------------------------------------------------------------
// Mappers config — pass this as the :mappers prop
// ---------------------------------------------------------------------------

export const productMappers = {
  afterLoad: [
    splitTagItems,
    parseDates,
  ],
  beforeSubmit: [
    formatDates,
    mergeTagItems,
  ]
}

// ---------------------------------------------------------------------------
// Schema & Model
// ---------------------------------------------------------------------------

export const productSchema = {
  fields: [
    {
      type: 'input',
      inputType: 'text',
      model: 'name',
      label: 'products.form.name',
      placeholder: 'products.form.namePlaceholder',
      required: true,
      min: 2,
      max: 255
    },
    {
      type: 'textarea',
      model: 'description',
      label: 'products.form.description',
      placeholder: 'products.form.descriptionPlaceholder',
      max: 2000
    },
    {
      type: 'number',
      model: 'price',
      label: 'products.form.price',
      required: true,
      min: 0
    },
    {
      type: 'select',
      model: 'categories',
      label: 'products.form.categories',
      placeholder: 'products.form.categoriesPlaceholder',
      multiple: true,
      required: true,
      options: []  // populated dynamically
    },
    {
      type: 'select',
      model: 'producers',
      label: 'products.form.producers',
      placeholder: 'products.form.producersPlaceholder',
      multiple: true,
      options: []  // populated dynamically
    },
    {
      type: 'input',
      inputType: 'datetime-local',
      model: 'publishedAt',
      label: 'products.form.publishedAt',
    },
    {
      type: 'input',
      inputType: 'datetime-local',
      model: 'expiresAt',
      label: 'products.form.expiresAt',
    }
  ]
}

export const productModel = {
  name: '',
  description: '',
  price: 0,
  categories: [],
  producers: [],
  publishedAt: null,
  expiresAt: null
}
