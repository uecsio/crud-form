<template>
  <div ref="editorContainer">
    <textarea :id="editorId" :name="field.name" />
  </div>
</template>

<script setup>
  import { ref, toRefs, onMounted, onBeforeUnmount, watch } from 'vue'
  import {
    useFormModel,
    useFieldAttributes,
    useValidation,
    useFieldProps,
    useFieldEmits,
  } from '@kevinkosterr/vue3-form-generator'

  const CKEDITOR_URL = 'https://cdn.ckeditor.com/4.14.0/full-all/ckeditor.js'

  const emits = defineEmits(useFieldEmits())
  const props = defineProps(useFieldProps())

  const { field, model } = toRefs(props)

  const { currentModelValue } = useFormModel(model.value, field.value)
  const { isRequired, isDisabled, isReadonly, isVisible, hint } = useFieldAttributes(model.value, field.value)
  const { errors, onChanged, onBlur } = useValidation(
    model.value,
    field.value,
    currentModelValue,
    props.formOptions,
    emits,
    isDisabled.value,
    isRequired.value,
    isReadonly.value,
  )

  const editorContainer = ref(null)
  const editorId = `field-editor-${props.id || Math.random().toString(36).slice(2)}`
  let editorInstance = null
  let isSettingData = false

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      if (window.CKEDITOR) { resolve(); return }
      const script = document.createElement('script')
      script.src = url
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  async function initEditor() {
    await loadScript(CKEDITOR_URL)

    if (window.CKEDITOR.instances[editorId]) {
      window.CKEDITOR.instances[editorId].destroy(true)
    }

    editorInstance = window.CKEDITOR.replace(editorId, {
      ...(field.value.editorConfig || {}),
    })

    editorInstance.on('instanceReady', () => {
      const initial = currentModelValue.value || ''
      isSettingData = true
      editorInstance.setData(initial, { callback: () => { isSettingData = false } })

      if (isReadonly.value) editorInstance.setReadOnly(true)
    })

    editorInstance.on('change', () => {
      if (isSettingData) return
      const data = editorInstance.getData()
      errors.value = []
      emits('onInput', data)
      onChanged()
    })

    editorInstance.on('blur', () => {
      onBlur()
    })
  }

  watch(currentModelValue, (val) => {
    if (!editorInstance) return
    const current = editorInstance.getData()
    if (val !== current) {
      isSettingData = true
      editorInstance.setData(val || '', { callback: () => { isSettingData = false } })
    }
  })

  watch(isReadonly, (val) => {
    if (editorInstance) editorInstance.setReadOnly(val)
  })

  onMounted(() => {
    initEditor()
  })

  onBeforeUnmount(() => {
    if (editorInstance) {
      editorInstance.destroy()
      editorInstance = null
    }
  })

  defineExpose({ errors, hint, isVisible })
</script>
