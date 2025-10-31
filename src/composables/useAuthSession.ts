import { onMounted, onUnmounted } from 'vue'
import { validateAuth, login } from '@/api/auth'

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
			} catch (err) {
				console.error('[auth] dev auto-login failed:', err)
			}
		}
	}

	async function ensureAuth() {
		// Пытаемся валидировать
		let valid = false
		try {
			await validateAuth()
			valid = true
		} catch {
			// Не авторизован
		}

		// В dev режиме авто-логин через env переменные
		if (!valid) {
			await tryDevAutoLogin()
			try {
				await validateAuth()
			} catch {
				// Авторизация не удалась
			}
		}
	}

	function startHeartbeat(ms = 10 * 60 * 1000) { // по умолчанию 10 минут
		if (intervalId) return
		intervalId = setInterval(async () => {
			try {
				await validateAuth()
			} catch {
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
			try {
				await validateAuth()
			} catch {
				await tryDevAutoLogin()
			}
		}
	}

	return { ensureAuth, startHeartbeat, stopHeartbeat, setup }
}
