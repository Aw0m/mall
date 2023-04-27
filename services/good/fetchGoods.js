import { config } from '../../config/index';
import { request } from "../../utils/request";

/** 获取商品列表 */
function mockFetchGoodsList(pageIndex = 1, pageSize = 20) {
  const { delay } = require('../_utils/delay');
  const { getGoodsList } = require('../../model/goods');
  return delay().then(() =>
    getGoodsList(pageIndex, pageSize).map((item) => {
      return {
        spuId: item.spuId,
        thumb: item.primaryImage,
        title: item.title,
        price: item.minSalePrice,
        originPrice: item.maxLinePrice,
        tags: item.spuTagList.map((tag) => tag.title),
      };
    }),
  );
}

/** 获取商品列表 */
export async function fetchGoodsList(pageIndex = 1, pageSize = 20, categoryId = 0) {
  // if (config.useMock) {
  //   return mockFetchGoodsList(pageIndex, pageSize);
  // }
  const rsp = await getCommodityFromCategory({
    category_id: categoryId.toString(),
    page_size: pageSize,
    page_num: pageIndex,
  });
  const commodityList = rsp.rsp.commodity_list;
  const goodsList = [];
  for (let i = 0; i < commodityList.length; i++) {
    const item = commodityList[i];
    goodsList.push({
      spuId: item.commodity_id,
      thumb: item.image_url,
      title: item.commodity_name,
      price: item.price * 100,
      originPrice: item.price * 100,
      tags: [],
    });
  }
  return new Promise((resolve) => {
    resolve(goodsList);
  });
}

export function getCommodityFromCategory(data) {
  return request(`/commodity/get_commodity_from_category`, data, 'POST', false);
}
