// pages/friends/friends_home/friends_home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news: [],
    messages: [],
    userId1: wx.getStorageSync('userId').value
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.requestFriensd();
    app.init()
    let authorization = wx.getStorageSync('Authorization').value;
    if(authorization) {
      this.findAllFriendsByUserId();
    }
    
  },
  requestFriensd() {
    wx.request({
      // url: `${app.globalData.hostName}:9008/friends/findOneById?id=${this.data.userId1}`,
      url: `${app.globalData.hostName}:9008/friends/findFriendsId?id=${this.data.userId1}`,
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'get',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        let friendsArr = result.data.data;
        // console.log(friendsArr);
        console.log(result)
        friendsArr.forEach((ele, index) => {
          this.requestMessage(ele, index);
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
              this.friendsList[index] = {
                'id': ele,
                'userPic': result.data.data.userPic || 'http://localhost:3000/img/touxiang.jpg',
                'nickName': result.data.data.nickName || '隐藏用户'
              }
              console.log(this.friendsList);
              this.setData({
                friendsList: this.friendsList
              })
            },
            fail: () => { },
            complete: () => { }
          });
        });
      },
    });
  },
  findAllFriendsByUserId() {
    let userId = wx.getStorageSync('userId').value;
    wx.request({
      url: `${app.globalData.hostName}:9008/friends/findFriendsId?id=${userId}`,
      data: {},
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        let res = result.data.data;
        res.forEach((ele, index) => {
          this.requestMessage(ele, index);
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  messages: [],
  requestMessage(userId2, index) {
    wx.request({
      url: `${app.globalData.hostName}:9012/message/findAllMessage?userId1=${this.data.userId1}&userId2=${userId2}`,
      data: {},
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        let messages = result.data.data;
        wx.request({
          url: `${app.globalData.hostName}:9002/user/findById?id=${userId2}`,
          data: {},
          header: {
            'content-type': 'application/json',
            'Authorization': wx.getStorageSync('Authorization').value
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: (result)=>{
            let res = result.data.data;
            if(messages.length != 0) {
              // this.messages[index] = messages[messages.length-1].content;
              this.messages[index] = {
                'nickName': res.nickName,
                'userPic': res.userPic,
                'content': messages[messages.length-1].content
              }
            }
            this.setData({
              messages: this.messages              
            })
          }
        });
        
      },
      fail: () => { },
      complete: () => { }
    });
  },
  
  jumpFriends() {
    wx.navigateTo({
      url: '/pages/friends/friends_info/friends_info',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  jumpAddFriends() {
    wx.navigateTo({
      url: '/pages/friends/addFriends/addFriends',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  jumpNews() {
    wx.navigateTo({
      url: '/pages/friends/newFriend/newFriend',
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
})