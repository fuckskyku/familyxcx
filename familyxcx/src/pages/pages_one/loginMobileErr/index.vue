<template>
  <div id="loginMobileErr">
    <div>
      <img src="http://test.admin.school.mseenet.com/html/img/iOS切图/vacancy_release.png" alt="">
    </div>
    <div class="title">你的手机号未添加<img src="http://test.admin.school.mseenet.com/html/img/iOS切图/login_explain_btn@2x.png" alt="" @click="next"></div>
    <button @click="buttonNext">
      用学生身份证号或护照号进行激活
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mobile: ''
    }
  },
  mounted() {
    this.mobile = this.$mp.query.mobile
  },
  methods: {
    next() {
      wx.navigateTo({
        url: '../loginMobileErrNext/main'
      })
    },
    buttonNext() {
      wx.navigateTo({
        url: '../loginActivation/main?mobile=' + this.mobile
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#loginMobileErr {
  margin-top: 150rpx;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > .title {
    margin-top: 55rpx;
    font-size: 38rpx;
    color: #000000;
    margin-bottom: 100rpx;
    img {
      vertical-align: middle;
      width: 44rpx;
      height: 44rpx;
    }
  }
  > button {
    font-size: 36rpx;
    color: #000000;
    background: #ffea55;
    width: 690rpx;
    border: none;
  }
}
</style>
