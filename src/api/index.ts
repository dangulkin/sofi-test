


// В dev используем прокси Vite (/api), в production - Netlify redirects (/api)
export function getApiUrl(path: string): string {
	// И в dev, и в production используем /api
	// Dev: Vite proxy перенаправляет на test.sofi-assistant.com
	// Production: Netlify redirects перенаправляет на test.sofi-assistant.com
	return path
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
