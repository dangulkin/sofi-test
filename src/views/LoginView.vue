<script setup lang="ts">
import { ref } from 'vue'
import { login } from '@/api/auth'
import { Button } from '@/components'

const username = ref('')
const password = ref('')
const error = ref<string | null>(null)
const isLoading = ref(false)

async function handleLogin() {
	error.value = null
	isLoading.value = true

	try {
		const result = await login({ username: username.value, password: password.value })
		console.log('Login successful:', result)

		// Для Safari: делаем небольшую задержку, чтобы cookies успели сохраниться
		await new Promise(resolve => setTimeout(resolve, 100))

		// Используем window.location вместо router.push для полной перезагрузки
		// Это помогает Safari корректно применить cookies
		window.location.href = '/'
	} catch (err) {
		console.error('Login error:', err)
		error.value = err instanceof Error ? err.message : 'Ошибка входа'
	} finally {
		isLoading.value = false
	}
}
</script>

<template>
	<div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
		<div class="w-full max-w-md">
			<div class="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
				<div class="flex justify-center mb-6">
					<img src="@/assets/logo.svg" alt="Sofi AI" class="h-8" />
				</div>
				<p class="text-gray-600 text-center mb-8">Вход в систему</p>

				<form @submit.prevent="handleLogin" class="space-y-4">
					<div>
						<label for="username" class="block text-sm font-medium text-gray-700 mb-1">
							Имя пользователя
						</label>
						<input id="username" v-model="username" type="text" required
							class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
							placeholder="Введите имя пользователя" />
					</div>

					<div>
						<label for="password" class="block text-sm font-medium text-gray-700 mb-1">
							Пароль
						</label>
						<input id="password" v-model="password" type="password" required
							class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
							placeholder="Введите пароль" />
					</div>

					<div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-xl">
						<p class="text-sm text-red-600">{{ error }}</p>
					</div>

					<Button type="submit" color="primary" :disabled="isLoading" class="w-full">
						{{ isLoading ? 'Вход...' : 'Войти' }}
					</Button>
				</form>

			</div>
		</div>
	</div>
</template>
