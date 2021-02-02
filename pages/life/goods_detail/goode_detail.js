const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    name: [],
    cate: [],
    createTime: [],
    comments: [],
    replyComments: [],
    replyList: [],
    isOpen: 0,
    fromIdImgs: [],
    replyIdImgs: [],
    commentValue: '',
    topicId: '',
    topicType: 1,
    commentEntity: {},
    replyEntity: {},
    flagId: '',
    tipStr: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
    // let id = options.id;
    console.log(options);
    console.log(options.id);
    this.setData({
      topicId: options.id,
    })
    wx.request({
      url: `${app.globalData.hostName}:9005/goods/findOneById?id=${options.id}`,
      data: {},
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'get',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        var createTime = res.data.data.createTime.substring(0, 10);
        this.setData({
          goods: res.data.data,
          createTime: createTime
        })
      },
      fail: function (res) {},
      complete: function (res) {},
    })
    wx.request({
      url: `${app.globalData.hostName}:9002/user/findById`,
      data: {
        id: options.userId
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'get',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        this.setData({
          name: res.data.data
        })
      },
      fail: function (res) {},
      complete: function (res) {},
    })
    wx.request({
      url: `${app.globalData.hostName}:9005/goods/category/findOneById`,
      data: {
        id: options.categoryId
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        this.setData({
          cate: res.data.data
        })
      },
      fail: function (res) {},
      complete: function (res) {},
    })

    this.getAllTopicComment();
  },
  getAllTopicComment() {
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
        let fromIds = [],
          fromIdImgs = [];
        Object.keys(resultEntityMap).forEach((ele, index) => {
          let eleObj = JSON.parse(ele)
          comments[index] = eleObj;
        })
        let replyList = Object.values(resultEntityMap);
        let replyIds = [],
          replyIdImgs = [];
        replyList.forEach((ele, index) => {
          ele.forEach((e, i) => {
            e.createTime = e.createTime.substr(0, 16);
            replyComments[index] = e;
            replyIds[index] = e.fromUid;
          })
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
            success: (result) => {
              let img = result.data.data.userPic || 'http://localhost:3000/img/touxiang.jpg';
              replyIdImgs[index] = img;
              this.setData({
                replyIdImgs: replyIdImgs
              })
            },
            fail: () => {},
            complete: () => {}
          });
        })




        // let sortDown = comments.sort(compare('createTime'));
        comments.forEach((ele, index) => {
          ele.createTime = this.handleCreateTime(ele.createTime);
          comments[index] = ele;
          fromIds[index] = ele.fromUid;
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
            success: (result) => {
              let img = result.data.data.userPic || 'http://localhost:3000/img/touxiang.jpg';
              fromIdImgs[index] = img;
              this.setData({
                fromIdImgs: fromIdImgs
              })
            },
            fail: () => {},
            complete: () => {}
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
    let time = `${year}-${month}-${day}  ${h}:${m}`;
    return time;
  },
  isOpen(e) {
    let flag = this.data.isOpen;
    let index1 = e.currentTarget.dataset.id;
    this.setData({
      isOpen: !flag,
      clickIndex: index1
    })
  },
  getTopicCommentValue(e) {
    let value = e.detail.value;
    this.setData({
      commentValue: value
    })
  },

  sendTopicComment() {
    if ((this.data.commentEntity == null || this.data.commentEntity.id == undefined) && (this.data.replyEntity == null || this.data.replyEntity.id == null)) {
      console.log("评论");
      wx.request({
        url: `${app.globalData.hostName}:9006/comment/add`,
        data: {
          "content": this.data.commentValue,
          "fromUid": wx.getStorageSync("userId").value,
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
        success: (result) => {
          // this.onLoad();
          this.getAllTopicComment();
        },
        fail: () => {},
        complete: () => {}
      });

    } else if (this.data.commentEntity != null && this.data.commentEntity.id != null) {
      wx.request({
        url: `${app.globalData.hostName}:9006/comment/reply/add`,
        data: {
          "content": this.data.commentValue,
          "fromUid": wx.getStorageSync("userId").value,
          "toUid": this.data.commentEntity.fromUid,
          "replyType": 1,
          "commentId": this.data.commentEntity.id
        },
        header: {
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync('Authorization').value
        },
        method: 'post',
        dataType: 'json',
        responseType: 'text',
        success: (result) => {
          // this.onLoad();
          this.getAllTopicComment();
        },
        fail: () => {},
        complete: () => {}
      });
    } else {
      wx.request({
        url: `${app.globalData.hostName}:9006/comment/reply/add`,
        data: {
          "content": this.data.commentValue,
          "fromUid": wx.getStorageSync("userId").value,
          "toUid": this.data.replyEntity.fromUid,
          "replyType": 2,
          "replyId": this.data.replyEntity.id,
          "commentId": this.data.replyEntity.commentId
        },
        header: {
          'content-type': 'application/json',
          'Authorization': wx.getStorageSync('Authorization').value
        },
        method: 'post',
        dataType: 'json',
        responseType: 'text',
        success: (result) => {
          // this.onLoad();
          this.getAllTopicComment();
        },
        fail: () => {},
        complete: () => {}
      });
    }
    this.setData({
      commentValue: ''
    })
  },
  findCommentById(e) {

    let id = e.currentTarget.dataset.id
    wx.request({
      url: `${app.globalData.hostName}:9006/comment/findOneById?id=` + id,
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      success: (res) => {
        this.setData({
          commentEntity: res.data.data,
          replyEntity: {},
          tipStr: '@' + res.data.data.nickName
        })
      }
    })
  },

  findCommentReplyById(e) {
    console.log("findCommentReplyById");
    let id = e.currentTarget.dataset.id
    wx.request({
      url: `${app.globalData.hostName}:9006/comment/reply/findOneById?id=` + id,
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      success: (res) => {
        this.setData({
          replyEntity: res.data.data,
          commentEntity: {},
          tipStr: '@' + res.data.data.fromNickName
        })
      }
    })
  },
  changeType() {
    console.log("changeType");
    this.setData({
      replyEntity: {},
      commentEntity: {},
      tipStr: '发表评论'
    })
  },


  onUnload: function () {

  },
})