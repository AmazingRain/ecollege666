// pages/life/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {}
  },

  go(){
    let {id, categoryId, userId} = this.data.options;
    console.log("1111111",this.data.options);
    wx.navigateTo({
      url: `../goods_detail/goode_detail?id=${id}&categoryId=${categoryId}&userId=${userId}`,
      success: function(res) {

      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onLoad: function (options) {
    console.log("success", options);
    this.setData({
      options: options
    })
  },
})
