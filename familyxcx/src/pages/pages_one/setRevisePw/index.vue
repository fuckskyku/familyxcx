<template>
  <div id="setRevisePw" :style="{'height':height + 'rpx'}">
    <div class="setRevisePw_container">
      <div class="container_item">
        <div class="title">咪师帐号</div>
        <input type="text" v-model="userMobile" disabled>
        <!-- <div class="text"></div> -->
      </div>
      <div class="container_item" v-if="type!=0">
        <!-- <div class="text"></div> -->
        <div class="title">原密码</div>
        <input type="password" placeholder="请输入原密码" v-model="oldpassword">

      </div>
      <div class="container_item">
        <div class="title">新密码</div>
        <!-- <div class="text"></div> -->
        <input type="password" placeholder="请设置新密码" v-model="password">
      </div>
      <div class="container_item">
        <div class="title">确认密码</div>
        <!-- <div class="text"></div> -->
        <input type="password" placeholder="请再次填入" v-model="passowrdOk">
      </div>
    </div>
    <div class="tip">密码必须至少8个字符的字母或者数字</div>
    <div class="tipOne" @click="tip" v-if="type!=0">忘记原密码</div>
    <div class="button_group">
      <button @click="submit">完成</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { modifyPassword, modifyPasswordOnLogin, sendSms } from "@/api/api";
import utils from "@/utils/index";
export default {
  data() {
    return {
      height: "",
      mobile: "",
      oldpassword: "",
      password: "",
      passowrdOk: "",
      type: "",
      code: ""
    };
  },
  computed: {
    ...mapState(["selectLoginType", "userMobile"])
  },
  mounted() {
    this.type = this.$mp.query.type;
    this.code = this.$mp.query.code;
    var _this = this;
    this.oldpassword = "";
    this.password = "";
    this.passowrdOk = "";
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        _this.height = clientHeight * rpxR;
      }
    });
  },
  methods: {
    ...mapActions(["setClearStore"]),
    submit() {
      if (this.type != 0 && !utils.required(this.oldpassword)) {
        utils.showDialog("请输入原密码");
        return;
      }
      if (!utils.required(this.password)) {
        utils.showDialog("请输入新密码");
        return;
      }
      if (!utils.minlength(this.password, 8)) {
        utils.showDialog("密码必须至少8个字符");
        return;
      }
      if (!utils.equalTo(this.password, this.passowrdOk)) {
        utils.showDialog("两次输入密码不一致");
        return;
      }

      if (this.type != 0) {
        modifyPassword({
          loginName: this.userMobile,
          password: this.oldpassword,
          newPassword: this.password,
          userType: this.selectLoginType
        }).then(res => {
          var _this = this;
          if (res.data.code == "200") {
            utils.showDialog(res.data.message);
            setTimeout(() => {
              wx.clearStorage();
              _this.setClearStore();
              wx.reLaunch({ url: "../loginSelect/main" });
            }, 2000);
          } else {
            utils.showDialog(res.data.message);
          }
        });
      } else {
        modifyPasswordOnLogin({
          mobileCode: this.code,
          mobile: this.userMobile,
          newPassword: this.password
        }).then(res => {
          var _this = this;
          if (res.data.code == "200") {
            utils.showDialog(res.data.message);
            setTimeout(() => {
              wx.clearStorage();
              _this.setClearStore();
              wx.reLaunch({ url: "../loginSelect/main" });
            }, 2000);
          } else if (res.data.code == "423") {
            utils.showDialog(res.data.message);
            setTimeout(() => {
              wx.navigateBack({ delta: 1 }); //返回上一页
            }, 2000);
          } else {
            utils.showDialog(res.data.message);
          }
        });
      }
    },
    tip() {
      var _this = this;
      wx.showModal({
        title: "确认手机号码",
        content:
          "你的咪师当前已经绑定手机号，可通过短信验证码重置咪师密码。即将发送验证码到:" +
          _this.userMobile,
        success: function(res) {
          if (res.confirm) {
            sendSms({ mobile: _this.userMobile, smsType: "modifyPwd" }).then(
              res => {
                if (res.data.code == "200") {
                  utils.showDialog(res.data.message);
                  setTimeout(() => {
                    wx.navigateTo({
                      url:
                        "../setMobileSelectInputCode/main?newMobile=" +
                        _this.userMobile +
                        "&type=1"
                    });
                  }, 2000);
                } else {
                  utils.showDialog(res.data.message);
                }
              }
            );
          } else if (res.cancel) {
            console.log(res.cancel);
          }
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
#setRevisePw {
  padding-top: 30rpx;
  box-sizing: border-box;
  background: rgb(242, 244, 245);
  .setRevisePw_container {
    // width: 100%;
    // margin-top: 30rpx;
    // float: left;
    .container_item {
      font-size: 34rpx;
      background: white;
      padding: 35rpx 30rpx;
      display: flex;
      position: relative;
      align-items: center;
      &:first-child {
        .title,
        > input {
          color: #808080;
        }
      }
      .title {
        width: 200rpx;
      }
      input {
        font-size: 30rpx;
      }
    }
  }
  .tip,
  .tipOne {
    margin-top: 20rpx;
    margin-left: 30rpx;
    color: #808080;
    font-size: 28rpx;
  }
  .tipOne {
    color: #009cff;
  }
  .button_group {
    width: 690rpx;
    position: fixed;
    left: 50%;
    margin-left: -345rpx;
    bottom: 226rpx;
    button {
      background: #ffea55;
      font-size: 34rpx;
      // margin: 0 auto;
      // width: 690rpx;
    }
  }
}
</style>
