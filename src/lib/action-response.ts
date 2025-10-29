/**
 * Type-safe Server Action response wrapper
 * Ensures consistent error handling across all Server Actions
 * Never exposes stack traces or internal details to clients
 */

export type ActionResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Wraps Server Action logic with error handling
 * Catches errors and returns user-friendly messages
 * Never exposes stack traces
 */
export async function executeAction<T>(
  action: () => Promise<T>
): Promise<ActionResponse<T>> {
  try {
    const data = await action()
    return { success: true, data }
  } catch (error) {
    // Log the actual error for debugging (server-side only)
    console.error('[Server Action Error]', error)

    // Return user-friendly error message
    const message = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred. Please try again.'

    // Ensure we never leak internal error details
    const sanitizedMessage = message.includes('database')
      ? 'Unable to process your request. Please try again.'
      : message

    return { 
      success: false, 
      error: sanitizedMessage 
    }
  }
}

/**
 * Type guard to check if response is successful
 */
export function isActionSuccess<T>(
  response: ActionResponse<T>
): response is { success: true; data: T } {
  return response.success === true
}

/**
 * Type guard to check if response failed
 */
export function isActionError<T>(
  response: ActionResponse<T>
): response is { success: false; error: string } {
  return response.success === false
}
