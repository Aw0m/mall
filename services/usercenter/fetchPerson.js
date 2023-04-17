import { getUserInfo, isLogin } from '../../utils/auth';
import { delay } from '../_utils/delay';
import { genSimpleUserInfo } from '../../model/usercenter';

/** 获取个人中心信息 */
function mockFetchPerson() {
  const { delay } = require('../_utils/delay');
  const { genSimpleUserInfo } = require('../../model/usercenter');
  const { genAddress } = require('../../model/address');
  const address = genAddress();
  return delay().then(() => ({
    ...genSimpleUserInfo(),
    address: {
      provinceName: address.provinceName,
      provinceCode: address.provinceCode,
      cityName: address.cityName,
      cityCode: address.cityCode,
    },
  }));
}

/** 获取个人中心信息 */
export function fetchPerson() {
  if (!isLogin()) {
    wx.navigateTo({ url: '/pages/login/login' });
    return;
  }
  const userinfo = getUserInfo();
  return delay().then(() => ({
    avatarUrl: userinfo.avatar_url,
    nickName: userinfo.username,
    phoneNumber: userinfo.phone_num,
    gender: userinfo.gender === 'm' ? '1' : userinfo.gender === 'f' ? '2' : '3',
    address: {
      provinceName: '',
      provinceCode: '',
      cityName: '',
      cityCode: '',
    },
  }));
}
