<template>
  <div id="about" :style="{'height': height + 'rpx'}">
    <div class="about_logo">
      <div><img src="http://img.mseenet.com/iOS_CutDiagram/logo.png" alt=""></div>
      <div>喵喵校园 版本号:1.9.1</div>
    </div>
    <div class="about_item">
      <div class="name">联系方式</div>
      <div class="text">0592-5223797</div>
    </div>
    <div class="about_item">
      <div class="name">电子邮箱</div>
      <div class="text">xmmishi@mseenet.com</div>
    </div>
    <div class="about_item">
      <div class="name">地址</div>
      <div class="text">厦门市湖里区安岭路966-968号汇金湖里大厦
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      height: ''
    }
  },
  mounted() {

    // 高度自适应
    var _this = this
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth
        _this.height = clientHeight * rpxR
      }
    })
  }
  
}
</script>

<style lang='scss' scoped>
#about {
  background: rgb(242, 244, 245);
  .about_logo {
    padding-top: 50rpx;
    padding-bottom: 60rpx;
    text-align: center;
    > div:nth-child(1) {
      margin-bottom: 20rpx;
      img {
        width: 150rpx;
        height: 150rpx;
      }
    }
  }
  .about_item {
    background: white;
    display: flex;
    align-items: center;
    padding: 25rpx 32rpx;
    .name {
      width: 250rpx;
      font-size: 34rpx;
      color: #333;
    }
    .text {
      text-align: right;
      flex: 1;
      font-size: 30rpx;
      color: #808080;
    }
    & + .about_item {
      border-top: 1rpx solid #e6e6e6;
    }
  }
}
</style>
