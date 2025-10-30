<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = withDefaults(defineProps<{
	maxHeight?: number
	gradientHeight?: number
	backgroundClass?: string
}>(), {
	maxHeight: 400,
	gradientHeight: 64,
	backgroundClass: 'from-white',
})

const scrollEl = ref<HTMLElement | null>(null)
const showFade = ref(false)

function updateFade() {
	const el = scrollEl.value
	if (!el) { showFade.value = false; return }
	const isScrollable = el.scrollHeight > el.clientHeight + 1
	const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 1
	showFade.value = isScrollable && !atBottom
}

onMounted(async () => {
	await nextTick()
	updateFade()
	const el = scrollEl.value
	if (el) el.addEventListener('scroll', updateFade, { passive: true } as AddEventListenerOptions)
})

onBeforeUnmount(() => {
	const el = scrollEl.value
	if (el) el.removeEventListener('scroll', updateFade)
})
</script>

<template>
	<div class="relative" :style="{}">
		<div ref="scrollEl" class="overflow-y-auto pr-1" :style="{ maxHeight: props.maxHeight + 'px' }">
			<slot />
		</div>
		<div v-show="showFade" class="pointer-events-none absolute bottom-0 left-0 right-0 bg-linear-to-t to-transparent"
			:class="backgroundClass" :style="{ height: props.gradientHeight + 'px' }" />
	</div>
</template>
