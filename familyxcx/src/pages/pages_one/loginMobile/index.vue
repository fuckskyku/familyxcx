<template>
  <div id="indexMobile">
    <div class="login_container">
      <img src="http://img.mseenet.com/iOS_CutDiagram/logo@3x.png" alt="">
    </div>
    <form class="login_go">
      <div class="login_go_mobile">
        <span>+86</span>
        <input type="number" :placeholder="selectLoginType==1?'请输入老师手机号码':'请输入家长手机号码'" placeholder-style="color:#B3B3B3" v-model="loginName" auto-focus>
        <icon type="clear" size='25' @click="clearInput" />
      </div>

      <div class="login_go_mobile imgCode" v-if="loginType==2">
        <input type="text" placeholder="请输入验证码" placeholder-style="color:#B3B3B3" v-model="imgCode">
        <img :src="imgCodeUrl" alt="" @click="renovate">
      </div>

      <div class="login_go_mobile code" v-if="loginType==2">
        <input type="text" placeholder="请输入短信验证码" placeholder-style="color:#B3B3B3" v-model="code">
        <button @click="getCode">获取验证码</button>
      </div>

      <div class="login_go_mobile" v-if="loginType==1||loginType==2">
        <input class="login_go_password" type="password" :placeholder="loginType==1?'请输入密码':'请设置登录密码'" placeholder-style="color:#B3B3B3" v-model="password">
        <i @click="selectPsw"><img src="http://img.mseenet.com/iOS_CutDiagram/login_open_btn@2x.png" alt=""></i>
      </div>

      <div class="login_go_mobile okPw" v-if="loginType==2">
        <input class="login_go_password" type="passwordOk" placeholder="请确认登录密码" placeholder-style="color:#B3B3B3">
      </div>
    </form>
    <!-- [{!checkboxBoole?'disabled':''},] -->
    <!-- loginType==2?!checkboxBoole: -->
    <button :class="[checkboxBoole?'':'disabled','login_button']" :disabled="loginType==2?!checkboxBoole:false" @click="btnLogin()">{{loginType==0?"继续":loginType==2?"激活登录":'登录'}}</button>
    <checkbox-group @change="checkboxChange">
      <!-- <div class="login_agreement" v-if="loginType==2" v-for="(item,index) in checkboxBoole" :key="index">
        <checkbox :checked='item.value' :value='item.value' />{{item.name}}
        <a href="">{{item.aTagOne}}</a>
        <a href="">{{item.aTagTwo}}</a>
      </div> -->
      <div class="login_agreement" v-if="loginType==2">
        <checkbox :checked='checkboxBoole' :value='checkboxBoole' />我已阅读并同意
        <a @click="registerAgreement()">《喵喵校园用户注册协议》</a><br>
        <a @click="useAgreement()">《喵喵校园使用协议》</a>
      </div>
    </checkbox-group>
    <div class="forget_password" v-if="loginType==1" @click="forgetPassword">忘记密码?</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { login, isStatus, sendNoTokenSms, captcha, userActive } from '@/api/api'
import utils from '@/utils/index'
import wxParse from '@/utils/WxValidate'
var Validate = ''

