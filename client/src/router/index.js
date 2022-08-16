import Vue from 'vue'
import VueRouter from 'vue-router'
import ChatView from '../views/ChatView.vue'
import UserList from '../views/UserList.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'UserList',
        component: UserList
    },
    {
        path: '/chat',
        name: 'CHatView',
        component: ChatView
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
