import { config } from '../../config/index';
import { request } from '../../utils/request';
import { mockIp, mockReqId } from "../../utils/mock";

/** 获取订单列表mock数据 */
function mockFetchOrders(params) {
  const { delay } = require('../_utils/delay');
  const { genOrders } = require('../../model/order/orderList');

  return delay(200).then(() => genOrders(params));
}

/** 获取订单列表数据 */
export async function fetchOrders(params) {
  // if (config.useMock) {
  //   console.log(mockFetchOrders(params));
  //   return mockFetchOrders(params);
  // }
  const { pageNum, pageSize, orderStatus } = params.parameter;
  let statusList = [1, 2, 3, 4];
  switch (orderStatus) {
    case 5:
      statusList = [1];
      break;
    case 10:
      statusList = [2];
      break;
    case 40:
      statusList = [3];
      break;
    case 50:
      statusList = [4];
      break;
    default:
      statusList = [1, 2, 3, 4];
  }
  const rsp = await getOrderList({
    page_num: pageNum,
    page_size: pageSize,
    status_list: statusList,
  });
  let orderList = [];
  const realRsp = rsp.rsp;
  if (realRsp.order_list !== null) {
    orderList = realRsp.order_list;
  }
  const orders = [];
  for (let i = 0; i < orderList.length; i++) {
    const orderItem = orderList[i];
    orders.push(packOrder(orderItem));
  }
  const ret = {
    data: {
      pageNum: pageNum,
      pageSize: pageSize,
      totalCount: orders.length,
      orders: orders,
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 113,
    success: true,
  };
  // const a = new Promise((resolve) => {
  //   resolve(ret);
  // });
  // console.log(a);
  return new Promise((resolve) => {
    resolve(ret);
  });
}

/** 获取订单列表mock数据 */
function mockFetchOrdersCount(params) {
  const { delay } = require('../_utils/delay');
  const { genOrdersCount } = require('../../model/order/orderList');

  return delay().then(() => genOrdersCount(params));
}

/** 获取订单列表统计 */
export function fetchOrdersCount(params) {
  if (config.useMock) {
    return mockFetchOrdersCount(params);
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}

export function getOrderList(data) {
  return request(`/order/get_order_list`, data, 'POST', true);
}

function packOrder(orderItem) {
  const imageURLBackup = 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3b.png';
  return {
    saasId: orderItem.seller_id,
    storeId: orderItem.seller_id,
    storeName: orderItem.seller_name,
    uid: orderItem.order_id,
    orderId: orderItem.order_id,
    orderNo: orderItem.order_id,
    orderType: 0,
    orderSubType: 0,
    orderStatus: orderItem.status,
    orderSubStatus: null,
    totalAmount: orderItem.price * 100 * orderItem.quantity,
    goodsAmount: orderItem.price * 100,
    goodsAmountApp: '10000',
    paymentAmount: orderItem.price * 100 * orderItem.quantity,
    freightFee: '0',
    packageFee: '0',
    discountAmount: '9990',
    channelType: 0,
    channelSource: '',
    channelIdentity: '',
    remark: '',
    cancelType: null,
    cancelReasonType: null,
    cancelReason: null,
    rightsType: null,
    // createTime: '1600350829291',
    orderItemVOs: [
      {
        id: orderItem.commodity_id,
        orderNo: null,
        spuId: orderItem.commodity_id,
        skuId: orderItem.commodity_id,
        roomId: null,
        goodsMainType: 0,
        goodsViceType: 0,
        goodsName: orderItem.commodity_name,
        goodsPictureUrl: orderItem.commodity_image_url !== '' ? orderItem.commodity_image_url : imageURLBackup,
        originPrice: orderItem.price * 100,
        actualPrice: orderItem.price * 100,
        buyQuantity: orderItem.quantity,
        itemTotalAmount: orderItem.price * 100,
        itemDiscountAmount: orderItem.price * 100,
        itemPaymentAmount: '10',
        goodsPaymentPrice: '10',
      },
    ],
    logisticsVO: {
      logisticsType: 1,
      logisticsNo: '',
      logisticsStatus: null,
      logisticsCompanyCode: '',
      logisticsCompanyName: '',
      receiverAddressId: orderItem.address_id,
      provinceCode: '',
      cityCode: '',
      countryCode: '',
      receiverProvince: '',
      receiverCity: '',
      receiverCountry: '',
      receiverArea: '',
      receiverAddress: orderItem.address_detail_info,
      receiverPostCode: '',
      receiverLongitude: '113.829127',
      receiverLatitude: '22.713649',
      receiverIdentity: '88888888205468',
      receiverPhone: orderItem.phone_num,
      receiverName: orderItem.consignee_name,
    },
    paymentVO: {
      payStatus: 1,
      amount: '20',
    },
  };
}
