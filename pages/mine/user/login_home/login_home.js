// pages/logins/login/login.js
const app = getApp();

Page({

  data: {
    username: '',
    password: '',
    inputType: 'password',
    className: 'iconfont iconicon-test'
  },


  onLoad: function (options) {

    let token = wx.getStorageSync("Authorization");
    let username = wx.getStorageSync("username");

    if (typeof (username) != 'undefined' && username != null && username != '' &&
      typeof (Authorization) != 'undefined' && Authorization != null && Authorization != '') {

      wx.switchTab({
        url: '/pages/study/study_home/study_home'
      })

    }


  },
  getUserName(e) {
    let value = e.detail.value;
    if (value.trim().length == 0) {
      wx.showToast({
        title: '用户名不能为空',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
      this.setData({
        username: ''
      })
    } else {
      this.setData({
        username: value
      })
    }
  },

  getPassword(e) {
    let value = e.detail.value;
    console.log('pass：' + value)
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
    } else {
      this.setData({
        password: value
      })
    }
  },
  regist() {
    wx.navigateTo({
      url: '/pages/mine/user/regist/regist_home/regist_home'
    })
  },
  findPassword() {
    wx.navigateTo({
      url: '/pages/mine/user/forget_password/forget_password_home/forget_password_home'
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
  },
  clearValue() {
    this.setData({
      username: ''
    })
  },
 
  loginPage() {

    wx.request({
      url: `${app.globalData.hostName}:9009/login`,
      header: {},
      data: {
        username: this.data.username,
        password: this.data.password
      },
      method: 'post',
      dataType: 'application/json',
      responseType: 'text',
      success: (res) => {
        let resData = JSON.parse(res.data);
        // console.log(resData);
        let {
          status,
          msg
        } = resData;
        if (status != 400) {
          app.setCache('Authorization', res.header["Authorization"], 60 * 60 * 24);
          app.setCache('username', resData.username, 60 * 60 * 24);
          wx.request({
            url: `${app.globalData.hostName}:9002/user/findByUsername`,
            header: {
              'Authorization': wx.getStorageSync('Authorization').value
            },
            data: {
              username: wx.getStorageSync('username').value
            },
            method: 'get',
            dataType: 'application/json',
            success: (res) => {
              let userId = JSON.parse(res.data).data.id;
              let email = JSON.parse(res.data).data.email;
              app.setCache('userId', userId, 60 * 60 * 24);
              wx.switchTab({
                url: '/pages/study/study_home/study_home'
              })
            }
          })
          
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
            image: '',
            duration: 1500,
            mask: true,
            success: (result)=>{
              
            },
            fail: ()=>{},
            complete: ()=>{}
          });
        }
        

      }
    })
  },
  disagree() {
    wx.showToast({
      title: '暂不支持',
      icon: 'none',
      image: '',
      duration: 1500,
      mask: true,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }

})