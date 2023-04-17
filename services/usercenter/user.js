import {
  request
} from '../../utils/request';

export function changeUserInfo(data) {
  return request(`/user/update_userinfo`, data, 'POST', true);
}