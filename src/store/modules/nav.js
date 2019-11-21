const nav = {
  state: {
    navs: [],
    activeNavName: 'system'
  },
  mutations: {
    SET_NAVS: (state, data) => {
      state.navs = data;
    },
    SET_ACTIVENAVNAME: (state, activeNavName) => {
      state.activeNavName = activeNavName;
    },
  },
  actions: {
    setNavs({ commit }, data) {
      commit('SET_NAVS', data);
    },
    setActiveNavName({ commit }, activeNavName) {
      commit('SET_ACTIVENAVNAME', activeNavName);
    },
  }
};

export default nav;
