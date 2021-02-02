const app = getApp();
Page({

  data: {
    friendsList: []
  },
  friendsList: [],
  onLoad: function (options) {
    this.requestFriensd();
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
  requestFriensd() {
    let userId = wx.getStorageSync('userId').value;
    wx.request({
      url: `${app.globalData.hostName}:9008/friends/findFriendsId?id=${userId}`,
      header: {
        'content-type':'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'get',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        let friendsArr = result.data.data;
        friendsArr.forEach((ele, index) => {
          wx.request({
            url: `${app.globalData.hostName}:9002/user/findById?id=${ele}`,
            data: {},
            header: {
              'content-type':'application/json',
              'Authorization': wx.getStorageSync('Authorization').value
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (result)=>{
              this.friendsList[index] = {
                'id': ele,
                'userPic': result.data.data.userPic || 'http://localhost:3000/img/touxiang.jpg',
                'nickName': result.data.data.nickName || '隐藏用户'
              }
              this.setData({
                friendsList: this.friendsList
              })
            },
            fail: ()=>{},
            complete: ()=>{}
          });
        });
      },
    });
  },
  jumpMessage(e) {
    let {index} = e.currentTarget.dataset;
    let userId = this.data.friendsList[index].id;
    wx.navigateTo({
      url: `/pages/friends/message/message?userId=${userId}`
    });
  }
  
})