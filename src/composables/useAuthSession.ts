import { onMounted, onUnmounted } from 'vue'
import { validateAuth, login } from '@/api/auth'

// Shared auth cache with router guard
interface AuthCache {
	isValid: boolean
	timestamp: number
}

let authCache: AuthCache | null = null
let authValidationPromise: Promise<void> | null = null
const CACHE_TTL = 60000 // 60 seconds

export function getAuthCache(): AuthCache | null {
	if (!authCache) return null
	const now = Date.now()
	if (now - authCache.timestamp > CACHE_TTL) {
		authCache = null
		return null
	}
	return authCache
}

export function setAuthCache(isValid: boolean) {
	authCache = { isValid, timestamp: Date.now() }
}

export function invalidateAuthCache() {
	authCache = null
}

export function getAuthValidationPromise(): Promise<void> | null {
	return authValidationPromise
}

export function setAuthValidationPromise(promise: Promise<void> | null) {
	authValidationPromise = promise
}

// Менеджер auth сессии: валидация при старте и поддержка сессии активной
export function useAuthSession() {
	let intervalId: number | null = null

	// Попытка переподключения в dev режиме
	async function tryDevAutoLogin() {
		if (!import.meta.env.DEV) return

		const username = import.meta.env.VITE_DEV_USERNAME
		const password = import.meta.env.VITE_DEV_PASSWORD
		if (username && password) {
			try {
				await login({ username, password })
				setAuthCache(true)
			} catch (err) {
				console.error('[auth] dev auto-login failed:', err)
				setAuthCache(false)
			}
		}
	}

	async function ensureAuth() {
		// Проверяем кэш
		const cached = getAuthCache()
		if (cached !== null) {
			console.log('[useAuthSession] Using cached auth:', cached.isValid)
			if (!cached.isValid) {
				await tryDevAutoLogin()
			}
			return
		}

		// Если валидация уже выполняется - ждем её
		const existingPromise = getAuthValidationPromise()
		if (existingPromise) {
			console.log('[useAuthSession] Waiting for existing validation')
			await existingPromise
			return
		}

		// Пытаемся валидировать
		console.log('[useAuthSession] Making new request')
		const validationPromise = (async () => {
			let valid = false
			try {
				await validateAuth()
				valid = true
				setAuthCache(true)
			} catch {
				setAuthCache(false)
			}

			// В dev режиме авто-логин через env переменные
			if (!valid) {
				await tryDevAutoLogin()
				try {
					await validateAuth()
					setAuthCache(true)
				} catch {
					setAuthCache(false)
				}
			}
		})()

		setAuthValidationPromise(validationPromise)
		await validationPromise
		setAuthValidationPromise(null)
	}

	function startHeartbeat(ms = 10 * 60 * 1000) { // по умолчанию 10 минут
		if (intervalId) return
		intervalId = setInterval(async () => {
			// Инвалидируем кэш и проверяем auth
			invalidateAuthCache()
			try {
				await validateAuth()
				setAuthCache(true)
			} catch {
				setAuthCache(false)
				// Пытаемся переподключиться через dev auto-login
				await tryDevAutoLogin()
			}
		}, ms)
	}

	function stopHeartbeat() {
		if (intervalId) {
			clearInterval(intervalId)
			intervalId = null
		}
	}

	function setup(ms?: number) {
		onMounted(async () => {
			await ensureAuth()
			startHeartbeat(ms)
			document.addEventListener('visibilitychange', onVisibility)
		})
		onUnmounted(() => {
			stopHeartbeat()
			document.removeEventListener('visibilitychange', onVisibility)
		})
	}

	async function onVisibility() {
		if (document.visibilityState === 'visible') {
			// Инвалидируем кэш при возврате на вкладку
			invalidateAuthCache()
			try {
				await validateAuth()
				setAuthCache(true)
			} catch {
				setAuthCache(false)
				await tryDevAutoLogin()
			}
		}
	}

	return { ensureAuth, startHeartbeat, stopHeartbeat, setup }
}
