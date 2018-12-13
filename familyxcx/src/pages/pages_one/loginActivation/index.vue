<template>
  <div id="login_Activation">
    <form action="">
      <div v-if="loginType==0">
        <div class="input_item">
          <span>学生姓名</span>
          <input type="text" placeholder="请输入家长姓名" placeholder-style="color:#B3B3B3" v-model="userInfo.studentName">
        </div>

        <div class="input_item">
          <span>证件号码</span>
          <input type="number" placeholder="请输入证件号码" placeholder-style="color:#B3B3B3" v-model="userInfo.idCard">
        </div>

        <div class="input_item">
          <span>家长姓名</span>
          <input type="text" placeholder="请输入家长姓名" placeholder-style="color:#B3B3B3" v-model="userInfo.familyName">
        </div>

        <picker bindchange="bindPickerChange" :value="index" :range="Relation" range-key="label" @change="bindchange">
          <div class="input_item">
            <span>家长关系</span>
            <div>{{Relation[index].label}}</div>
            <!-- <input type="number" placeholder="请输入家长关系" placeholder-style="color:#B3B3B3" v-model="userInfo.familyRelation"> -->
          </div>
        </picker>
        <div class="input_item">
          <span>绑定手机</span>
          <input type="number" placeholder="请输入绑定手机" placeholder-style="color:#B3B3B3" v-model="userInfo.bindMobile">
        </div>

        <div class="input_item input_itemTwo">
          <input type="text" placeholder="请输入图形验证码" placeholder-style="color:#B3B3B3" v-model="imgCode">
          <img :src="imgCodeUrl" alt="" @click="renovate">
        </div>

        <div class="input_item input_itemTwo">
          <input type="number" placeholder="请输入短信验证码" placeholder-style="color:#B3B3B3" v-model="Code">
          <button @click="getCode">获取验证码</button>
        </div>
      </div>

      <div v-if="loginType==1">
        <div class="input_item input_itemTwo">
          <input type="password" placeholder="请设置登录密码" placeholder-style="color:#B3B3B3" v-model="password">
          <!-- <i><img src="http://img.mseenet.com/iOS_CutDiagram/login_open_btn@2x.png" alt=""></i> -->
        </div>

        <div class="input_item input_itemTwo">
          <input type="password" placeholder="请确认登录密码" placeholder-style="color:#B3B3B3" v-model="passwordOK">
          <!-- <i><img src="http://img.mseenet.com/iOS_CutDiagram/login_open_btn@2x.png" alt=""></i> -->
        </div>
      </div>
    </form>
    <button class="login_button" :disabled="checkboxBoole?false:true" @click="next">{{loginType==0?"下一步":"激活登录"}}</button>

    <checkbox-group @change="checkboxChange">
      <div class="login_agreement">
        <checkbox :checked='checkboxBoole' :value='checkboxBoole' />我已阅读并同意<br>
         <a @click="registerAgreement()">《咪师校园用户注册协议》</a><br>
        <a @click="useAgreement()">《咪师校园使用协议》</a>
      </div>
    </checkbox-group>

  </div>
</template>

<script>
import { captcha, sendNoTokenSms, userActive } from "@/api/api";
import utils from "@/utils/index";
export default {
  data() {
    return {
      userInfo: {
        studentName: "",
        idCard: "",
        familyName: "",
        familyRelation: "",
        bindMobile: ""
      },
      Relation: [
        { value: "1", label: "父亲" },
        { value: "2", label: "母亲" },
        { value: "3", label: "爷爷" },
        { value: "4", label: "奶奶" },
        { value: "5", label: "外公" },
        { value: "6", label: "外婆" },
        { value: "7", label: "其他" }
      ],
      index: 0,
      value: "",
      checkboxBoole: true,
      loginType: 0,
      userType: "",
      imgCode: "",
      Code: "",
      password: "",
      passwordOK: "",
      imgCodeUrl: ""
    };
  },
  mounted() {
    this.userType = utils.wxGetStorage("loginType");
    this.userInfo.bindMobile = this.$mp.query.mobile;
    this.renovate();
  },
  methods: {
    //点击刷新图片验证码
    renovate() {
      captcha().then(res => {
        this.imgCodeUrl = res.data.data;
      });
    },
    //点击获取短信验证码
    getCode() {
      sendNoTokenSms({
        mobile: this.userInfo.bindMobile,
        captchaCode: this.imgCode,
        smsType: "registerUser",
        userType: this.userType
      }).then(res => {
        utils.showDialog(res.data.message);
      });
    },
    checkboxChange(e) {
      if (e.target.value.length > 0) {
        this.checkboxBoole = true;
      } else {
        this.checkboxBoole = false;
      }
    },
    next() {
      if (this.loginType == 0) {
        this.loginType = 1;
        console.log(this.userInfo);
      } else if (this.loginType == 1) {
        userActive().then(res => {
          userActive({
            mobile: this.userInfo.bindMobile,
            mobileCode: this.code,
            plainPassword: this.password,
            userType: this.userType
          }).then(res => {
            console.log(res);
            if (res.data.code == "200") {
              this.longin();
            } else {
              utils.showDialog(res.data.message);
            }
          });
        });
      }
    },
    bindchange(e) {
      var index = e.mp.detail.value;
      this.index = index;
      this.value = this.Relation[index].value;
    },
    //登录
    longin() {
      var url = "../index/main";
      login({
        loginName: this.userInfo,
        password: this.password,
        userType: this.userType
      }).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          if (this.userType == 2 && res.data.data.students.length > 1) {
            url = "../mySelect/main"; //多个学生跳转去选择学生
          }
          utils.wxSetStorageSync("students", res.data.data.students);
          utils.wxSetStorageSync("token", res.data.data.token);
          utils.wxSetStorageSync("userType", res.data.data.userType);
          wx.redirectTo({
            url: url
          });
        } else {
          utils.showDialog(res.data.message);
        }
      });
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
    }
  }
};
</script>

<style lang='scss' scoped>
#login_Activation {
  display: flex;
  flex-direction: column;
  align-items: center;
  .input_item {
    margin-top: 20rpx;
    font-size: 34rpx;
    display: flex;
    width: 690rpx;
    height: 98rpx;
    border-bottom: 1px solid #e6e6e6;
    align-items: center;
    span {
      margin-right: 50rpx;
      color: #333;
    }
  }
  .input_itemTwo {
    input {
      padding-left: 30rpx;
    }
    button {
      background: #ffea55;
      font-size: 27rpx;
    }
    > img {
      width: 220rpx;
      height: 65rpx;
    }
    i {
      position: absolute;
      right: 65rpx;

      img {
        width: 60rpx;
        height: 60rpx;
      }
    }
  }
  .login_button {
    background: #ffea55;
    width: 690rpx;
    margin: 0 auto;
    margin-top: 50rpx;
    font-size: 36rpx;
  }
  .login_agreement {
    margin: 0 auto;
    margin-top: 43rpx;
    text-align: center;
    width: 690rpx;
    font-size: 34rpx;
    > a {
      display: inline;
      color: #2e9efc;
    }
  }
}
</style>
