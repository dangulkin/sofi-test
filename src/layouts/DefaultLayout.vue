<script setup lang="ts">
import { ref, provide } from 'vue';
import { HeaderBar, SideBar } from '@/components';

const isMobileMenuOpen = ref(false);
const isSidebarCollapsed = ref(false);

provide('isMobileMenuOpen', isMobileMenuOpen);

const toggleMobileMenu = () => {
	isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const toggleSidebar = () => {
	isSidebarCollapsed.value = !isSidebarCollapsed.value;
};
</script>

<template>
	<div class="flex flex-col h-screen">
		<HeaderBar @toggle-mobile-menu="toggleMobileMenu" :is-mobile-menu-open="isMobileMenuOpen" />

		<div class="flex h-[calc(100vh-90px)]">
			<SideBar :collapsed="isSidebarCollapsed" @toggle="toggleSidebar" :is-mobile-open="isMobileMenuOpen" />

			<!-- Main Content Area -->
			<main class="flex-1 overflow-y-auto">
				<slot />
			</main>
		</div>
	</div>
</template>
