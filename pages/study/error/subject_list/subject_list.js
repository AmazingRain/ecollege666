const app = getApp();

Page({

  data: {
    courses: [],
    requestData: [],
    total: 0
  },
  pageNum: 1,
  pageSize: 3,
  skip(options) {
    var {id} = options.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/study/error/question_list/question_list?id=${id}`,
      success: (result)=>{
      }
    });
  },

  onLoad: function (options) {
    
    app.init();
    let authorization = wx.getStorageSync('Authorization').value;
    if(authorization) {
      this.requestData();
    }
    
  },
  requestData() {
    wx.request({
      url: `${app.globalData.hostName}:9001/question/category/search?pageNum=1&pageSize=${this.pageSize}`,
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'post',
      data: {
        tbQuestionCategory: {
  
        }
      },
      success: (res) => {
        this.setData({
          courses: res.data.data.rows,
          total: res.data.data.total
        })
      }
    })
  },
  onReachBottom: function () {
    // console.log('到底部了');
    console.log(this.data.total)
    if(this.pageSize > this.data.total) {
      wx.showToast({
        title: '亲，没有数据了',
        icon: 'none',
        image: '',
        duration: 1000,
        mask: true,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
    this.pageSize = this.pageSize + 3;
    if(this.pageNum <= this.data.total) {
      this.requestData();
    } else {
      this.pageSize = this.data.total;
      this.requestData();
      wx.showToast({
        title: '没有数据了',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        success: (result)=>{
          
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
    console.log(this.pageSize, this.data.total);
    
    console.log(this.pageSize)
  }
  
})