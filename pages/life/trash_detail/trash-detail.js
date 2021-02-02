// pages/life/trash_detail/trash-detail.js
const  app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    type: '',
    searchResult: {},
    refuseType: ['可回收垃圾', '其他垃圾', '厨余垃圾', '有害垃圾']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    wx.request({
      url: `${app.globalData.hostName}:9007/refuse/findOneById?id=${this.data.id}`,
      method: 'get',
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      success: (res) => {
        // console.log(res.data.data);
        let type = res.data.data.type;
        this.setData({
          searchResult: res.data.data,
          type: this.data.refuseType[type]
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})