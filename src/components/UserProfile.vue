<script setup lang="ts">
import { UserRound } from 'lucide-vue-next'
import { computed } from 'vue'
import { useUserInfo } from '@/composables/useUserInfo'
import { AvatarRoot, AvatarFallback } from 'reka-ui'

const { user, loading } = useUserInfo()

// Compute user initials for fallback
const userInitials = computed(() => {
	if (!user.value) return ''
	const firstInitial = user.value.first_name?.[0]?.toUpperCase() || ''
	const lastInitial = user.value.last_name?.[0]?.toUpperCase() || ''
	return firstInitial + lastInitial
})

// Compute full name
const fullName = computed(() => {
	if (loading.value) return 'Загрузка…'
	if (!user.value) return 'Гость'
	return `${user.value.first_name} ${user.value.last_name}`.trim() || user.value.name || 'Гость'
})
</script>

<template>
	<div class="flex items-center gap-3 p-2 transition-colors">
		<AvatarRoot class="relative flex size-10 shrink-0 overflow-hidden rounded-full">
			<!-- <AvatarImage :src="user?.photo_url" :alt="fullName" /> -->
			<AvatarFallback
				class="flex size-full items-center justify-center rounded-full bg-gray-100 font-medium text-sm">
				<span v-if="userInitials">{{ userInitials }}</span>
				<UserRound v-else class="size-5 shrink-0" />
			</AvatarFallback>
		</AvatarRoot>
		<div class="text-left">
			<div class="text-md font-medium">
				{{ fullName }}
			</div>
			<div class="text-xs text-gray-500 mt-1 underline hover:no-underline cursor-pointer">
				<span>Аккаунт hh.ru</span>
			</div>
		</div>
		<!-- <Button variant="flat" icon-only>
			<ChevronDown class="size-5 shrink-0" />
		</Button> -->
	</div>
</template>
