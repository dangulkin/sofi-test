import { onMounted, onUnmounted } from 'vue'
import { validateAuth, login } from '@/api/auth'

// Simple auth session manager: validates on start and keeps session alive.
export function useAuthSession() {
	let intervalId: number | null = null

	async function ensureAuth() {
		// Try validate
		let valid = false
		try {
			const res = await validateAuth()
			console.log('[auth] validate on start:', res)
			valid = true
		} catch (e) {
			console.warn('[auth] initial validate failed:', e)
		}

		// In dev, auto-login using env creds if not valid
		if (!valid && import.meta.env.DEV) {
			const username = import.meta.env.VITE_DEV_USERNAME
			const password = import.meta.env.VITE_DEV_PASSWORD
			if (username && password) {
				try {
					await login({ username, password })
					console.log('[auth] dev auto-login success')
					const res2 = await validateAuth()
					console.log('[auth] validate after dev login:', res2)
				} catch (e) {
					console.error('[auth] dev auto-login failed:', e)
				}
			}
		}
	}

	function startHeartbeat(ms = 10 * 60 * 1000) { // default 10 minutes
		if (intervalId) return
		intervalId = window.setInterval(async () => {
			try {
				const res = await validateAuth()
				console.debug('[auth] heartbeat validate:', res)
			} catch (e) {
				console.warn('[auth] heartbeat failed:', e)
				// Optionally try dev auto-login to recover silently
				if (import.meta.env.DEV) {
					const username = import.meta.env.VITE_DEV_USERNAME
					const password = import.meta.env.VITE_DEV_PASSWORD
					if (username && password) {
						try {
							await login({ username, password })
							console.log('[auth] heartbeat dev re-login success')
						} catch (err) {
							console.error('[auth] heartbeat dev re-login failed:', err)
						}
					}
				}
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
				console.debug('[auth] visibility validate ok')
			} catch (e) {
				console.warn('[auth] visibility validate failed:', e)
				if (import.meta.env.DEV) {
					const username = import.meta.env.VITE_DEV_USERNAME
					const password = import.meta.env.VITE_DEV_PASSWORD
					if (username && password) {
						try {
							await login({ username, password })
							console.log('[auth] visibility dev re-login success')
						} catch (err) {
							console.error('[auth] visibility dev re-login failed:', err)
						}
					}
				}
			}
		}
	}

	return { ensureAuth, startHeartbeat, stopHeartbeat, setup }
}
