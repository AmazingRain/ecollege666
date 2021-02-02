// pages/friends/addFriends/addFriends.js
const app =  getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    searchResult: [],
    idArr: [],
    userId1: wx.getStorageSync('userId').value,
    flag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getSearchCon(e) {
    let key = e.detail.value;
    this.setData({
      nickName: key
    })
    console.log(key.trim().length);
    if(key.trim().length != 0) {
      this.searchFriends();
    } else {
      this.setData({
        searchResult: []
      })
    }
  },
  searchFriends() {
    wx.request({
      url: `${app.globalData.hostName}:9002/user/search?pageNum=1&pageSize=10`,
      data: {
        nickName: this.data.nickName
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        let {rows:friends} = result.data.data;
        // console.log(friends);
        friends.forEach(ele => {
          this.isFriends(ele.id);
        });
        
        this.setData({
          searchResult: friends
        })
      },
      fail: () => {},
      complete: () => {}
    });
  },


  isFriends(userId2){
    wx.request({
      url: `${app.globalData.hostName}:9008/friends/isFriends?userId1=${this.data.userId1}&userId2=`+userId2,
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'get',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        let flag = result.data.data;
        console.log(flag)
        this.setData({
          flag: flag
        })
      }, 
      fail: () => {},
      complete: () => {}
    });

  },
  addFriends(e) {
    let userId2 = e.currentTarget.dataset.id;
    console.log(e);
    wx.request({
      url: `${app.globalData.hostName}:9008/friends/add`,
      data: {
        "acceptUserId": userId2,
        "applyUserId": wx.getStorageSync('userId').value,
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        let msg = result.data.msg;
        let status = result.data.status;
        if(status == 200) {
          wx.showToast({
            title: '添加好友请求已发送',
            icon: 'none',
            image: '',
            duration: 500,
            mask: true,
          });
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
            image: '',
            duration: 500,
            mask: true,
          });
        }
       
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  onLoad: function (options) {
    
  }

 
})