import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ERROR_TITLE = "Oops, something went wrong";
export const SUCCESS_TITLE = "Success, operation completed";
