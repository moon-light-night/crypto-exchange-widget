import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueClickAway from "vue3-click-away";
import './assets/main.scss'

createApp(App).use(store).use(VueAxios, axios).use(VueClickAway).mount('#app')
