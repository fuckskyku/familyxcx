<template>
  <div id="set" :style="{'height': height + 'rpx'}">

    <div @click="bindViewTapSetAccount">帐号与安全
      <div><img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt=""></div>
    </div>

    <div @click="bindViewTapAbout"> 关于咪师
      <div><img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt=""></div>
    </div>
    <button class="login_button" @click="doLogout">退出登录</button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import utils from "@/utils/index";
export default {
  data() {
    return {
      height: ""
    };
  },
  mounted() {
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
    bindViewTapAbout() {
      const url = "../about/main";
      wx.navigateTo({ url });
    },
    bindViewTapSetAccount() {
      const url = "../setAccount/main";
      wx.navigateTo({ url });
    },
    doLogout() {
      var _this = this;
      wx.showModal({
        title: "",
        content: "确定要退出登录吗？",
        success: function(sm) {
          if (sm.confirm) {
            var url = "/pages/pages_one/logout/main";
            wx.reLaunch({
              url: url
            });
          } else if (sm.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
#set {
  padding-top: 20rpx;
  background: rgb(242, 244, 245);
  > div {
    padding: 0 29rpx;
    height: 100rpx;
    line-height: 100rpx;
    font-size: 34rpx;
    color: #333;
    background: white;
    & + div {
      border-top: 1px solid #e6e6e6;
    }
    > div {
      float: right;
      > img {
        width: 15rpx;
        height: 26rpx;
      }
    }
  }
  .login_button {
    background: #ffea55;
    width: 690rpx;
    margin: 0 auto;
    color: #000000;
    font-size: 36rpx;
    margin-top: 50rpx;
  }
}
</style>
