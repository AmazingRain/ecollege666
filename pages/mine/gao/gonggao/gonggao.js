const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gonggao:[],
    createTime: []
  },
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gonggao();
  },

  gonggao(){
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
        // console.log(res.data.data)
        let result = res.data.data;
        let reverseResutl = result.reverse();
        // console.
        this.setData({
          gonggao: reverseResutl
        })
       
      }
    })
   
  },

  click(options){
    console.log(options);
    let id = options.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: `../gao-xinxi/gao-xinxi?id=${id}`
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var pageNum = this.data.pageNum;
    if (this.data.pageNum >= this.totalPages) {
      console.log("没有数据了");
      wx.showToast({
        title: '没有下一页数据了',
      })
    } else {
      console.log("还有数据");
      pageNum++;
      this.setData({
        pageNum: pageNum
      })
      // this.data.pageNum += 1;
      this.gonggao();
      console.log(this.data.pageNum);
    }
  },
})