<script setup lang="ts">

import {
	ComboboxRoot,
	ComboboxAnchor,
	ComboboxInput,
	ComboboxTrigger,
	ComboboxCancel,
	ComboboxPortal,
	ComboboxContent,
	ComboboxViewport,
	ComboboxGroup,
	ComboboxItem,
	ComboboxItemIndicator
} from 'reka-ui'
import { ChevronDown, Check, X } from 'lucide-vue-next'
import type { ExperienceLevel } from '@/api/positions'

import { ref, watchEffect } from 'vue'
const props = defineProps<{
	modelValue: ExperienceLevel[]
	options: ExperienceLevel[]
	labels: Record<ExperienceLevel, string>
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: ExperienceLevel[]): void }>()

const selected = ref<ExperienceLevel[]>([])
watchEffect(() => {
	selected.value = Array.isArray(props.modelValue) ? [...props.modelValue] : []
})
</script>

<template>
	<div class="flex flex-col gap-y-2 xl:flex-row">
		<div class="xl:w-62">
			<label class="block font-semibold text-lg mb-1">Опыт работы</label>
		</div>
		<div class="flex-1">
			<ComboboxRoot v-model="selected" multiple :options="props.options"
				@update:modelValue="(v) => emit('update:modelValue', Array.isArray(v) ? v : [v])">
				<ComboboxAnchor class="w-full">
					<div
						class="w-full h-12 relative bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-400 transition-all outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent cursor-pointer overflow-hidden"
						tabindex="0">
						<div class="absolute inset-0 flex items-center gap-1 px-1.5 pr-16">
							<template v-if="selected.length">
								<span v-for="level in selected" :key="level"
									class="flex items-center shrink-0 bg-white rounded-lg px-2.5 py-1.5 text-sm font-medium shadow-sm/5 border border-gray-200 relative z-10">
									{{ props.labels[level] }}
									<button type="button" class="ml-1 focus:outline-none pointer-events-auto"
										@click.stop="selected.splice(selected.indexOf(level), 1); emit('update:modelValue', [...selected])">
										<X class="size-4 text-gray-500 hover:text-gray-700" />
									</button>
								</span>
							</template>
							<span v-else class="text-sm text-gray-500 pl-2">Выберите уровень опыта</span>
						</div>
						<ComboboxInput
							class="absolute inset-0 opacity-0 w-full h-full border-none outline-none cursor-pointer pointer-events-auto" />
						<div
							class="absolute right-0 top-0 bottom-0 w-24 pointer-events-none bg-linear-to-l from-gray-50 from-33% via-gray-50/80 via-50% to-transparent z-20">
						</div>
						<ComboboxTrigger class="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer z-30">
							<ChevronDown class="size-4 text-gray-500" />
						</ComboboxTrigger>
						<ComboboxCancel />
					</div>
				</ComboboxAnchor>
				<ComboboxPortal>
					<ComboboxContent v-if="props.options.length" position="popper" align="start" :side-offset="5"
						class="w-full min-w-full bg-white rounded-lg shadow-lg border border-gray-200 text-left origin-top-left">
						<ComboboxViewport class="p-1">
							<ComboboxGroup>
								<ComboboxItem v-for="level in props.options" :key="level" :value="level"
									class="relative flex items-center px-3 py-2.5 rounded-md text-sm outline-none cursor-pointer select-none data-highlighted:bg-blue-50 data-highlighted:text-blue-900 data-[state=checked]:font-medium transition-colors">
									<span class="size-4 mr-2 relative inline-flex items-center justify-center shrink-0">
										<ComboboxItemIndicator class="absolute inset-0 flex items-center justify-center">
											<Check class="size-4 text-blue-600" />
										</ComboboxItemIndicator>
									</span>
									<span>{{ props.labels[level] }}</span>
								</ComboboxItem>
							</ComboboxGroup>
						</ComboboxViewport>
					</ComboboxContent>
				</ComboboxPortal>
			</ComboboxRoot>
		</div>
	</div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
	display: none;
}

.no-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
</style>
