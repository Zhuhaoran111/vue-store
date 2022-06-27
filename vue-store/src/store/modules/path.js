import {init_data} from './mutations-types.js'
export default{
    state:{
        list:[]
    },
    getters:{
        defaultPath(state){
       return state.list.filter(v=>{
             return  v.isDefault==1;
       })
       }
    },
    mutations:{
        [init_data](state,arrPath){
           state.list=arrPath
        }
    }
}