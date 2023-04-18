import { config } from '../../config/index';
import { getAddressList } from "../usercenter/address";

/** 获取收货地址 */
function mockFetchDeliveryAddress(id) {
  const { delay } = require('../_utils/delay');
  const { genAddress } = require('../../model/address');

  return delay().then(() => genAddress(id));
}

/** 获取收货地址 */
export function fetchDeliveryAddress(id = 0) {
  if (config.useMock) {
    return mockFetchDeliveryAddress(id);
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}

/** 获取收货地址列表 */
function mockFetchDeliveryAddressList(len = 0) {
  const { delay } = require('../_utils/delay');
  const { genAddressList } = require('../../model/address');

  return delay().then(() =>
    genAddressList(len).map((address) => {
      return {
        ...address,
        phoneNumber: address.phone,
        address: `${address.provinceName}${address.cityName}${address.districtName}${address.detailAddress}`,
        tag: address.addressTag,
      };
    }),
  );
}

/** 获取收货地址列表 */
export async function fetchDeliveryAddressList() {

  // const a = await mockFetchDeliveryAddressList(10);
  // console.log("a:", a);
  // return a;
  const res = await getAddressList({});
  const resList = [];
  const addressList = res.rsp.address_list;
  for (let i = 0; i < addressList.length; i++) {
    resList.push({
      addressId:addressList[i].address_id,
      name: addressList[i].address_name,
      address: addressList[i].detail_info,
    });
  }
  return new Promise((resolve) => {
    resolve(resList);
  });
}
