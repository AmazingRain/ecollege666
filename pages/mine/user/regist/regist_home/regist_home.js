const app = getApp();

Page({
  data: {
    userName: '',
    password: '',
    rePassword: '',
    inputType: ['password', 'password'],
    pwd: 'password',
    className: ['iconfont iconicon-test', 'iconfont iconicon-test']
  },
  getUserName(e) {
    let value = e.detail.value;
    if (value.trim().length == 0 || value.trim().length < 6) {
      wx.showToast({
        title: '至少为6位',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
      this.setData({
        userName: ''
      })
    } else {
      this.setData({
        userName: value
      })
    }
  },

  getPassword(e) {
    let value = e.detail.value;
    if (value.trim().length == 0 || value.trim().length < 6) {
      wx.showToast({
        title: '至少为6位',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
      this.setData({
        password: ''
      })
    } else {
      this.setData({
        password: value
      })
    }
  },
  getRePassword(e) {
    let value = e.detail.value;
    if (value.trim().length == 0 || value.trim().length < 6) {
      wx.showToast({
        title: '至少为6位',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
      this.setData({
        rePassword: ''
      })
    } else {
      this.setData({
        rePassword: value
      })
    }
  },
  clearValue() {
    this.setData({
      userName: ''
    })
  },
  checkPassword() {
    let {
      userName,
      password,
      rePassword,
      userId
    } = this.data;
    let id = 1;
    // wx.navigateTo({
    //   url: `/pages/mine/user/regist/bind_email/bind_email?userId=${id}`
    // });
    if (userName.trim() != 0 && password.trim() != 0 && rePassword.trim() != 0) {
      if (password == rePassword) {
        wx.request({
          url: `${app.globalData.hostName}:9002/user/add`,
          data: {
            "username": userName,
            "password": password,
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'post',
          success: (result) => {
            // let res = result.data;
            // let str = res.split('}{');
            // let resultStr = str[0] + '}';
            // let resultObj = JSON.parse(resultStr);
            // let status = resultObj.status;
            // let msg = resultObj.msg;
            // let userId = resultObj.data.id;
            // console.log(status);
            // console.log(userId)
            console.log(result.data);
            let status = result.data.status;
            let msg = result.data.msg;
            let userId = result.data.data.id;
            if (status == 400) {
              wx.showToast({
                title: `${msg}`,
                icon: 'none',
                duration: 1500,
                mask: false,
                success: (result) => {
                  this.setData({
                    userName: '',
                    password: '',
                    rePassword: ''
                  })
                },
              });
            } else if (status == 200) {
              wx.showToast({
                title: '用户注册成功',
                icon: 'none',
                mask: true,
                success: (result) => {
                  clearTimeout(timer);
                  let timer = setTimeout(function () {
                    wx.navigateTo({
                      url: `/pages/mine/user/regist/bind_email/bind_email?userId=${userId}`,
                    });
                  }, 2000);

                }
              });
            }
          }
        });
      } else {
        wx.showToast({
          title: '两次密码不匹配',
          icon: 'none',
          mask: true,
        });
      }
    } else {
      wx.showToast({
        title: '账户或密码信息为空',
        icon: 'none',
        mask: true,
      });
    }
  },
  changeType(options) {
    let type = options.currentTarget.dataset.type;
    if (type == 'pwd') {
      if (this.data.inputType[0] == 'password') {
        this.setData({
          inputType: ['text', 'password'],
          className: ['iconfont iconicon-test1', 'iconfont iconicon-test']
        })
      } else {
        this.setData({
          inputType: ['password', 'password'],
          className: ['iconfont iconicon-test', 'iconfont iconicon-test']
        })
      }
    } else if (type == 'repwd') {
      if (this.data.inputType[1] == 'password') {
        this.setData({
          inputType: ['password', 'text'],
          className: ['iconfont iconicon-test', 'iconfont iconicon-test1']
        })
      } else {
        this.setData({
          inputType: ['password', 'password'],
          className: ['iconfont iconicon-test', 'iconfont iconicon-test']
        })
      }
    }
  }
})