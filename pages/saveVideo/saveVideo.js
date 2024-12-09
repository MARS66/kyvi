
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resolvingData:{}
  },

  // 保存视频
  saveVideo(){
    const t=this
    wx.showLoading({
      title: '下载中...',
      mask:true,
    })
    wx.downloadFile({
        //视频信息的Url
      url:this.data.resolvingData.url,
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success:function(res) {
              wx.hideLoading(); 
            },
            fail(){
              wx.hideLoading(); 
              wx.showToast({
                title: '已取消！',
                icon:'none'
              })
            }
          })
        }else{
          wx.hideLoading(); 
          wx.showToast({
            title: '系统异常请稍后重试！',
            icon:'none'
          })
        }
      },
      fail(){
        wx.hideLoading(); 
        wx.showToast({
          title: '请复制链接至浏览器下载！',
          icon:'none'
        })
      }
    })
  },
  // 保存封面 
  saveCover(){
    const t=this
    wx.showLoading({
      title: '下载中...',
      mask:true,
    })
    wx.downloadFile({
        //视频信息的Url
      url:this.data.resolvingData.cover,
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success:function(res) {
              wx.hideLoading(); 
            },
            fail(){
              wx.hideLoading(); 
              wx.showToast({
                title: '已取消！',
                icon:'none'
              })
            }
          })
        }else{
          wx.hideLoading(); 
          wx.showToast({
            title: '系统异常请稍后重试！',
            icon:'none'
          })
        }
      },
      fail(){
        wx.hideLoading(); 
        wx.showToast({
          title: '请复制链接至浏览器下载！',
          icon:'none'
        })
      }
    })

  },
  // 复制
  copyText({currentTarget}){
    const t=this
    wx.setClipboardData({
      data: currentTarget.dataset.text,
      success (res) {
        wx.showToast({
          title: '已复制',
          icon: 'success',
          duration: 2000
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {globalData} = getApp();
     this.setData({
      resolvingData:globalData.resolvingData
     })
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