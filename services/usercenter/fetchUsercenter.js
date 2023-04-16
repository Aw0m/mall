import { config } from '../../config/index';
import { getUserInfo } from "../../utils/auth";

/** 获取个人中心信息 */
function mockFetchUserCenter() {
  const { delay } = require('../_utils/delay');
  const { genUsercenter } = require('../../model/usercenter');
  return delay(200).then(() => genUsercenter());
}

/** 获取个人中心信息 */
export function fetchUserCenter() {
  // if (config.useMock) {
  //   return mockFetchUserCenter();
  // }
  return new Promise((resolve) => {
    resolve({
      userInfo: getUserInfo(),
      countsData: [],
      orderTagInfos: [
        {
          orderNum: 2,
          tabType: 5,
        },
        {
          orderNum: 1,
          tabType: 10,
        },
        {
          orderNum: 1,
          tabType: 40,
        },
        {
          orderNum: 0,
          tabType: 0,
        },
      ],
      customerServiceInfo: [],
    });
  });
}
