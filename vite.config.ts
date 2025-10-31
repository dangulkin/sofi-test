import path from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	server: {
		proxy: {
			'/api': {
				target: 'https://test.sofi-assistant.com',
				changeOrigin: true,
				secure: false,
				cookieDomainRewrite: 'localhost',
				cookiePathRewrite: '/',
				configure: (proxy) => {
					proxy.on('proxyRes', (proxyRes) => {
						//Set-Cookie заголовки для работы в Safari
						const cookies = proxyRes.headers['set-cookie'];
						if (cookies) {
							proxyRes.headers['set-cookie'] = cookies.map(cookie => {
								return cookie
									.replace(/;\s*Secure/gi, '')
									.replace(/;\s*SameSite=None/gi, '; SameSite=Lax')
									.replace(/;\s*Domain=[^;]+/gi, '');
							});
						}
					});
				},
			},
		},
	},
})
