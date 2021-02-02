const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    flag: 1
  },

  jumpAnwer() {
    wx.navigateTo({
      url: '/pages/study/answer/subject_list/subject_list',
    });
  },
  jumpError() {
    wx.navigateTo({
      url: '/pages/study/error/subject_list/subject_list',
    });
  },
  jumpRank() {
    wx.navigateTo({
      url: '/pages/study/ranking_list/ranking_list',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let authorization = wx.getStorageSync('Authorization').value;
    if(authorization) {
      wx.request({
        url: `${app.globalData.hostName}:9011/notice/findAll`,
        data: {},
        header: {
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync('Authorization').value
        },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: (res) => {
          let result = res.data.data;
          if(result.length != 0) {
            this.setData({
              content:res.data.data[res.data.data.length-1].content,
              flag: 0
            })
          } else {
            this.setData({
              flag: 1
            })
          }
         
        }
      })
    }
    
  },
  chaxun() {
    wx.showToast({
      title: '开发中···',
      image: '',
      duration: 1000,
      mask: true,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
  
})