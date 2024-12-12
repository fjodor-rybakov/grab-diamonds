
import {createRouter, createWebHistory} from 'vue-router'

import Home from "./components/Home.vue";
import Scene from "./components/Scene.vue";

const routes = [
    { path: '/', component: Home  },
    { path: '/game/:gameId', component: Scene },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router