// pages/applay/applay.js
import Message from 'tdesign-miniprogram/message';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gridData:[
     { 
        label:'短视频免费去水印',
        icon:'icon-xiazaishipin',
        list:[
          {
            name:'DY某音',
            path:'/pages/douyin/douyin',
            image:"https://img0.baidu.com/it/u=3637022310,470598549&fm=253&fmt=auto&app=138&f=GIF?w=608&h=342"
          },
          {
            name:'KS某手',
            path:'/pages/douyin/douyin',
            image:"https://img1.baidu.com/it/u=1222192942,2911847175&fm=253&fmt=auto&app=138&f=JPEG?w=754&h=500"
          },
          {
            name:'b站某站',
            path:'/pages/douyin/douyin',
            image:"https://img0.baidu.com/it/u=706392535,1774762650&fm=253&fmt=auto&app=138&f=JPEG?w=421&h=308"
          },
          {
            name:'小某书',
            path:'/pages/douyin/douyin',
            image:"https://img2.baidu.com/it/u=1913296192,333530481&fm=253&fmt=auto&app=138&f=PNG?w=466&h=415"
          },
          {
            name:'Instagram',
            path:'/pages/douyin/douyin',
            image:"https://img1.baidu.com/it/u=3929110579,3673354682&fm=253&fmt=auto?w=842&h=585"
          },
          {
            name:'Tiktok',
            path:'/pages/douyin/douyin',
            image:"https://img1.baidu.com/it/u=3915340595,2009108826&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=375"
          },
          {
            name:'Weibo',
            path:'/pages/douyin/douyin',
            image:"https://img2.baidu.com/it/u=1925254889,2187947328&fm=253&fmt=auto&app=138&f=JPEG?w=625&h=500"
          },
          {
            name:'YouTubo',
            path:'/pages/douyin/douyin',
            image:"https://img0.baidu.com/it/u=3073167323,1223521968&fm=253&fmt=auto&app=138&f=PNG?w=594&h=453"
          }
        ]
      },
      // {
      //   label:'实用工具',
      //   icon:'icon-baibaoxiang1',
      //   list:[
      //     {
      //       name:'手持弹幕',
      //       path:'/pages/douyin/douyin',
      //       icon:'icon-drama-masks',
      //     }
      //   ],
      // },
      { 
         label:'彝文传承',
         icon:'icon-aafbcf-',
         list:[
          {
            name:'彝文输入法',
            image:"https://img2.baidu.com/it/u=3375676585,3910023347&fm=253&fmt=auto&app=138&f=PNG?w=376&h=375"
          },
          {
            name:'彝族家谱',
            image:"https://img2.baidu.com/it/u=2910848886,240912047&fm=253&fmt=auto&app=138&f=JPEG?w=520&h=390"
          },
          {
            name:'彝文经典',
            image:"https://img0.baidu.com/it/u=3555005591,1512054220&fm=253&fmt=auto&app=138&f=JPEG?w=331&h=331"
          },
          {
            name:'吉日测算',
            image:"https://img0.baidu.com/it/u=4023209331,1350391415&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=501"
          },
          {
            name:'点读学习',
            image:"https://img1.baidu.com/it/u=1820971645,1199109546&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
          },
          {
            name:'尔比尔集',
            image:"https://img2.baidu.com/it/u=4234781346,2161447878&fm=253&fmt=auto&app=138&f=JPEG?w=520&h=500"
          }
        ]
      }
    ],
    border: {
      color: 'var(--td-border-level-1-color, #E7E7E7)',
    },
  },

  onChange(e) {
    // this.setData({ value: e.detail.value,});
    wx.switchTab({
      url: `/pages/${e.detail.value}/${e.detail.value}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})