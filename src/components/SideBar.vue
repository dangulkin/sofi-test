<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import {
	LayoutDashboard, List, FileInput, CreditCard, Mic, Briefcase,
	FileQuestionMark, LifeBuoy, PanelLeftOpen, PanelLeftClose
} from 'lucide-vue-next'

const props = defineProps<{
	collapsed: boolean,
	isMobileOpen: boolean
}>()
const emit = defineEmits<{
	(e: 'toggle'): void
}>()

const handleResize = () => {
	const isTabletOrSmaller = window.innerWidth < 1024
	if (isTabletOrSmaller && !props.collapsed) {
		emit('toggle')
	}
}

onMounted(() => {
	handleResize()
	window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
	window.removeEventListener('resize', handleResize)
})
</script>

<template>
	<aside :class="[
		'flex flex-col h-[calc(100vh-90px)] py-8 bg-white border-r border-gray-200 transition-all duration-300',
		// Мобильные (< sm): скрыт за бургером, при открытии — полный оверлей
		'fixed top-[90px] left-0 z-40',
		props.isMobileOpen ? 'translate-x-0 w-64 px-4' : '-translate-x-full sm:translate-x-0',
		// Планшеты (sm - lg): компактный вид по умолчанию, можно раскрыть поверх
		'sm:w-15 sm:px-2',
		props.collapsed ? 'sm:w-15 sm:px-2' : 'sm:w-64 sm:px-4 sm:fixed sm:shadow-lg',
		// Десктоп (>= lg): статический сайдбар
		'lg:static lg:shadow-none',
		props.collapsed ? 'lg:w-15 lg:px-2' : 'lg:w-64 lg:px-4'
	]">
		<button @click="emit('toggle')"
			class="w-fit mb-2 p-3 mx-auto lg:ml-auto lg:mr-0 bg-transparent hover:bg-gray-100 rounded-lg transition-colors cursor-pointer hidden sm:flex">
			<PanelLeftOpen v-if="props.collapsed" class="size-5 shrink-0" />
			<PanelLeftClose v-else class="size-5 shrink-0" />
		</button>
		<nav class="flex flex-col flex-1 gap-y-2">
			<a href="#" class="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
				<LayoutDashboard class="size-5 shrink-0" />
				<span
					:class="['sidebar-label font-medium', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Дэшборд</span>
			</a>
			<a href="#" class="flex items-center gap-3 p-3 text-blue-600 bg-blue-50 rounded-lg font-medium">
				<List class="size-5 shrink-0" />
				<span
					:class="['sidebar-label font-medium', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Позиции</span>
			</a>
			<a href="#" class="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors">
				<FileInput class="size-5 shrink-0" />
				<span
					:class="['sidebar-label font-medium', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Отклики</span>
				<span class="px-2 py-1 ml-auto text-xs font-semibold bg-violet-100 text-violet-700 rounded-full sidebar-label"
					:class="(props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0'">10 из 20</span>
			</a>
			<a href="#" class="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors">
				<CreditCard class="size-5 shrink-0" />
				<span
					:class="['sidebar-label font-medium', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Подписка</span>
			</a>
			<a href="#" class="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors">
				<Mic class="size-5 shrink-0" />
				<span
					:class="['sidebar-label font-medium', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Интервью</span>
			</a>
			<a href="#" class="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors">
				<Briefcase class="size-5 shrink-0" />
				<span
					:class="['sidebar-label font-medium', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Вакансии</span>
			</a>
		</nav>
		<div class="flex flex-col gap-y-2 mt-auto">
			<button
				class="flex items-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">
				<FileQuestionMark class="size-5 shrink-0" />
				<span
					:class="['sidebar-label font-medium', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Инструкция</span>
			</button>
			<button
				class="flex items-center gap-3 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer">
				<LifeBuoy class="size-5 shrink-0" />
				<span
					:class="['sidebar-label font-medium', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Поддержка</span>
			</button>
		</div>
	</aside>
</template>

<style scoped>
.sidebar-label {
	transition-property: all;
	transition-duration: 200ms;
	overflow: hidden;
	white-space: nowrap;
	opacity: 1;
	max-width: 128px;
	margin-left: 0.5rem;
}

.opacity-0 {
	opacity: 0 !important;
}

.max-w-0 {
	max-width: 0 !important;
}

.ml-0 {
	margin-left: 0 !important;
}
</style>
