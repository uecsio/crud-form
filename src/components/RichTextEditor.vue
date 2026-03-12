<template>
  <div class="rich-text-editor mb-4">
    <label v-if="label" class="block mb-2 text-sm font-medium text-gray-700" :for="inputId">
      {{ label }}
      <span v-if="required" class="text-red-600">*</span>
    </label>

    <div v-if="showToolbar" class="flex gap-2 mb-0 p-2 bg-gray-50 border border-gray-300 border-b-0 rounded-t-md">
      <button type="button" @click="formatText('bold')" class="px-2 py-1 border border-gray-300 bg-white rounded text-sm hover:bg-gray-50 active:bg-gray-100">
        <strong>B</strong>
      </button>
      <button type="button" @click="formatText('italic')" class="px-2 py-1 border border-gray-300 bg-white rounded text-sm hover:bg-gray-50 active:bg-gray-100">
        <em>I</em>
      </button>
      <button type="button" @click="formatText('underline')" class="px-2 py-1 border border-gray-300 bg-white rounded text-sm hover:bg-gray-50 active:bg-gray-100">
        <u>U</u>
      </button>
    </div>

    <div
      ref="editor"
      :id="inputId"
      class="w-full p-3 text-base leading-relaxed text-gray-900 bg-white border border-gray-300 outline-none resize-y focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      :class="[showToolbar ? 'rounded-b-md' : 'rounded-md']"
      contenteditable="true"
      @input="handleInput"
      @blur="handleBlur"
      :placeholder="placeholder"
      :style="{ minHeight: minHeight + 'px' }"
    ></div>

    <div v-if="help" class="mt-1 text-sm text-gray-500">
      {{ help }}
    </div>

    <div v-if="errorMessage" class="mt-1 text-sm text-red-600">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  help: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  minHeight: {
    type: Number,
    default: 120
  },
  showToolbar: {
    type: Boolean,
    default: true
  },
  validation: {
    type: String,
    default: ''
  },
  validationMessages: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

const editor = ref(null)
const inputId = computed(() => `rich-text-${Math.random().toString(36).substr(2, 9)}`)
const errorMessage = ref('')

watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.innerHTML !== newValue) {
    editor.value.innerHTML = newValue
  }
})

const handleInput = (event) => {
  const content = event.target.innerHTML
  emit('update:modelValue', content)
  if (errorMessage.value) {
    errorMessage.value = ''
  }
}

const handleBlur = (event) => {
  emit('blur', event)
  validateContent()
}

const formatText = (format) => {
  document.execCommand(format, false, null)
  editor.value.focus()
}

const validateContent = () => {
  const content = editor.value?.innerHTML || ''

  if (props.required && !content.trim()) {
    errorMessage.value = props.validationMessages.required || 'This field is required'
    return false
  }

  if (props.validation.includes('rich_text_min_words')) {
    const minWords = parseInt(props.validation.match(/rich_text_min_words:(\d+)/)?.[1] || '10')
    const textContent = content.replace(/<[^>]*>/g, '').trim()
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length

    if (wordCount < minWords) {
      errorMessage.value = props.validationMessages.rich_text_min_words || `Content must have at least ${minWords} words`
      return false
    }
  }

  errorMessage.value = ''
  return true
}

onMounted(() => {
  if (editor.value && props.modelValue) {
    editor.value.innerHTML = props.modelValue
  }
})
</script>

<style scoped>
.rich-text-editor [contenteditable="true"]:empty:before {
  content: attr(placeholder);
  color: #9ca3af;
  pointer-events: none;
}
</style>
