<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePositions } from '@/composables/usePositions'
import { LoaderCircle } from 'lucide-vue-next'

const router = useRouter()
const { loadPositions, positions } = usePositions()

onMounted(async () => {
	await loadPositions()

	// NOTE: Для тестового задания автоматически перенаправляем на первую позицию.
	// В реальном приложении здесь будет список позиций, и пользователь сам выберет
	// нужную позицию, кликнув на карточку/кнопку настроек.
	if (positions.value.length > 0) {
		const firstPosition = positions.value[0]
		if (firstPosition) {
			router.replace(`/search-settings/${firstPosition.position_id}`)
		}
	} else {
		// Если нет позиций - можно показать пустое состояние или форму создания
		console.warn('[PositionsView] No positions found')
	}
})
</script>

<template>
	<div class="p-8 sm:ml-16 lg:ml-0 flex items-center justify-center min-h-screen">
		<div class="text-center">
			<LoaderCircle class="size-12 text-blue-600 mx-auto animate-spin" />
			<p class="mt-4 text-gray-600">Загрузка позиций...</p>
		</div>
	</div>
</template>
