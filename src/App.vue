<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';
import { useAuthSession } from '@/composables/useAuthSession';

// Запускаем keep-alive для auth сессии при монтировании
const { setup } = useAuthSession()
setup()


const route = useRoute();
const layout = computed(() => route.meta.layout);
</script>

<template>
	<component :is="layout || 'div'">
		<RouterView />
	</component>
</template>

<style scoped></style>
