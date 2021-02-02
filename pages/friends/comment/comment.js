// pages/life/liuyan/liuyan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comments: [],
    replyComments: [],
    replyList: [],
    isOpen: 0,
    fromIdImgs: [],
    replyIdImgs: [],
    commentValue: '',
    topicId: '',
    topicType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let topicId = 47, topicType = 1;
    this.setData({
      topicId: topicId,
      topicType: topicType
    })
    wx.request({
      url: `${app.globalData.hostName}:9006/comment/findAllCommentByTopicTypeAndTopicId`,
      data: {
        topicType: this.data.topicType,
        topicId: this.data.topicId
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        let resultEntityMap = res.data.data;
        let comments = [];
        let replyComments = [];
        let fromIds = [], fromIdImgs = [];
        Object.keys(resultEntityMap).forEach((ele, index) => {
          let eleObj = JSON.parse(ele)
          eleObj.createTime = this.handleCreateTime(eleObj.createTime);
          fromIds[index] = eleObj.fromUid;
          comments[index] = eleObj;
        })
        let replyList = Object.values(resultEntityMap);
        let replyIds = [], replyIdImgs = [];
        replyList.forEach((ele, index) => {
          ele.forEach((e, i) => {
            e.createTime = e.createTime.substr(0, 16);
            replyComments[index] = e;
            replyIds[index] = e.fromUid;
          })
        })
        fromIds.forEach((ele, index) => {
          wx.request({
            url: `${app.globalData.hostName}:9002/user/findById?id=${ele}`,
            data: {},
            header: {
              'content-type': 'application/json',
              'Authorization': wx.getStorageSync('Authorization').value
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (result)=>{
              let img = result.data.data.userPic || 'http://localhost:3000/img/touxiang.jpg';
              fromIdImgs[index] = img;
              this.setData({
                fromIdImgs: fromIdImgs
              })
            },
            fail: ()=>{},
            complete: ()=>{}
          });
        })
        replyIds.forEach((ele, index) => {
          wx.request({
            url: `${app.globalData.hostName}:9002/user/findById?id=${ele}`,
            data: {},
            header: {
              'content-type': 'application/json',
              'Authorization': wx.getStorageSync('Authorization').value
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (result)=>{
              let img = result.data.data.userPic || 'http://localhost:3000/img/touxiang.jpg';
              replyIdImgs[index] = img;
              this.setData({
                replyIdImgs: replyIdImgs
              })
            },
            fail: ()=>{},
            complete: ()=>{}
          });
        })
        this.setData({
          comments: comments,
          replyList: replyList,
        })
      },
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  handleCreateTime(timestamp) {
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var arr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var week = date.getDay();
    var h = date.getHours();
    h = h < 10 ? '0' + h : h;
    var m = date.getMinutes();
    m = m < 10 ? '0' + m : m;
    var s = date.getSeconds();
    s = s < 10 ? '0' + s : s;
    let time = `${year}-${month}-${day}   ${h}:${m}`;
    // console.log(time);
    return time;
  },
  isOpen() {
    let flag = this.data.isOpen;
    this.setData({
      isOpen: !flag
    })
  },
  sendTopicComment() {
    wx.request({
      url: `${app.globalData.hostName}:9006/comment/reply/add`,
      data: {
        "content": this.data.commentValue,
        "fromUid": 0,
        "topicId": this.data.topicId,
        "topicType": this.data.topicType
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        wx.request({
          url: `${app.globalData.hostName}:9006/comment/findAllCommentByTopicTypeAndTopicId`,
          data: '',
          header: {
            'content-type': 'application/json',
            'Authorization': wx.getStorageSync('Authorization').value
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: function (res) {},
          fail: function (res) {},
          complete: function (res) {},
        })
      },
      fail: function (res) {},
      complete: function (res) {},
    })
  },
  getCommentValue(e) {
    let value = e.detail.value;
    console.log(value);
    this.setData({
      commentValue: value
    })
  },
  sendReplyComment() {
    wx.request({
      url: `${app.globalData.hostName}:9006/comment/add`,
      data: {
          "content": this.data.commentValue,
          "createTime": '',
          "fromUid": 0,
          "isHot": "string",
          "isTop": "string",
          "likeNum": 0,
          "nickName": "string",
          "replyNum": 0,
          "status": "string",
          "thumbImg": "",
          "topicId": this.data.topicId,
          "topicType": this.data.topicType
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
  
})