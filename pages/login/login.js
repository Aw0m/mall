import { login } from '../../services/usercenter/login';
import { setToken, setUserInfo } from '../../utils/auth';
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../store/store';
Page({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    actions: {
      updateUserInfo: 'updateUserInfo',
    },
  },
  onShow() {
    this.reqLogin();
  },
  reqLogin() {
    let code;
    const that = this;
    //调用微信小程序的登录接口
    wx.login({
      success(e) {
        code = e.code; //拿到的code存储在data中
        wx.showModal({
          title: '温馨提示',
          content: '微信授权登录后才能正常使用小程序功能',
          cancelText: '拒绝',
          confirmText: '同意',
          success() {
            //调用微信小程序的获取用户信息的接口
            wx.getUserProfile({
              desc: '用于完善会员资料', // 声明获取用户个人信息后的用途
              lang: 'zh_CN',
              success(info) {
                const userInfoObj = JSON.parse(info.rawData);
                const gender = 'u';
                login(code, userInfoObj.nickName, userInfoObj.avatarUrl, gender)
                  .then((res) => {
                    setToken(res.rsp.token);
                    setUserInfo(res.rsp.user);
                    that.updateUserInfo();
                    wx.navigateBack({
                      delta: 1,
                    });
                    wx.showToast({
                      title: '登录成功',
                      icon: 'success',
                    });
                  })
                  .catch(() => {
                    wx.navigateBack({
                      delta: 1,
                    });
                    wx.showToast({
                      title: '登录失败',
                      icon: 'none',
                    });
                  });
              },
              fail() {
                wx.navigateBack({
                  delta: 1,
                });
                wx.showToast({
                  title: '信息获取失败',
                  icon: 'none',
                });
              },
            });
          },
          fail() {
            wx.navigateBack({
              delta: 1,
            });
            wx.showToast({
              title: '拒绝登录',
              icon: 'none',
            });
          },
        });
      },
      fail() {
        wx.navigateBack({
          delta: 1,
        });
        wx.showToast({
          title: '网络异常',
          duration: 2000,
        });
      },
      complete() {},
    });
  },
});
