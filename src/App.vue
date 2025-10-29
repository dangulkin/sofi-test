<script setup lang="ts">
import { ref, provide } from 'vue';
import { RouterView } from 'vue-router';
import { HeaderBar } from '@/components';

const isMobileMenuOpen = ref(false);
provide('isMobileMenuOpen', isMobileMenuOpen);

const toggleMobileMenu = () => {
	isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<template>
	<div class="flex flex-col"></div>
	<HeaderBar @toggle-mobile-menu="toggleMobileMenu" />
	<main>
		<RouterView />
	</main>
</template>

<style scoped>

</style>
