const TokenKey = 'token';
const UserInfoKey = 'userInfo';

export function setUserInfo(obj) {
  return wx.setStorageSync(UserInfoKey, obj);
}
export function getUserInfo() {
  return wx.getStorageSync(UserInfoKey);
}

export function getToken() {
  return wx.getStorageSync(TokenKey);
}

export function setToken(token) {
  return wx.setStorageSync(TokenKey, token);
}

export function removeToken() {
  return wx.removeStorageSync(TokenKey);
}

export function removeUserInfo() {
  return wx.removeStorageSync(UserInfoKey);
}

export function isLogin() {
  return getToken() !== null && getToken() !== '' && typeof getToken() !== undefined
}