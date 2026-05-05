/**
 * Form Mappers Composable
 *
 * Provides data transformation pipelines for form data.
 * Supports 'afterLoad' and 'beforeSubmit' mapper events.
 *
 * - afterLoad: transforms data received from API before assigning to the model
 * - beforeSubmit: transforms model data before sending to the server (without mutating the model)
 */

/**
 * @param {Object} mappers - Object with mapper arrays keyed by event name
 * @param {Array<Function>} [mappers.afterLoad] - Functions to transform data after loading from API
 * @param {Array<Function>} [mappers.beforeSubmit] - Functions to transform data before submitting to API
 */
export function useFormMappers(mappers = {}) {
  /**
   * Applies a pipeline of mapper functions to data sequentially.
   * Each mapper receives the current data and returns the transformed data.
   * @param {string} event - The event name ('afterLoad' | 'beforeSubmit')
   * @param {Object} data - The data to transform
   * @returns {Object} The transformed data
   */
  const applyMappers = (event, data) => {
    const fns = mappers[event]

    if (!fns || !Array.isArray(fns) || fns.length === 0) {
      return data
    }

    return fns.reduce((currentData, mapperFn) => {
      const result = mapperFn(currentData)
      return result !== undefined ? result : currentData
    }, data)
  }

  /**
   * Applies afterLoad mappers to data received from the API
   * @param {Object} data - Raw data from API
   * @returns {Object} Mapped data ready for the form model
   */
  const applyAfterLoad = (data) => applyMappers('afterLoad', data)

  /**
   * Applies beforeSubmit mappers to form data before sending to the API.
   * Works on a shallow copy to avoid mutating the original model.
   * @param {Object} data - Form model data
   * @returns {Object} Mapped data ready for API submission
   */
  const applyBeforeSubmit = (data) => {
    const copy = { ...data }
    return applyMappers('beforeSubmit', copy)
  }

  return {
    applyAfterLoad,
    applyBeforeSubmit
  }
}
