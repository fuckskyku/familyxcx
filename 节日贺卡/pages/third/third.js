
var templateUrl2
var templateId2
var innerAudioContext;

const {
  baseUrl
} = getApp().globalData
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popErrorMsg: "",
    display: true,
    modalConfirm: false,
    tasMusic: [],
    templatename: '',
    templateUrl: '',//背景图片
    id: 0,
    newTemplateId: 0,
    musicId: '',
    musicUrl: '',
    content: '',
    userId: '',
    userName: '',
    receiveUserName: '',
    attachUrl: '',
    cardId: 0, //发送贺卡的最新id
    hasAttachUrl: true,
    holidayType: '',//类型
    Tid: '',  //模板ID
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
    heightt: '',
    heighttt: '',
    TandF: 'true',
    canvasHeight: '',
    canvasWidth: '',
    canvasImgHeight: '',
    canvasImgWidth: '',
    canvasHidden: 'none',
    imgurl: '',
    clientW: app.globalData.windowWidth,
    clientH: app.globalData.windowHeight,
    lineHeight: 2 * app.globalData.windowHeight * 0.02986 + 'rpx'
  },
  /**
   * 页面调用方法
   */
  again() {
    //保留之前填写的姓名
    var contactValue = wx.getStorageSync('contact')
    //清空第一步的缓存和第二步的缓存
    try {
      wx.removeStorageSync('SandT')
      wx.removeStorageSync('CardContent')
    } catch (e) {

    }

    wx.redirectTo({
      url: '/pages/first/first'
    })
  },
  //////返回首页
  homePage() {
    wx.redirectTo({
      url: '/pages/homepage/homepage'
    })
  },
  
  //截图
  screenshot() {
    var url;
    var that = this
    this.setData({
      canvasHidden: "block"
    })
    const ctx = wx.createCanvasContext('myCanvas',this)
    // 
    // 
    
    
    var netUrL;
    wx.downloadFile({
      url: that.data.templateUrl,
      success: function (res) {
        
        // console.log(res.tempFilePath +'下载成功')
        netUrL = res.tempFilePath
        

      }
    })
    function drawText() {
      var text = that.data.content;//这是要绘制的文本
    var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    ctx.setFontSize(12)
    ctx.setFillStyle('#000')
    ctx.fillText(that.data.receiveUserName + ':', that.data.clientW * 0.0533, that.data.clientH * 0.825)

    for (var a = 0; a < chr.length; a++) {
      if (ctx.measureText(temp).width < 270) {
        temp += chr[a];
      }
      else {
        a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
        row.push(temp);
        temp = "";
      }
    }

    row.push(temp);
    console.log('row',row)
    // //如果数组长度大于2 则截取前两个
    // if (row.length > 2) {
    //   var rowCut = row.slice(0, 3);
    //   console.log('rowCut',rowCut)
    //   var rowPart = rowCut[1];
    //   var test = "";
    //   var empty = [];
     
    //   for (var a = 0; a < rowPart.length; a++) {
    //     if (ctx.measureText(test).width < 220) {
    //       test += rowPart[a];
    //     }
    //     else {
    //       break;
    //     }
    //   }
    //   empty.push(test);
    //   console.log('empty', empty)      
    //   var group = empty[0] + "..."//这里只显示两行，超出的用...表示
    //   rowCut.splice(1, 1, group);
    //   row = rowCut;
    // }
    for (var b = 0; b < row.length; b++) {
      ctx.fillText(row[b], 0.03 * that.data.clientW, 0.855 * that.data.clientH + b * 30,that.data.clientW * 0.675);
      ctx.translate( 8, -10)
    }  
    ctx.fillText(that.data.userName, 0.625 * that.data.clientW - ctx.measureText(that.data.userName).width, that.data.clientH * 1.01)
    }

    //图片保存本地
    function downLoadImg(netUrl, storageKeyUrl) {
      wx.getImageInfo({
        src: that.data.templateUrl,
        //请求的网络图片路径      
        success: function (res) {        //请求成功后将会生成一个本地路径即res.path,然后将该路径缓存到storageKeyUrl关键字中       
          urlImg = res.path;
          wx.setStorage({ key: storageKeyUrl, data: res.path, });

        }
      })
      wx.downloadFile({
        url: netUrl,
        success: function (res) {
          // console.log(res);
          wx.setStorage({ key: storageKeyUrl, data: res.tempFilePath, });
          ctx.drawImage(res.tempFilePath, 0, 0, that.data.canvasImgWidth, that.data.canvasImgHeight);
          drawText();
          
        }
      })
    }
    var urlImg;
    downLoadImg(that.data.templateUrl, 'urlImg')
    var headUrl = wx.getStorageSync("urlImg"); //下面用canvas绘制
    console.log(wx.getStorageSync("urlImg")+'储存')

    /////////////console出了underfind

    console.log(headUrl+'网络图片路径')

    wx.getImageInfo({
      src: that.data.templateUrl,
      success: function (res) {
        urlImg = res.path;
        
      }
    })
    
//////以下
    //绘制文字
    
    // var text = this.data.content;//这是要绘制的文本
    // var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
    // var temp = "";
    // var row = [];
    // ctx.setFontSize(14)
    // ctx.setFillStyle('#fff');
    // ctx.fillText(this.data.receiveUserName + ':', 30, 490)

    // for (var a = 0; a < chr.length; a++) {
    //   if (ctx.measureText(temp).width < 250) {
    //     temp += chr[a];
    //   }
    //   else {
    //     a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
    //     row.push(temp);
    //     temp = "";
    //   }
    // }

    // row.push(temp);

    // //如果数组长度大于2 则截取前两个
    // if (row.length > 2) {
    //   var rowCut = row.slice(0, 3);
    //   var rowPart = rowCut[1];
    //   var test = "";
    //   var empty = [];
    //   for (var a = 0; a < rowPart.length; a++) {
    //     if (ctx.measureText(test).width < 220) {
    //       test += rowPart[a];
    //     }
    //     else {
    //       break;
    //     }
    //   }
    //   empty.push(test);
    //   var group = empty[0] + "..."//这里只显示两行，超出的用...表示
    //   rowCut.splice(1, 1, group);
    //   row = rowCut;
    // }
    // for (var b = 0; b < row.length; b++) {
    //   ctx.fillText(row[b], 30, 510 + b * 30, 200);
    // }

    // ctx.fillText(this.data.userName, 200, 590)
    
//////以上    ok
    //保存图片截图
    setTimeout(()=>{
      ctx.draw(true,()=>{
        console.log('开始截取图片');
        wx.canvasToTempFilePath({
        x: 0,   //画布绘制的起点X坐标
        y: 0,   //画布绘制的起点Y坐标
        width: that.data.window_Width,//画布的宽度
        height: that.data.window_Height,//画布的高度
        canvasId: 'myCanvas',
        success: function (res) {
          console.log(res)
          
          console.log(res.tempFilePath+'**********')
          wx.saveImageToPhotosAlbum({     //保存到本地
            filePath: res.tempFilePath,
            success(result) {
              console.log('保存成功')
              that.setData({
                canvasHidden: 'none'
              })
            },
            fail(result) {
              that.setData({
                canvasHidden: 'none'
              })
              console.log(result)
              if (result.errMsg === "saveImageToPhotosAlbum:fail auth deny"){
                console.log('用户拒绝授权保存图片至相册，再次获取授权')
                wx.authorize({
                  scope:'scope.writePhotosAlbum',
                  success(successdata){
                    console.log('授权成功')
                  },
                  fail(faildata){
                    console.log('授权失败')
                  }
                })
              }
            }
          })
          ctx.clearRect(0, 0, that.data.window_width, that.data.window_height)
          ctx.draw()
        }
      })
      },that
    );
    },2000)
       
    
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    //获取用户屏幕信息

    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight
        var clientWidth = res.windowWidth
        var rpxR = 750 / clientWidth
        that.setData({
          canvasHeight: clientHeight * rpxR + 'rpx',
          canvasWidth: clientWidth * rpxR + 'rpx',
          canvasImgHeight: clientHeight,
          canvasImgWidth: clientWidth,
          clientW: clientWidth,
          clientH: clientHeight
        })
      },
    })
    
    
    innerAudioContext = wx.createInnerAudioContext()//音乐
    var dataaa = wx.getStorageSync('type');
    var cardContentValue = wx.getStorageSync('CardContent')
    var value = wx.getStorageSync('MusicData')
    var templateValue = wx.getStorageSync('theTheme')
    var contactValue = wx.getStorageSync('SandT')
    var valuee = JSON.stringify(value)
    var cardContentValuee = JSON.stringify(cardContentValue)
    var templateValuee = JSON.stringify(templateValue)
    var TTid = templateValue.id
    // console.log(value)
    //console.log(templateValue.id+'模板')
    this.setData({
      holidayType: dataaa,    //节日类型
      Tid: TTid,                //模板id
      content: cardContentValue.cardContent,     //发送内容
      musicId: value.musicId,   //音乐id
      userName: contactValue.studentsName,    //发送人姓名
      receiveUserName: contactValue.teacherName,  //收信人姓名
      attachUrl: cardContentValue.videoUrl, //录音文件
    })

    try {
      //console.log(cardContentValuee +'-----'+valuee+'-----'+templateValuee)
      if (value && templateValue && cardContentValue) {
        //调用模板
        wx.request({
          url: `${baseUrl}/api/greetingCard/changeTemplate `,
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          dataType: 'string',
          method: "Post",
          data: {
            holidayType: that.data.holidayType,
            templateId: that.data.Tid
          },
          success: function (res) {
            var detail = JSON.parse(res.data);
            templateUrl2 = baseUrl + detail.data.templateUrl;
            templateId2 = detail.data.id
            console.log(templateUrl2 + '新图片路径')
            if (dataaa == 2 || dataaa == 3) {
              that.setData({
                templatename: "cardTemplate" + 25, //wxml标签class名
                heightt: 'height:900rpx',
                heighttt: '1120rpx'
              })
            } else {
              that.setData({
                templatename: "cardTemplate" + TTid, //wxml标签class名
              })
            }

            that.setData({
              templateUrl: templateUrl2, //背景图片
              id: templateId2,          //图片ID
              userName: contactValue.studentsName,  //发信人姓名
              receiveUserName: contactValue.teacherName,  //收信人姓名
              content: '      ' + cardContentValue.cardContent,//信的内容
              // baseUrl + '/static/music/music1.mp3'
              musicId: value.musicId,   //音乐ID
              musicUrl: value.musicUrl, //音乐路径
              attachUrl: cardContentValue.videoUrl,
              hasAttachUrl: cardContentValue.videoUrl != undefined && cardContentValue.videoUrl != '' ? true : false,

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
              innerAudioContext.stop(); console.log('this.data.musicUrl:' + that.data.musicUrl)
              innerAudioContext.src = that.data.musicUrl;
              innerAudioContext.play()
            })
            innerAudioContext.onError((res) => {
              console.log(res.errMsg)
              console.log(res.errCode)
            })
            innerAudioContext.play();
          }
        })

      }
    } catch (e) { }

    wx.getStorage({
      key: "theTheme",
      success: (res) => {
        const {
          templateUrl,
          id
        } = res.data
        this.setData({
          templateUrl: `${baseUrl}${templateUrl}`,
          id
        })
      },
    })
    var sss;
    wx.request({
      url: `${baseUrl}/api/greetingCard/save `,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      dataType: 'string',
      data: {
        holidayType: that.data.holidayType,//必选 节日类型
        title: '1',
        content: that.data.content,    //必选 发送内容
        templateId: that.data.Tid,      //必选  模板ID
        musicId: that.data.musicId,   //必选  音乐ID

        sendUserId: 8,       //必选 发送人ID
        sendUserName: that.data.userName,  //必选  发送人名字
        receiveUserName: that.data.receiveUserName,    //必选  收信人名字
        attachUrl: that.data.attachUrl,    //非必选  录音文件
        sendType: 2,      //必选 
      },
      success: function (res) {
        console.log(res.data)
        sss = JSON.parse(res.data)
        that.setData({
          cardId: sss.data.id
        })
        console.log(that.data.cardId + '参数')
      }
    })
  },

  //背景音乐开关
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
    innerAudioContext.stop();
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
    innerAudioContext.pause();
    // console.log(1)
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
  onShareAppMessage: function (res) {
    // console.log(1)
    var _this = this
    return {
      title: '转发给好友',
      path: '/pages/cardDetail/cardDetail?id=' + _this.data.cardId + '&type=' + _this.data.holidayType,
      success: function (res) {
        // wx.redirectTo({
        //   url: '/pages/cardDetail/cardDetail'
        // })
        // console.log(res)
        // console.log('转发给好友' + _this.data.cardId + '成功666666')
      }
    }

  }
})