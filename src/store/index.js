import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    //  直接使用本地存储的方式
    user_id: JSON.parse(sessionStorage.getItem('user_id')) || 'user_id',
    token: JSON.parse(sessionStorage.getItem('token')) || 'token',
  },
  mutations: {
    set(state, data) {
      //  修改数据的时候直接存到本地
      sessionStorage.setItem('user_id', JSON.stringify(data.user_id));
      sessionStorage.setItem('token', JSON.stringify(data.token));
      state.user_id = data.user_id;
      state.token = data.token;
    }
  },
})
