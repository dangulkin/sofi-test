import { ref, computed } from 'vue'
import { pluralizeRu } from '@/lib/utils'

export function useIndustriesSelect(initialIds: string[] = [], initialNames: string[] = []) {
	const isOpen = ref(false)
	const selectedIds = ref<string[]>([...initialIds])
	const selectedNames = ref<string[]>([...initialNames])

	const countText = computed(() => {
		const count = selectedNames.value.length
		return `${count} ${pluralizeRu(count, ['отрасль', 'отрасли', 'отраслей'])}`
	})

	function open() { isOpen.value = true }
	function close() { isOpen.value = false }
	function clear() { selectedIds.value = []; selectedNames.value = [] }
	function apply(payload: { selectedIds: string[]; selectedNames: string[] }) {
		selectedIds.value = payload.selectedIds
		selectedNames.value = payload.selectedNames
		close()
	}

	return {
		isOpen,
		selectedIds,
		selectedNames,
		countText,
		open,
		close,
		clear,
		apply,
	}
}
