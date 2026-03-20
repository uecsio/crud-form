<template>
  <input
    :id="id"
    type="date"
    :lang="locale"
    class="field-input w-full border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    :name="field.name"
    :required="isRequired"
    :disabled="isDisabled"
    :readonly="isReadonly"
    :placeholder="field.placeholder"
    :value="localDate"
    @input="onFieldValueChanged"
    @blur="onBlur"
  />
</template>

<script setup>
  import { ref, watch, toRefs } from 'vue'
  import { useI18n } from 'vue-i18n'
  import {
    useFormModel,
    useFieldAttributes,
    useValidation,
    useFieldProps,
    useFieldEmits,
  } from '@kevinkosterr/vue3-form-generator'

  const emits = defineEmits(useFieldEmits())
  const props = defineProps(useFieldProps())

  const { field, model } = toRefs(props)
  const { locale } = useI18n()

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

  function toDateInputValue(val) {
    if (!val) return ''
    const d = new Date(val)
    if (isNaN(d.getTime())) return ''
    return d.toISOString().split('T')[0]
  }

  const localDate = ref(toDateInputValue(currentModelValue.value))

  watch(currentModelValue, (val) => {
    localDate.value = toDateInputValue(val)
  })

  const onFieldValueChanged = (event) => {
    errors.value = []
    const value = event.target.value
    localDate.value = value
    emits('onInput', value ? new Date(value) : null)
    onChanged()
  }

  defineExpose({ errors, hint, isVisible })
</script>
