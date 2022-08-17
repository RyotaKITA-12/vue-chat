import Vue from 'vue'
import VueRouter from 'vue-router'
import ChatView from '../views/ChatView.vue'
import RoomList from '../views/RoomList.vue'
import SignUp from '../views/SignUp.vue'
import SignIn from '../views/SignIn.vue'
// import firebase from "@/firebase/firebase"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'RoomList',
        component: RoomList,
        meta: { requiresAuth: true }
    },
    {
        path: '/chat',
        name: 'CHatView',
        component: ChatView,
        meta: { requiresAuth: true }
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp
    },
    {
        path: '/signin',
        name: 'SignIn',
        component: SignIn
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth) {
        const user = sessionStorage.getItem('user')
        // firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            next({
                path: '/signin',
                query: { redirect: to.fullPath }
            })
        } else {
            next()
        }
        // })
    } else {
        next()
    }
})

export default router
