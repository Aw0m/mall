import {
  getToken
} from '../utils/auth';

const baseUrl = 'http://47.113.231.167:8081';

export function request(url, data, method, isToken) {
  return new Promise(function (resolve, reject) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: '',
    };
    if (isToken) {
      headers.Authorization = getToken();
    }
    wx.request({
      url: baseUrl + url,
      data: data,
      method: method,
      header: headers,
      success: function (res) {
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          if (res.statusCode == 401)
            wx.navigateTo({
              url: `/pages/login/login`,
            });
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err);
      },
    });
  });
}