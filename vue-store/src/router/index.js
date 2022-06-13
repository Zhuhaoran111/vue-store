import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'


Vue.use(VueRouter);

const routes = [
    {
        path: '/home',
        name: 'Home',
        component: Home,
    },
    //重定向
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/list',
        name: 'List',
        component: () =>
            import('../views/List.vue')
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () =>
            import('../views/Cart.vue')
    },

    {
        path: '/my',
        name: 'My',
        component: () =>
            import('../views/My.vue')
    },

    //搜索页面
    {
        path: '/search',
        name: 'Search',
        children: [
            //下面是搜多点击获得的页面
            {
                path: '/',
                name: 'index',
                component: () =>
                    import('../views/search/Search-index.vue'),
            },
            {
                path: 'list',
                name: 'list',
                component: () =>
                    import('../views/search/Search-list.vue'),
            }
        ],
        component: () =>
            import('../views/Search.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})

export default router

