<template>
  <div id="myinfo" :style="{'height': height + 'rpx'}">
    <!-- <div class="tip">
      *提示：头像是直接修改的不需要保存呦~
    </div> -->
    <div class="myinfo_container">
      <div class="myinfo_item" @click="UserPhoto">
        <div>教师正脸照</div>
        <div class="img"><img :src="userInfo.avatarImg" alt=""><img class="icon" src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt=""></div>
      </div>

      <div class="myinfo_item">
        <div>名字</div>
        <div class="img"><input type="text" v-model="userInfo.realName"></div>
      </div>

      <picker @change="bindPickerChange" :value="userInfo.sex" :range="sexArray" class="picker">
        <div class="myinfo_item">
          <div>性别</div>
          <div class="img">{{sexArray[userInfo.sex]}}<img class="icon" src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt=""></div>
        </div>
      </picker>

      <div class="myinfo_item">
        <div>职称</div>
        <div class="img">{{userInfo.jobTitle}}</div>
      </div>
      <div class="myinfo_item">
        <div>学科</div>
        <div class="img">{{userInfo.subjects}}</div>
      </div>
      <div class="myinfo_item" style="border-bottom:1rpx solid #e6e6e6">
        <div>身份证号</div>
        <div class="img"><input type="text" v-model="userInfo.cardNo"><img class="icon" src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt=""></div>
      </div>
    </div>
    <div class="group_button">
      <button @click="submit">保存</button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import utils from '@/utils/index'
import { userCenter, modifyUserInfo } from '@/api/api'
export default {
  data() {
    return {
      height: '',
      UserName: '',
      idCard: '',
      sexArray: ['男', '女'],
      userInfo: '',
      PhotoUrl: ''
    }
  },
  computed: {
    ...mapState(['token'])
  },
  mounted() {
    // 高度自适应
    var _this = this
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth
        _this.height = clientHeight * rpxR
      }
    }),
      userCenter().then(res => {
        console.log(res)
        if (res.data.code == 200) {
          this.userInfo = res.data.data
          this.userInfo.avatarImg = utils.formatImgUrl(res.data.data.avatarImg)
        } else {
          console.log(res.data.message)
        }
      })
  },
  methods: {
    bindPickerChange(value) {
      this.userInfo.sex = value.mp.detail.value
    },
    UserPhoto() {
      var _this = this
      wx.chooseImage({
        success: function(res) {
          var tempFilePaths = res.tempFilePaths
          wx.uploadFile({
            url:
              'https://admin.school.mseenet.com/api/storage/uploadSingleFile',
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              Authorization: 'Bearer  ' + _this.token
            },
            formData: {},
            success: function(res) {
              var data = JSON.parse(res.data)
              _this.userInfo.avatarImg = utils.formatImgUrl(data.data.url)
              _this.PhotoUrl = data.data.url
            }
          })
        }
      })
    },
    submit() {
      if (!utils.required(this.userInfo.realName)) {
        utils.showDialog('请输入姓名')
        return
      }
      if (!utils.required(this.userInfo.cardNo)) {
        utils.showDialog('您输入身份证号码')
        return
      }

      modifyUserInfo({
        realName: this.userInfo.realName,
        avatarImg: this.PhotoUrl,
        sex: this.userInfo.sex,
        cardNo: this.userInfo.cardNo
      }).then(res => {
        //console.log(res)
        if (res.data.code == '200') {
          utils.showDialog(res.data.message)

          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        } else {
          utils.showDialog(res.data.message, function() {
            wx.navigateBack()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#myinfo {
  .tip {
    text-align: center;
    padding: 20rpx;
    font-size: 20rpx;
    background: rgb(242, 244, 245);
  }

  .myinfo_container {
    padding-top: 20rpx;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    .picker {
      border-top: 1px solid #e6e6e6;
    }
    .myinfo_item {
      &:first-child {
        border: none;
      }
      border-top: 1px solid #e6e6e6;
      // & + .myinfo_item,
      // .picker {
      //   border-top: 1px solid #e6e6e6;
      // }
      background: white;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      font-size: 34rpx;
      color: #333333;
      padding: 0 30rpx;
      height: 100rpx;
      > div:first-child {
        // -webkit-box-flex: 1;
        // -ms-flex: 1;
        // flex: 1;
        // display: block;
        width: 350rpx;
      }
      .img {
        font-size: 30rpx;
        color: #808080;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        // text-align: right;
        > input {
          text-align: right;
        }
        > img {
          width: 80rpx;
          height: 80rpx;
          border-radius: 40rpx;
          // display: block;
        }
        .icon {
          margin-left: 20rpx;
          display: block;
          // vertical-align: middle;
          // float: right;
          // display: inline-block;
          width: 15rpx;
          height: 26rpx;
        }
      }
    }
  }
  .group_button {
    margin-top: 100rpx;
    > button {
      width: 690rpx;
      background: #ffea55;
    }
  }
}
</style>




