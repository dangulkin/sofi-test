<script setup lang="ts">
import { onMounted } from 'vue'
import { getPositions } from '@/api/positions'
import { validateAuth, login } from '@/api/auth'

const DEV_LOGIN = import.meta.env.DEV

onMounted(async () => {
	let isValid = false
	try {
		await validateAuth();
		isValid = true
	} catch (err) {
		console.warn('[auth] Ошибка валидации:', err)
	}

	if (!isValid && DEV_LOGIN) {
		try {
			const username = import.meta.env.VITE_DEV_USERNAME
			const password = import.meta.env.VITE_DEV_PASSWORD
			if (username && password) {
				await login({ username, password })
				await validateAuth()
				isValid = true
			}
		} catch (err) {
			console.error('[auth] Ошибка входа:', err)
		}
	}

	try {
		await getPositions()
	} catch (err) {
		console.error('[positions] Ошибка загрузки:', err)
	}
})
</script>
<template>
	<div class="p-8 sm:ml-16 lg:ml-0">
		<h1 class="text-2xl font-semibold">Дашборд</h1>
		<p class="mt-4 text-gray-600">Вэлкам!</p>
	</div>
</template>
