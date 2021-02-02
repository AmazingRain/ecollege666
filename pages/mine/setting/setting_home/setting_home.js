// pages/mine/setting/hebing/hebing.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  xiaoxi() {
    wx.navigateTo({
      url: '/pages/mine/setting/xiaoxi/xiaoxi'
    })
  },
  yinsi() {
    wx.navigateTo({
      url: '/pages/mine/setting/yinsi/yinsi',
    });
  },
  net() {
    wx.navigateTo({
      url: '/pages/mine/setting/net/net',
    });
  },
  huancun() {
    wx.clearStorage();
    wx.showToast({
      title: '缓存已清楚',
      icon: 'none',
      mask: true,
    });
  },
  zhanghao() {
    wx.navigateTo({
      url: '/pages/mine/setting/zhanghao/zhanghao'
    })
  },
  exit() {
    console.log(111);
    app.globalData.userId = ''
    wx.reLaunch({
      url: '/pages/mine/user/login_home/login_home'
  });
  },
 
})