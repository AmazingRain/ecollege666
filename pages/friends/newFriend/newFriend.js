// pages/friends/newFriend/newFriend.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news: [],
    userInfo: [],
    agreeFlag: 1,
    refuseFlag: 1,
    isShow: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNews();
  },
  getNews() {
    wx.request({
      url: `${app.globalData.hostName}:9008/friends/search?pageNum=1&pageSize=5`,
      data: {
        "acceptUserId": 3,
        "status": "0"
      },
      header: {
        'content-type':'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        let  res = result.data.data.rows;
        let news = [];
        res.forEach((ele, index) => {
          let applyUserId = ele.applyUserId;
          wx.request({
            url: `${app.globalData.hostName}:9002/user/findById?id=${applyUserId}`,
            data: {},
            header: {
              'content-type':'application/json',
              'Authorization': wx.getStorageSync('Authorization').value
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (result)=>{
              let res = result.data.data;
              console.log(res);
              news[index] = {
                'nickName': res.nickName,
                'userPic': res.userPic,
                'id': ele.id
              };
              this.setData({
                news: news
              })
            },
            fail: ()=>{},
            complete: ()=>{}
          });
          // news[index] = {
          //   ''
          // }
        });
        console.log(res);
        this.setData({
          news: res
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  agree(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      isShow: 1,
      agreeFlag: 0
    })
    wx.request({
      url: `${app.globalData.hostName}:9008/friends/updateStatus?id=${id}&status=1`,
      data: {},
      header: {
        'content-type':'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'put',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        this.setData({
          isShow: 1,
          agreeFlag: 0
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  refuse(e) {
    let id = e.currentTarget.dataset.id;
    wx.request({
      url: `${app.globalData.hostName}:9008/friends/deleteIds?ids=${id}`,
      header: {
        'content-type':'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'delete',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        this.setData({
          isShow: 1,
          refuseFlag: 0
        })
       
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})