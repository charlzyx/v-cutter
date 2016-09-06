import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    user:{
        name: '小明',
        said: 'hello XiaoHong'
    }
}


const mutations = {
    SETUSER(state,{name,said}){
        state.user.name = name;
        state.user.said = said;
    }
}

export default new Vuex.Store({
    state,
    mutations
})