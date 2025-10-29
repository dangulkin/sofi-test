<script setup lang="ts">
import { ref, watch, inject } from 'vue';
import type { Ref } from 'vue';
import { SideBar as Sidebar } from '@/components'

import {
	X,
	LoaderCircle,
	Save,
	ExternalLink,
	ArrowLeft,
	Check,
	ChevronDown,
} from 'lucide-vue-next';

import {
	CheckboxRoot,
	CheckboxIndicator,
	SelectRoot,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectItemText,
	SelectTrigger,
	SelectValue,
	SelectPortal,
	SelectViewport,
	SelectIcon
} from 'reka-ui';

const keywords = ref('');
const searchInTitle = ref(true);
const searchInDescription = ref(false);
const excludeWords = ref('');
const experience = ref('');
const vacancyCount = ref<number | null>(null);
const isLoading = ref(false);
const isSidebarCollapsed = ref(false);
const isMobileMenuOpen = inject<Ref<boolean>>('isMobileMenuOpen', ref(false));

const industries = ref([
	'Аналитик',
	'Гейм-дизайнер',
	'Дизайнер, художник',
	'Менеджер продукта',
	'Программист, разработчик',
	'Продуктовый аналитик',
	'Сетевой инженер'
]);

const experienceOptions = [
	'Нет опыта',
	'1-3 года',
	'3-5 лет',
	'Более 5 лет'
];

let searchTimeout: number | null = null;

watch([keywords, searchInTitle, searchInDescription, excludeWords, industries, experience], () => {
	isLoading.value = true;
	if (searchTimeout) clearTimeout(searchTimeout);

	searchTimeout = setTimeout(() => {
		vacancyCount.value = Math.floor(Math.random() * 500) + 50;
		isLoading.value = false;
	}, 800);
}, { deep: true });

const removeIndustry = (index: number) => {
	industries.value = industries.value.filter((_, i) => i !== index);
};

const handleSave = () => {
	console.log('Settings saved');
};
</script>

