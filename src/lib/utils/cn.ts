import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 * Ensures classes don't conflict and merge properly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
