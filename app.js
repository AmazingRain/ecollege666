App({
  /*
 *创建缓存
 * @param e 缓存名称
 * @param t 缓存值
 * @param i 缓存时间 s
 */
  setCache(e, t, i) {
    var n = +new Date / 1000,
      a = true,
      o = {
        expire: i ? n + parseInt(i) : 0,
        value: t
      };
    try {
      wx.setStorageSync(e, o)
    } catch (e) {
      a = false
    }
    return a
  },
  /*
   *获取缓存
   * @param e 缓存名称
   * @param t 缓存值
   */
  getCache(e, t) {
    var i = +new Date / 1000,
      n = "";
    i = parseInt(i);
    try {
      n = wx.getStorageSync(e), n.expire > i || 0 == n.expire ? n = n.value : (n = "", this.removeCache(e))
    } catch (e) {
      n = void 0 === t ? "" : t
    }
    return n = n || ""
  },
  /*
   *清除缓存
   * @param e 缓存名称
   */
  removeCache(e) {
    var t = true;
    try {
      wx.removeStorageSync(e)
    } catch (e) {
      t = false
    }
    return t
  },
  init() {
    let token = wx.getStorageSync("Authorization").value;
    let username = wx.getStorageSync("username").value;

    if (typeof (username) == 'undefined' || username == null || username == ''
      || typeof (token) == 'undefined' || token == null || token == '') {

      wx.showToast({
        title: '请登录',
        success: () => {
          let timer = setTimeout(() => {
            wx.reLaunch({
              url: '/pages/mine/user/login_home/login_home',
            })
          }, 1500);
        }
      })
    }
  },
  initError(){
    this.removeCache("username");
    this.removeCache("Authorization");
    wx.navigateTo({
      url: '/pages/mine/user/login_home/login_home',
    })
  },
  globalData: {
    hostName: 'https://www.ecollege.top'
  }
 
})