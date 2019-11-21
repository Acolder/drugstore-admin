import {
  setToken,
  setUserData,
  removeUserData,
  removeToken
} from '@/utils/auth';
import {
  javaLogin,
  getAdminInfo
} from '@/api/user';

const user = {
  state: {
    id: '',
    name: '',
    realName: '',
    mobile: '',
    status: '',
    token: '',
    avatar: '',
    introduction: '',
    roles: [],
    menuList: [],
  },
  mutations: {
    SET_ID: (state, id) => {
      state.id = id;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_REALNAME: (state, realName) => {
      state.realName = realName;
    },
    SET_MOBILE: (state, name) => {
      state.mobile = name;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_MENULIST: (state, data) => {
      state.menuList = data;
    }
  },
  actions: {
    login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        javaLogin(username, userInfo.password).then(response => {
          const data = response.data;
          commit('SET_TOKEN', data.token);
          setToken(response.data.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    getUserInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        getAdminInfo(state.token).then(response => {
          try {
            const userData = response.data.resultData.sysUserPo;
            const menuList = response.data.resultData.menuList;
            commit('SET_ID', userData.userId);
            commit('SET_NAME', userData.userName);
            commit('SET_REALNAME', userData.realName);
            commit('SET_MOBILE', userData.phone);
            commit('SET_AVATAR', userData.headPortrait);
            if (menuList) {
              commit('SET_MENULIST', menuList);
            }
            let userStr = JSON.stringify(userData);
            setUserData(userStr);
            resolve(response);
          } catch (ex) {
            let errorMsg = '获取用户信息失败！';
            console.error(errorMsg);
            let e = new Error(errorMsg);
            reject(e);
          }
        }).catch(error => {
          reject(error);
        });
      });
    },
    userLogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        /* logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          commit('SET_ROLES', []);
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        }); */
        commit('SET_TOKEN', '');
        removeToken();
        removeUserData();
        resolve();
      });
    },
  }
};

export default user;
