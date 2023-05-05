import { changeUserInfo } from '../../../services/usercenter/user';
import Toast from 'tdesign-miniprogram/toast/index';
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings';
import { store } from '../../../store/store';
import { setUserInfo } from '../../../utils/auth';
import { updateInfo } from '../../../services/usercenter/updateInfo';

Page({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: {
      userInfo: 'userInfo',
      navbarHeight: 'navbarHeight',
    },
    actions: {
      updateUserInfo: 'updateUserInfo',
    },
  },
  data: {
    nameValue: '',
  },
  onLoad(options) {
    const { name } = options;
    this.setData({
      nameValue: name,
    });
  },
  onSubmit() {
    changeUserInfo({
      username: this.data.nameValue,
    }).then(
      () => {
        updateInfo()
          .then((res) => {
            this.userInfo = res.rsp.user;
            setUserInfo(this.userInfo);
            wx.navigateBack({ backRefresh: true });
          })
          .then(() => {})
          .catch(() => {});
        Toast({
          context: this,
          selector: '#t-toast',
          message: '设置成功',
          theme: 'success',
        });
      },
      () => {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '设置失败',
          theme: 'failed',
        });
        wx.navigateBack({ backRefresh: true });
      },
    );
  },
  clearContent() {
    this.setData({
      nameValue: '',
    });
  },
});
