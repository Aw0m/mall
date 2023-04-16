import { config } from '../../config/index';
import { isLogin } from "../../utils/auth";
import { delay } from "../_utils/delay";
import { genSimpleUserInfo } from "../../model/usercenter";

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
    return delay().then(() => ({
      avatarUrl:
        'https://we-retail-static-1300977798.cos.ap-guangzhou.myqcloud.com/retail-ui/components-exp/avatar/avatar-1.jpg',
      nickName: '111',
      phoneNumber: '13438358888',
      gender: 2,
      address: {
        provinceName: '',
        provinceCode: '',
        cityName: '',
        cityCode: '',
      },
    }));
  }

  if (config.useMock) {
    return mockFetchPerson();
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}

export function request(config) {
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    timeout: 15000,
    headers: {
      'Authorization':  window.localStorage.getItem('token')
    }
  })

  console.log("本次发送的token:", window.localStorage.getItem('token'))
  instance.interceptors.request.use(config => {
    return config;
  }, error => {
    console.log(error);
  })

  // 拦截响应
  instance.interceptors.response.use(res => {
    return res.data
  }, error => {
    console.log(error);
  })

  // 发送真正的网络请求
  return instance(config);
}


export function login (userInfo) {
  return request({
    method: 'post',
    url:    '/users/login',
    params:   {
      userName: userInfo.username,
      password: userInfo.password
    }
  })
}
