import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
/**
 * Used for merging tailwind classes and it is provided by the shadc ui kit
 * @param  {...any} inputs 
 * @returns 
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
