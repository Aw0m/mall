import { request } from '../../utils/request';

export function getOrderStatistics(data) {
  return request(`/order/get_order_statistics`, data, 'POST', true);
}
