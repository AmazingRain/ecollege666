const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    addressDetail: '',
    telphone: '',
    frontImg: '',
    backImg: '',
    isAgree: false,
    authStatus: '',
    authMsg: ''
  },

  submit() {
    if (this.data.name.trim().length == 0 || this.data.addressDetail.trim().length == 0 || this.data.telphone.trim().length == 0 ||
      this.data.frontImg.length == 0 || this.data.backImg.length == 0
    ) {
      wx.showToast({
        title: '以上内容不能为空',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: true,
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      });
      return;
    }
    wx.request({
      url: `${app.globalData.hostName}:9002/seller/add`,
      data: {
        addressDetail: this.data.addressDetail,
        name: this.data.name,
        telephone: this.data.telphone,
        idCardFrontPic: this.data.frontImg,
        idCardTailPic: this.data.backImg,
        userId: wx.getStorageSync('userId').value,
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'post',
      dataType: 'application/json',
      success: (res) => {
        // let result = JSON.parse(res.data);
        // console.log(res);
        wx.showToast({
          title: '认证已发送',
          icon: 'none',
          image: '',
          duration: 1000,
        });
        this.getAuth();
      },
      fail: function (res) {},
      complete: function (res) {},
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAuth();
  },
  onShow: function() {
    this.getAuth();
  },

  getAuth() {
    wx.request({
      url: `${app.globalData.hostName}:9002/seller/findById?id=` + wx.getStorageSync('userId').value,
      data: {},
      header: {
        'content-type': 'multipart/form-data"',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log(result.data);
        if(result.data.status == 200) {
          this.setData({
            name: result.data.data.name,
            addressDetail: result.data.data.addressDetail,
            telphone: result.data.data.telephone,
            frontImg: result.data.data.idCardFrontPic,
            backImg: result.data.data.idCardTailPic,
            authStatus: result.data.data.status
          })
          if (result.data.data.status == '1') {
            this.setData({
              authMsg: '已完成商家认证'
            })
          } else if (result.data.data.status == '2') {
            this.setData({
              authMsg: '审核不通过，请联系管理员！'
            })
          } else if (result.data.data.status == '0') {
            this.setData({
              authMsg: '审核中请耐心等待~~'
            })
          }
          
        } 

       
      },
      fail: () => {},
      complete: () => {}
    });
  },
  PreImg: function (e) {
    var img = this.data.imgPath;
    // 设置预览图片路径
    wx.previewImage({
      current: img,
      urls: [img]
    })
  },

  selectImg: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: `${app.globalData.hostName}:9000/upload`,
          //后台文件上传接口
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'multipart/form-data"',
            'Authorization': wx.getStorageSync('Authorization').value
          },
          formData: {},
          success: (res) => {
            let img = JSON.parse(res.data).data
            console.log(img)
            this.setData({
              frontImg: img
            })
          },
          fail: function (res) {},
          complete: function (res) {},
        })
      }
    })
  },

  PreImg1: function (e) {
    var img = this.data.fontImg;
    // 设置预览图片路径
    wx.previewImage({
      current: img,
      urls: [img]
    })
  },

  selectImg1: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: `${app.globalData.hostName}:9000/upload`,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'multipart/form-data"',
            'Authorization': wx.getStorageSync('Authorization').value
          },
          formData: {},
          success: (res) => {
            let img = JSON.parse(res.data).data
            this.setData({
              backImg: img
            })
          },
          fail: function (res) {},
          complete: function (res) {},
        })

      }
    })
  },
  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  getAddressDetail(e) {
    this.setData({
      addressDetail: e.detail.value
    })
  },
  getTelphone(e) {
    this.setData({
      telphone: e.detail.value
    })
  }

})