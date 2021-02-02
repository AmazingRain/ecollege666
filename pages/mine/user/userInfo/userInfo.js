const app = getApp()
Page({
  data: {
    date: '',
    nickName: '',
    genders: ['男', '女'],
    index: 0,
    email: '',
    imgSrc: '',
    token: '',
    userPic: '',
    userInfo: {},
    schoolId: '',
    searchFlag: 1,
    searchResult: [],
    hiddenFlag: 1,
    schoolName: ''
  },
  userInfo: {},

  onLoad: function (e) {
    app.init();
    let token = wx.getStorageSync("Authorization").value;
    this.setData({
      token: token
    })
    wx.request({
      url: `${app.globalData.hostName}:9002/user/findByUsername`,
      data: {
        username: wx.getStorageSync("username").value
      },
      header: {
        'content-type': 'application/json',
        'Authorization': this.data.token
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        let res = result.data.data;
        let birthday = result.data.data.birthday;
        this.userInfo = res;
        wx.request({
          url: `${app.globalData.hostName}:9004/dept/findOneById?id=${res.schoolId}`,
          data: {},
          header: {
            'content-type': 'application/json',
            'Authorization': wx.getStorageSync('Authorization').value
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: (result) => {
            this.setData({
              date: birthday,
              schoolName: result.data.data.deptName
            })
          },
          fail: () => {},
          complete: () => {}
        });
        this.setData({
          userInfo: res,
        });
      }
    });
  },
  getSchoolName(e) {
    let value = e.detail.value.trim();
    if (value.length != 0) {
      wx.request({
        url: `${app.globalData.hostName}:9004/dept/findSchoolsByDeptName?deptName=${value}`,
        data: {},
        header: {
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync('Authorization').value
        },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: (result) => {
          let searchResult = result.data.data;
          if (searchResult.length != 0) {
            this.setData({
              searchResult: searchResult,
              hiddenFlag: 0
            })
          } else {
            this.setData({
              hiddenFlag: 1
            })
            wx.showToast({
              title: '未查找到',
              image: '',
              duration: 1000,
              mask: true,
            });
          }

        },
        fail: () => {},
        complete: () => {}
      });
    }

  },
  confirmSchoolName(e) {
    let value = e.currentTarget.dataset.name;
    this.setData({
      hiddenFlag: 1
    })
    this.userInfo.schoolId = value;
    wx.request({
      url: `${app.globalData.hostName}:9004/dept/findOneById?id=${value}`,
      data: {},
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        // this.setData({
        //   school: result.data.data
        // })
        // console

        console.log(result.data.data.deptName);
        this.setData({
          schoolName: result.data.data.deptName
        })
      },
      fail: () => {},
      complete: () => {}
    });
  },
  getDate(e) {
    let value = e.detail.value;
    // console.log(value);
    this.userInfo.birthday = value;
    this.setData({
      date: value
    })
  },
  // hiddenSearch() {
  //   this.setData({
  //     searchFlag: 1
  //   })
  // },
  getGender(e) {
    let value = e.detail.value;
    this.userInfo.sex = value || this.userInfo.sex;
  },
  getUserName(e) {
    let value = e.detail.value;
    if (value.trim().length == 0) {
      wx.showToast({
        title: '昵称不能为空',
        icon: 'none',
        duration: 1500,
        mask: true,
      });
      this.setData({
        nickName: ''
      })
    } else {
      let value = e.detail.value;
      this.userInfo.nickName = value || this.userInfo.sex;
    }
  },
  choosePhoto() {
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: (result) => {
        let tempFilePaths = result.tempFilePaths;
        // console.log(result);
        wx.uploadFile({
          url: `${app.globalData.hostName}:9000/upload`,
          // `${app.globalData.hostName}:9002/user/findByUsername`
          filePath: tempFilePaths[0],
          name: 'file',
          method: 'post',
          formData: {},
          header: {
            "Content-Type": "multipart/form-data",
            'Authorization': wx.getStorageSync('Authorization').value
          },
          success: (res) => {
            let imgSrc = JSON.parse(res.data).data;
            this.userInfo.userPic = imgSrc || this.userInfo.userPic;
            this.setData({
              userInfo: this.userInfo
            })
          },
          fail: function (res) {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) {}
            })
          }
        })
      }
    });
  },
  submit() {
    wx.request({
      url: `${app.globalData.hostName}:9002/user/update`,
      data: this.userInfo,
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'put',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        let status = result.data.status;
        let msg = result.data.msg;
        if(status != 99999) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            image: '',
            duration: 1500,
            mask: true,
            success: (result)=>{
              
            },
            fail: ()=>{},
            complete: ()=>{}
          });
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
      },
    });
  }
})