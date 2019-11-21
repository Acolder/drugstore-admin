const permission = {
  state: {
    permissions: [
      /* {
        name:''
        routers: []
      } */
    ]
  },
  mutations: {
    SET_PERMISSION: (state, data) => {
      state.permissions = [];
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        state.permissions.push(item);
      }
    },
    CLEAR_PERMISSION: (state, data) => {
      state.permissions = [];
    }
  },
  actions: {
    setPermission({ commit }, data) {
      return new Promise(resolve => {
        commit('SET_PERMISSION', data);
        resolve();
      });
    },
    clearPermission({ commit }, data) {
      return new Promise(resolve => {
        commit('CLEAR_PERMISSION', data);
        resolve();
      });
    }
  }
};

export default permission;