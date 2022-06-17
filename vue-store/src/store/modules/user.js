import {LOGIN}from './mutations-types'
export default {
    state:{
       list:123,
       //存放登陆的状态
       loginStatus:false,
       //token
       token:null,
       //用户信息和用户头像，用户昵称
       userInfo:{

       }

     },
     getters:{
 
     },
     mutations:{
        [LOGIN](){
            console.log('11111111')
        }
     },
     actions:{
 
     }
}