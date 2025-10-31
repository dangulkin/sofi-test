<script setup lang="ts">
import { computed } from 'vue';

export interface ButtonProps {
	variant?: 'solid' | 'flat' | 'light';
	color?: 'default' | 'primary' | 'secondary';
	size?: 'sm' | 'md' | 'lg';
	iconOnly?: boolean;
	disabled?: boolean;
	href?: string;
	tag?: 'button' | 'a';
}

const props = withDefaults(defineProps<ButtonProps>(), {
	variant: 'solid',
	color: 'default',
	size: 'md',
	iconOnly: false,
	disabled: false,
	tag: 'button',
});

const buttonClasses = computed(() => {
	const classes: string[] = [
		'inline-flex items-center justify-center gap-3 font-medium rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
	];

	// Размеры с фиксированной высотой
	const sizeClasses = {
		sm: props.iconOnly ? 'size-9' : 'px-3 h-9 text-sm',
		md: props.iconOnly ? 'size-12' : 'px-4.5 h-12 text-base',
		lg: props.iconOnly ? 'size-14' : 'px-6 h-14 text-lg',
	};
	classes.push(sizeClasses[props.size]);

	// Варианты и цвета
	const variantColorClasses = {
		solid: {
			default: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
			primary: 'bg-blue-600 hover:bg-blue-700 text-white',
			secondary: 'bg-violet-600 hover:bg-violet-700 text-white',
		},
		flat: {
			default: 'bg-transparent hover:bg-gray-100 text-gray-700',
			primary: 'bg-transparent hover:bg-blue-50 text-blue-600',
			secondary: 'bg-transparent hover:bg-violet-50 text-violet-600',
		},
		light: {
			default: 'bg-gray-50 hover:bg-gray-100 text-gray-700',
			primary: 'bg-blue-50 hover:bg-blue-100 text-blue-600',
			secondary: 'bg-violet-50 hover:bg-violet-100 text-violet-600 border border-violet-200',
		},
	};
	classes.push(variantColorClasses[props.variant][props.color]);

	return classes.join(' ');
});
</script>

<template>
	<component :is="tag" :class="buttonClasses" :disabled="tag === 'button' ? disabled : undefined" :href="href">
		<slot name="icon-before" />
		<slot v-if="!iconOnly" />
		<slot name="icon-after" />
	</component>
</template>
