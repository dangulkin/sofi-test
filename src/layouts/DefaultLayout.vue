<script setup lang="ts">
import { ref, provide, watch } from 'vue';
import { useRoute } from 'vue-router';
import { HeaderBar, SideBar } from '@/components';

const isMobileMenuOpen = ref(false);
const isSidebarCollapsed = ref(false);
const route = useRoute();

provide('isMobileMenuOpen', isMobileMenuOpen);

const toggleMobileMenu = () => {
	isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const toggleSidebar = () => {
	isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

// Закрываем мобильное меню при переходе на другую страницу
watch(() => route.path, () => {
	isMobileMenuOpen.value = false;
});
</script>

<template>
	<div class="flex flex-col h-dvh">
		<HeaderBar @toggle-mobile-menu="toggleMobileMenu" :is-mobile-menu-open="isMobileMenuOpen" />

		<div class="flex h-[calc(100dvh-90px)]">
			<SideBar :collapsed="isSidebarCollapsed" @toggle="toggleSidebar" :is-mobile-open="isMobileMenuOpen" />

			<!-- Main Content Area -->
			<main class="flex-1 overflow-y-auto">
				<slot />
			</main>
		</div>
	</div>
</template>
