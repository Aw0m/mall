import { request } from '../../utils/request';
import { mockIp, mockReqId } from '../../utils/mock';

/** 获取购物车mock数据 */
// function mockFetchCartGroupData(params) {
//   const { delay } = require('../_utils/delay');
//   const { genCartGroupData } = require('../../model/cart');
//
//   return delay().then(() => genCartGroupData(params));
// }

/** 获取购物车数据 */
export async function fetchCartGroupData() {
  const httpRsp = await getCartList({});
  if (httpRsp.message !== 'success') {
    return new Promise((resolve) => {
      resolve('fail');
    });
  }
  const storeGoods = [];
  const commodityItemList = httpRsp.rsp.commodity_item_list;
  let totalPrice = 0;
  for (let i = 0; i < commodityItemList.length; i++) {
    const item = commodityItemList[i];
    const storeId = item.seller_id;
    const storeName = item.seller_name;
    const goodsPromotionList = [];
    for (let j = 0; j < item.commodity_list.length; j++) {
      const carCommodity = item.commodity_list[j];
      const price = carCommodity.commodity.price * 100;
      const commodityNum = carCommodity.cart.commodity_num;
      totalPrice += price * commodityNum;
      goodsPromotionList.push({
        uid: carCommodity.commodity.commodity_id,
        storeId: storeId,
        spuId: carCommodity.commodity.commodity_id,
        skuId: '135691622',
        isSelected: 0,
        thumb: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3a.png',
        title: carCommodity.commodity.commodity_name,
        primaryImage: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3a.png',
        quantity: commodityNum, // 数量
        stockStatus: true,
        stockQuantity: 99, // 库存
        price: price,
        originPrice: carCommodity.cart.init_price * 100,
        specInfo: [
          {
            //TODO 修改为自己的分类
            specTitle: '颜色',
            specValue: '经典白',
          },
          {
            specTitle: '类型',
            specValue: '经典套装',
          },
        ],
        joinCartTime: carCommodity.cart.create_time,
        available: 1,
      });
    }
    storeGoods.push({
      storeId: storeId,
      storeName: storeName,
      promotionGoodsList: [{ goodsPromotionList: goodsPromotionList }],
    });
  }
  const realRsp = {
    data: {
      isNotEmpty: true,
      storeGoods: storeGoods,
      invalidGoodItems: [],
      totalAmount: totalPrice,
      selectedGoodsCount: 0,
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 269,
    success: true,
  };
  return new Promise((resolve) => {
    resolve(realRsp);
  });
}
export function getCartList(data) {
  return request(`/cart/get_cart_list`, data, 'POST', true);
}
