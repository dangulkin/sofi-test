<script setup lang="ts">
defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
	<div class="flex flex-col gap-y-4 xl:flex-row">
		<div class="xl:w-62">
			<label class="block font-semibold text-lg">Исключить слова</label>
			<p class="text-sm text-gray-500">Убрать вакансии со словами</p>
		</div>
		<div class="flex-1">
			<input :value="modelValue" @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
				type="text" placeholder="Исключить слова, через запятую"
				class="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" />
		</div>
	</div>
</template>
