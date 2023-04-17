import { request } from '../../utils/request';

export function updateInfo() {
  return request('/user/get_userinfo', {}, 'POST', true);
}