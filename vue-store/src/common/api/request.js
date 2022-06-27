//引入加载插件
//axios二次封装
import { Indicator } from "mint-ui";
import axios from 'axios';
import store from '@/store'
import router from '@/router'

export default {
    common: {
        mehtood: 'GET',
        data: {},
        params: {},
        headers:{},
    },
    $axios(options = {}) {
       
        options.method = options.method || this.common.method
        options.data = options.data || this.common.data
        options.params = options.params || this.common.params
        options.headers=options.headers||this.common.headers

        //请求显示加载中
        Indicator.open("Loading...");

         //token认证判断是否是登陆状态
         if(options.headers.token){
            options.headers.token=store.state.user.token;

            if(!options.headers.token){
                // debugger
                router.push('/login');
               
            }
         }

        return axios(options).then(v => {
            //这里的v就是Home里面的res
            let data = v.data.data;

             //如果token过期重新登陆
            if(data.code==1000){
                Indicator.close();
                return router.push('/login');
            }
                return new Promise((res, rej) => {
                    if (!v) return rej();
    
                    //有数据关闭加载中
                    setTimeout(() => {
                        //关闭正在加载
                        Indicator.close();
                    }, 500)
                    res(data);
                })
            

        })
    }
}