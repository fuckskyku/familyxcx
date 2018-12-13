<template>
  <div id="setMobileSelect" :style="{'height':height+'rpx'}">
    <div class="tip">
      更换手机后，下次登录使用新手机号登录。 当前手机号：{{userMobile}}
    </div>

    <div class="setMobileSelect_container">
      <picker :value="index" :range="array" @change="bindchange">
        <div class="picker_container">
          <div class="addressTitle">国家/地区</div>
          <div class="addressValue">
            <div>{{array[index]}}</div>
            <img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt="">
          </div>
        </div>
      </picker>
      <div class="container_item">
        <div class="addressTitle">
          <span>+86</span>
        </div>
        <div class="addressValue">
          <input type="text" placeholder="请填写手机号码" v-model="newMobile">
        </div>
      </div>
    </div>

    <div class="button_group">
      <button @click="go">下一步</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { modifyMobile, sendSms } from "@/api/api";
import utils from "@/utils/index";
export default {
  data() {
    return {
      height: "",
      newMobile: "",
      array: ["美国", "中国", "巴西", "日本"],
      index: 1
    };
  },
  computed: {
    ...mapState(["userMobile"])
  },
  mounted() {
    // this.mobile = this.$mp.query.mobile
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
    go() {
      var _this = this;
      if (!utils.required(this.newMobile)) {
        utils.showDialog("请输入手机号码");
        return;
      }
      if (!utils.tel(this.newMobile)) {
        utils.showDialog("您输入的手机号码不正确");
        return;
      }
      if (utils.equalTo(this.newMobile, this.userMobile)) {
        utils.showDialog("手机号码没有更换");
        return;
      }
      wx.showModal({
        title: "确认手机号码",
        content: "我们将把验证码发送到这个手机号码:" + _this.newMobile,
        success: function(res) {
          if (res.confirm) {
            sendSms({ mobile: _this.newMobile, smsType: 'modifyMobile' }).then(
              res => {
                if (res.data.code == '200') {
                  wx.navigateTo({
                    url:
                      '../setMobileSelectInputCode/main?newMobile=' +
                      _this.newMobile +
                      '&type=0'
                  })
                } else {
                  utils.showDialog(res.data.message)
                }
              }
            )

            // wx.navigateTo({
            //   url:
            //     "../setMobileSelectInputCode/main?newMobile="+_this.newMobile +"&type=0"
            // });
          } else if (res.cancel) {
          }
        }
      });
    },
    bindchange(e) {
      this.index = e.mp.detail.value;
    }
  }
};
</script>

<style lang="scss" scoped>
#setMobileSelect {
  background: rgb(242, 244, 245);
  .tip {
    padding: 45rpx 63rpx;
    color: #808080;
    font-size: 34rpx;
  }
  .setMobileSelect_container {
    .picker_container,
    .container_item {
      padding: 35rpx 30rpx;
      display: flex;
      align-items: center;
      background: white;
      .addressTitle {
        width: 300rpx;
        font-size: 34rpx;
        > span {
          color: #2e9efc;
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
