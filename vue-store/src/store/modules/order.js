import {  init_order} from  './mutations-types.js'
export default{
    state:{
        list:[],
        order_id:localStorage.getItem('tea_orderId')||'',
    },
    mutations:{
        [init_order](state,orderId){
           state.list=orderId
           //存储订单号
           state.order_id=orderId[0].order_id
           //设置一个id号
           localStorage.setItem('tea_orderId',orderId[0].order_id)
        }
    }
}