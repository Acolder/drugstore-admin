import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import nav from './modules/nav';
import permission from './modules/permission';
import tabs from './modules/tabs';
import user from './modules/user';
import getters from './getters';
import 'babel-polyfill';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    nav,
    permission,
    tabs,
    user
  },
  getters
});

export default store;
