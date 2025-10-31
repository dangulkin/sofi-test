<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getExperiences, type ExperienceLevel, type VacancySearchParams } from '@/api/positions';
import { Button } from '@/components';
import { pluralizeRu } from '@/lib/utils'
import { EXPERIENCE_LABELS, SPECIALIZATIONS } from '@/lib/constants'
import KeywordsInput from '@/components/search/KeywordsInput.vue'
import SearchInToggles from '@/components/search/SearchInToggles.vue'
import ExcludeWordsInput from '@/components/search/ExcludeWordsInput.vue'
import IndustriesField from '@/components/search/IndustriesField.vue'
import ExperienceSelect from '@/components/search/ExperienceSelect.vue'
import SavePanel from '@/components/search/SavePanel.vue'
import { useSearchPreferences } from '@/composables/useSearchPreferences'
import { useVacancyCount } from '@/composables/useVacancyCount'

import { ExternalLink, ArrowLeft } from 'lucide-vue-next';

const router = useRouter();
const experienceLevels = ref<ExperienceLevel[]>([]);

// TODO: заменить на параметр из роута
const currentPositionId = ref(558);

const {
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
	load,
	save,
} = useSearchPreferences(currentPositionId)

const industriesCountText = computed(() => {
	const count = industries.value.length
	return `${count} ${pluralizeRu(count, ['отрасль', 'отрасли', 'отраслей'])}`
})

const specializations = [...SPECIALIZATIONS]
const experienceLabels: Record<ExperienceLevel, string> = EXPERIENCE_LABELS

onMounted(async () => {
	try {
		const levels = await getExperiences();
		experienceLevels.value = levels;
	} catch (err) {
		console.error('[experiences] Failed to load:', err);
	}
	await load();
});

function clearIndustries() {
	industries.value = [];
	selectedIndustryIds.value = [];
}

const paramsGetter = () => {
	const searchIn: ('title' | 'description')[] = [];
	if (searchInTitle.value) searchIn.push('title');
	if (searchInDescription.value) searchIn.push('description');
	const params: VacancySearchParams = {
		keywords: keywords.value ? keywords.value.split(',').map(k => k.trim()).filter(Boolean) : [],
		exclude_keywords: excludeWords.value ? excludeWords.value.split(',').map(k => k.trim()).filter(Boolean) : [],
		search_in: searchIn,
		specializations: specializations,
		industries: selectedIndustryIds.value,
		excluded_employer_ids: [],
		experience: experience.value && experience.value.length ? experience.value : []
	};
	return params;
}
const { vacancyCount, isLoading } = useVacancyCount(currentPositionId, paramsGetter, {
	debounce: 800,
	immediate: true,
	watchSource: [keywords, excludeWords, searchInTitle, searchInDescription, selectedIndustryIds, experience]
})

async function handleSave() {
	await save({ specializations, excluded_employer_ids: [] })
}
</script>

