<script setup lang="ts">
import FadeOverflow from '@/components/ui/FadeOverflow.vue'
import IndustryPickerModal from '@/components/IndustryPickerModal.vue'
import { X } from 'lucide-vue-next'

withDefaults(defineProps<{
	selectedNames: string[]
	selectedIds: string[]
	countText: string
	disabled?: boolean
}>(), { disabled: false })

const emit = defineEmits<{
	(e: 'update:selectedIds', v: string[]): void
	(e: 'update:selectedNames', v: string[]): void
	(e: 'clear'): void
}>()

const isOpen = defineModel<boolean>('open', { default: false })

function open() { isOpen.value = true }
function close() { isOpen.value = false }
function onSave(payload: { selectedIds: string[], selectedNames: string[] }) {
	emit('update:selectedIds', payload.selectedIds)
	emit('update:selectedNames', payload.selectedNames)
	close()
}
</script>

<template>
	<div class="flex-1 flex flex-col gap-2">
		<div class="flex items-center gap-2 mb-4">
			<span class="text-sm text-gray-500">Вы выбрали</span>
			<span class="text-sm font-medium text-blue-500 underline underline-offset-2 decoration-dashed cursor-pointer"
				@click="open">{{ countText }}</span>
			<button type="button" @click="emit('clear')"
				class="text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full p-1 transition-colors cursor-pointer">
				<X class="size-3" />
			</button>
		</div>

		<FadeOverflow v-if="selectedNames.length" :max-height="400" class="mb-4">
			<div class="flex flex-wrap gap-2">
				<span v-for="(industry, index) in selectedNames" :key="industry"
					class="inline-flex items-center gap-2 p-2 pl-3 bg-gray-100 rounded-xl text-sm">
					{{ industry }}
					<button type="button" @click="
						emit('update:selectedNames', selectedNames.filter((_, i) => i !== index));
					emit('update:selectedIds', selectedIds.filter((_, i) => i !== index));
					" class="bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors cursor-pointer">
						<X class="size-3" />
					</button>
				</span>
			</div>
		</FadeOverflow>

		<button type="button" @click="open" :disabled
			class="w-fit text-blue-500 hover:text-blue-700 text-md font-medium transition-colors cursor-pointer">
			Изменить отрасли
		</button>

		<IndustryPickerModal v-model:open="isOpen" :initialSelectedIds="selectedIds" @save="onSave" />
	</div>
</template>
