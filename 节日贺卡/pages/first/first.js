// pages/first/first.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherName:'',     //教师姓名  
    studentsName:'',    //学生姓名
  },
  studentsName(e){
    this.setData({
      studentsName: e.detail.value
    })
  },
  teacherName(e) {
    this.setData({
      teacherName: e.detail.value
    })
  },
  theNextStep(){
    if (this.data.studentsName == '') {
      wx.showModal({
        title: '提示',
        content: '您的名字不能为空哦',
        showCancel: false
      })

    } else if (this.data.teacherName == '') {
      wx.showModal({
        title: '提示',
        content: '对老师的称呼不能为空哦',
        showCancel: false
      });
    }else{
        wx.setStorage({
          key: 'SandT',
          data: this.data,
        })
        wx.navigateTo({
          url: '/pages/second/second'
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})