<template>
  <div id="loginSelect">
    <h1>选择您的身份:</h1>
    <div @click="myTeacher()">
      <div><img src="http://test.admin.school.mseenet.com/html/img/iOS切图/教师.png" alt=""></div>
      <div class="name">我是教师</div>
    </div>
    <div @click="myFamily()">
      <div><img src="http://test.admin.school.mseenet.com/html/img/iOS切图/家长.png" alt=""></div>
      <div class="name">我是家长</div>
    </div>
    <div class="tip" @click="casual()">
      <a href="">体验演示版</a>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { getSessionId } from '@/api/api'
import utils from '@/utils/index'
export default {
  data() {
    return {
      userType: ''
    }
  },
  mounted() {
    // console.log(this.$store.state)
    //判断登录类型
    // if (this.judgeuserType != '' && this.judgeuserType) {
    //   this.userType = this.judgeuserType
    // }
    // if (
    //   utils.wxGetStorage('userType') != '' &&
    //   utils.wxGetStorage('userType')
    // ) {
    //   this.userType = utils.wxGetStorage('userType')
    // }

    getSessionId().then(res => {
      this.setCookieId(res.data.data)
    })
  },
  computed: {
    ...mapState([
      'selectLoginType',
      'judgeuserType',
      'token',
      'students',
      'tasteType'
    ])
  },
  methods: {
    ...mapActions(['setSelectLoginType', 'setCookieId', 'setTasteType']),
    myTeacher() {
      //存储登录类型
      this.setSelectLoginType(1)
      var url = '../loginMobile/main'
      if (this.token != '') {
        if (this.judgeuserType == 1) {
          url = '../index/main'
          wx.redirectTo({
            url: url
          })
          return
        }
      }
      wx.navigateTo({
        url: url
      })

      // var _this = this
      // utils.wxSetStorage('loginType', 1, function() {
      //   var url = '../loginMobile/main'
      //   if (utils.wxGetStorage('token')) {
      //     if (_this.userType == 1) {
      //       url = '../index/main'
      //     }
      //   }
      //   wx.redirectTo({
      //     url: url
      //   })
      // })
    },
    myFamily() {
      //存储登录类型
      this.setSelectLoginType(2)
      var url = '../loginMobile/main'
      if (this.tasteType != 1) {
        if (this.token != '') {
          if (this.judgeuserType == 2) {
            if (utils.wxGetStorage('students').length < 2) {
              url = '../index/main'
              wx.redirectTo({
                url: url
              })
              return
            } else if (utils.wxGetStorage('students').length > 1) {
              url = '../mySelect/main'
            }
          }
        }
      }
      wx.navigateTo({
        url: url
      })

      // var _this = this
      // utils.wxSetStorage('loginType', 2, function() {
      //   var url = '../loginMobile/main'
      //   if (utils.wxGetStorage('token')) {
      //     if (_this.userType == 2) {
      //       if (utils.wxGetStorage('students').length < 2) {
      //         url = '../index/main'
      //       } else if (utils.wxGetStorage('students').length > 1) {
      //         url = '../mySelect/main'
      //       }
      //     }
      //   }
      //   wx.redirectTo({
      //     url: url
      //   })
      // })
    },
    casual() {
      //存储登录类型
      var url = '../loginMobile/main?tasteType=1'
      wx.redirectTo({
        url: url
      })
      // wx.redirectTo({
      //   url: '/pages/business/index/main'
      // })
      // utils.wxSetStorageSync('loginType', 3);
      // utils.wxSetStorage('loginType', 3, function() {})
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: '咪师校园',
      path: 'pages/pages_one/index/main'
    }
  }
}
</script>

<style lang="scss" scoped>
#loginSelect {
  h1 {
    font-size: 50rpx;
    text-align: center;
    font-weight: 600;
    color: #3a230f;
  }
  > div {
    margin-top: 110rpx;
    text-align: center;
    img {
      width: 276rpx;
      height: 276rpx;
    }
    .name {
      font-weight: 600;
      font-size: 40rpx;
      color: #3a230f;
      margin-top: 32rpx;
    }
  }
  .tip {
    margin-top: 90rpx;
    color: #2e9efc;
    font-size: 30rpx;
    text-decoration: underline;
  }
}
</style>
