<template>
  <div>
    
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

    var url = "../loginSelect/main";
    _this.setClearStore();
    wx.clearStorage();
    // wx.clearStorage()
    wx.reLaunch({
      url: url
    });
  },
  methods: {
    ...mapActions(["setClearStore"])
   
  }
};
</script>

<style lang='scss' scoped>
</style>
