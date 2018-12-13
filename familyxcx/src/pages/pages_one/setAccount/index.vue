<template>
  <div id="account" :style="{'height': height + 'rpx'}">
    <div class="account_item">
      帐号
      <div class="text">{{userMobile}}</div>
    </div>

    <div class="account_item" @click="changeMobile">
      更换手机号
      <div class="text">{{userMobile}}
        <img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt="">
      </div>
    </div>

    <div class="account_item" @click="changePassword">
      登录密码
      <div class="text">已设置
        <img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt="">
      </div>
    </div>

    <div class="show" v-if="show"></div>
    <div class="input" v-if="show">
      <div class="title">验证原始密码</div>
      <input type="text">
      <div class="button_group">
        <button>取消</button>
        <button>确定</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import utils from '@/utils/index'
export default {
  data() {
    return {
      height: '',
      show: false
    }
  },
  computed:{
    ...mapState(['userMobile'])
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
  },
  methods: {
    changeMobile() {
      wx.navigateTo({
        url: '../setMobileSelect/main'
      })
    },
    changePassword() {
      wx.navigateTo({
        url: '../setRevisePw/main'
      })
    }
  }
}
</script>

<style lang='scss' scoped>
#account {
  padding-top: 20rpx;
  background: rgb(242, 244, 245);
  .account_item {
    padding: 0 29rpx;
    height: 100rpx;
    line-height: 100rpx;
    font-size: 34rpx;
    color: #333;
    background: white;
    & + div {
      border-top: 1px solid #e6e6e6;
    }
    .text {
      color: #808080;
      font-size: 30rpx;
      > img {
        margin-left: 20rpx;
        width: 15rpx;
        height: 26rpx;
      }
    }
    > div {
      float: right;
    }
  }

  .show {
    z-index: 999;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  .input {
    width: 540rpx;
    height: 300rpx;
    background: rgb(248, 248, 248);
    top: 50%;
    left: 50%;
    margin-top: -150rpx;
    margin-left: -270rpx;
    position: fixed;
    z-index: 9999;
    border-radius: 26px;
    overflow: hidden;
    > .title {
      text-align: center;
      color: #fb5332;
      font-size: 34rpx;
      margin-top: 45rpx;
    }
    > input {
      border: 1rpx solid #808080;
      margin: 0 auto;
      margin-top: 35rpx;
      background: white;
      width: 476rpx;
    }
    > .button_group {
      margin-top: 40rpx;
      display: flex;
      button {
        margin-bottom: 10rpx;
        font-size: 34rpx;
        flex: 1;
      }
    }
  }
}
</style>
