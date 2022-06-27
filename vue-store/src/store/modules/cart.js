import {cart_list,check_all,uncheck_all,check_item} from './mutations-types.js'
import { Toast,Dialog } from "vant";
import http from "@/common/api/request.js";
export default{
    //然后组件那边可以去调用这个state
    state:{
        list:[], //这个数组是购物车的数据
        selectList:[],//选中的那几个组成的数组
    },
    getters:{
        isCheckAll(state){
        return state.list.length==state.selectList.length;
        },
        total(state){
            let total={
                num:0,
                price:0,
            }
            state.list.forEach(v=>{
                if(v.checked){
                    total.num+=parseInt(v.goods_num);
                    total.price+=v.goods_price*v.goods_num
                }             
            })
            return total;
        }

    },
    mutations:{
        /* 这里的cartArr就是Cart数据传过来的数据 */
        [cart_list](state,cartArr){
          /* 然后把数据赋值给state */
               state.list=cartArr;   
            //    state.selectList=cartArr;   s
               state.selectList = state.list.map(v=>{
                return v.id;
            })
        },

        //全选
         [check_all](state){
            //state.selectList这里是存选中的id
            state.selectList=state.list.map(v=>{
                  v.checked=true;    
                  return v.id;  
            })

         },
        //全不选
        [uncheck_all](state){
            state.list.forEach(v=>{
               v.checked=false;
          })
          state.selectList=[];
        },

     //单选
        [check_item](state,index){
             let id=state.list[index].id;
             let i=state.selectList.indexOf(id);
             //能在selectList里面找到对应的id,就删除
             if(i>-1){
               
                   return state.selectList.splice(i,1);
             }
                //如果之前没有选中，就给selectList添加一个id进去
                state.selectList.push(id);
             
        },

    //删除
      delGoods(state){
        state.list=state.list.filter(v=>{
            return state.selectList.indexOf(v.id)==-1
        })
      }


    },
    actions:{
        //这是对于一个控制多个的按钮，选一个控制多个
        checkAllFn({commit,getters}){
               getters.isCheckAll?commit('uncheck_all'):commit('check_all')    
        },
        delGoodsFn({commit,state},id){
            //如果没有选中则提示信息
          if(state.selectList.length==0){
            //删除操作
              Toast('请选择商品')
          }
          let arrCart = [];
          Dialog.confirm({
            message: '确定要删除这些商品吗？',
          }).then(() => {


            if( typeof id =='number' ){
                //单个删除
                    arrCart = [id];
                    let index = state.list.findIndex(v=>{
                        return v.id == id 
                    })
                    state.list.splice(index,1);  //删除list中的数据
                }else{
                //多选删除
                    arrCart = state.selectList;
                    // commit('delGoods');

                    commit('delGoods')
                    //全不选
                    // commit('uncheck_all')
                }
                
                http.$axios({
                	url:'/api/deleteCart',
                    method:'post',
                    
                    data:{
                       arrId:arrCart
                    }
                }).then(res=>{
           
                   
                    if( res.success ){
                        Toast(res.msg)
                    }
                })

          })
           
        }

    },
}