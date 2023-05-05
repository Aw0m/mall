import { config } from '../../config/index';
import { request } from "../../utils/request";
import { mockIp, mockReqId } from "../../utils/mock";

/** 获取订单详情mock数据 */
function mockFetchOrderDetail(params) {
  const { delay } = require('../_utils/delay');
  const { genOrderDetail } = require('../../model/order/orderDetail');

  return delay().then(() => genOrderDetail(params));
}

/** 获取订单详情数据 */
export async function fetchOrderDetail(params) {
  // if (config.useMock) {
  //   return mockFetchOrderDetail(params);
  // }
  console.log('params:',params)
  const rsp = await getOrderDetail({
    order_id: params.parameter,
  });
  const orderInfo = rsp.rsp.order;

  return new Promise((resolve) => {
    resolve(packOrder(orderInfo));
  });
}

/** 获取客服mock数据 */
function mockFetchBusinessTime(params) {
  const { delay } = require('../_utils/delay');
  const { genBusinessTime } = require('../../model/order/orderDetail');

  return delay().then(() => genBusinessTime(params));
}

/** 获取客服数据 */
export function fetchBusinessTime(params) {
  if (config.useMock) {
    return mockFetchBusinessTime(params);
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}

export function getOrderDetail(data) {
  return request('/order/get_order_detail', data, 'POST', true);
}

function packOrder(order) {
  let orderSubStatus = 5;
  let orderStatusName;
  let buttonVOs = [{ primary: true, type: 1, name: '付款' }];
  switch (order.status) {
    case 1:
      orderSubStatus = 5;
      orderStatusName = '待付款';
      buttonVOs = [{ primary: false, type: 2, name: '取消订单' }, { primary: true, type: 1, name: '付款' }];
      break;
    case 2:
      orderSubStatus = 10;
      orderStatusName = '待发货';
      buttonVOs = [];
      break;
    case 3:
      orderSubStatus = 40;
      orderStatusName = '待收货';
      buttonVOs = [{ primary: true, type: 3, name: '确认收货' }];
      break;
    case 4:
      orderSubStatus = 50;
      orderStatusName = '已完成';
      buttonVOs = [];
      break;
    default:
      orderSubStatus = 5;
  }
  const createTime = Date.parse(order.create_time)
  const cancelTime = createTime + 86400;
  console.log(`createTime:${createTime},  cancelTime:${cancelTime}`);
  return {
    data: {
      saasId: '88888888',
      storeId: order.seller_id,
      storeName: order.seller_name,
      uid: order.order_id,
      parentOrderNo: '',
      orderId: order.order_id,
      orderNo: order.order_id,
      orderType: 0,
      orderSubType: 0,
      orderStatus: orderSubStatus,
      orderSubStatus: null,
      totalAmount: order.price * 100 * order.quantity,
      goodsAmount: order.price * 100,
      goodsAmountApp: order.price * 100,
      paymentAmount: order.price * 100 * order.quantity,
      freightFee: '0',
      packageFee: '0',
      discountAmount: '0',
      channelType: 0,
      channelSource: '',
      channelIdentity: '',
      remark: '',
      cancelType: 0,
      cancelReasonType: 0,
      cancelReason: '',
      rightsType: 0,
      createTime: createTime,
      orderItemVOs: [
        {
          id: '354021736133427225',
          orderNo: null,
          spuId: '3',
          skuId: '135696670',
          roomId: null,
          goodsMainType: 0,
          goodsViceType: 0,
          goodsName: order.commodity_name,
          specifications: [],
          goodsPictureUrl: order.commodity_image_url,
          originPrice: '0',
          actualPrice: order.price * 100,
          buyQuantity: order.quantity,
          itemTotalAmount: order.price * 100,
          itemDiscountAmount: order.price * 100 * order.quantity,
          itemPaymentAmount: '0',
          goodsPaymentPrice: '0',
          tagPrice: null,
          tagText: null,
          outCode: null,
          labelVOs: null,
          buttonVOs: [{ primary: false }],
        },
      ],
      logisticsVO: {
        logisticsType: 1,
        logisticsNo: '',
        logisticsStatus: null,
        logisticsCompanyCode: '',
        logisticsCompanyName: '',
        receiverAddressId: '14',
        provinceCode: '440000',
        cityCode: '440300',
        countryCode: '440306',
        receiverProvince: '',
        receiverCity: '',
        receiverCountry: '',
        receiverArea: '',
        receiverAddress: order.address_detail_info,
        receiverPostCode: '',
        receiverLongitude: '113.829127',
        receiverLatitude: '22.713649',
        receiverIdentity: '88888888205468',
        receiverPhone: order.phone_num,
        receiverName: order.consignee_name,
        expectArrivalTime: null,
        senderName: '',
        senderPhone: '',
        senderAddress: '',
        sendTime: null,
        arrivalTime: null,
      },
      paymentVO: {
        payStatus: 1,
        amount: '20',
        currency: null,
        payType: null,
        payWay: null,
        payWayName: null,
        interactId: null,
        traceNo: null,
        channelTrxNo: null,
        period: null,
        payTime: null,
        paySuccessTime: null,
      },
      buttonVOs: buttonVOs,
      labelVOs: null,
      invoiceVO: null,
      couponAmount: '0',
      autoCancelTime: '1823652629288',
      orderStatusName: orderStatusName,
      orderSatusRemark: cancelTime,
      logisticsLogVO: null,
      invoiceStatus: 3,
      invoiceDesc: '暂不开发票',
      invoiceUrl: null,
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 89,
    success: true,
  }
}


export function cancelOrder(data) {
  return request('/order/cancel_order', data, 'POST', true);
}
