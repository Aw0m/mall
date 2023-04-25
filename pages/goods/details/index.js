import Toast from 'tdesign-miniprogram/toast/index';
import { fetchGood, getCommodityDetail } from '../../../services/good/fetchGood';
import { fetchActivityList } from '../../../services/activity/fetchActivityList';
import {
  getGoodsDetailsCommentList,
  getGoodsDetailsCommentsCount,
} from '../../../services/good/fetchGoodsDetailsComments';

import { cdnBase } from '../../../config/index';
import { addToCart } from '../../../services/good/addToCart';

const imgPrefix = `${cdnBase}/`;

const recLeftImg = `${imgPrefix}common/rec-left.png`;
const recRightImg = `${imgPrefix}common/rec-right.png`;
const obj2Params = (obj = {}, encode = false) => {
  const result = [];
  Object.keys(obj).forEach((key) => result.push(`${key}=${encode ? encodeURIComponent(obj[key]) : obj[key]}`));

  return result.join('&');
};

Page({
  data: {
    price: 0,
    commodityName: '未知商品',
    imageURLList: [''],
    commentsList: [],
    commentsStatistics: {
      badCount: 0,
      commentCount: 0,
      goodCount: 0,
      goodRate: 0,
      hasImageCount: 0,
      middleCount: 0,
    },
    isShowPromotionPop: false,
    activityList: [],
    recLeftImg,
    recRightImg,
    details: {},
    goodsTabArray: [
      {
        name: '商品',
        value: '', // 空字符串代表置顶
      },
      {
        name: '详情',
        value: 'goods-page',
      },
    ],
    storeLogo: `${imgPrefix}common/store-logo.png`,
    storeName: '云mall标准版旗舰店',
    jumpArray: [
      {
        title: '首页',
        url: '/pages/home/home',
        iconName: 'home',
      },
      {
        title: '购物车',
        url: '/pages/cart/index',
        iconName: 'cart',
        showCartNum: true,
      },
    ],
    isStock: true,
    cartNum: 0,
    soldout: false,
    buttonType: 1,
    buyNum: 1,
    selectedAttrStr: '',
    skuArray: [],
    primaryImage: '',
    specImg: '',
    isSpuSelectPopupShow: false,
    isAllSelectedSku: false,
    buyType: 0,
    outOperateStatus: false, // 是否外层加入购物车
    operateType: 0,
    selectSkuSellsPrice: 0,
    maxLinePrice: 0,
    minSalePrice: 0,
    maxSalePrice: 0,
    list: [],
    spuId: '',
    navigation: { type: 'fraction' },
    current: 0,
    autoplay: true,
    duration: 500,
    interval: 5000,
    soldNum: 0, // 已售数量
  },

  handlePopupHide() {
    this.setData({
      isSpuSelectPopupShow: false,
    });
  },

  showSkuSelectPopup(type) {
    this.setData({
      buyType: type || 0,
      outOperateStatus: type >= 1,
      isSpuSelectPopupShow: true,
    });
  },

  buyItNow() {
    this.showSkuSelectPopup(1);
  },

  toAddCart() {
    this.showSkuSelectPopup(2);
  },

  toNav(e) {
    const { url } = e.detail;
    wx.switchTab({
      url: url,
    });
  },

  showCurImg(e) {
    const { index } = e.detail;
    const { images } = this.data.details;
    wx.previewImage({
      current: images[index],
      urls: images, // 需要预览的图片http链接列表
    });
  },

  onPageScroll({ scrollTop }) {
    const goodsTab = this.selectComponent('#goodsTab');
    goodsTab && goodsTab.onScroll(scrollTop);
  },

  chooseSpecItem(e) {
    const { specList } = this.data.details;
    const { selectedSku, isAllSelectedSku } = e.detail;
    if (!isAllSelectedSku) {
      this.setData({
        selectSkuSellsPrice: 0,
      });
    }
    this.setData({
      isAllSelectedSku,
    });
    this.getSkuItem(specList, selectedSku);
  },
  // 获取已选择的sku名称
  getSelectedSkuValues(skuTree, selectedSku) {
    const normalizedTree = this.normalizeSkuTree(skuTree);
    return Object.keys(selectedSku).reduce((selectedValues, skuKeyStr) => {
      const skuValues = normalizedTree[skuKeyStr];
      const skuValueId = selectedSku[skuKeyStr];
      if (skuValueId !== '') {
        const skuValue = skuValues.filter((value) => {
          return value.specValueId === skuValueId;
        })[0];
        skuValue && selectedValues.push(skuValue);
      }
      return selectedValues;
    }, []);
  },

  normalizeSkuTree(skuTree) {
    const normalizedTree = {};
    skuTree.forEach((treeItem) => {
      normalizedTree[treeItem.specId] = treeItem.specValueList;
    });
    return normalizedTree;
  },

  selectSpecsName(selectSpecsName) {
    if (selectSpecsName) {
      this.setData({
        selectedAttrStr: selectSpecsName,
      });
    } else {
      this.setData({
        selectedAttrStr: '',
      });
    }
  },

  async addCart() {
    const rsp = await addToCart({
      // eslint-disable-next-line camelcase
      commodity_id: this.data.spuId,
      // eslint-disable-next-line camelcase
      commodity_num: this.data.buyNum,
    });
    if (rsp.message !== 'success') {
      Toast({
        context: this,
        selector: '#t-toast',
        message: `加入购物车失败`,
        icon: '',
        duration: 1000,
      });
      return;
    }
    Toast({
      context: this,
      selector: '#t-toast',
      message: `加入购物车成功`,
      icon: '',
      duration: 1000,
    });
  },

  gotoBuy() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: `点击了购买,value:${this.data.buyNum}`,
      icon: '',
      duration: 1000,
    });
    // this.handlePopupHide();
    // const query = {
    //   quantity: buyNum,
    //   storeId: '1',
    //   spuId: this.data.spuId,
    //   goodsName: this.data.details.title,
    //   skuId:
    //     type === 1 ? this.data.skuList[0].skuId : this.data.selectItem.skuId,
    //   available: this.data.details.available,
    //   price: this.data.details.minSalePrice,
    //   specInfo: this.data.details.specList?.map((item) => ({
    //     specTitle: item.title,
    //     specValue: item.specValueList[0].specValue,
    //   })),
    //   primaryImage: this.data.details.primaryImage,
    //   thumb: this.data.details.primaryImage,
    //   title: this.data.details.title,
    // };
    // let urlQueryStr = obj2Params({
    //   goodsRequestList: JSON.stringify([query]),
    // });
    // urlQueryStr = urlQueryStr ? `?${urlQueryStr}` : '';
    // const path = `/pages/order/order-confirm/index${urlQueryStr}`;
    // wx.navigateTo({
    //   url: path,
    // });
  },

  specsConfirm() {
    const { buyType } = this.data;
    if (buyType === 1) {
      this.gotoBuy();
    } else {
      this.addCart();
    }
    // this.handlePopupHide();
  },

  changeNum(e) {
    this.setData({
      buyNum: e.detail.buyNum,
    });
  },

  closePromotionPopup() {
    this.setData({
      isShowPromotionPop: false,
    });
  },

  promotionChange(e) {
    const { index } = e.detail;
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${index}`,
    });
  },

  showPromotionPopup() {
    this.setData({
      isShowPromotionPop: true,
    });
  },

  async getDetail(spuId) {
    const getCommodityDetailRsp = await getCommodityDetail({ commodity_id: spuId });
    const price = getCommodityDetailRsp.rsp.commodity_info.price * 100;
    const commodityName = getCommodityDetailRsp.rsp.commodity_info.commodity_name;
    const comment = {
      userHeadUrl: getCommodityDetailRsp.rsp.comment_info.commenter_avatar_url,
      userName: getCommodityDetailRsp.rsp.comment_info.commenter_name,
      commentScore: getCommodityDetailRsp.rsp.comment_info.score_res,
      commentContent: getCommodityDetailRsp.rsp.comment_info.comment_text,
    };
    this.setData({
      price: price,
      commentsList: [comment],
      commodityName: commodityName,
      imageURLList: [getCommodityDetailRsp.rsp.commodity_info.image_url],
      primaryImage: getCommodityDetailRsp.rsp.commodity_info.image_url,
    });
    // Promise.all([fetchGood(spuId), fetchActivityList()]).then(async (res) => {
    // eslint-disable-next-line camelcase
    //
    // let [details, activityList] = res;
    // const { primaryImage, isPutOnSale, minSalePrice, maxSalePrice, maxLinePrice, soldNum } = details;
    // this.setData({
    // details,
    // activityList,
    // isStock:1,
    // maxSalePrice: maxSalePrice ? parseInt(maxSalePrice) : 0,
    // maxLinePrice: maxLinePrice ? parseInt(maxLinePrice) : 0,
    // minSalePrice: minSalePrice ? parseInt(minSalePrice) : 0,
    // primaryImage,
    // soldout: isPutOnSale === 0,
    // });
    // });
  },

  onShareAppMessage() {
    // 自定义的返回信息
    const { selectedAttrStr } = this.data;
    let shareSubTitle = '';
    if (selectedAttrStr.indexOf('件') > -1) {
      const count = selectedAttrStr.indexOf('件');
      shareSubTitle = selectedAttrStr.slice(count + 1, selectedAttrStr.length);
    }
    const customInfo = {
      imageUrl: this.data.details.primaryImage,
      title: this.data.details.title + shareSubTitle,
      path: `/pages/goods/details/index?spuId=${this.data.spuId}`,
    };
    return customInfo;
  },

  /** 获取评价统计 */
  async getCommentsStatistics() {
    try {
      const code = 'Success';
      const data = await getGoodsDetailsCommentsCount();
      if (code.toUpperCase() === 'SUCCESS') {
        const { badCount, commentCount, goodCount, goodRate, hasImageCount, middleCount } = data;
        const nextState = {
          commentsStatistics: {
            badCount: parseInt(`${badCount}`),
            commentCount: parseInt(`${commentCount}`),
            goodCount: parseInt(`${goodCount}`),
            /** 后端返回百分比后数据但没有限制位数 */
            goodRate: Math.floor(goodRate * 10) / 10,
            hasImageCount: parseInt(`${hasImageCount}`),
            middleCount: parseInt(`${middleCount}`),
          },
        };
        this.setData(nextState);
      }
    } catch (error) {
      console.error('comments statiistics error:', error);
    }
  },

  /** 跳转到评价列表 */
  navToCommentsListPage() {
    wx.navigateTo({
      url: `/pages/goods/comments/index?spuId=${this.data.spuId}`,
    });
  },

  onLoad(query) {
    const { spuId } = query;
    this.setData({
      spuId: spuId, //spudId === commodityId
    });
    this.getDetail(spuId);
    this.getCommentsStatistics(spuId);
  },
});
