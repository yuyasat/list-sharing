/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

import { registerPlugins } from '@/plugins'


import store from './store'

const app = createApp(App)


registerPlugins(app)

app.use(store).mount('#app')
