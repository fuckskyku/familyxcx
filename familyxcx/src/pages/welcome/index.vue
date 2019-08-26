<template>
  <div id="index" @click="goIndex()">
      <img src="http://img.mseenet.com/8CC19D303A05C8324FD88205FAC02118.jpg">          
  </div>
</template>
<script>
import tabBar from "@/components/tabbar";
import { mapState, mapActions } from "vuex";
import { index } from "@/api/api";
import utils from "@/utils/index";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["family", "token", "selectLoginType"])
  },
  mounted() {


    var that=this;
    setTimeout(function() {
      that.goIndex();
    }, 3000); //页面那边需要做一个倒计时
  },
  components: {
    tabBar
  },
  methods: {
    goIndex() {
      var url = "/pages/pages_one/loginSelect/main";
      if (this.token) {
        switch (this.selectLoginType) {
          case 1:
            url = "/pages/pages_two/index/main";
            break; //老师端
          case 2:
            url = "/pages/pages_one/index/main";
            break; //家长端
        }
      }
      wx.reLaunch({ url });
    },

    getUserInfo() {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: res => {
              this.userInfo = res.userInfo;
            }
          });
        }
      });
    }
  },
  watch: {},

  onShareAppMessage: function(res) {
    return {
      title: "喵喵校园",
      path: "/pages/index/main"
    };
  }
};
</script>

<style scoped lang="scss">
$backgroundColor: white;
$fontSize: 28rpx;
$fontSizeColor: #333333;

#index {
  background: #fff;
  text-align: center;
  font-size: $fontSize;
  color: #a8aab3;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  height: 100vh;
  img {
    width: 100%;
    height: 100%;
    min-height: 100%;
    overflow: hidden;
    display: table;
    width: 100%;
  }
}
</style>
