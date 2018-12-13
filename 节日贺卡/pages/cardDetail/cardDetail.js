// pages/cardDetail/cardDetail.js
//受害者视角页面JS
const app = getApp()
const {
  baseUrl
} = getApp().globalData
var innerAudioContext;
var isOnLoad = 0;
var i = 0

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    templateId: 0,
    templateUrl: '',
    templateUrl2: '',
    musicId: 0,
    musicUrl: '',
    title: '',
    content: '',
    userName: '',
    templatename: 25,
    receiveUserName: '',
    backMusicUrl: '',
    holidayType: '',//节日类型传参
    Tid: '',//模板ID传参
    startTime: 0,
    endTime: 0,
    icon: '/images/music.png',
    audioStatus: 1,
    audioCtx: '',
    musicClass: 'music-on',
    cssDisplay: 'musiclistNone',
    musicStyle: 'position: absolute; right: 20rpx; top: 70rpx; width: 100rpx; height: 100rpx;',
    rotate: true,
    iconOn: '/images/music.png',
    iconOff: '/images/musicstop.png',
    bottom: app.globalData.windowHeight * 0.099,
    lineHeight: 2 * app.globalData.windowHeight * 0.02986 + 'rpx'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var oooid = options.id
    var dataaa = options.type
    console.log(oooid + '收信人视角')
    console.log(this.data.lineHeight)
    innerAudioContext = wx.createInnerAudioContext()
    var _this = this;

    _this.setData({
      holidayType: dataaa,
      Tid: oooid
    })

    wx.request({
      url: `${baseUrl}/api/greetingCard/greetingCardDetailByGreetingCardId `,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: "Post",
      dataType: 'string',
      data: {
        holidayType: _this.data.holidayType,
        id: _this.data.Tid
      },
      success: function (res) {
        var detail = JSON.parse(res.data);
        if (_this.data.holidayType == 2 || _this.data.holidayType == 3) {
          var newIntTempId = 25;
        }
        if (_this.data.holidayType == 1) {
          var newIntTempId = parseInt(detail.data.templateId);
        }
        console.log(res.data)
        _this.setData({
          templateId: detail.data.templateId,
          templateUrl2: detail.data.templateUrl,
          templatename: 'cardTemplate' + newIntTempId,
          musicId: detail.data.musicId,
          musicUrl: baseUrl + detail.data.musicUrl,
          attachUrl: detail.data.attachUrl == "" || detail.data.musicUrl == undefined ? baseUrl + detail.data.musicUrl : detail.data.attachUrl,
          userName: detail.data.sendUserName,
          receiveUserName: detail.data.receiveUserName + "：",
          title: detail.data.title,
          content: detail.data.content,
          backMusicUrl: baseUrl + detail.data.musicUrl
        })
        wx.request({
          url: `${baseUrl}/api/greetingCard/changeTemplate `,
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          dataType: 'string',
          method: "Post",
          data: {
            holidayType: _this.data.holidayType,
            templateId: _this.data.templateId
          },
          success: function (res) {
            console.log(res.data + '新图片')
            var finalData = JSON.parse(res.data)
            var finalUrl = finalData.data.templateUrl
            _this.setData({
              templateUrl: baseUrl + finalUrl,
            })
          }
        })

        // 音频播放
        if (_this.data.attachUrl != undefined && _this.data.attachUrl != "") {
          innerAudioContext.src = _this.data.attachUrl;
        }
        else {
          innerAudioContext.src = _this.data.musicUrl
        }

        innerAudioContext.onPlay(() => {

        })
        innerAudioContext.onEnded(() => {
          i = i + 1;
          innerAudioContext.stop();
          if (_this.data.musicUrl == '') {
            innerAudioContext.src = _this.data.backMusicUrl;
          } else {
            innerAudioContext.src = _this.data.musicUrl;
          }


          innerAudioContext.play()
          if (i == 2) {
            innerAudioContext.destroy()
          }
        })

        innerAudioContext.onError((res) => {
          console.log(res.errMsg)
          console.log(res.errCode)

        })

        innerAudioContext.play()

      }
    })


  },
  send: function () {
    isOnLoad = 1;
    innerAudioContext.stop();
    wx.clearStorage();
    wx.clearStorageSync();
    wx.navigateTo({
      url: '/pages/homepage/homepage'
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(this.data.templateUrl)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {//调用模板      
    if (
      isOnLoad == 1) {
      if (!this.data.audioStatus) {
        this.setData({
          audioStatus: 0,
          icon: this.data.iconOff,
          musicClass: ''
        })
        innerAudioContext.pause();
        // 如果是停止就播放 
      } else {
        this.setData({
          audioStatus: 1,
          icon: this.data.iconOn,
          musicClass: 'music-on'
        })
        innerAudioContext.play();
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    innerAudioContext.stop();
    this.setData({
      backMusicUrl: this.data.musicUrl
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    this.setData({
      backMusicUrl: this.data.musicUrl
    })
    innerAudioContext.stop();

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

  },

  _switch: function () {
    if (this.endTime - this.startTime < 350) {
      // 如果是播放就停止   
      if (this.data.audioStatus) {
        this.setData({
          audioStatus: 0,
          icon: this.data.iconOff,
          musicClass: ''
        })
        innerAudioContext.pause();
        console.log('暂停')
        // 如果是停止就播放 
      } else {
        this.setData({
          audioStatus: 1,
          icon: this.data.iconOn,
          musicClass: 'music-on'
        })
        innerAudioContext.play();
        console.log('播放')
      }
    }
  },

  handleTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },

  //touch end
  handleTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  }
})