<template>
	<section :class="[
		'w-full flex-1 space-y-7 p-3 sm:p-6 sm:pl-22 lg:p-8 mb-32 sm:mb-0 overflow-y-auto transition-all duration-300',
	]">
		<div class="flex flex-col gap-3 sm:gap-auto sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-center gap-4">
				<Button icon-only class="bg-white border border-gray-200" @click="router.back()">
					<ArrowLeft class="size-5" />
				</Button>
				<h1 class="text-2xl font-semibold">Настройка поиска</h1>
			</div>
			<a href="#"
				class="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 transition-colors relative after:bg-blue-700 after:absolute after:h-px after:w-0 after:-bottom-px after:left-0 hover:after:w-full after:transition-all after:duration-180 cursor-pointer">
				Как найти больше вакансий?
				<ExternalLink class="size-4" />
			</a>
		</div>

		<div class="flex flex-row-reverse justify-between gap-6 bg-white p-4 sm:p-6 xl:p-10 rounded-xl border border-gray-200">
			<SavePanel :isSaving="isSaving" :saveSucceeded="saveSucceeded" :isCounting="isLoading"
				:vacancyCount="vacancyCount" :disabled="isPrefLoading" @save="handleSave" />

			<form v-if="!isPrefLoading" class="flex-1 grid gap-y-10 xl:gap-x-8 max-w-4xl">
				<KeywordsInput v-model="keywords">
					<template #below>
						<SearchInToggles :inTitle="searchInTitle" :inDescription="searchInDescription"
							@update:inTitle="(v: boolean) => searchInTitle = v"
							@update:inDescription="(v: boolean) => searchInDescription = v" />
					</template>
				</KeywordsInput>

				<ExcludeWordsInput v-model="excludeWords" />

				<div class="flex flex-col gap-y-2 xl:flex-row">
					<div class="xl:w-62">
						<label class="block font-semibold text-lg">Отрасль компании</label>
					</div>
					<IndustriesField :selectedNames="industries" :selectedIds="selectedIndustryIds"
						:countText="industriesCountText" :disabled="isPrefLoading"
						@update:selectedNames="(v: string[]) => industries = v"
						@update:selectedIds="(v: string[]) => selectedIndustryIds = v" @clear="clearIndustries" />
				</div>

				<ExperienceSelect v-model="experience" :options="experienceLevels" :labels="experienceLabels" />
			</form>

			<!-- Скелетон формы при загрузке -->
			<div v-else class="flex-1 grid gap-y-10 xl:gap-x-8 max-w-4xl">
				<div class="flex flex-col gap-y-4 xl:flex-row">
					<div class="xl:w-62">
						<div class="h-6 w-48 bg-gray-100 rounded animate-pulse"></div>
						<div class="h-4 w-56 bg-gray-100 rounded mt-2 animate-pulse"></div>
					</div>
					<div class="flex-1">
						<div class="h-12 w-full bg-gray-100 rounded-xl animate-pulse"></div>
						<div class="mt-6 space-y-3">
							<div class="flex items-center gap-3">
								<div class="size-5 bg-gray-100 rounded animate-pulse"></div>
								<div class="h-4 w-56 bg-gray-100 rounded animate-pulse"></div>
							</div>
							<div class="flex items-center gap-3">
								<div class="size-5 bg-gray-100 rounded animate-pulse"></div>
								<div class="h-4 w-64 bg-gray-100 rounded animate-pulse"></div>
							</div>
						</div>
					</div>
				</div>

				<div class="flex flex-col gap-y-4 xl:flex-row">
					<div class="xl:w-62">
						<div class="h-6 w-40 bg-gray-100 rounded animate-pulse"></div>
						<div class="h-4 w-56 bg-gray-100 rounded mt-2 animate-pulse"></div>
					</div>
					<div class="flex-1">
						<div class="h-12 w-full bg-gray-100 rounded-xl animate-pulse"></div>
					</div>
				</div>

				<div class="flex flex-col gap-y-2 xl:flex-row">
					<div class="xl:w-62">
						<div class="h-6 w-44 bg-gray-100 rounded animate-pulse"></div>
					</div>
					<div class="flex-1 flex flex-col gap-2">
						<div class="flex items-center gap-2 mb-4">
							<div class="h-4 w-24 bg-gray-100 rounded animate-pulse"></div>
							<div class="h-4 w-16 bg-gray-100 rounded animate-pulse"></div>
							<div class="size-5 bg-gray-100 rounded-full animate-pulse"></div>
						</div>
						<div class="flex gap-2">
							<div class="h-8 w-24 bg-gray-100 rounded-xl animate-pulse"></div>
							<div class="h-8 w-28 bg-gray-100 rounded-xl animate-pulse"></div>
							<div class="h-8 w-20 bg-gray-100 rounded-xl animate-pulse"></div>
						</div>
						<div class="h-5 w-32 bg-gray-100 rounded mt-3 animate-pulse"></div>
					</div>
				</div>

				<div class="flex flex-col gap-y-2 xl:flex-row">
					<div class="xl:w-62">
						<div class="h-6 w-36 bg-gray-100 rounded animate-pulse"></div>
					</div>
					<div class="flex-1">
						<div class="h-12 w-full bg-gray-100 rounded-xl animate-pulse"></div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.tag-enter-active,
.tag-leave-active {
	transition: all 0.12s ease;
}

.tag-enter-from {
	opacity: 0;
	transform: scale(0.8);
}

.tag-leave-to {
	opacity: 0;
	transform: scale(0.8);
}

.tag-move {
	transition: transform 0.2s ease;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.21s cubic-bezier(0.32, 0.72, 0, 1);
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
	opacity: 1;
}

.sidebar-label {
	transition-property: all;
	transition-duration: 200ms;
	overflow: hidden;
	white-space: nowrap;
	opacity: 0;
	max-width: 0;
	margin-left: 0;
}

@media (min-width: 1024px) {
	.sidebar-label {
		opacity: 1;
		max-width: 128px;
		margin-left: 0.5rem;
	}
}
</style>
