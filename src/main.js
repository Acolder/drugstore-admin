// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import elementUI from 'element-ui';
import 'babel-polyfill';
import './accessControl';
import './defineComponent';
import VueResource from 'vue-resource';
import VueBus from '@/utils/vue-bus';

import 'vue-easytable/libs/themes-base/index.css';
import { VTable, VPagination } from 'vue-easytable';
Vue.component(VTable.name, VTable);
Vue.component(VPagination.name, VPagination);
Vue.config.productionTip = false;
Vue.use(elementUI);
Vue.use(VueResource);
Vue.use(VueBus);
Vue.config.productionTip = false;

// eslint-disable-next-line
/* eslint-disable */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
