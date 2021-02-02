// pages/users/bindEmail/bindEmail.js
const app = getApp();
Page({

  data: {
    email: '',
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      userId: options.userId
    })
    wx.showToast({
      title: '请绑定邮箱',
      icon: 'none',
      mask: true,
    });
  },
  getEmail(e) {
    let value = e.detail.value;
    console.log(value);
    var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!reg.test(value)) {
      wx.showToast({
        title: '邮箱格式不正确',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
    } else {
      this.setData({
        email: value
      })
    }
  },
  clearValue() {
    this.setData({
      email: ''
    })
  },
  sendEmailCode() {
    wx.request({
      url: `${app.globalData.hostName}:9002/user/sendEmailActiveCode`,
      data: {
        userId: this.data.userId,
        email: this.data.email
      },
      header: {'content-type':'application/json'},
      method: 'get',
      dataType: 'application/json',
      responseType: 'text',
      success: (result)=>{
        wx.navigateTo({
          url: '/pages/mine/user/regist/confim_email/confim_email'
        })
      }
    });
    // wx.navigateTo({
    //   url: '/pages/mine/user/regist/confim_email/confim_email'
    // })
  }

})