<template>
	<div class="flex h-[calc(100vh-90px)]">

		<Sidebar :collapsed="isSidebarCollapsed" @toggle="isSidebarCollapsed = !isSidebarCollapsed"
			:is-mobile-open="isMobileMenuOpen" />

		<!-- Main Content -->
		<section :class="[
			'w-full flex-1 space-y-7 p-4 sm:p-6 lg:p-8 ml-0 sm:ml-16 lg:ml-0 mb-30 sm:mb-0 overflow-y-auto transition-all duration-300',
		]">
			<div class="flex flex-col gap-3 sm:gap-auto sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center gap-4">
					<button
						class="p-3 bg-white hover:bg-gray-200 border border-gray-200 rounded-lg transition-colors cursor-pointer">
						<ArrowLeft class="size-5" />
					</button>
					<h1 class="text-2xl font-medium">Настройка поиска</h1>
				</div>
				<a href="#"
					class="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 transition-colors relative after:bg-blue-700 after:absolute after:h-px after:w-0 after:-bottom-px after:left-0 hover:after:w-full after:transition-all after:duration-180 cursor-pointer">
					Как найти больше вакансий?
					<ExternalLink class="size-4" />
				</a>
			</div>

			<div class="flex flex-row-reverse justify-between gap-6 bg-white p-6 rounded-xl border border-gray-200">

				<!-- Блок для сохранения и счетчика -->
				<div class="min-w-50 md:static md:mt-0 fixed left-0 sm:left-15 bottom-0 w-full sm:w-[calc(100%-3.75rem)] md:w-auto z-30 bg-white border-t border-gray-100 px-4 py-3 flex flex-col md:flex-col gap-3 md:rounded-none shadow-lg
         md:border-t-0 md:shadow-none">
					<button @click="handleSave"
						class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 cursor-pointer w-full">
						<Save class="size-5" />
						Сохранить
					</button>
					<div class="flex items-center justify-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 w-full">
						<span class="text-sm">Найдено вакансий:</span>
						<span class="inline-block min-w-9 relative">
							<LoaderCircle v-if="isLoading" class="size-4 animate-spin text-blue-600 mx-auto" />
							<span v-else class="text-sm font-medium text-blue-600 transition-all block text-center">
								{{ vacancyCount || 9999 }}
							</span>
						</span>
					</div>
				</div>

				<!-- Form -->
				<form class="flex-1 grid gap-y-10 xl:gap-x-8 max-w-4xl">
					<!-- Ключевые слова -->
					<div class="flex flex-col gap-y-4 xl:flex-row">

						<div class="xl:w-62">
							<label class="block font-semibold text-lg">Ключевые слова <span class="text-red-500">*</span></label>
							<p class="text-sm text-gray-500">Слова, которые нужно искать в&nbsp;вакансии</p>
						</div>

						<div class="flex-1">
							<input v-model="keywords" type="text" placeholder="Ключевые слова, через запятую"
								class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" />
							<p class="text-xs text-gray-400 mt-1">
								например,
								<span class="font-medium text-blue-500 underline underline-offset-2 decoration-dashed cursor-pointer">
									специалист по тестированию
								</span>
							</p>


							<!-- Искать -->
							<div class="w-fit flex flex-col gap-2 mt-7">
								<span class="block font-normal text-md mb-3">Искать</span>
								<label class="flex items-center gap-3 cursor-pointer group">
									<CheckboxRoot v-model:checked="searchInTitle"
										class="size-5 border border-gray-200 rounded flex items-center justify-center data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all">
										<CheckboxIndicator>
											<Check class="size-4 text-white" />
										</CheckboxIndicator>
									</CheckboxRoot>
									<span class="group-hover:text-gray-900 transition-colors">в названии вакансии</span>
								</label>
								<label class="flex items-center gap-3 cursor-pointer group">
									<CheckboxRoot v-model:checked="searchInDescription"
										class="size-5 border border-gray-200 rounded flex items-center justify-center data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 transition-all">
										<CheckboxIndicator>
											<Check class="size-4 text-white" />
										</CheckboxIndicator>
									</CheckboxRoot>
									<span class="text-gray-700 group-hover:text-gray-900 transition-colors">в описании
										вакансии</span>
								</label>
							</div>
						</div>
					</div>

					<!-- Исключить слова -->
					<div class="flex flex-col gap-y-4 xl:flex-row">
						<div class="xl:w-62">
							<label class="block font-semibold text-lg">Исключить слова</label>
							<p class="text-sm text-gray-500">Убрать вакансии со словами</p>
						</div>
						<div class="flex-1">
							<input v-model="excludeWords" type="text" placeholder="Исключить слова, через запятую"
								class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none" />
						</div>
					</div>

					<!-- Отрасль компании -->
					<div class="flex flex-col gap-y-2 xl:flex-row">
						<div class="xl:w-62">
							<label class="block font-semibold text-lg">Отрасль компании</label>
						</div>
						<div class="flex-1 flex flex-col gap-2">
							<div class="flex items-center gap-2 mb-4">
								<span class="text-sm text-gray-500">Вы выбрали</span>
								<span
									class="text-sm font-medium text-blue-500 underline underline-offset-2 decoration-dashed cursor-pointer">{{
										industries.length }} отраслей</span>
								<button type="button"
									class="text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full p-1 transition-colors cursor-pointer">
									<X class="size-3" />
								</button>
							</div>
							<div class="flex flex-wrap gap-2 mb-4">
								<TransitionGroup name="tag">
									<span v-for="(industry, index) in industries" :key="industry"
										class="inline-flex items-center gap-2 p-2 pl-3 bg-gray-100 rounded-lg text-sm">
										{{ industry }}
										<button type="button" @click="removeIndustry(index)"
											class="bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors cursor-pointer">
											<X class="size-3" />
										</button>
									</span>
								</TransitionGroup>
							</div>
							<button
								class="w-fit text-blue-500 hover:text-blue-700 text-md font-medium transition-colors cursor-pointer">
								Изменить отрасли
							</button>
						</div>
					</div>

					<!-- Опыт работы -->
					<div class="flex flex-col gap-y-2 xl:flex-row">
						<div class="xl:w-62">
							<label class="block font-semibold text-lg mb-1">Опыт работы</label>
						</div>
						<div class="flex-1">
							<SelectRoot v-model="experience">
								<SelectTrigger
									class="w-full px-4 py-3 border border-gray-200 rounded-lg text-left flex items-center justify-between hover:border-gray-400 transition-all outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer">
									<SelectValue :placeholder="experience ? '' : 'Выберите уровень опыта'" />
									<SelectIcon>
										<ChevronDown class="size-4 text-gray-500" />
									</SelectIcon>
								</SelectTrigger>
								<SelectPortal>
									<Transition name="fade">
										<SelectContent v-if="experienceOptions.length" position="popper" :side-offset="5"
											class="w-full min-w-full bg-white rounded-lg shadow-lg border border-gray-200">
											<SelectViewport class="p-1">
												<SelectGroup>
													<SelectItem v-for="option in experienceOptions" :key="option" :value="option"
														class="relative flex items-center px-8 py-2.5 rounded-md text-sm outline-none cursor-pointer select-none data-highlighted:bg-blue-50 data-highlighted:text-blue-900 data-[state=checked]:font-medium transition-colors">
														<SelectItemText>{{ option }}</SelectItemText>
													</SelectItem>
												</SelectGroup>
											</SelectViewport>
										</SelectContent>
									</Transition>
								</SelectPortal>
							</SelectRoot>
						</div>
					</div>
				</form>
			</div>
		</section>
	</div>
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
		/* ml-2 */
	}
}
</style>
