import { ref } from 'vue'
import { getPositions, type Position } from '@/api/positions'

const positions = ref<Position[]>([])
const isLoading = ref(false)
const isLoaded = ref(false)

export function usePositions() {
	const loadPositions = async () => {
		if (isLoaded.value) return

		isLoading.value = true
		try {
			const response = await getPositions()
			positions.value = response.positions
			isLoaded.value = true
		} catch (err) {
			console.error('[usePositions] Failed to load positions:', err)
		} finally {
			isLoading.value = false
		}
	}

	const getPositionById = (id: number) => {
		return positions.value.find(p => p.position_id === id)
	}

	return {
		positions,
		isLoading,
		isLoaded,
		loadPositions,
		getPositionById
	}
}
