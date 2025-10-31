import { ref, type Ref } from 'vue'
import { getSearchPreferences, saveSearchPreferences, type ExperienceLevel, type SearchPreferences } from '@/api/positions'

export interface UseSearchPreferencesState {
	keywords: Ref<string>
	excludeWords: Ref<string>
	searchInTitle: Ref<boolean>
	searchInDescription: Ref<boolean>
	experience: Ref<ExperienceLevel[]>
	selectedIndustryIds: Ref<string[]>
	industries: Ref<string[]> // отображаемые названия
	isPrefLoading: Ref<boolean>
	isSaving: Ref<boolean>
	saveSucceeded: Ref<boolean | null>
	error: Ref<string | null>
}

export function useSearchPreferences(positionId: Ref<number> | number) {
	const pid = typeof positionId === 'number' ? ref(positionId) : positionId

	const keywords = ref('')
	const excludeWords = ref('')
	const searchInTitle = ref(true)
	const searchInDescription = ref(false)
	const experience = ref<ExperienceLevel[]>([])
	const selectedIndustryIds = ref<string[]>([])
	const industries = ref<string[]>([])

	const isPrefLoading = ref(true)
	const isSaving = ref(false)
	const saveSucceeded = ref<boolean | null>(null)
	const error = ref<string | null>(null)

	async function load() {
		isPrefLoading.value = true
		error.value = null
		try {
			const prefs = await getSearchPreferences(pid.value)
			keywords.value = Array.isArray(prefs.keywords) ? prefs.keywords.join(', ') : ''
			excludeWords.value = Array.isArray(prefs.exclude_keywords) ? prefs.exclude_keywords.join(', ') : ''
			searchInTitle.value = !!prefs.search_in?.title
			searchInDescription.value = !!prefs.search_in?.description
			selectedIndustryIds.value = Array.isArray(prefs.industries) ? prefs.industries.map((i) => i.id) : []
			industries.value = Array.isArray(prefs.industries) ? prefs.industries.map((i) => i.name) : []
			experience.value = Array.isArray(prefs.experience) ? prefs.experience.filter(Boolean) as ExperienceLevel[] : []
		} catch (e) {
			console.error('[useSearchPreferences.load] Failed', e)
			error.value = 'Не удалось загрузить настройки'
		} finally {
			isPrefLoading.value = false
		}
	}

	async function save(extra: Partial<Pick<SearchPreferences, 'specializations' | 'excluded_employer_ids'>> = {}) {
		if (isSaving.value) return
		isSaving.value = true
		saveSucceeded.value = null
		error.value = null
		try {
			const searchIn: ('title' | 'description')[] = []
			if (searchInTitle.value) searchIn.push('title')
			if (searchInDescription.value) searchIn.push('description')

			const preferences: SearchPreferences = {
				position_id: pid.value,
				keywords: keywords.value ? keywords.value.split(',').map((k) => k.trim()).filter(Boolean) : [],
				exclude_keywords: excludeWords.value ? excludeWords.value.split(',').map((k) => k.trim()).filter(Boolean) : [],
				search_in: searchIn,
				specializations: extra.specializations ?? [],
				industries: selectedIndustryIds.value,
				excluded_employer_ids: extra.excluded_employer_ids ?? [],
				experience: experience.value && experience.value.length ? experience.value : [],
			}

			await saveSearchPreferences(pid.value, preferences)
			saveSucceeded.value = true
		} catch (e) {
			console.error('[useSearchPreferences.save] Failed', e)
			saveSucceeded.value = false
			error.value = 'Не удалось сохранить настройки'
		} finally {
			isSaving.value = false
			setTimeout(() => { saveSucceeded.value = null }, 2000)
		}
	}

	return {
		// состояние
		keywords,
		excludeWords,
		searchInTitle,
		searchInDescription,
		experience,
		selectedIndustryIds,
		industries,
		isPrefLoading,
		isSaving,
		saveSucceeded,
		error,
		// действия
		load,
		save,
	} as UseSearchPreferencesState & { load: () => Promise<void>; save: (extra?: Partial<Pick<SearchPreferences, 'specializations' | 'excluded_employer_ids'>>) => Promise<void> }
}
