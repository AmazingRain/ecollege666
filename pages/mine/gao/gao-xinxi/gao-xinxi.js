const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nei:{},
    options:{}
  },


  getCont(){
    // console.log(this.data.options);
    let id1 = this.data.options.id;
    wx.request({
      url: `${app.globalData.hostName}:9011/notice/findOneById`,
      data: {
        id: id1
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res)=> {
        console.log(res.data.data);
        this.setData({
          nei:res.data.data,
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      options: options
    }),
    this.getCont();
  },

})