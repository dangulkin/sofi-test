<script setup lang="ts">
import { computed } from 'vue'
import { CheckboxRoot, CheckboxIndicator } from 'reka-ui'
import { Check } from 'lucide-vue-next'

const props = defineProps<{
	inTitle: boolean
	inDescription: boolean
}>()
const emit = defineEmits<{
	(e: 'update:inTitle', v: boolean): void
	(e: 'update:inDescription', v: boolean): void
}>()

const titleChecked = computed({
	get: () => props.inTitle,
	set: (v: boolean | 'indeterminate') => emit('update:inTitle', v === true),
})
const descChecked = computed({
	get: () => props.inDescription,
	set: (v: boolean | 'indeterminate') => emit('update:inDescription', v === true),
})
</script>

<template>
	<div class="w-fit flex flex-col gap-2">
		<span class="block font-normal text-md mb-3">Искать</span>
		<label class="flex items-center gap-3 group">
			<CheckboxRoot v-model="titleChecked"
				class="size-5 border border-gray-200 rounded flex items-center justify-center data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all">
				<CheckboxIndicator>
					<Check class="size-4 text-white" />
				</CheckboxIndicator>
			</CheckboxRoot>
			<span class="group-hover:text-gray-900 transition-colors">в названии вакансии</span>
		</label>
		<label class="flex items-center gap-3 group">
			<CheckboxRoot v-model="descChecked"
				class="size-5 border border-gray-200 rounded flex items-center justify-center data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all">
				<CheckboxIndicator>
					<Check class="size-4 text-white" />
				</CheckboxIndicator>
			</CheckboxRoot>
			<span class="text-gray-700 group-hover:text-gray-900 transition-colors">в описании вакансии</span>
		</label>
	</div>
</template>
