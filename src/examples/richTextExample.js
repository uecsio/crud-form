/**
 * Example: Rich Text Editor Usage
 *
 * Demonstrates a schema with a rich text editor field.
 */

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
      validation: 'rich_text_min_words:50',
      props: {
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
