const {
  baseUrl
} = getApp().globalData
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    theme: [],
    tasBeenSent: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //首页传参 判断用户点击进入了哪个节日    options.type=1 —> 教师节/ 2-> 中秋节/ 3-> 国庆节
    var dataa = options.type
    wx.setStorage({
      key: 'type',
      data: dataa,
    })
    //渲染节日页面
    wx.request({
      url: `${baseUrl}/api/greetingCard/greetingCardTemplateList`,
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
      },
      data: {
        holidayType:dataa
      },
      method:'post',
      success: res => {
        // console.log(res)
        this.data.theme = res.data.data
        this.setData(this.data)
        console.log(res)
      }
    })
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