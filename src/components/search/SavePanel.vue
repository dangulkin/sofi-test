<script setup lang="ts">
import { Button } from '@/components'
import { LoaderCircle, Save, X, Check } from 'lucide-vue-next'

const props = defineProps<{
	isSaving: boolean
	saveSucceeded: boolean | null
	isCounting: boolean
	vacancyCount: number | null
	disabled?: boolean
}>()
const emit = defineEmits<{ (e: 'save'): void }>()
</script>

<template>
	<div
		class="min-w-50 md:static p-4 md:p-0 md:mt-0 fixed left-0 sm:left-16 bottom-0 w-full sm:w-[calc(100%-4rem)] md:w-auto z-40! bg-white border-t border-gray-100 flex flex-col md:flex-col gap-3 md:rounded-none shadow-lg md:border-t-0 md:shadow-none">
		<Button color="primary" @click="emit('save')" :disabled="props.disabled || props.isSaving">
			<LoaderCircle v-if="props.isSaving" class="size-5 animate-spin" />
			<template v-else-if="props.saveSucceeded === true">
				<Check class="size-5" />
				Сохранено
			</template>
			<template v-else-if="props.saveSucceeded === false">
				<X class="size-5" />
				Ошибка
			</template>
			<template v-else>
				<Save class="size-5" />
				Сохранить
			</template>
		</Button>
		<div class="flex items-center justify-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 w-full">
			<span class="text-sm">Найдено вакансий:</span>
			<span class="inline-block min-w-9 relative">
				<LoaderCircle v-if="props.isCounting" class="size-4 animate-spin text-blue-600 mx-auto" />
				<span v-else class="text-sm font-medium text-blue-600 transition-all block text-center">{{ props.vacancyCount ||
					0
				}}</span>
			</span>
		</div>
	</div>
</template>
