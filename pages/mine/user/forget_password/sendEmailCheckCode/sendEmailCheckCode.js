const app = getApp();
Page({
  data: {
    email: '',
    checkCode: '',
    password: '',
    inputType: 'password',
    className: 'iconfont iconicon-test',
  },
  onLoad: function (options) {
    this.setData({
      email: options.email,
    })
    console.log(this.data.email, this.data.userId);
  },
  getCheckCode(e) {
    let value = e.detail.value;
    if (value.trim().length == 0) {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
      this.setData({
        checkCode: value
      })
    }
    this.setData({
      checkCode: value
    })
  },

  getPassword(e) {
    let value = e.detail.value;
    if (value.trim().length == 0) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
      this.setData({
        password: ''
      })
    }
    this.setData({
      password: value
    })
  },
  modify() {
    wx.request({
      url: `${app.globalData.hostName}:9002/user/restPasswordByEmailCheckCode`,
      data: {
        checkCode: this.data.checkCode,
        password: this.data.password,
        email: this.data.email
      },
      method: 'GET',
      success: (result) => {
        let status = result.data.status;
        if (status == 200) {
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 3000,
            mask: true,
            success: (result) => {
              let timer = setTimeout(() => {
                wx.navigateTo({
                  url: '/pages/mine/user/forget_password/confimUpdate/confimUpdate',
                  success: (result) => {
                  },
                  fail: () => {},
                  complete: () => {}
                });
              }, 3000);
            },
          });
        }
      }
    });
  },
  clearValue() {
    this.setData({
      checkCode: ''
    })
  },
  changeType() {
    if (this.data.className == 'iconfont iconicon-test') {
      this.setData({
        inputType: 'text',
        className: 'iconfont iconicon-test1'
      })
    } else if (this.data.className = 'iconfont iconicon-test1') {
      this.setData({
        inputType: 'password',
        className: 'iconfont iconicon-test'
      })
    }
  }
})