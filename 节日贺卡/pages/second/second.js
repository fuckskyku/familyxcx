
var util = require('../../utils/util.js')
const {
  baseUrl
} = getApp().globalData


const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext()

var playTimeInterval
var recordTimeInterval
var videoUrl = ''


Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: [],
    showView: true,
    showView2: false,
    showView3: false,
    showView4: false,
    showView5: false,
    showTemple: false, //控制祝福语
    showAll: true,//控制整个页面
    // cardTitle: "",
    cardContent: "",
    localId: "",
    display: false,
    record: true,
    recording: false,
    playing: false,
    hasRecord: false,
    recordTime: 0,
    playTime: 0,
    formatedRecordTime: '00:00:00',
    formatedPlayTime: '00:00:00',
    holidayType: '',      //节日类型
    recorderTempFilePath: '', // 录音地址
    playDuration: '', // 播放时间
    onPlay: false, // 播放状态样式判断
    voice: false, // 预览语音显示

  },
  

  // 按住录音
  recorderS: function () {
    const options = {
      duration: 600000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }
    // 开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      // console.log('recorder start')
      wx.showLoading({
        title: '录音中...',
      })
    })
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);       //////////==================================================================录音此处报错   回调错误
       wx.hideLoading();
      wx.showToast({
        title: '录音失败',
        icon: 'fail',
        duration: 1000
      })
    })
  },
  // 录音结束
  recorderE: function () {
    let that = this;
    // 结束录音
    recorderManager.stop();
    recorderManager.onStop((res) => {
      wx.hideLoading();
      wx.showToast({
        title: '录音结束',
        icon: 'success',
        duration: 1000
      })
      const { tempFilePath, duration } = res
      let recorderTempFilePath = tempFilePath;
      let playDuration = Math.ceil(duration / 1000);
      that.setData({
        recorderTempFilePath: recorderTempFilePath,
        playDuration: playDuration,
        voice: true,
        videoUrl: recorderTempFilePath
      })

      that.setData({
        showView: (!that.data.showView),
        showView4: (that.data.showView)
      })
    })

  },
  // 播放录音
  play: function () {
    
    let that = this;
    let recorderTempFilePath = that.data.recorderTempFilePath;
    innerAudioContext.autoplay = true
    innerAudioContext.src = recorderTempFilePath
    this.setData({
      onPlay: true
    })
    console.log('1')
    innerAudioContext.play()
    // innerAudioContext.onPlay(() => {
    //   // console.log('开始播放')
    //   that.setData({
    //     onPlay: true
    //   })
    // })
    innerAudioContext.onError((res) => {
      wx.showToast({
        title: res.errMsg,
        icon: 'success',
        duration: 2000
      })
    })
    // 播放结束
    innerAudioContext.onEnded((res) => {
      that.setData({
        onPlay: false
      })
    })
    
  },
  //play 结束
  cardContent(e) {
    this.setData({
      cardContent: e.detail.value
    })
  },
  onHide: function () {
    if (this.data.playing) {
      this.stopVoice()
    } else if (this.data.recording) {
      this.stopRecordUnexpectedly()
    }
  },
  startRecord: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView),
      showView2: (that.data.showView)
    })
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })

  },
  stopRecord: function () {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
    })

    var that = this;
    that.setData({
      videoUrl: tempFilePath,
      showView3: true,
      showView2: false,
      showView1: false,
      showView4: true
    })
  },
  playVoice: function () {
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.tempFilePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })

  },
  pauseVoice: function () {
    clearInterval(playTimeInterval)
    wx.pauseVoice()
    this.setData({
      playing: false
    })
  },
  stopVoice: function () {
    this.setData({
      playing: false,
      formatedPlayTime: util.formatTime(0),
      playTime: 0
    })
    wx.stopVoice()
  },
  clear: function () {
    var that = this;
    that.data.videoUrl = ''
    that.setData({
      onPlay: false
    })
    this.setData({
      tempFilePath: '',
      showView: true,
      showView2: false,
      showView4: false,
    })
    that.setData({
      voice: false
    })
  },
  theNextStep() {
    var cardContent = this.data.cardContent
    if (cardContent == '') {
      wx.showModal({
        title: '提示',
        content: '祝福语不能为空哦',
        showCancel: false
      });
      return;
    }
    //保存路径
    var tempFilePath = this.data.videoUrl
    if (tempFilePath != '' && tempFilePath != undefined) {
      wx.uploadFile({
        url: `${baseUrl}/api/storage/uploadSingleFile`,
        filePath: tempFilePath,
        name: 'file',
        header: {},
        data: {},
        success: function (res) {
          var data2 = JSON.parse(res.data)
          var videoUrl2 = baseUrl + data2.data.url
          var objData = {
            cardContent: cardContent,
            videoUrl: videoUrl2
          }
          wx.setStorage({
            key: "CardContent",
            data: objData,
            success: () => {
              wx.navigateTo({
                url: '/pages/third/third'
              })
            }
          })
        }
      })
    }
    else {
      var objData = {
        cardContent: cardContent,
        videoUrl: ''
      }
      wx.setStorage({
        key: "CardContent",
        data: objData,
        success: () => {
          wx.navigateTo({
            url: '/pages/third/third',
          })
        }
      })
    }
  },

  setGreetingContent: function (e) {
    this.setData({
      showTemple: false,
      showAll: true,
      cardContent: '      ' + e.target.dataset.content
    })

  },

  closeTmplate: function () {
    this.setData({
      showTemple: false,
      showAll: true
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var dataa = wx.getStorageSync('type');
    this.setData({
      holidayType: dataa
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
    //获取模板
    wx.request({
      url: `${baseUrl}/api/greetingCard/greetingTemplateList`,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "Post",
      success: res => {
        this.data.data = res.data.data
        this.setData(this.data)
      }
    })
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

  },

  //选择祝福语
  /**
   * 选择祝福语
   */

  toTemplist: function () {
    this.setData({
      showTemple: true,
      showAll: false,
    })

    wx.request({
      url: `${baseUrl}/api/greetingCard/greetingTemplateList`,
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 默认值
      },
      dataType: 'string',
      data: {
        holidayType: this.data.holidayType
      },
      method: "Post",
      success: res => {
        var ress = JSON.parse(res.data)
        console.log(ress.data)
        this.setData({
          data: ress.data
        })
      }
    })
  }
})

//麦克风帧动画
function speaking() {
  var _this = this;
  //话筒帧动画
  var i = 1;
  this.timer = setInterval(function () {
    i++;
    i = i % 5;
    _this.setData({
      j: i
    })
  }, 200);
}