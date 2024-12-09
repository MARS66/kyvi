// components/my-grid/my-grid.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    data:{
      type:Array,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    go(e) {
      console.log(e);
      const {path} =e.currentTarget.dataset
      if (path) {
        wx.navigateTo({ url: path })
        return;
      }
      wx.showToast({
        title: '即将上线，敬请期待！',
        icon:'none',
      })
    },
  }
})