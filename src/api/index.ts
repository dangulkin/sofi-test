
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://test.sofi-assistant.com'
const isDev = import.meta.env.DEV

// В dev используем прокси Vite (/api), в production - прямые запросы к API
export function getApiUrl(path: string): string {
	if (isDev) {
		// Локальная разработка - используем Vite proxy
		return path
	}
	// Production - убираем /api и добавляем базовый URL
	const pathWithoutApi = path.startsWith('/api') ? path.substring(4) : path
	return `${API_BASE_URL}${pathWithoutApi}`
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
	const response = await fetch(getApiUrl(path), {
		...options,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...options.headers,
		},
		credentials: 'include',
	})

	if (!response.ok) {
		const errorText = await response.text()
		throw new Error(`API error ${response.status}: ${errorText}`)
	}

	return response.status === 204 ? (null as T) : response.json()
}
