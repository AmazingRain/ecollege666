// pages/mine/mineMenu/mineMenu.js
const app = getApp()
// app.globalData.scene
Page({

  /**
   * 页面的初始数据
   */
  data: {
   userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.init();
    let authorization = wx.getStorageSync('Authorization').value;
    if(authorization) {
      this.setData({
        userId: wx.getStorageSync('userId').value
      });
      this.getUserInfo();
    }
    
  },
  onShow: function() {
    this.getUserInfo();
  },
  getUserInfo() {
    wx.request({
      url: `${app.globalData.hostName}:9002/user/findById?id=${this.data.userId}`,
      data: {
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(result);
        this.setData({
          userInfo: result.data.data
        });
      }
    });
  },
  preview() {
    wx.previewImage({
      current: this.data.imgSrc,
      urls: [this.data.imgSrc],
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  renzheng() {
    wx.navigateTo({
      url: '/pages/mine/renzheng/renzheng'
    })
  },
  setting() {
    wx.navigateTo({
      url: '/pages/mine/setting/setting_home/setting_home',
    });
  },
  gengduo() {
    wx.navigateTo({
      url: '/pages/mine/more/more_home/more_home'
    })
  },
  gong() {
    wx.navigateTo({
      url: '/pages/mine/gao/gonggao/gonggao'
    })
  },
  userInfo() {
    wx.navigateTo({
      url: '/pages/mine/user/userInfo/userInfo'
    })
  }
})