export default {
  components: {},
  data() {
    return {
      loginType: 0, //登录显示状态值
      loginName: '', //登录帐号
      password: '', //登录密码
      passwordOk: '', //登录确认密码
      imgCode: '',
      code: '',
      checkboxBoole: true,
      imgCodeUrl: ''
    }
  },
  destroyed() {
  
    console.log(1)
  },
  computed: {
    ...mapState(['selectLoginType', 'tasteType'])
  },
  mounted() {
    this.initData()
    // this.userType = utils.wxGetStorage('loginType')
    //  || this.userType == 2
    var tasteType = this.$mp.query.tasteType

    if (tasteType == 1) {
      this.loginName = '15600100001'
      this.password = '123456'
      this.setSelectLoginType(2)
      this.setTasteType(1)
      this.longin()
    } else {
      this.setTasteType(0)
    }
    //获取验证码
    this.renovate()
  },
  
  methods: {
    ...mapActions([
      'setToKen',
      'setUserId',
      'setJudgeUserType',
      'setSelectLoginType',
      'setTasteType',
      'setSchoolList',
      'setFamily'
    ]),

    //初始化数据
    initData() {
      this.loginType = 0 //登录显示状态值
      this.loginName = '' //登录帐号
      this.password = '' //登录密码
      this.passwordOk = '' //登录确认密码
      this.imgCode = ''
      this.code = ''
      this.checkboxBoole = true
      this.imgCodeUrl = ''
    },
    btnLogin() {
      if (!utils.required(this.loginName)) {
        utils.showDialog('请填写手机号码')
        return
      }
      if (!utils.tel(this.loginName)) {
        utils.showDialog('您填写的手机号码不正确')
        return
      }

      if (this.loginType == 0) {
        isStatus({
          userType: this.selectLoginType,
          mobile: this.loginName
        }).then(res => {
          if (res.data.data.islogin == 0) {
            this.loginType = 0
            wx.navigateTo({
              url: '../loginMobileErr/main?mobile=' + this.loginName
            })
          } else if (res.data.data.islogin == 1) {
            //直接登录
            this.loginType = 1
          } else if (res.data.data.islogin == 2) {
            //激活登录
            this.loginType = 2
          }
        })
      } else if (this.loginType == 2) {
        userActive({
          mobile: this.loginName,
          mobileCode: this.code,
          plainPassword: this.password,
          userType: this.selectLoginType
        }).then(res => {
          console.log(res)
          if (res.data.code == '200') {
            this.longin()
          } else {
            utils.showDialog(res.data.message)
          }
        })
      } else {
        this.longin()
      }
    },
    //登录
    longin() {
      if (!utils.required(this.password)) {
        utils.showDialog('请输入密码')
        return
      }
      var url = '../index/main'
      // if (this.selectLoginType == 1) {
      //   url = '/pages/pages_two/index/main'
      // }

      login({
        loginName: this.loginName,
        password: this.password,
        userType: this.selectLoginType
      }).then(res => {
        if (res.data.code != 200) {
          utils.showDialog(res.data.message)
          return
        }
        if (this.selectLoginType == 1) {
          if (res.data.code == 200) {
            if (
              this.selectLoginType == 1 &&
              res.data.data.schoolInfoOutDtos.length > 1
            ) {
              this.setSchoolList(res.data.data.schoolInfoOutDtos)
              url = '/pages/pages_two/institutionSelect/main' //多个学校跳转去选择学校
            } else {
              var obj = [{ key: 'schoolName', value: res.data.data.schoolName }]
              this.setFamily(obj)
              url = '/pages/pages_two/index/main'
            }
          } else {
            utils.showDialog(res.data.message)
          }
        } else {
          if (res.data.code == 200) {
            if (
              this.selectLoginType == 2 &&
              res.data.data.students.length == 0
            ) {
              utils.showDialog('您的账号还没有添加学生')
              return
            }
            if (
              this.selectLoginType == 2 &&
              res.data.data.students.length > 1
            ) {
              url = '../mySelect/main' //多个学生跳转去选择学生
            } else {
              // studentId,item.parentId,item.studentName
              var obj = [
                {
                  key: 'studentId',
                  value: res.data.data.students[0].studentId
                },
                { key: 'parentId', value: res.data.data.students[0].parentId },
                {
                  key: 'studentName',
                  value: res.data.data.students[0].studentName
                },
                {
                  key: 'schoolId',
                  value: res.data.data.students[0].schoolId
                },
                {
                  key: 'schoolName',
                  value: res.data.data.students[0].schoolName
                }
              ]
              this.setFamily(obj)
            }
            wx.reLaunch({
              url: url
            })
          } else {
            utils.showDialog(res.data.message)
          }
        }
        this.initData()
        this.setToKen(res.data.data.token)
        this.setUserId(res.data.data.id)
        this.setJudgeUserType(res.data.data.userType)
        utils.wxSetStorageSync('students', res.data.data.students)
        wx.reLaunch({
          url: url
        })
      })
    },
    //清空输入框
    clearInput() {
      this.loginName = ''
    },
    //忘记密码按钮
    forgetPassword() {
      wx.navigateTo({
        url: '../forgetPassword/main?mobile=' + this.loginName
      })
    },
    //密码显示影藏切换事件
    selectPsw() {},
    //checkbox切换
    checkboxChange(e) {
      if (e.target.value.length > 0) {
        this.checkboxBoole = true
      } else {
        this.checkboxBoole = false
      }
    },
    //点击刷新图片验证码
    renovate() {
      captcha().then(res => {
        this.imgCodeUrl = res.data.data
      })
    },
    //点击获取短信验证码
    getCode() {
      sendNoTokenSms({
        mobile: this.loginName,
        captchaCode: this.imgCode,
        smsType: 'activeUser',
        userType: this.selectLoginType
      }).then(res => {
        utils.showDialog(res.data.message)
        // console.log(this.imgCode)
        //console.log(res)
      })
    }
  },
  //使用协议  
    useAgreement() {
      let url = '../../useAgreement/main'
      wx.navigateTo({ url })
    },
    //登录协议
    registerAgreement() {
      let url = '../../registerAgreement/main'
      wx.navigateTo({ url })
    },
  //分享
  onShareAppMessage: function(res) {
    return {
      title: '喵喵校园',
      path: 'pages/welcome/main'
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
      color: #2e9efc;
    }
  }
  .forget_password {
    margin-top: 24rpx;
    width: 100%;
    text-align: center;
    font-size: 32rpx;
    color: #2e9efc;
  }
}
</style>
