const app = getApp()
Page({
  // TeachersDay() {
  //   //教师节
  //   wx.navigateTo({
  //     url: '../festival/festival?type=1'
  //   });
  // },
  MidAutumnDay() {
    //中秋节
    wx.navigateTo({
      url: '../festival/festival?type=2'
    });
  },
  NationalDay() {
    //国庆节
    wx.navigateTo({
      url: '../festival/festival?type=3'
    });
  },
  data: {
    clientW: app.globalData.windowWidth,
    clientH: app.globalData.windowHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //获取用户屏幕信息

    // wx.getSystemInfo({
    //   success: function (res) {
    //     var clientHeight = res.windowHeight
    //     var clientWidth = res.windowWidth
    //     console.log(clientHeight)
    //     that.setData({  
    //       clientW: clientWidth,
    //       clientH: clientHeight
    //     })
    //   },
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(this.data.clientH)
    console.log(this.data.clientW)
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