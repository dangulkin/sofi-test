import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

// Хелпер для русской плюрализации
// forms: [one, few, many] напр. ['отрасль', 'отрасли', 'отраслей']
export function pluralizeRu(count: number, forms: [string, string, string]) {
	const n = Math.abs(count) % 100
	const n1 = n % 10
	if (n > 10 && n < 20) return forms[2]
	if (n1 > 1 && n1 < 5) return forms[1]
	if (n1 === 1) return forms[0]
	return forms[2]
}
