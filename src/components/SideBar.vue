<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import {
	LayoutDashboard, List, FileInput, CreditCard, Mic, Briefcase,
	FileQuestionMark, LifeBuoy, PanelLeftOpen, PanelLeftClose, UserRound
} from 'lucide-vue-next'
import { Button } from '@/components'

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
		'flex flex-col h-[calc(100dvh-90px)] py-8 pb-safe bg-white border-r border-gray-200 transition-all duration-300 overflow-clip',
		// Мобильные (< sm): скрыт за бургером, при открытии — полный оверлей на всю ширину
		'fixed top-[90px] left-0 z-50',
		props.isMobileOpen ? 'translate-x-0 w-full px-4 sm:w-64' : '-translate-x-full sm:translate-x-0',
		// Планшеты (sm - lg): компактный вид по умолчанию, можно раскрыть поверх
		'sm:w-16 sm:px-2',
		props.collapsed ? 'sm:w-16 sm:px-2' : 'sm:w-64 sm:px-4 sm:fixed sm:shadow-lg',
		// Десктоп (>= lg): статический сайдбар
		'lg:static lg:shadow-none',
		props.collapsed ? 'lg:w-16 lg:px-2' : 'lg:w-64 lg:px-4'
	]">
		<Button @click="emit('toggle')" icon-only variant="flat" class="mb-2 mr-auto hidden! sm:flex!">
			<PanelLeftOpen v-if="props.collapsed" class="size-5 shrink-0" />
			<PanelLeftClose v-else class="size-5 shrink-0" />
		</Button>
		<nav class="flex flex-col flex-1 gap-y-2">
			<RouterLink to="/" custom v-slot="{ isExactActive, href, navigate }">
				<Button :variant="isExactActive ? 'light' : 'flat'" :color="isExactActive ? 'primary' : 'default'" :href="href"
					@click="navigate" tag="a"
					:class="['justify-start', isExactActive && 'font-medium', (props.collapsed && !props.isMobileOpen) && 'px-3.5! w-12! justify-center']">
					<template #icon-before>
						<LayoutDashboard class="size-5 shrink-0" />
					</template>
					<span
						:class="['sidebar-label', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Дашборд</span>
				</Button>
			</RouterLink>
			<RouterLink to="/positions" custom v-slot="{ isExactActive, href, navigate }">
				<Button :variant="isExactActive ? 'light' : 'flat'" :color="isExactActive ? 'primary' : 'default'" :href="href"
					@click="navigate" tag="a"
					:class="['justify-start', isExactActive && 'font-medium', (props.collapsed && !props.isMobileOpen) && 'px-3.5! w-12! justify-center']">
					<template #icon-before>
						<List class="size-5 shrink-0" />
					</template>
					<span
						:class="['sidebar-label', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Позиции</span>
				</Button>
			</RouterLink>
			<RouterLink to="/responses" custom v-slot="{ isExactActive, href, navigate }">
				<Button :variant="isExactActive ? 'light' : 'flat'" :color="isExactActive ? 'primary' : 'default'" :href="href"
					@click="navigate" tag="a"
					:class="['justify-start', isExactActive && 'font-medium', (props.collapsed && !props.isMobileOpen) && 'px-3.5! w-12! justify-center']">
					<template #icon-before>
						<FileInput class="size-5 shrink-0" />
					</template>
					<span
						:class="['sidebar-label', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Отклики</span>
				</Button>
			</RouterLink>
			<RouterLink to="/subscription" custom v-slot="{ isExactActive, href, navigate }">
				<Button :variant="isExactActive ? 'light' : 'flat'" :color="isExactActive ? 'primary' : 'default'" :href="href"
					@click="navigate" tag="a"
					:class="['justify-start', isExactActive && 'font-medium', (props.collapsed && !props.isMobileOpen) && 'px-3.5! w-12! justify-center']">
					<template #icon-before>
						<CreditCard class="size-5 shrink-0" />
					</template>
					<span
						:class="['sidebar-label', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Подписка</span>
				</Button>
			</RouterLink>
			<RouterLink to="/interviews" custom v-slot="{ isExactActive, href, navigate }">
				<Button :variant="isExactActive ? 'light' : 'flat'" :color="isExactActive ? 'primary' : 'default'" :href="href"
					@click="navigate" tag="a"
					:class="['justify-start', isExactActive && 'font-medium', (props.collapsed && !props.isMobileOpen) && 'px-3.5! w-12! justify-center']">
					<template #icon-before>
						<Mic class="size-5 shrink-0" />
					</template>
					<span
						:class="['sidebar-label', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Интервью</span>
				</Button>
			</RouterLink>
			<RouterLink to="/vacancies" custom v-slot="{ isExactActive, href, navigate }">
				<Button :variant="isExactActive ? 'light' : 'flat'" :color="isExactActive ? 'primary' : 'default'" :href="href"
					@click="navigate" tag="a"
					:class="['justify-start', isExactActive && 'font-medium', (props.collapsed && !props.isMobileOpen) && 'px-3.5! w-12! justify-center']">
					<template #icon-before>
						<Briefcase class="size-5 shrink-0" />
					</template>
					<span
						:class="['sidebar-label', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Вакансии</span>
				</Button>
			</RouterLink>
		</nav>
		<div class="flex flex-col gap-y-2 mt-auto">
			<!-- Счетчик откликов (планшеты/десктоп, только в раскрытом виде) -->
			<Transition name="fade">
				<div v-if="!props.collapsed" class="hidden sm:flex items-center gap-3 py-3 px-4 bg-gray-100 rounded-xl">
					<FileInput class="size-5 shrink-0" />
					<div class="flex flex-col items-start sidebar-label">
						<span class="font-medium">10 из 20</span>
						<span class="text-sm text-gray-500">Суточных откликов</span>
					</div>
				</div>
			</Transition>

			<!-- Блок нижних кнопок: горизонтальный на мобильных, вертикальный на планшетах/десктопе -->
			<div class="flex sm:flex-col gap-2">
				<Button href="#" tag="a"
					:class="['justify-center sm:justify-start', 'flex-1 sm:flex-none', 'px-0 sm:px-3.5', 'gap-0 sm:gap-3', 'min-w-0', (props.collapsed && !props.isMobileOpen) && 'px-3.5! w-12! justify-center']">
					<template #icon-before>
						<FileQuestionMark class="size-5 shrink-0" />
					</template>
					<span
						:class="['sidebar-label', 'sm:inline hidden', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Инструкция</span>
				</Button>
				<Button href="#" tag="a"
					:class="['justify-center sm:justify-start', 'flex-1 sm:flex-none', 'px-0 sm:px-3.5', 'gap-0 sm:gap-3', 'min-w-0', (props.collapsed && !props.isMobileOpen) && 'px-3.5! w-12! justify-center']">
					<template #icon-before>
						<LifeBuoy class="size-5 shrink-0" />
					</template>
					<span
						:class="['sidebar-label', 'sm:inline hidden', (props.collapsed && !props.isMobileOpen) && 'opacity-0 max-w-0 ml-0']">Поддержка</span>
				</Button>
				<Button class="flex-1 sm:hidden justify-center">
					<template #icon-before>
						<UserRound class="size-5 shrink-0" />
					</template>
				</Button>
			</div>
		</div>
	</aside>
</template>

<style scoped>
.sidebar-label {
	transition-property: all;
	transition-duration: 180ms;
	white-space: nowrap;
	opacity: 1;
	max-width: 128px;
}

.opacity-0 {
	opacity: 0 !important;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 180ms ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
	opacity: 1;
}
</style>
