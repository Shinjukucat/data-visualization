import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Theme: "chalk",
  },
  getters: {},
  mutations: {
    changeTheme(state) {
      if(state.Theme === 'chalk') {
        state.Theme = 'vintage'
      } else {
        state.Theme = 'chalk'
      }
    }
  },
  actions: {},
  modules: {},
});
