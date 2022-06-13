//引入加载插件
//axios二次封装
import { Indicator } from "mint-ui";
import axios from 'axios';
export default {
    common: {
        mehtood: 'GET',
        data: {},
        params: {}
    },
    $axios(options = {}) {
        console.log('aaaa')
        options.mehtood = options.mehtood || this.common.mehtood
        options.data = options.data || this.common.data
        options.params = options.params || this.common.params

        //请求显示加载中
        Indicator.open("Loading...");
        return axios(options).then(v => {
            //这里的v就是Home里面的res
            let data = v.data.data
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