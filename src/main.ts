import { createApp } from 'vue';
import App from './App.vue';

// The page never navigates in-app: every link is a full page navigation to another
// app or an external site, so there is no router to install.
createApp(App).mount('#app');
