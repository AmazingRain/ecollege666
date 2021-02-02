const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    cate: [],
    index: 0,
    inputTyping1: '',
    inputTyping4: '',
    content: '',
    imgPath:'',
    imgPath1: '',
    imgPath2:''

  },
  getContent(e) {
    this.setData({
      content: e.detail.value
    })
  },
  submit() {
    if(this.data.inputTyping1.trim().length == 0 || this.data.content.trim().length ==0 
    || this.data.content.trim().length == 0 || this.data.imgPath.length == 0 || this.data.imgPath1.length == 0
    || this.data.imgPath2.length == 0
    ) {
      wx.showToast({
        title: '以上内容不能为空',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: true,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
      return ;
    }
    wx.request({
      url: `${app.globalData.hostName}:9005/goods/add`,
      data: {
          categoryId: this.data.cate[this.data.index].id,
          content: this.data.content,
          goodsName: this.data.inputTyping1,
          price: this.data.inputTyping4,
          userId: wx.getStorageSync('userId').value,
          thumPic: this.data.imgPath,
          mainPic: this.data.imgPath1,
          longPic: this.data.imgPath2
        },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'post',
      dataType: 'application/json',
      success: (res)=>  {
        let result = JSON.parse(res.data);
        wx.navigateTo({
          url: `../success/success?id=${result.data.id}&categoryId=${result.data.categoryId}&userId=${result.data.userId}`
        })
        // console.log(result.msg);
        // if(result.status == 403) {
        //   wx.showModal({
        //     title: '未完成商家认证，请前往 我的->实名认证',
        //     content: '',
        //     showCancel: true,
        //     cancelText: '取消',
        //     cancelColor: '#000000',
        //     confirmText: '确定',
        //     confirmColor: '#3CC51F',
        //     success: (result) => {
        //       if(result.confirm){
                
        //       }
        //     },
        //     fail: ()=>{},
        //     complete: ()=>{}
        //   });
         
        // } else {
        //   wx.navigateTo({
        //     url: `../success/success?id=${result.data.id}&categoryId=${result.data.categoryId}&userId=${result.data.userId}`
        //   })
          
        // }
      },
      fail: function (res) {},
      complete: function (res) {},
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodsType();
  },
  getGoodsType() {
    wx.request({
      url: `${app.globalData.hostName}:9005/goods/category/findAll`,
      data: {},
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        let cate = result.data.data;
        let arr = [];
        cate.forEach((ele, index) => {
          arr[index] = ele.categoryName;
        })
        this.setData({
          cate: cate,
          array: arr
        })     
      },
      fail: ()=>{},
      complete: ()=>{}
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
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        //res.tempFilePaths 返回图片本地文件路径列表
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
          success: (res) =>{
            let img = JSON.parse(res.data).data
            that.setData({
              imgPath: img
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
        
      }
    })
  },

  PreImg1: function (e) {
    var img = this.data.imgPath1;
    // 设置预览图片路径
    wx.previewImage({
      current: img,
      urls: [img]
    })
  },

  selectImg1: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        //res.tempFilePaths 返回图片本地文件路径列表
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
          success: (res) =>{
            let img = JSON.parse(res.data).data
            that.setData({
              imgPath1: img
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
        
      }
    })
  },

  PreImg2: function (e) {
    var img = this.data.imgPath2;
    // 设置预览图片路径
    wx.previewImage({
      current: img,
      urls: [img]
    })
  },

  selectImg2: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        //res.tempFilePaths 返回图片本地文件路径列表
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
          success: (res) =>{
            let img = JSON.parse(res.data).data
            that.setData({
              imgPath2: img
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    })
  },
  inputTyping1:function(e){
    this.setData({
      inputTyping1: e.detail.value
    })
    // console.log(this.data.inputTyping1);
  },
  bindPickerChange: function (e) {
    // console.log(e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  
  inputTyping4: function (e) {
    // console.log('4' +e.detail.value);
    this.setData({
      inputTyping4:e.detail.value,
    })
  }
})