import { ref, watch, type Ref } from 'vue'
import { getTotalVacancies, type VacancySearchParams } from '@/api/positions'

export interface UseVacancyCountOptions {
	/** Debounce in ms before auto-fetch on changes */
	debounce?: number
	/** Whether to start an initial fetch on mount */
	immediate?: boolean
	/** Watch source for triggering refetch (when using function params) */
	watchSource?: Ref<unknown> | Ref<unknown>[]
}

export function useVacancyCount(
	positionId: Ref<number> | number,
	paramsSource: Ref<VacancySearchParams> | (() => VacancySearchParams),
	opts: UseVacancyCountOptions = {}
) {
	const pid = typeof positionId === 'number' ? ref(positionId) : positionId
	const debounceMs = opts.debounce ?? 800
	const vacancyCount = ref<number | null>(null)
	const isLoading = ref(false)
	const error = ref<string | null>(null)
	let timer: number | null = null

	function currentParams(): VacancySearchParams {
		return typeof paramsSource === 'function' ? (paramsSource as () => VacancySearchParams)() : paramsSource.value
	}

	async function fetch() {
		isLoading.value = true
		error.value = null
		try {
			const count = await getTotalVacancies(pid.value, currentParams())
			vacancyCount.value = count
		} catch (e) {
			console.error('[useVacancyCount.fetch] Failed', e)
			vacancyCount.value = null
			error.value = 'Не удалось получить количество вакансий'
		} finally {
			isLoading.value = false
		}
	}

	// Авто-обновление с debounce при изменении параметров
	if (typeof paramsSource !== 'function') {
		// Если params это Ref, следим за ним напрямую
		watch(paramsSource, () => {
			if (timer) clearTimeout(timer)
			timer = setTimeout(() => { fetch() }, debounceMs) as unknown as number
		}, { deep: true })
	} else if (opts.watchSource) {
		// Если params это функция, следим за переданным watchSource
		const sources = Array.isArray(opts.watchSource) ? opts.watchSource : [opts.watchSource]
		watch(sources, () => {
			if (timer) clearTimeout(timer)
			timer = setTimeout(() => { fetch() }, debounceMs) as unknown as number
		}, { deep: true })
	}

	if (opts.immediate) {
		// Запускаем первоначальную загрузку
		fetch()
	}

	return {
		vacancyCount,
		isLoading,
		error,
		fetch,
	}
}
