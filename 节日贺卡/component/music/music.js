
const {
  baseUrl
} = getApp().globalData
const innerAudioContext = wx.createInnerAudioContext()

Component({
  properties: {
    // 音乐路径
    music: {
      type: String,
      value: '',
      observer: function(newVal) {
         //先播放语音
        var value = wx.getStorageSync('CardContent')
        if (value.videoUrl != "" && value.videoUrl != undefined)
        {
          newVal = value.videoUrl
        }
        console.log('1')
        this._initMusic(newVal)
        console.log('2')
      }
    },
    // 样式
    musicStyle: {
      type: String,
      value: 'position: absolute; right: 20rpx; top: 70rpx; width: 100rpx; height: 100rpx;'
    },
    // 播放时是否有旋转效果
    rotate: {
      type: Boolean,
      value: true
    },
    // 播放时的icon路径
    iconOn: {
      type: String,
      value: '/images/music.png' // 请填写默认的图片地址
    },
    // 暂停时的icon路径
    iconOff: {
      type: String,
      value: '/images/musicstop.png' // 请填写默认的图片地址
    }
  },

  data: {
    icon: '',
    audioStatus: 1,
    audioCtx: '',
    musicClass: 'music-on',
    cssDisplay:'musiclistNone',
    musicId:0,
    musicUrl: ""
  },

  // 页面关闭时销毁音乐
  detached() {
    this.onHide()
  },

  ready() {
    // 首先
    this.setData({
      icon: this.data.iconOn
    })
    //获取模板
    wx.request({
      url: `${baseUrl}/api/greetingCard/musicInfoList`,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "Post",
      success: res => {
        var list = res.data.data;
        this.data.tasMusic = list;
        this.setData(this.data)
      }
    });
  },

  methods: {
    // 在引用组件页面的onShow()中调用
    //  否则，如果当发生分享页面行为并返回时，音乐不会自动播放
    onShow: function() {

     if (this.data.music && this.data.audioStatus) {
        this.data.audioCtx.play()
      }
      console.log(this.data.iconOn)
    },

    // 在引用组件页面的onHide()中调用
    //  否则，在跳转到下一个页面后，音乐还在继续
    onHide: function() {
      if (this.data.music && this.data.audioStatus) {
        this.data.audioCtx.pause()
      }
      this.setData({
        animationData: {}
      })
    },

    // 初始化音乐
    _initMusic: function(newVal) {
      console.log(3)
      // 当页面传来新的music时，先销毁之前的audioCtx，否则页面会很嗨
      if (this.data.audioCtx) {
        this.data.audioCtx.destroy()
      }
      if (newVal) {
        var audioCtx = wx.createInnerAudioContext()
        this.setData({
          audioCtx: audioCtx
        })
        if (this.data.audioStatus == '1') {
          audioCtx.autoplay = true
        }
        audioCtx.loop = true
        audioCtx.src = newVal
        console.log("audioCtx.src ：" + audioCtx.src )


        this.setData({ musicId: 1 })
        this.setData({ musicUrl: newVal })
        wx.setStorage({
          //确认选择音乐
          key: "MusicData",
          data: this.data
        })
      }
    },

    handleTouchStart: function(e) {
      this.startTime = e.timeStamp;
      //console.log("-------- startTime = " + e.timeStamp);  
    },

    //touch end
    handleTouchEnd: function(e) {
      this.endTime = e.timeStamp; 
      //console.log("-------- endTime = " + e.timeStamp);  
    },

    handleLongPress: function(e) {
      //console.log("----------------- endTime - startTime = " + (this.endTime - this.startTime));
      this.setData({ cssDisplay:'musiclist'})
    },

    //切换歌曲
    changeMusic:function(e){      
      console.log('test')
      this._initMusic(baseUrl + e.target.dataset.src)
      this.setData({musicId:e.target.dataset.id})
      this.setData({ cssDisplay: 'musiclistNone' })
      wx.setStorage({
        //确认选择音乐
        key: "MusicData",
        data: this.data
      })
    },

    // 音乐开关控制
    _switch: function() {
      if (this.endTime - this.startTime < 350) {
        // 如果是播放就停止   
        if (this.data.audioStatus) {
          this.setData({
            audioStatus: 0,
            icon: this.data.iconOff,
            musicClass: ''
          })
          this.data.audioCtx.pause()
          // 如果是停止就播放 
        } else {
          this.setData({
            audioStatus: 1,
            icon: this.data.iconOn,
            musicClass: 'music-on'
          })
          this.data.audioCtx.play()
        }
      }
    }
  }
})