import { mockIp, mockReqId } from '../utils/mock';

export function genCartGroupData() {
  const resp = {
    data: {
      isNotEmpty: true,
      storeGoods: [
        {
          storeId: '1000',
          storeName: '云Mall深圳旗舰店',
          lastJoinTime: '2020-06-29T07:55:40.000+0000',
          promotionGoodsList: [
            {
              goodsPromotionList: [
                {
                  uid: '88888888205468',
                  storeId: '1000',
                  spuId: '12',
                  skuId: '135691622',
                  isSelected: 1,
                  thumb: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3a.png',
                  title: '腾讯极光盒子4智能网络电视机顶盒6K千兆网络机顶盒4K高分辨率',
                  primaryImage: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-3a.png',
                  quantity: 1, // 数量
                  stockStatus: true,
                  stockQuantity: 99, // 库存
                  price: '99010',
                  originPrice: '16900',
                  specInfo: [
                    {
                      specTitle: '颜色',
                      specValue: '经典白',
                    },
                    {
                      specTitle: '类型',
                      specValue: '经典套装',
                    },
                  ],
                  joinCartTime: '2020-06-29T07:55:40.000+0000',
                  available: 1,
                },
                {
                  uid: '88888888205468',
                  saasId: '88888888',
                  storeId: '1000',
                  spuId: '5',
                  skuId: '135691635',
                  isSelected: 0,
                  thumb: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-2a.png',
                  title: '迷你便携高颜值蓝牙无线耳机立体声只能触控式操作简约立体声耳机',
                  primaryImage: 'https://cdn-we-retail.ym.tencent.com/tsr/goods/dz-2a.png',
                  quantity: 1,
                  stockStatus: true,
                  stockQuantity: 96,
                  price: '29000',
                  originPrice: '29900',
                  tagPrice: null,
                  tagText: null,
                  roomId: null,
                  specInfo: [
                    {
                      specTitle: '颜色',
                      specValue: '黑色',
                    },
                    {
                      specTitle: '类型',
                      specValue: '简约款',
                    },
                  ],
                  joinCartTime: '2020-06-29T07:55:17.000+0000',
                  available: 1,
                  putOnSale: 1,
                  etitle: null,
                },
              ],
              lastJoinTime: '2020-06-29T07:55:40.000+0000',
            },
          ],
        },
      ],
      invalidGoodItems: [],
      isAllSelected: false,
      selectedGoodsCount: 0,
      totalAmount: '179997',
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 269,
    success: true,
  };
  return resp;
}
