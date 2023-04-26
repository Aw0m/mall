import { config, cdnBase } from '../../config/index';
import { request } from "../../utils/request";
import { genSwiperImageList } from "../../model/swiper";

/** 获取首页数据 */
function mockFetchHome() {
  const { delay } = require('../_utils/delay');
  const { genSwiperImageList } = require('../../model/swiper');
  return delay().then(() => {
    return {
      swiper: genSwiperImageList(),
      tabList: [
        {
          text: '精选推荐',
          key: 0,
        },
        {
          text: '夏日防晒',
          key: 1,
        },
        {
          text: '二胎大作战',
          key: 2,
        },
        {
          text: '人气榜',
          key: 3,
        },
        {
          text: '好评榜',
          key: 4,
        },
        {
          text: 'RTX 30',
          key: 5,
        },
        {
          text: '手机也疯狂',
          key: 6,
        },
      ],
      activityImg: `${cdnBase}/activity/banner.png`,
    };
  });
}

/** 获取首页数据 */
export async function fetchHome() {
  const { genSwiperImageList } = require('../../model/swiper');
  const swiper = genSwiperImageList();
  const rsp = await getCategoryList({});
  const categoryList = rsp.rsp.category_list;
  const tabList = [];
  for (let i = 0; i < categoryList.length; i++) {
    tabList.push({
      text: categoryList[i].category_name,
      key: categoryList[i].category_id,
    });
  }
  // if (config.useMock) {
  //   return mockFetchHome();
  // }
  return new Promise((resolve) => {
    resolve({
      swiper: swiper,
      tabList: tabList,
      activityImg: `${cdnBase}/activity/banner.png`,
    });
  });
}

export function getCategoryList(data) {
  return request(`/category/get_category_list`, data, 'POST', false);
}
