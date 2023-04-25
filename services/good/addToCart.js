import { request } from '../../utils/request';

export function addToCart(data) {
  return request(`/commodity/add_to_cart`, data, 'POST', true);
}
