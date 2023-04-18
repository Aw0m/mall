import { request } from '../../utils/request';

export function getAddressList(data) {
  return request(`/address/get_address_list`, data, 'POST', true);
}
