const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: [
      {
        id: 0,
        name: "跳蚤市场",
        cla:"iconfont iconxiazai50",
        color:"#ee2",
        isActive: true
      },
      {
        id: 1,
        name: "垃圾分类",
        cla: "iconfont iconhuishou",
        color: "#1AFA29",
        isActive: false
      }
    ],
    navState: 0,
    userData: [],
    pageSize: 4,
    pageNum: 1,
    goodsName: '',
    flag:0,
    refuseName: '',
    searchRufuse: [],
    refuseType: ['可回收垃圾', '其他垃圾', '厨余垃圾', '有害垃圾']
  },
  handleItemChange(e){
    const {index}=e.detail;
    let { tab } = this.data;
    tab.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tab
    })
  }, 
  //总页数
  totalPages: 1,
  userData: [],
  /*点击导航*/
  navSwitch: function (e) {
    // console.log(e.currentTarget.dataset.index)
    let index = e.currentTarget.dataset.index;
    this.setData({
      navState: index
    })
  },

  getSearchGoodsName(e) {
    let value = e.detail.value;
    let flag = e.currentTarget.dataset.flag;
    console.log(flag);
    this.setData({
      goodsName: value,
    })
    this.getGoods(flag);
  },
  addGoods() {
    this.isGetAuth();
    // wx.navigateTo({
    //   url: '/pages/life/submit/submit',
    // });
  },
  getGoods(flag) {
   
    if(flag == 1) {
      this.setData({
        userData:[],
        pageNum:1
      })
    }
    wx.request({
      url: `${app.globalData.hostName}:9005/goods/search?pageNum=${this.data.pageNum}&pageSize=4`,
      data: {
        goodsName: this.data.goodsName
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'post',
      responseType: 'text',
      success: (res) => {
        this.userData = res.data.data.total;
        var temp = this.data.userData;
        // let temp = this.userData;
        this.totalPages = Math.ceil(res.data.data.total / this.data.pageSize);
        temp = [...temp, ...res.data.data.rows];
        this.setData({
          total: res.data.data.total,
          userData: temp
        });
        if (this.data.userData.length == 0) {
          wx.showToast({
            title: '暂无相关商品'
          })
        }
        // console.log(res.data);
      },
      fail: (res) => {
        this.userData = "获取数据失败";
      },
    })
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    app.init();
    let authorization = wx.getStorageSync('Authorization').value;
    if(authorization) {
      this.getGoods(0);
    }
  },
  isGetAuth() {
    wx.request({
      url: `${app.globalData.hostName}:9002/seller/findById?id=` + wx.getStorageSync('userId').value,
      data: {},
      header: {
        'content-type': 'multipart/form-data"',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        // console.log(result.data)
        if(result.data.data == null) {
          wx.showModal({
            title: '',
            content: '未完成商家认证，请前往认证',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '前往认证',
            confirmColor: '#3CC51F',
            success: (result) => {
              if(result.confirm){
                wx.navigateTo({
                  url: '/pages/mine/renzheng/renzheng',
                  success: (result)=>{
                    
                  },
                  fail: ()=>{},
                  complete: ()=>{}
                });
              }
            },
            fail: ()=>{},
            complete: ()=>{}
          });
          return;
        } 
        wx.navigateTo({
          url: '/pages/life/submit/submit',
          success: (result)=>{
            
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      },
      fail: () => {},
      complete: () => {}
    });
  },
  compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    }
  },
  sortMoney() {
    let tempGoods = this.data.userData.sort(this.compare('price'));
    this.setData({
      userData: tempGoods
    })
  },
  refresh(){
    this.setData({
      userData: [],
      goodsName: "",
      pageNum: 1
    }),
    this.getGoods();
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
      this.getGoods();
      // console.log(this.data.pageNum);
    }
  },
  getRefuseName(e) {
    let value = e.detail.value;
    let flag;
    this.setData({
      refuseName: value
    })
    console.log(value);
    if (value.trim() != "") {
      // this.data.flag = 1;
      flag = 1;
      this.searchRefuseName();
      this.setData({
        searchResult: []
      })
    }else{
      flag = 0;
    };
    this.setData({
      flag: flag
    });
  },

  searchRefuseName() {
    this.setData({
      searchResult: []
    })
    wx.request({
      url: `${app.globalData.hostName}:9007/refuse/search?pageNum=1&pageSize=5`,
      data: {
        name: this.data.refuseName
      },
      method: 'post',
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      success: (res) => {
        let searchResult = res.data.data.rows;
        this.setData({
          searchRufuse: searchResult
        });
        if (this.data.searchRufuse.length == 0) {
          wx.showToast({
            title: '暂无该垃圾分类'
          })
        }
      },
    })
  },
  jumpTrash(e) {
    let value = e.currentTarget.dataset.id;
    console.log(e)
    wx.navigateTo({
      url: `../trash_detail/trash-detail?id=${value}`,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
})