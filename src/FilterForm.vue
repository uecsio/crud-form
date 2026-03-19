<template>
  <div class="filter-form">
    <vue-form-generator
      v-if="formLoaded"
      :schema="translatedSchema"
      :model="formData"
      :options="formOptions"
    />
    <div class="mt-4 flex gap-2 justify-end">
      <button
        type="button"
        class="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded hover:bg-gray-300 focus:outline-none transition-colors"
        @click="onReset"
      >
        {{ t('common.reset') }}
      </button>
      <button
        type="button"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 focus:outline-none transition-colors"
        @click="onSearch"
      >
        {{ t('common.search') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  model: {
    type: Object,
    required: false,
    default: () => ({}),
  },
  formOptions: {
    type: Object,
    required: false,
    default: () => ({
      validateAfterLoad: false,
      validate: 'onChanged',
    }),
  },
})

const emit = defineEmits(['search', 'reset'])

const { t } = useI18n()

const formData = reactive({})
const formLoaded = ref(false)

const translatedSchema = computed(() => ({
  ...props.schema,
  fields: props.schema.fields.map(field => ({
    ...field,
    label: field.label ? t(field.label) : field.label,
    placeholder: field.placeholder ? t(field.placeholder) : field.placeholder,
  })),
}))

const onSearch = () => {
  emit('search', { ...formData })
}

const onReset = () => {
  for (const key of Object.keys(formData)) {
    formData[key] = undefined
  }
  emit('reset')
}

onMounted(() => {
  Object.assign(formData, props.model)
  formLoaded.value = true
})
</script>
