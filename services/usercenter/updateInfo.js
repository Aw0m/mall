import { request } from '../../utils/request';

export function updateInfo() {
  return request('/user/get_userinfo', {}, 'POST', true);
}
export function updateClubInfo() {
  return request('/user/get_clubinfo', {}, 'POST', true);
}
