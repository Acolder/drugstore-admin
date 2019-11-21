import Cookies from 'js-cookie';

const app = {
  state: {
    sidebarStatus: !Number(Cookies.get('sidebarStatus')),
    tabValue: ''
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebarStatus) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebarStatus = !state.sidebarStatus;
    },
    SET_TABVALUE: (state, tabValue) => {
      state.tabValue = tabValue;
    }
  },
  actions: {
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR');
    },
    setTabValue({ commit }, tabValue) {
      commit('SET_TABVALUE', tabValue);
    }
  }
};

export default app;