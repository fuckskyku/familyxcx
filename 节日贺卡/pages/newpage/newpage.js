const {
  baseUrl
} = getApp().globalData
var innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    templateUrl: "",
    id: "",
    musicId: '',
    musicUrl: '',
    holidayType: 10,
    startTime: 0,
    endTime: 0,
    icon: '/images/music.png',
    audioStatus: 1,
    audioCtx: '',
    musicClass: 'music-on',
    cssDisplay: 'musiclistNone',
    musicStyle: 'position: absolute; right: 20rpx; top: 90rpx; width: 100rpx; height: 100rpx;',
    rotate: true,
    iconOn: '/images/music.png',
    iconOff: '/images/musicstop.png',
    spacee: '',
    heightt: '',
    heighttt: '',
    nnnn: 'display:none'
  },

  /**
   * 触发事件
   */
  //编辑  
  choose() {
    // innerAudioContext.stop();
    this.setData({
      audioStatus: 0
    })
    var objData = {
      musicId: this.data.musicId,
      musicUrl: this.data.musicUrl
    }
    
    wx.setStorage({
      key: "MusicData",
      data: objData
    })

    wx.navigateTo({
      url: '/pages/first/first'
    })
    innerAudioContext.pause();
  },
  //重新编辑
  toChoose() {
    wx.getStorage({
      key: 'type',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/festival/festival?type=' + res.data
        })
      },
    })
  },

  //长按选择音乐
  bindlongtapp() {
    var that = this
    that.setData({
      nnnn: 'display:block'
    })
  },
  SelectMusic(event) {
    console.log(this.data.tasMusic);
    this.data.tasMusic.forEach(item => {
      if (event.target.id == item.id) {
        console.log(item)
        this.setData({
          musicId: item.id,
          musicUrl: baseUrl + item.musicUrl
        })
        innerAudioContext.src = this.data.musicUrl
        innerAudioContext.play()
        this.setData({
          nnnn: 'display:none'
        })
      }
    });
  },
  //以下两个方法是循环播放
  handleTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  handleTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },

  /////播放音乐和暂停
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取页面渲染所用图片的路径
    var dataa = wx.getStorageSync('theTheme');
    var dataaa = wx.getStorageSync('type');
    if (dataaa == 2 || dataaa == 3) {
      this.setData({
        spacee: 'gqzq',
        heightt: 'height:1210rpx;',
        heighttt: 'height:1120rpx;'
      })
    } else {

    }
    wx.getStorage({
      key: "theTheme",
      success: (res) => {
        const {
          templateUrl,
        } = res.data
        this.setData({
          templateUrl: `${baseUrl}${templateUrl}`,
        })
      },
    })
    //获取音乐列表
    var that = this;
    wx.request({
      url: `${baseUrl}/api/greetingCard/musicInfoList`,
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
      },
      method: "Post",
      data: {
        holidayType: dataaa
      },
      success: res => {
        that.setData({
          tasMusic: res.data.data,
          musicId: res.data.data[0].id,
          musicUrl: baseUrl + res.data.data[0].musicUrl
        })
        innerAudioContext.src = baseUrl + res.data.data[0].musicUrl
        innerAudioContext.play()
      },
    })

    // 音频播放
    if (that.data.attachUrl != undefined && that.data.attachUrl != "") {
      innerAudioContext.src = that.data.attachUrl;
    }
    else {
      innerAudioContext.src = that.data.musicUrl
    }
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onEnded(() => {
      console.log('结束播放')
      innerAudioContext.stop();
      console.log('this.data.musicUrl:' + that.data.musicUrl)
      innerAudioContext.src = that.data.musicUrl;
      innerAudioContext.play()
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    innerAudioContext.play();
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
    innerAudioContext.stop();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
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

  }
})