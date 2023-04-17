import { observable, action } from 'mobx-miniprogram';
import { updateInfo } from '../services/usercenter/updateInfo';
import { isLogin, setUserInfo } from "../utils/auth";
export const store = observable({
  //底部安全区
  pbSafe: wx.getSystemInfoSync().screenHeight - wx.getSystemInfoSync().safeArea.bottom,
  // 状态栏高度
  statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
  // 胶囊高度
  menuButtonHeight: wx.getMenuButtonBoundingClientRect().height,
  // 自定义navbar设置高度
  navbarHeight:
    wx.getSystemInfoSync().statusBarHeight +
    wx.getMenuButtonBoundingClientRect().height +
    (wx.getMenuButtonBoundingClientRect().top - wx.getSystemInfoSync().statusBarHeight) * 2,

  // 用户个人信息
  userInfo: null, //不用storage的info store实时更新
  userClub: null,
  // 更新info
  updateUserInfo: action(function () {
    if (!isLogin()) {
      this.userInfo = null;
      return;
    }
    updateInfo()
      .then((res) => {
        this.userInfo = res.rsp.user;
        setUserInfo(this.userInfo);
      })
      .then(() => {})
      .catch(() => {});
  }),
});
