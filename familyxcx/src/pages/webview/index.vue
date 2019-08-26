<template>
  <div id="index">
    <web-view :src="url"></web-view>
  </div>

</template>
<script>
import tabBar from "@/components/tabbar";
import { mapState, mapActions } from "vuex";
import { index } from "@/api/api";
import utils from "@/utils/index";
export default {
  data() {
    return {
      url: ""
    };
  },
  computed: {
    ...mapState(["family", "token", "selectLoginType"])
  },
  mounted() {
    var that = this;
    that.url = this.$mp.query.url;
    // wx.setNavigationBarTitle({
    //   title: "喵喵校园" //页面标题
    // });
  },
  components: {
    tabBar
  },
  methods: {},
  watch: {},

  onShareAppMessage: function(res) {
    return {
      title: "喵喵校园",
      path: "pages/welcome/main"
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
  }
}
</style>
