<template>
  <div class="rich-text-editor">
    <label v-if="label" class="formkit-label" :for="inputId">
      {{ label }}
      <span v-if="required" style="color: var(--cui-danger);">*</span>
    </label>
    
    <div class="editor-toolbar" v-if="showToolbar">
      <button type="button" @click="formatText('bold')" class="toolbar-btn">
        <strong>B</strong>
      </button>
      <button type="button" @click="formatText('italic')" class="toolbar-btn">
        <em>I</em>
      </button>
      <button type="button" @click="formatText('underline')" class="toolbar-btn">
        <u>U</u>
      </button>
    </div>
    
    <div
      ref="editor"
      :id="inputId"
      class="editor-content"
      contenteditable="true"
      @input="handleInput"
      @blur="handleBlur"
      :placeholder="placeholder"
      :style="{ minHeight: minHeight + 'px' }"
    ></div>
    
    <div v-if="help" class="formkit-help">
      {{ help }}
    </div>
    
    <div v-if="errorMessage" class="formkit-message">
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

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (editor.value && editor.value.innerHTML !== newValue) {
    editor.value.innerHTML = newValue
  }
})

// Handle input changes
const handleInput = (event) => {
  const content = event.target.innerHTML
  emit('update:modelValue', content)
  
  // Clear error when user starts typing
  if (errorMessage.value) {
    errorMessage.value = ''
  }
}

// Handle blur event
const handleBlur = (event) => {
  emit('blur', event)
  validateContent()
}

// Format text
const formatText = (format) => {
  document.execCommand(format, false, null)
  editor.value.focus()
}

// Validation
const validateContent = () => {
  const content = editor.value?.innerHTML || ''
  
  // Check required
  if (props.required && !content.trim()) {
    errorMessage.value = props.validationMessages.required || 'This field is required'
    return false
  }
  
  // Check rich text validation (example)
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

// Initialize editor content
onMounted(() => {
  if (editor.value && props.modelValue) {
    editor.value.innerHTML = props.modelValue
  }
})
</script>

<style lang="scss" scoped>
.rich-text-editor {
  margin-bottom: 1rem;
}

.editor-toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background-color: var(--cui-secondary-bg);
  border: 1px solid var(--cui-border-color);
  border-bottom: none;
  border-radius: 0.375rem 0.375rem 0 0;
}

.toolbar-btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--cui-border-color);
  background-color: var(--cui-body-bg);
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background-color: var(--cui-secondary-bg);
  }
  
  &:active {
    background-color: var(--cui-tertiary-bg);
  }
}

.editor-content {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--cui-body-color);
  background-color: var(--cui-body-bg);
  border: 1px solid var(--cui-border-color);
  border-radius: 0 0 0.375rem 0.375rem;
  outline: none;
  resize: vertical;
  
  &:focus {
    border-color: var(--cui-border-color-translucent);
    box-shadow: none;
  }
  
  &:empty:before {
    content: attr(placeholder);
    color: var(--cui-text-muted);
    pointer-events: none;
  }
  
  // Rich text content styling
  :deep(p) {
    margin: 0 0 0.5rem 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  :deep(strong) {
    font-weight: bold;
  }
  
  :deep(em) {
    font-style: italic;
  }
  
  :deep(u) {
    text-decoration: underline;
  }
}

.formkit-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--cui-body-color);
  font-size: 0.875rem;
}

.formkit-help {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--cui-text-muted);
}

.formkit-message {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--cui-danger);
}
</style>
