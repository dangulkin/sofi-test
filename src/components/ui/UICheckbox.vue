<script setup lang="ts">
import { CheckboxRoot, CheckboxIndicator } from 'reka-ui'
import { Check, Minus } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
	checked?: boolean
	indeterminate?: boolean
	disabled?: boolean
}>()

const emit = defineEmits<{
	(e: 'update:checked', value: boolean): void
}>()

// Two-way binding для Reka checkbox - используем v-model (modelValue), не v-model:checked
const model = computed<boolean | 'indeterminate'>({
	get: () => {
		if (props.indeterminate) return 'indeterminate'
		return props.checked === true
	},
	set: (v) => {
		// Отправляем true для checked, false для unchecked
		// При клике на indeterminate он становится checked (true)
		if (v === 'indeterminate') {
			emit('update:checked', true)
		} else {
			emit('update:checked', v === true)
		}
	}
})
</script>

<template>
	<label class="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer min-w-0"
		:class="{ 'opacity-60 cursor-not-allowed': props.disabled }">
		<CheckboxRoot v-model="model" :disabled="props.disabled"
			class="shrink-0 size-5 border border-gray-300 rounded flex items-center justify-center data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=indeterminate]:bg-blue-600 data-[state=indeterminate]:border-blue-600 transition-all">
			<CheckboxIndicator>
				<Check v-if="model === true" class="size-4 text-white" />
				<Minus v-else-if="model === 'indeterminate'" class="size-4 text-white" />
			</CheckboxIndicator>
		</CheckboxRoot>
		<span class="text-sm leading-5 wrap-break-word flex-1 min-w-0">
			<slot />
		</span>
	</label>
</template>
