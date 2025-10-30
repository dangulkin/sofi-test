import { apiRequest } from './index'

export type ExperienceLevel = 'noExperience' | 'between1And3' | 'between3And6' | 'moreThan6'

export type Currency = 'RUB' | 'USD' | 'EUR'

export interface Position {
	title: string
	location: string[]
	resume_link: string
	salary: string
	notes: string
	remote: boolean
	apply_to_favorites: boolean
	currency: Currency
	category: string
	languages: string[]
	frameworks: string[]
	grade: string
	position_id: number
	user_id: string
	status: boolean
	created_at: string
	last_search: string
	search_results: string
	letter_type: string[]
}

export interface PositionsResponse {
	positions: Position[]
	positions_count: number
	positions_max_count: number
}

export interface SubIndustry {
	id: string
	name: string
}

export interface Industry {
	id: string
	name: string
	industries: SubIndustry[]
}

export type SearchInLocation = 'title' | 'description'

export interface SearchPreferences {
	position_id: number
	keywords: string[]
	exclude_keywords: string[]
	search_in: SearchInLocation[]
	specializations: string[]
	industries: string[]
	excluded_employer_ids: string[]
	experience: ExperienceLevel[]
}

export interface VacancySearchParams {
	keywords: string[]
	exclude_keywords: string[]
	search_in: SearchInLocation[]
	specializations: string[]
	industries: string[]
	excluded_employer_ids: string[]
	experience: string[]
}

export interface TotalVacanciesResponse {
	total: number
}

// GET preferences response types
export interface PreferenceSpecializationItem {
	id: string
	name: string
	area_id: string
}

export interface PreferenceIndustryItem {
	id: string
	name: string
	parent_id: string
}

export interface SearchInObject {
	title: boolean
	description: boolean
	company?: boolean
}

export interface GetSearchPreferencesResponse {
	position_id: number
	keywords: string[]
	exclude_keywords: string[]
	search_in: SearchInObject
	specializations: PreferenceSpecializationItem[]
	industries: PreferenceIndustryItem[]
	manual_query?: boolean
	excluded_employers: string[]
	experience: ExperienceLevel[]
}

export async function getPositions() {
	return apiRequest<PositionsResponse>('/api/positions')
}

export async function getExperiences() {
	return apiRequest<ExperienceLevel[]>('/api/positions/experiences')
}

export async function getIndustries() {
	return apiRequest<Industry[]>('/api/industries')
}

export async function getSearchPreferences(positionId: number) {
	return apiRequest<GetSearchPreferencesResponse>(`/api/positions/${positionId}/preferences`)
}

export async function saveSearchPreferences(positionId: number, preferences: SearchPreferences) {
	return apiRequest<void>(`/api/positions/${positionId}/preferences`, {
		method: 'PUT',
		body: JSON.stringify(preferences)
	})
}

export async function getTotalVacancies(positionId: number, params: VacancySearchParams) {
	return apiRequest<number>(`/api/positions/get-total-vacancies?position_id=${positionId}`, {
		method: 'POST',
		body: JSON.stringify(params)
	})
}
