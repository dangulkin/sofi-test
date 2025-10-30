import { apiRequest, getApiUrl } from './index'

export interface ValidateResponse {
	status?: string
	message?: string
	[key: string]: unknown
}

export async function validateAuth() {
	return apiRequest<ValidateResponse>('/api/auth/validate')
}

export interface LoginPayload {
	username: string
	password: string
	grant_type?: string
	scope?: string
	client_id?: string
	client_secret?: string
}

export async function login(payload: LoginPayload) {
	const body = new URLSearchParams()
	body.set('grant_type', payload.grant_type ?? 'password')
	body.set('username', payload.username)
	body.set('password', payload.password)

	const res = await fetch(getApiUrl('/api/auth/login'), {
		method: 'POST',
		body,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		credentials: 'include',
	})

	if (!res.ok) {
		const text = await res.text()
		throw new Error(`Login failed ${res.status}: ${text}`)
	}

	return res.json().catch(() => ({}))
}
