<script setup lang="ts">
import { Bell, ChevronDown, Menu } from 'lucide-vue-next';

const emit = defineEmits(['toggle-mobile-menu']);
</script>

<template>
	<!-- Header -->
	<header class="h-[90px] px-4 sm:px-10 flex items-center justify-between bg-white border-b border-gray-200">
		<div class="flex items-center gap-4">
			<button @click="emit('toggle-mobile-menu')" class="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
				<Menu class="size-6" />
			</button>
			<a href="#" class="text-2xl font-light hover:opacity-70 transition-opacity">
				<img src="@/assets/logo.svg" alt="Логотип Софи">
			</a>
		</div>

		<div class="flex items-center gap-4">
			<button class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
				<Bell class="size-5" />
				<span class="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
			</button>
			<div
				class="hidden sm:flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors cursor-pointer">
				<div class="w-8 h-8 bg-gray-300 rounded-full"></div>
				<div class="text-left">
					<div class="text-sm font-medium text-gray-900">Андрей Луцкевич</div>
					<div class="text-xs text-gray-500">Аккаунт HH.ru</div>
				</div>
				<ChevronDown class="w-4 h-4 text-gray-400" />
			</div>
		</div>
	</header>
</template>
