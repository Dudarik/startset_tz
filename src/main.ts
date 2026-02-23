import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './app';
import './app/styles/global.scss';

const app = createApp(App);
app.use(createPinia());
app.mount('#app');
