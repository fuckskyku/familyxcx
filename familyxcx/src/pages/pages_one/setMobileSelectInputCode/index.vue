<template>
  <div id="setMobileSelectInputCode" :style="{'height':height+'rpx'}">
    <div class="tip">
      短信验证码已发送，请填写验证码
    </div>
    <div class="setMobileSelect_container">
      <div class="picker_container">
        <div class="addressTitle">手机号</div>
        <div class="addressValue">
          <input type="text" disabled v-model="newMobile">
          <!-- <div>{{array[index]}}</div> -->
        </div>
      </div>
      <div class="container_item">
        <div class="addressTitle code">
          验证码
        </div>
        <div class="addressValue">
          <input type="text" placeholder="请填写验证码" class="code" v-model="code">
        </div>
      </div>
      <div class="code_tip" @click="tip">
        收不到验证码?
      </div>
    </div>

    <div class="button_group">
      <button @click="go">{{type==1?'下一步':'完成'}}</button>
    </div>
  </div>
</template>

<script>
import { modifyMobile } from "@/api/api";
import utils from "@/utils/index";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      height: "",
      code: "",
      newMobile: "",
      type: ""
    };
  },
    computed: {
    ...mapState(["selectLoginType", "userMobile"])
  },
  mounted() {
    this.type = this.$mp.query.type;
    this.newMobile = this.$mp.query.newMobile;
    // console.log(this.$mp.query);
    // 高度自适应
    var _this = this;
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
    go() {
      if (this.type == 0) {
        if (!utils.required(this.newMobile)) {
          utils.showDialog("请输入手机号码");
          return;
        }
        if (!utils.tel(this.newMobile)) {
          utils.showDialog("您输入的手机号码不正确");
          return;
        }
        if (!utils.required(this.code)) {
          utils.showDialog("请输入验证码");
          return;
        }
        var _this=this;
        modifyMobile({
          newMobile: this.newMobile,
          newMobileCode: this.code
        }).then(res => {
          if (res.data.code == "200") {
            wx.showToast({
              title: "成功",
              icon: "success",
              duration: 2000
            });
            setTimeout(function() {
              
            wx.clearStorage();
            _this.setClearStore();
            wx.reLaunch({ url: "../loginSelect/main" });
              
            }, 2000);
          } else {
            utils.showDialog(res.data.message);
          }
        });
      } else {
        //这边没有验证验证码是否正确？
        wx.navigateTo({
          url: "../setRevisePw/main?type=0&code="+this.code
        });
      }
    },
    tip() {
      wx.showActionSheet({
        itemList: ["重新获取验证码"],
        success: function(res) {
          console.log(res.tapIndex);
        },
        fail: function(res) {
          console.log(res.errMsg);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#setMobileSelectInputCode {
  background: rgb(242, 244, 245);
  .tip {
    text-align: center;
    padding: 45rpx 63rpx;
    color: #808080;
    font-size: 34rpx;
  }
  .setMobileSelect_container {
    .code_tip {
      margin-top: 50rpx;
      color: 30rpx;
      text-align: center;
      width: 100%;
      color: #009cff;
    }
    .picker_container,
    .container_item {
      padding: 35rpx 30rpx;
      display: flex;
      align-items: center;
      background: white;
      .addressTitle {
        color: #808080;
        width: 300rpx;
        font-size: 34rpx;
        > span {
          color: #2e9efc;
        }
        &.code {
          color: #333;
        }
      }
      .addressValue {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 30rpx;
        > img {
          margin-left: 20rpx;
          width: 15rpx;
          height: 26rpx;
        }
        > input {
          color: #808080;
        }
        input.code {
          color: #333;
        }
      }
    }
    .container_item {
      border-top: 1rpx solid #e6e6e6;
    }
  }
  .button_group {
    width: 690rpx;
    position: fixed;
    bottom: 225rpx;
    left: 50%;
    margin-left: -345rpx;
    button {
      background: #ffea55;
      font-size: 34rpx;
      border-radius: 8rpx;
    }
  }
}
</style>
