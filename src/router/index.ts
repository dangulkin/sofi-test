import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import PositionsView from '@/views/PositionsView.vue'
import SearchSettings from '@/views/SearchSettings.vue'
import ResponsesView from '@/views/ResponsesView.vue'
import SubscriptionView from '@/views/SubscriptionView.vue'
import InterviewsView from '@/views/InterviewsView.vue'
import VacanciesView from '@/views/VacanciesView.vue'
import LoginView from '@/views/LoginView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { validateAuth } from '@/api/auth'
import { getAuthCache, setAuthCache, getAuthValidationPromise, setAuthValidationPromise } from '@/composables/useAuthSession'

async function checkAuth(): Promise<boolean> {
	// Проверяем shared кэш
	const cached = getAuthCache()
	if (cached !== null) {
		console.log('[checkAuth] Using cached result:', cached.isValid)
		return cached.isValid
	}

	// Если валидация уже выполняется - ждем её
	const existingPromise = getAuthValidationPromise()
	if (existingPromise) {
		console.log('[checkAuth] Waiting for existing validation')
		await existingPromise
		const cachedAfterWait = getAuthCache()
		return cachedAfterWait?.isValid ?? false
	}

	// Делаем новый запрос
	console.log('[checkAuth] Making new request')
	const validationPromise = validateAuth()
		.then(() => {
			setAuthCache(true)
		})
		.catch(() => {
			setAuthCache(false)
		})

	setAuthValidationPromise(validationPromise)
	await validationPromise
	setAuthValidationPromise(null)

	const result = getAuthCache()
	return result?.isValid ?? false
}

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/login',
			name: 'login',
			component: LoginView,
			meta: { requiresAuth: false }
		},
		{
			path: '/',
			name: 'dashboard',
			component: DashboardView,
			meta: { layout: DefaultLayout, requiresAuth: true }
		},
		{
			path: '/positions',
			name: 'positions',
			component: PositionsView,
			meta: { layout: DefaultLayout, requiresAuth: true }
		},
		{
			path: '/search-settings/:position_id',
			name: 'search-settings',
			component: SearchSettings,
			meta: { layout: DefaultLayout, requiresAuth: true }
		},
		{
			path: '/responses',
			name: 'responses',
			component: ResponsesView,
			meta: { layout: DefaultLayout, requiresAuth: true }
		},
		{
			path: '/subscription',
			name: 'subscription',
			component: SubscriptionView,
			meta: { layout: DefaultLayout, requiresAuth: true }
		},
		{
			path: '/interviews',
			name: 'interviews',
			component: InterviewsView,
			meta: { layout: DefaultLayout, requiresAuth: true }
		},
		{
			path: '/vacancies',
			name: 'vacancies',
			component: VacanciesView,
			meta: { layout: DefaultLayout, requiresAuth: true }
		},
	],
})

// Navigation guard для проверки авторизации
router.beforeEach(async (to, from, next) => {
	const requiresAuth = to.meta.requiresAuth !== false

	if (!requiresAuth) {
		// Страница не требует авторизации (например, /login)
		next()
		return
	}

	const isValid = await checkAuth()

	if (isValid) {
		next()
	} else {
		// Если не авторизован - редирект на логин
		next({ name: 'login' })
	}
})

export default router
