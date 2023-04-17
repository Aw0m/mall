import { fetchPerson } from '../../../services/usercenter/fetchPerson';
import { phoneEncryption } from '../../../utils/util';
import Toast from 'tdesign-miniprogram/toast/index';
import { changeUserInfo } from "../../../services/usercenter/user";
import { store } from "../../../store/store";
import { storeBindingsBehavior } from "mobx-miniprogram-bindings";

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
    personInfo: {
      avatarUrl: '',
      nickName: '',
      gender: 0,
      phoneNumber: '',
    },
    showUnbindConfirm: false,
    pickerOptions: [
      {
        name: '男',
        code: '1',
      },
      {
        name: '女',
        code: '2',
      },
      {
        name: '其他',
        code: '3',
      },
    ],
    typeVisible: false,
    genderMap: ['', '男', '女', '其他'],
  },
  onLoad() {
    this.init();
  },
  init() {
    this.fetchData();
  },
  fetchData() {
    fetchPerson().then((personInfo) => {
      this.setData({
        personInfo,
        'personInfo.phoneNumber': phoneEncryption(personInfo.phoneNumber),
      });
    });
  },
  onClickCell({ currentTarget }) {
    const { dataset } = currentTarget;
    const { nickName } = this.data.personInfo;

    switch (dataset.type) {
      case 'gender':
        this.setData({
          typeVisible: true,
        });
        break;
      case 'name':
        wx.navigateTo({
          url: `/pages/usercenter/name-edit/index?name=${nickName}`,
        });
        break;
      case 'avatarUrl':
        this.toModifyAvatar();
        break;
      case 'phoneNumber':
        Toast({ context: this, selector: '#t-toast', message: '点击了PhoneNumber' });
        break;
      default: {
        break;
      }
    }
  },
  onClose() {
    this.setData({
      typeVisible: false,
    });
  },
  onConfirm(e) {
    const { value } = e.detail;
    this.setData(
      {
        typeVisible: false,
        'personInfo.gender': value,
      },
      () => {
        let genderVal;
        switch (value) {
          case '1':
            genderVal = 'm';
            break;
          case '2':
            genderVal = 'f';
            break;
          default:
            genderVal = 'u'
        }
        changeUserInfo({
          gender: genderVal
        }).then(
          () => {
            Toast({
              context: this,
              selector: '#t-toast',
              message: '设置成功',
              theme: 'success',
            });
            this.updateUserInfo()
          },
          () => {
            Toast({
              context: this,
              selector: '#t-toast',
              message: '设置失败',
              theme: 'failed',
            });
          }
        )
      },
    );
  },
  async toModifyAvatar() {
    try {
      const tempFilePath = await new Promise((resolve, reject) => {
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            const { path, size } = res.tempFiles[0];
            if (size <= 10485760) {
              resolve(path);
            } else {
              reject({ errMsg: '图片大小超出限制，请重新上传' });
            }
          },
          fail: (err) => reject(err),
        });
      });
      const tempUrlArr = tempFilePath.split('/');
      const tempFileName = tempUrlArr[tempUrlArr.length - 1];
      Toast({
        context: this,
        selector: '#t-toast',
        message: `已选择图片-${tempFileName}`,
        theme: 'success',
      });
    } catch (error) {
      if (error.errMsg === 'chooseImage:fail cancel') return;
      Toast({
        context: this,
        selector: '#t-toast',
        message: error.errMsg || error.msg || '修改头像出错了',
        theme: 'error',
      });
    }
  },
});
