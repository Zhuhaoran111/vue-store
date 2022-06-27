import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'


Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}


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

    //详情页面
    {
        path: '/detail',
        name: 'detail',
        meta:{
            keepAlive:true,//此组件需要被缓存,其它组件不需要,点击向详情页时多次点击一个会被缓存
        },
        component: () =>
            import('../views/Detail.vue')
    },
        //登录页面
    {
            path: '/login',
            name: 'Login',
            component: () =>
                import('../views/login/Login.vue')
    },
    {
        path: '/userLogin',
        name: 'userLogin',
        component: () =>
            import('../views/login/UserLogin.vue')
      },

      {
        path: '/Register',
        name: 'Register',
        component: () =>
            import('../views/login/Register.vue')
      },


      //找回密码
        
    {
        path: '/recovery',
        name: 'Recovery',
        children: [
            //下面是找回密码获得的页面
            {
                path: '/',
                name: 'index',
                component: () =>
                    import('../views/recovery/RecoveryIndex.vue'),
            },
            {
                path: 'btn',
                name: 'btn',
                component: () =>
                    import('../views/recovery/RecoveryBtn.vue'),
            }
        ],
        component: () =>
            import('../views/Search.vue'),
    },

    //地址路由
    {
        path: '/path',
        name: 'Path',
        children:[
            {
                path:'/',
                name:'pathIndex',
                component:()=>
                    import('../views/path/Path-index.vue'),
            },
            {
                path:'path-list',
                name:'path-list',
                component:()=>
                    import('../views/path/Path-list.vue'),
            },
        ],
        component: () =>
            import('../views/Path.vue'),
    },
    {
        path: '/order',
        name: 'Order',
        meta:{
            keepAlive:true,//此组件需要被缓存,其它组件不需要,点击向详情页时多次点击一个会被缓存
        },
        component: () =>
            import('../views/Order.vue'),
    },

    {
        path: '/payment',
        name: 'Payment',
        component: () =>
            import('../views/Payment.vue'),
    },

];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});


router.beforeEach((to,from,next)=>{
    
    let nextRoute = ['Payment','Cart','Path','Order','pathIndex','path-list'];
    //是否是登录中
    let userInfo = JSON.parse( localStorage.getItem('teauserInfo')  );
    console.log('!!!!!!!!!')
    console.log( localStorage.getItem('teauserInfo'))
    console.log('!!!!!!!!!')
    
    //当前进入的页面，是不是需要验证哪些页面
    if(  nextRoute.indexOf( to.name ) >= 0  ){
        console.log('---------')
        console.log(userInfo)
        console.log('---------')
        if( !userInfo ){
            router.push('/login');
        }
    }
    
    next();
})

export default router

