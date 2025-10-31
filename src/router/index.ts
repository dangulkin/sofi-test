import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import SearchSettings from '@/views/SearchSettings.vue'
import ResponsesView from '@/views/ResponsesView.vue'
import SubscriptionView from '@/views/SubscriptionView.vue'
import InterviewsView from '@/views/InterviewsView.vue'
import VacanciesView from '@/views/VacanciesView.vue'
import LoginView from '@/views/LoginView.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { validateAuth } from '@/api/auth'

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
			path: '/search-settings',
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

	try {
		await validateAuth()
		next()
	} catch {
		// Если не авторизован - редирект на логин
		next({ name: 'login' })
	}
})

export default router
