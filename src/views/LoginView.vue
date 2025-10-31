<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/auth'
import { Button } from '@/components'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref<string | null>(null)
const isLoading = ref(false)

async function handleLogin() {
	error.value = null
	isLoading.value = true

	try {
		await login({ username: username.value, password: password.value })
		router.push('/')
	} catch (err) {
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
				<h1 class="text-2xl font-bold text-center mb-2">Sofi AI</h1>
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
