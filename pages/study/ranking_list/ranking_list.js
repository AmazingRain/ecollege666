// pages/study/ranking_list/ranking_list.js
const app = getApp();
Page({

  data: {
    userData: [],
    styles: ['con_col iconfont iconlevel1', 'con_col iconfont iconlevel2', 'con_col iconfont iconlevel3'],
    reqData: [],
    selfData: {}
  },
  /**
   * 
   * 请求排榜中的数据
   *
   *  */
  requestData() {
    wx.request({
      url: `${app.globalData.hostName}:9001/question/rank/GetScoreRank?start=1&size=50`,
      header: {
        'content-type': 'application/json',
        // 缓存中读取认证信息 Authorization
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'GET',
      success: (result) => {
        let res = result.data.data,
            keys = [],
            values = [];
        res.forEach((ele, index) => {
          keys[index] = Object.keys(ele)[0];
          values[index] = Object.values(ele)[0];
        });
        let scores = [],
            correctRates = [],
            nickName = [],
            userId = [];
        values.forEach((ele, index) => {
          correctRates[index] = ele.correctRate.toFixed(2) * 100 + '%';
          scores[index] = ele.score.toFixed(1);
        })
        keys.forEach((ele, index) => {
          nickName[index] = JSON.parse(ele).nickName != undefined ? JSON.parse(ele).nickName : '隐藏用户';
          userId[index] = JSON.parse(ele).id;
        })
        let userData = [];
        for (var i = 0; i < scores.length; i++) {
          userData[i] = {
            'score': scores[i],
            'correctRate': correctRates[i],
            'nickName': nickName[i]
          }
        }
        this.setData({
          userData
        })
      }
    });
  },

  onLoad: function (options) {
    app.init();
    let authorization = wx.getStorageSync('Authorization').value;
    if (authorization) {
      this.requestData();
    }
  },

  onReachBottom: function () {
    if (this.size <= 100) {
      this.size = this.size + 10;
      this.requestData();
    } else {
      wx.showToast({
        title: '只显示前100名',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: true,
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})