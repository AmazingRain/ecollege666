const app = getApp();
Page({
  data: {
    email: '',
  },
  getEmail(e) {
    let value = e.detail.value;
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    if (!reg.test(value)) {
      wx.showToast({
        title: '邮箱格式不正确',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
      this.clearEmailValue();
    } else {
      this.setData({
        email: value
      })
    }
  },
  clearEmailValue() {
    this.setData({
      email: '',
      userId: ''
    })
  },
  updatePassword() {
    wx.request({
      url: `${app.globalData.hostName}:9002/user/sendUpdatePasswordCheckCode`,
      data: {
        email: this.data.email
      },
      header: {
        'content-type': 'application/json',
        // 'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'get',
      success: (result) => {
        let flag = result.data.data;
        if (!flag) {
          // 查找用户的id
          wx.showToast({
            title: '邮件已发送（垃圾邮箱也有可能），请注意查收',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: true,
            success: (result) => {
              let timer = setTimeout(() => {
                wx.navigateTo({
                  url: `/pages/mine/user/forget_password/sendEmailCheckCode/sendEmailCheckCode?email=${this.data.email}`
                })
              }, 2000);
            },
            fail: () => {},
            complete: () => {}
          });
        } else {
          wx.showToast({
            title: '请输入正确的邮箱地址',
            icon: 'none',
            duration: 1500,
            mask: true,
          });
        }
      },
    });
  }
})