// pages/douyin/douyin.js
import Message from 'tdesign-miniprogram/message';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current:'',
    autosize: { maxHeight: 120, minHeight: 60 },
    resolvingData:{},
    url:'',
    swiperList:[ 
      {
        value: 'https://img1.baidu.com/it/u=2081837368,1048460361&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500',
        ariaLabel: '图片1',
      },
      {
        value: 'https://img0.baidu.com/it/u=2018145865,3358069236&fm=253&fmt=auto&app=138&f=JPEG?w=467&h=305',
        ariaLabel: '图片1',
      },
      {
        value: 'https://img2.baidu.com/it/u=2189398648,3566628695&fm=253&fmt=auto&app=120&f=JPEG?w=801&h=500',
        ariaLabel: '图片2',
      },
    ]
  },
  // 同步到剪贴板
  handlerChange({detail}){
    this.setData({
      url:detail.value
    })
  },
  // 粘贴并解析
  handlerPaste(){
    const t=this
    wx.getClipboardData({
      success (res){
        if (!res.data?.length) {
          wx.showToast({
            title: '请提供视频链接！',
            icon:'none'
          })
          return;
        }
        t.setData({url:res.data})
        t.startResolving()
      },
      fail(){
        wx.showToast({
          title: '请提供视频链接！',
          icon:'none'
        })
      }
    })
  },
  // 清空
  handlerClear(){
    this.setData({url:'' })
  },
  
  // 开始解析
  startResolving(){
    wx.showLoading({title: '解析中...',mask:true})
    const t=this
    wx.request({
      url: 'https://dy.kukutool.com/api/parse',
      method:'POST',
      data:{ requestURL: this.data.url },
      success({data,status}){
        wx.hideLoading()
        if (data.status===0) {
          const app = getApp();
          app.globalData.resolvingData=data.data
          wx.navigateTo({
            url: '/pages/saveVideo/saveVideo',
          })
        } else{
          wx.showToast({
            title: data.error,
            icon:'none'
          })
        } 
      },
      fail(){
        wx.hideLoading()
        wx.showToast({
          title: '系统异常请联系管理员！',
          icon:'none'
        })
      } 
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