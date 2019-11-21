import ajax from '@/utils/ajax';
import javaRequest from '@/utils/javaApiRequest';
export function login(username, password) {
  const data = {
    Mobile: username,
    Password: password
  };
  return ajax.post('https://tyao.kangmeiyaohulu.com/api/user/login ', data);
}

export function javaLogin(username, password, code) {
  const data = {
    account: username,
    password: password,
    code: code
  };
  return javaRequest.post('/mall_manage/back/login/webLogin', data);
}

export function logout() {
  return ajax({
    url: '',
    method: 'get'
  });
}

export function getUserInfo() {
  return ajax.get('/api/user/info');
}

export function getAdminInfo() {
  return javaRequest.post('/mall_manage/back/getUserInfoAndMenuList', {});
}
