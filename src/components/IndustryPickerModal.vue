<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { getIndustries, type Industry } from '@/api/positions';
import { X, LoaderCircle } from 'lucide-vue-next';
import { Button, Checkbox } from '@/components';
import { DialogRoot, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogClose } from 'reka-ui'

const props = defineProps<{
	open: boolean
	initialSelectedIds?: string[]
}>()

const emit = defineEmits<{
	(e: 'update:open', value: boolean): void
	(e: 'save', payload: { selectedIds: string[], selectedNames: string[] }): void
}>()

const isOpen = ref(props.open)
watch(() => props.open, v => { isOpen.value = v })
watch(isOpen, v => emit('update:open', v))

const loading = ref(false)
const error = ref<string | null>(null)
const groups = ref<Industry[]>([])
const selected = ref<Set<string>>(new Set(props.initialSelectedIds ?? []))

watch(() => props.initialSelectedIds, (arr) => {
	if (arr) selected.value = new Set(arr)
})

const nameById = computed<Record<string, string>>(() => {
	const m: Record<string, string> = {}
	for (const g of groups.value) for (const s of g.industries) m[s.id] = s.name
	return m
})

// Compute group selection state
function getGroupState(group: Industry): { checked: boolean; indeterminate: boolean } {
	const groupIds = group.industries.map(s => s.id)
	const selectedCount = groupIds.filter(id => selected.value.has(id)).length

	if (selectedCount === 0) {
		return { checked: false, indeterminate: false }
	} else if (selectedCount === groupIds.length) {
		return { checked: true, indeterminate: false }
	} else {
		return { checked: false, indeterminate: true }
	}
}

async function ensureLoaded() {
	if (groups.value.length || loading.value) return
	loading.value = true
	error.value = null
	try {
		const data = await getIndustries()
		groups.value = data
		// Normalize unknown ids
		selected.value = new Set(Array.from(selected.value).filter(id => data.some(g => g.industries.some(s => s.id === id))))
		console.log('[IndustryPickerModal] loaded groups:', data.length)
	} catch (e) {
		console.error('[IndustryPickerModal] load failed', e)
		error.value = 'Не удалось загрузить отрасли'
	} finally {
		loading.value = false
	}
}

watch(isOpen, (v) => { if (v) ensureLoaded() }, { immediate: true })

function close() { isOpen.value = false }
function clear() {
	selected.value = new Set();
}
function toggle(id: string, checked: boolean) {
	console.log('[IndustryPickerModal] toggle', id, checked)
	const next = new Set(selected.value)
	if (checked) {
		next.add(id)
	} else {
		next.delete(id)
	}
	selected.value = next
	console.log('[IndustryPickerModal] selected size:', selected.value.size)
}

function toggleGroup(group: Industry, checked: boolean) {
	const next = new Set(selected.value)
	const groupIds = group.industries.map(s => s.id)

	if (checked) {
		// Add all industries from this group
		groupIds.forEach(id => next.add(id))
	} else {
		// Remove all industries from this group
		groupIds.forEach(id => next.delete(id))
	}

	selected.value = next
	console.log('[IndustryPickerModal] toggled group', group.name, 'selected size:', selected.value.size)
}

function save() {
	const ids = Array.from(selected.value)
	const names = ids.map(id => nameById.value[id]).filter((n): n is string => !!n)
	emit('save', { selectedIds: ids, selectedNames: names })
	close()
}
</script>

<template>
	<DialogRoot v-model:open="isOpen">
		<DialogPortal>
			<DialogOverlay class="fixed inset-0 z-50 bg-black/40" />
			<DialogContent
				class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 focus:outline-none">
				<div class="w-full max-w-4xl bg-white rounded-t-xl sm:rounded-xl shadow-xl overflow-hidden">
					<div class="flex items-center justify-between p-4 border-b border-gray-200">
						<DialogTitle class="text-lg font-semibold">Выбор отраслей</DialogTitle>
						<DialogClose asChild>
							<Button type="button" icon-only size="sm" @click="close">
								<X class="size-5" />
							</Button>
						</DialogClose>
					</div>

					<div class="px-2 md:px-5">
						<div v-if="loading" class="flex items-center gap-2 text-sm text-gray-600">
							<LoaderCircle class="size-4 animate-spin text-blue-600" /> Загрузка отраслей…
						</div>
						<div v-else-if="error" class="text-sm text-red-600">{{ error }}</div>

						<div v-else class="max-h-[70vh] overflow-y-auto pr-1 space-y-6">
							<div v-for="g in groups" :key="g.id" class="space-y-2">
								<Checkbox :checked="getGroupState(g).checked" :indeterminate="getGroupState(g).indeterminate"
									@update:checked="(checked: boolean) => toggleGroup(g, checked)" class="font-medium">
									{{ g.name }}
								</Checkbox>
								<div class="flex flex-col gap-2 ml-6">
									<Checkbox v-for="s in g.industries" :key="s.id" :checked="selected.has(s.id)"
										@update:checked="(checked: boolean) => toggle(s.id, checked)">
										{{ s.name }}
									</Checkbox>
								</div>
							</div>
						</div>
					</div>

					<div
						class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-t border-gray-200">
						<div class="text-sm text-gray-600">Выбрано: <span class="font-medium">{{ selected.size }}</span></div>
						<div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
							<Button size="sm" color="danger" variant="flat" @click="clear" class="flex-1">Очистить</Button>
							<DialogClose asChild>
								<Button size="sm" color="default" class="flex-1" @click="close">Отмена</Button>
							</DialogClose>
							<Button size="sm" color="primary" class="flex-1" @click="save">Выбрать</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</DialogPortal>
	</DialogRoot>
</template>

<style scoped></style>
