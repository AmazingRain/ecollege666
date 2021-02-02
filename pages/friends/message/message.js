// pages/friends/message/message.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId1: '1',
    userId2: '2',
    messages: []
  },
  messages: [],
  userPic: {},
 
  onLoad: function (options) {
    // let userId2 = options.userId;
    let userId2 = 2;
    this.setData({
      userId2
    });
    this.requestFriendsInfo(this.data.userId1);
    this.requestFriendsInfo(userId2);
    this.requestMessage();
  },
  requestFriendsInfo(userId) {
   
  },
  requestMessage() {
    wx.request({
      url: `${app.globalData.hostName}:9012/message/findAllMessage?userId1=${this.data.userId1}&userId2=${this.data.userId2}`,
      // url: 'http://localhost:3000/comment',
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
        res.forEach((ele, index) => {
          wx.request({
            url: `${app.globalData.hostName}:9002/user/findById?id=${ele.fromUid}`,
            data: {},
            header: {
              'content-type':'application/json',
              'Authorization': wx.getStorageSync('Authorization').value
            },
            method: 'GET',
            dataType: 'json',
            responseType: 'text',
            success: (result)=>{
              let pic = result.data.data.userPic;
              let tempClass = wx.getStorageSync('userId').value == ele.fromUid ? 'item item_right' : 'item';
              console.log(tempClass);
              this.messages[index] = {
                'createTime': this.handleDate(ele.createTime),
                'content': ele.content,
                'userPic': pic,
                'class': tempClass
              }
              this.setData({
                messages: this.messages
              })
            }
          });
        });
       
      }
    });
  },
  handleDate(date) {
    let d = new Date(date);
    let month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
    let hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    let min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    let sec = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
  
    let times = month + '-' + day + ' ' + hours + ':' + min;
  
    return times
  },
  // 2020-03-27T08:33:30.000+0000
  sendMessage() {
    wx.request({
      url: `${app.globalData.hostName}:9009/message/add`,
      data: {
        "content": "string",
        "createTime": "2020-04-20T08:10:34.767Z",
        "fromUid": this.data.userId1,
        "toUid": this.data.userId2
      },
      header: {
        'content-type':'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log(result)
      }
    });
  }

  
})