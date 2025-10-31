<script setup lang="ts">
import { UserRound, ExternalLink, ChevronDown} from 'lucide-vue-next'
import { computed } from 'vue'
import { useUserInfo } from '@/composables/useUserInfo'
import { AvatarRoot, AvatarFallback } from 'reka-ui'
import { Button } from '@/components'


const { user, loading } = useUserInfo()

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
				class="flex size-full items-center justify-center bg-gray-100 font-medium text-sm">
				<UserRound class="size-5 shrink-0" />
			</AvatarFallback>
		</AvatarRoot>
		<div class="text-left">
			<div class="text-md font-medium">
				{{ fullName }}
			</div>
			<a href="https://hh.ru/" target="_blank" class="flex items-center gap-1 text-xs text-gray-500 mt-1 underline hover:no-underline cursor-pointer">
				<span>Аккаунт hh.ru</span>
				<ExternalLink class="size-3" />
			</a>
		</div>
		<Button variant="flat" icon-only class="cursor-pointer">
			<ChevronDown class="size-5 shrink-0" />
		</Button>
	</div>
</template>
