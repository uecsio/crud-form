/**
 * Form Navigation Composable
 * 
 * Handles navigation logic for form operations.
 * Manages redirects and route parameters.
 */

import { useRouter } from 'vue-router'

export function useFormNavigation() {
  const router = useRouter()

  /**
   * Navigates to a route or goes back
   * @param {string} redirectRoute - Route name or 'prev' for back navigation
   * @param {Object} redirectParams - Route parameters
   */
  const navigateTo = (redirectRoute, redirectParams = {}) => {
    if (redirectRoute === 'prev') {
      router.back()
    } else {
      router.push({ name: redirectRoute, params: redirectParams })
    }
  }

  /**
   * Handles form cancellation navigation
   * @param {string} redirectRoute - Route name or 'prev' for back navigation
   * @param {Object} redirectParams - Route parameters
   */
  const handleCancel = (redirectRoute, redirectParams = {}) => {
    navigateTo(redirectRoute, redirectParams)
  }

  /**
   * Handles successful form submission navigation
   * @param {string} redirectRoute - Route name or 'prev' for back navigation
   * @param {Object} redirectParams - Route parameters
   */
  const handleSuccess = (redirectRoute, redirectParams = {}) => {
    navigateTo(redirectRoute, redirectParams)
  }

  return {
    navigateTo,
    handleCancel,
    handleSuccess
  }
}
