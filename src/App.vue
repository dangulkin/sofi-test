<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';
import { useAuthSession } from '@/composables/useAuthSession';

// Start auth session keep-alive when app mounts
const { setup: setupAuth } = useAuthSession();
setupAuth();

const route = useRoute();
const layout = computed(() => route.meta.layout);
</script>

<template>
	<component :is="layout || 'div'">
		<RouterView />
	</component>
</template>

<style scoped></style>
