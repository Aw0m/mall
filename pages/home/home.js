import { fetchHome } from '../../services/home/home';
import { fetchGoodsList } from '../../services/good/fetchGoods';
import Toast from 'tdesign-miniprogram/toast/index';
import { addToCart } from "../../services/good/addToCart";

Page({
  data: {
    imgSrcs: [],
    tabList: [],
    goodsList: [],
    goodsListLoadStatus: 0,
    pageLoading: false,
    current: 1,
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: { type: 'dots' },
    swiperImageProps: { mode: 'scaleToFill' },
    categoryCurrIdx: 0,
  },

  goodListPagination: {
    index: 0,
    num: 20,
  },

  privateData: {
    tabIndex: 0,
  },

  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    this.init();
  },

  onReachBottom() {
    if (this.data.goodsListLoadStatus === 0) {
      this.loadGoodsList();
    }
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.loadHomePage();
  },

  loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: true,
    });
    fetchHome().then(({ swiper, tabList }) => {
      this.setData({
        tabList,
        imgSrcs: swiper,
        pageLoading: false,
      });
      this.loadGoodsList(true);
    });
  },

  tabChangeHandle(e) {
    const { value } = e.detail;
    this.data.categoryCurrIdx = parseInt(value);
    this.loadGoodsList(true);
    // this.init();
  },

  onReTry() {
    this.loadGoodsList();
  },

  async loadGoodsList(fresh = false) {
    if (fresh) {
      await wx.pageScrollTo({
        scrollTop: 0,
      });
    }

    this.setData({ goodsListLoadStatus: 1 });

    const pageSize = this.goodListPagination.num;
    let pageIndex = this.privateData.tabIndex * pageSize + this.goodListPagination.index + 1;
    if (fresh) {
      pageIndex = 1;
    }

    try {
      const nextList = await fetchGoodsList(pageIndex, pageSize, this.data.categoryCurrIdx);
      this.setData({
        goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
        goodsListLoadStatus: 0,
      });

      this.goodListPagination.index = pageIndex;
      this.goodListPagination.num = pageSize;
    } catch (err) {
      this.setData({ goodsListLoadStatus: 3 });
    }
  },
  // 查看商品详细
  goodListClickHandle(e) {
    const { index } = e.detail;
    const { spuId } = this.data.goodsList[index];
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${spuId}`,
    });
  },
  // 点击商品的详细
  async goodListAddCartHandle(e) {
    const { goods } = e.detail;
    const rsp = await addToCart({
      // eslint-disable-next-line camelcase
      commodity_id: goods.spuId,
      // eslint-disable-next-line camelcase
      commodity_num: 1,
    });
    if (rsp.message !== 'success') {
      Toast({
        context: this,
        selector: '#t-toast',
        message: `加入购物车失败`,
        icon: '',
        duration: 400,
      });
      return;
    }
    Toast({
      context: this,
      selector: '#t-toast',
      message: '加入购物车成功',
      icon: '',
      duration: 400,
    });
    const app = getApp();
    app.globalData.needUpdateCart = true;
  },
  // 搜索界面
  navToSearchPage() {
    wx.navigateTo({ url: '/pages/goods/search/index' });
  },
  // banner推广页面
  navToActivityDetail({ detail }) {
    const { index: promotionID = 0 } = detail || {};
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${promotionID}`,
    });
  },
});
