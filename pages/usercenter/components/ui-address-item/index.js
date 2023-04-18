import { changeUserInfo } from '../../../../services/usercenter/user';
import Toast from 'tdesign-miniprogram/toast/index';

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true,
  },
  properties: {
    address: {
      type: Object,
      value: {},
    },
    customIcon: {
      type: String,
      value: 'edit-1',
    },
    extraSpace: {
      type: Boolean,
      value: true,
    },
    isDrawLine: {
      type: Boolean,
      value: true,
    },
  },
  externalClasses: [
    'item-wrapper-class',
    'title-class',
    'default-tag-class',
    'normal-tag-class',
    'address-info-class',
    'delete-class',
  ],
  methods: {
    onDelete(e) {
      const { item } = e.currentTarget.dataset;
      this.triggerEvent('onDelete', item);
    },
    onSelect() {
      const id = this.data.address.addressId;
      wx.showModal({
        title: '提示',
        content: '是否选择为默认自提点',
        success: function (res) {
          if (res.confirm) {
            changeUserInfo({ address_id: id }).then((res) => {
              let message = '';
              if (res.message === 'success') {
                message = '修改成功';
              } else {
                message = '修改失败';
              }

              Toast({
                context: this,
                selector: '#t-toast',
                message: message,
                icon: '',
                duration: 1000,
              });
            });
          }
        },
      });
      // const { item } = e.currentTarget.dataset;
      // this.triggerEvent('onSelect', item);
    },
  },
});
