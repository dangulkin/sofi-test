<script setup lang="ts">
import { useSlots } from 'vue'

defineProps<{
	modelValue: string
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
const slots = useSlots()
</script>

<template>
	<div class="flex flex-col gap-y-4 xl:flex-row">
		<div class="xl:w-62">
			<label class="block font-semibold text-lg">Ключевые слова <span class="text-red-500">*</span></label>
			<p class="text-sm text-gray-500">Слова, которые нужно искать в&nbsp;вакансии</p>
		</div>
		<div class="flex-1">
			<input :value="modelValue" @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
				type="text" placeholder="Ключевые слова, через запятую"
				class="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" />
			<p class="text-xs text-gray-400 mt-1">
				например,
				<span @click="emit('update:modelValue', 'специалист по тестированию')"
					class="font-medium text-blue-500 underline underline-offset-2 decoration-dashed cursor-pointer">
					специалист по тестированию
				</span>
			</p>
			<div v-if="slots.below" class="mt-7">
				<slot name="below" />
			</div>
		</div>
	</div>
</template>
