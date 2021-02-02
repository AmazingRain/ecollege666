const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    questions: [],
    isRight: '',
    isHidden: true,
    resultClass: '',
    isDisabled: false,
    index: 0,
    inputValue: '',
    checkedFlag: false,
    choose: '',
    radioValue: ''
  },
  pageSize: 5,
  getUserChoose(e) {
    console.log(e)
    let value = e.currentTarget.dataset.choose;
    console.log(value);
    this.setData({
      choose: value
    })
  },
  checkChooseAnswer(e) {
    // let {
    //   choose
    // } = e.currentTarget.dataset;
    let choose = this.data.radioValue || this.data.choose;
    let questionId = this.data.questions[this.data.index].id;
    wx.request({
      url: `${app.globalData.hostName}:9001/question/answer/add`,
      data: {
        "questionId": questionId,
        "userAnswer": choose,
        "userId": wx.getStorageSync('userId').value
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'post',
      success: (result) => {
        let resultClass = ['resutl-false', 'resutl-true'];
        let res = result.data.data;
        let isRight = res.isRight == "0" ? '回答错误' : '回答正确';
        this.setData({
          isRight,
          isHidden: 0,
          isDisabled: 1,
          resultClass: resultClass[res.isRight],
        })
        // this.edit(e);
      }
    });
  },
  // 填空题答案
  inputAnswer(e) {
    console.log(e.detail.value)
    this.setData({
      choose: e.detail.value
    })
  },
  onLoad: function (options) {
    this.setData({
      classId: options.id
    })
    this.questions();
  },

  // 请求题目信息
  questions() {
    wx.request({
      url: `${app.globalData.hostName}:9001/question/search?pageNum=1&pageSize=${this.pageSize}`,
      data: {
        "categoryId": this.data.classId
      },
      header: {
        'content-type': 'application/json',
        'Authorization': wx.getStorageSync('Authorization').value
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        let {
          total,
          rows: resQuestions
        } = res.data.data;
        let handleQuestions = [];
        let questionType = ['选择', '填空'];
        this.setData({
          total
        })
        console.log(resQuestions)
        resQuestions.forEach((ele, index) => {
          let options;
          if (ele.type == 1) {
            options = JSON.parse(ele.options);
          }
          handleQuestions[index] = {
            'type': ele.type,
            'question': `【${questionType[ele.type - 1]}】 ${ele.question}`,
            'answer:': `答案：${ele.answer}`,
            'analysis': `解析：${ele.analysis}` || `暂无解析`,
            'aa': `答案：${ele.answer}`,
            'options': options || '无',
            'id': ele.id,
            'questionPic': ele.questionPic
          }
        });
        this.setData({
          questions: handleQuestions
        })
      },
      fail: () => {},
      complete: () => {}
    });

  },
  radioChange(e) {
    this.setData({
      radioValue: e.detail.value
    })
  },
  edit(e) {
    this.setData({
      isRight: '',
      isHidden: true,
      inputValue: '',
      isDisabled: false,
      checkedFlag: false,
      radioValue: ''
    })
    let {
      choose
    } = e.currentTarget.dataset;
    let {
      index,
      total,
      questions
    } = this.data;
    if (choose == 0 && index >= 0) {
      if (index == 0) {
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
    } else if (choose == 1) {
      index += 1;
      if (index < this.pageSize && index < total) {
        this.setData({
          index: index
        })
      } else if (questions.length < total) {
        this.pageSize += 5;
        this.questions();
      } else {
        wx.showToast({
          title: '已经是最后一题了',
          icon: 'none',
          image: '',
          duration: 1000,
          mask: true,
          success: (result) => {

          },
          fail: () => {},
          complete: () => {}
        });
      }

    }
  },
  // errBook() {
  //   wx.navigateTo({
  //     url: '/pages/study/ErrorBook/ErrorBook',
  //     success: (result) => {

  //     },
  //     fail: () => {},
  //     complete: () => {}
  //   });
  // },


})