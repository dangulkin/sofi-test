import type { ExperienceLevel } from '@/api/positions'

// Общие специализации для запросов вакансий
export const SPECIALIZATIONS: readonly string[] = [
	'1170019', // HTMLCSS
	'1170020', // HTMLCSS JS
	'1170021', // HTML 5
	'1170027', // JavaScript
	'1020007', // Веб-разработчик
	'1210005', // UI
	'1210004', // UX
] as const

// Понятные метки для уровней опыта
export const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
	noExperience: 'Нет опыта',
	between1And3: '1-3 года',
	between3And6: '3-6 лет',
	moreThan6: 'Более 6 лет',
}
