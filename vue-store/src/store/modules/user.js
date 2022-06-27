import {user_login,init_user}from './mutations-types'
 
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
        //设置
        //在这里mutations挂载一个方法//这里为什么方法名是一个数组的方法
        //在这里接收，第一个接收state，第二个接收user这个从登录传过来的参数
        [user_login](state,user){
            state.loginStatus=true;  //登陆进行把状态改为登陆true
            state.token=user.token;
            state.userInfo=user


            //由于登陆完成后，刷新页面将会重新登陆，所以要把数据持久化存储
            localStorage.setItem('teauserInfo',JSON.stringify(user));
        
        },
        //读取
        [init_user](state){
            //把json字符串转化成对象用json.parse
            let userInfo=JSON.parse(localStorage.getItem('teauserInfo'));
            if(userInfo){
                state.loginStatus=true;  //登陆进行把状态改为登陆true
                state.token=userInfo.token;
                state.userInfo=userInfo;
            }
        },

        //退出登录
        
        loginOut(state){
            console.log('去除token')
            state.loginStatus=false;  //登陆进行把状态改为登陆true
            state.token=null;
            state.userInfo={};
            localStorage.removeItem('teauserInfo')  //移除本地存储信息
         }

     },
     actions:{
 
     }
}