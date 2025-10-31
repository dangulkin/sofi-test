<script setup lang="ts">
import { Bell, Menu, X } from 'lucide-vue-next';
import UserProfile from './UserProfile.vue';
import { Button } from '@/components/';

defineProps<{
	isMobileMenuOpen: boolean;
}>();

const emit = defineEmits(['toggle-mobile-menu']);
</script>

<template>
	<!-- Header -->
	<header class="h-[90px] px-4 sm:px-5 xl:px-8 flex items-center justify-between bg-white border-b border-gray-200">
		<div class="flex items-center gap-4">
			<RouterLink to="/" class="text-2xl font-light cursor-pointer">
				<img src="@/assets/logo.svg" alt="Логотип Софи">
			</RouterLink>
		</div>

		<div class="flex items-center gap-2">
			<Button variant="flat" icon-only class="relative">
				<Bell class="size-5" />
				<span class="absolute top-2 right-3 size-3 bg-blue-600 border-2 border-white rounded-full"></span>
			</Button>
			<UserProfile name="Андрей Луцкевич" class="hidden sm:flex" />

			<!-- Для мобилки -->
			<Button @click="emit('toggle-mobile-menu')" icon-only class="sm:hidden">
				<X v-if="isMobileMenuOpen" class="size-5" />
				<Menu v-else class="size-5" />
			</Button>
		</div>
	</header>
</template>
