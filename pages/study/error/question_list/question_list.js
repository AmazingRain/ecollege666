const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    subjectType: '',
    total: 0,
    errList: [],
    index: 0,
    up: false,
    down: false
  },
  pagesize: 5,
 

  onLoad: function (options) {
    this.setData({
      subjectType: options.id
    })
    this.questions();
  },

  errList: [],
  questions() {
    this.setData({
      errList: []
    })
    wx.request({
      url: `${app.globalData.hostName}:9001/question/answer/search?pageNum=1&pageSize=${this.pagesize}`,
      data: {
        "isRight": 0,
        "questionCategoryId": this.data.subjectType,
        "userId": wx.getStorageSync('userId').value
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        let {total, rows} = res.data.data;
        let questionIds = [], userAnswers = [], questionsInfp;
        this.setData({
          total: total
        })
        rows.forEach((ele, index) => {
          userAnswers[index] = ele.userAnswer;
          // 获取题目的信息
          wx.request({
            url: `${app.globalData.hostName}:9001/question/findById?id=${ele.questionId}`,
            header: {
              'content-type': 'application/json',
              'Authorization': wx.getStorageSync('Authorization').value
            },
            success: (result)=>{
              let {analysis, answer, question} = result.data.data;
              this.errList[index] = {
                'question': question,
                'userAnswer': ele.userAnswer,
                'analysis': analysis,
                'answer': answer
              },
              this.setData({
                errList: this.errList
              })
            }
          });
        });
      },
      fail: () => {},
      complete: () => {}
    });

  },
  
  edit(e) {
    let {choose} = e.currentTarget.dataset;
    let {index, total, errList} = this.data;
    if(choose == 0 && index >= 0) {
      if(index == 0) {
        wx.showToast({
          title: '请点击下一题',
          icon: 'none',
          image: '',
          duration: 1000,
          mask: true,
        });
      } else {
        index -= 1;
        this.setData({
          index: index
        })
      }
    } else if(choose == 1) {
      index += 1;
      if(index < this.pagesize && index < total) {
        this.setData({
          index: index
        })
      } else if(errList.length < total) {
        this.pagesize += 5;
        this.questions();
      } else {
        wx.showToast({
          title: '已经是最后一题了',
          icon: 'none',
          image: '',
          duration: 1000,
          mask: true,
          success: (result)=>{
            
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }
      
    }
  }
  


})