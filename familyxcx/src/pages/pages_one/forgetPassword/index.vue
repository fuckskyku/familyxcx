<template>
  <div id="indexMobile">
    <form class="login_go">
      <div class="login_go_mobile">
        <span>+86</span>
        <input type="number" :placeholder="selectLoginType==1?'请输入老师手机号码':'请输入家长手机号码'" placeholder-style="color:#B3B3B3" v-model="loginName" auto-focus>
        <icon type="clear" size='25' @click="clearInput" />
      </div>

      <div class="login_go_mobile imgCode">
        <input type="text" placeholder="输入图形验证码" placeholder-style="color:#B3B3B3" v-model="imgCode">
        <img :src="imgCodeUrl" alt="" @click="renovate">
      </div>

      <div class="login_go_mobile code">
        <input type="text" placeholder="输入验证码" placeholder-style="color:#B3B3B3" v-model="code">
        <button @click="getCode" :disabled='codeDisabled'>{{!reckon?'获取验证码':tiemNum+'秒'}}</button>
      </div>

      <div class="login_go_mobile">
        <input class="login_go_password" type="password" placeholder="输入新密码" placeholder-style="color:#B3B3B3" v-model="password">
      </div>
      <div class="login_go_mobile">
        <input class="login_go_password" type="password" placeholder="请再次输入密码" placeholder-style="color:#B3B3B3" v-model="passowrdOk">
      </div>
    </form>
    <button class="login_button" @click="next">确定</button>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { sendNoTokenSms, captcha, forgetPwd } from '@/api/api'
import utils from '@/utils/index'
export default {
  // props: {
  //   mobile: '',
  //   loginName: '',
  //   password: '', //登录密码
  //   passwordOk: '', //登录确认密码
  //   imgCode: '',
  //   code: '',
  //   imgCodeUrl: ''
  // },
  components: {},
  data() {
    return {
      mobile: '',
      code: '',
      password: '',
      imgCode: '',
      loginName: '',
      imgCodeUrl: '',
      passowrdOk: '',
      codeDisabled: false,
      reckon: false,
      tiemNum: 60
    }
  },
  
  mounted() {
    //获取验证码
    this.renovate()
    this.mobile = this.$mp.query.mobile
  },
  onUnload() {
    this.clearAll()
  },
  
 
  computed: {
    ...mapState(['selectLoginType', 'tasteType'])
  },
  methods: {
    //清空输入框
    clearInput() {
      this.loginName = ''
    },
    
    //清空所有数据
    clearAll() {
      this.mobile = ''
      this.code = ''
      this.password = ''
      this.imgCode = ''
      this.imgCodeUrl = ''
      this.passowrdOk = ''
      this.loginName = ''
     
    },
    getCode() {
      if (!utils.required(this.loginName)) {
        utils.showDialog('请输入手机号码')
        return
      }
      if (!utils.tel(this.loginName)) {
        utils.showDialog('您输入的手机号码不正确')
        return
      }
      if (!utils.required(this.imgCode)) {
        utils.showDialog('请输入图形验证码')
        return
      }
      sendNoTokenSms({
        mobile: this.mobile,
        captchaCode: this.imgCode,
        userType: this.selectLoginType,
        smsType: 'forgetPwd'
      }).then(res => {
        utils.showDialog(res.data.message)
        this.reckon = true
        this.codeDisabled = true
        var fallreckon = setInterval(() => {
          if (this.tiemNum != 0) {
            this.tiemNum--
          } else {
            this.reckon = false
            this.codeDisabled = false
          }
        }, 1000)
      })
    },
    //点击刷新图片验证码
    renovate() {
      captcha().then(res => {
        this.imgCodeUrl = res.data.data
      })
    },
    next() {
      if (!utils.required(this.loginName)) {
        utils.showDialog('请输入手机号码')
        return
      }
      if (!utils.required(this.code)) {
        utils.showDialog('请输入短信验证码')
        return
      }
      if (!utils.required(this.password)) {
        utils.showDialog('请输入新密码')
        return
      }
      if (!utils.minlength(this.password, 8)) {
        utils.showDialog('密码必须至少8个字符')
        return
      }
      if (!utils.equalTo(this.password, this.passowrdOk)) {
        utils.showDialog('两次输入密码不一致')
        return
      }
      var that = this
      forgetPwd({
        mobileCode: this.code,
        mobile: this.mobile,
        plainPassword: this.password,
        userType: this.selectLoginType
      }).then(res => {
        if (res.data.code == '200') {
          wx.showToast({
            title: '密码重置成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function() {
            that.init()
            wx.reLaunch({
              url: '../loginMobile/main'
            })
          }, 3000)
        } else {
          utils.showDialog(res.data.message)
        }
      })
    },
    init: function() {
      this.mobile = ''
      this.code = ''
      this.password = ''
      this.imgCode = ''
      this.loginName = ''
      this.imgCodeUrl = ''
      this.passowrdOk = ''
    }
  },
  
  //分享
  onShareAppMessage: function(res) {
    return {
      title: this.storeInfo.storeName || '喵喵校园',
      path: 'pages/pages_one/index/main'
    }
  }
}
</script>

<style lang='scss' scoped>
#indexMobile {
  .login_container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 320rpx;
    background: linear-gradient(to right, #ffea55, #ffbf01);
    text-align: center;
    img {
      width: 386rpx;
      height: 143rpx;
    }
  }
  .login_go {
    padding: 40rpx 0 0 50rpx;
    box-sizing: border-box;
    .login_go_mobile {
      // background: #f5f5f5;
      border-bottom: 1px solid #e6e6e6;
      height: 98rpx;
      width: 690rpx;
      margin: 0 auto;
      margin-bottom: 35rpx;
      display: flex;
      align-items: center;
      > span {
        padding: 0 30rpx;
        color: #2e9efc;
        font-size: 30rpx;
        display: block;
        line-height: 98rpx;
        position: relative;
        &::after {
          display: block;
          content: '';
          width: 3rpx;
          height: 50rpx;
          background: white;
          position: absolute;
          top: 50%;
          margin-top: -25rpx;
          right: -10rpx;
        }
      }
      &.imgCode {
        display: flex;
        > input {
          flex: 1;
        }
        > img {
          flex: 0 220rpx;
          height: 65rpx;
        }
      }
      input {
        color: #333333;
        width: 450rpx;
        font-size: 34rpx;
        padding-left: 31rpx;
        height: 100%;
      }

      .login_go_password {
        margin-right: 125rpx;
        position: relative;
        width: 100%;
      }
      i {
        position: absolute;
        right: 65rpx;

        img {
          width: 60rpx;
          height: 60rpx;
        }
      }
      &.code {
        display: flex;
        input {
          flex: 1;
        }
        button {
          border: none;
          background: #ffea55;
          font-size: 27rpx;
        }
      }
    }
  }
  .login_button {
    background: #ffea55;
    width: 690rpx;
    margin: 0 auto;
    color: #000000;
    font-size: 36rpx;
    &.disabled {
      color: rgba(0, 0, 0, 0.3);
      background-color: #f7f7f7;
      // color: rgba(255, 255, 255, 0.6);
    }
  }

  .login_agreement {
    margin: 43rpx auto;
    // margin-top: 43rpx;
    text-align: center;
    width: 690rpx;
    font-size: 34rpx;
    > a {
      display: inline;
    }
  }
  .forget_password {
    margin-top: 24rpx;
    width: 100%;
    text-align: center;
    font-size: 32rpx;
    color: #333333;
  }
}
</style>
