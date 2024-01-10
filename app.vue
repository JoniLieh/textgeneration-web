<template>
	<div>
		<NuxtLoadingIndicator />
		
		<NuxtLayout>
			<v-sheet class="pa-4 rounded">
				<NuxtPage />
			</v-sheet>
		</NuxtLayout>
	</div>
</template>

<script lang="ts" setup>
	import { useTheme } from 'vuetify'
	const theme = useTheme()

	// prefill store
	useMyGrammarStore().INIT_GRAMMAR()

	if (process.client) {
		// auto toggle theme mode
		setTimeout(() => {
			// theme.global.name.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
		}, 200);
	}
</script>