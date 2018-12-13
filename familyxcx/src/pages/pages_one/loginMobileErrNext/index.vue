<template>
  <div id="loginMobileErrNext">
    <pre>
      <img src="http://img.mseenet.com/iOS_CutDiagram/login_explain_btn@2x.png" alt=""><span class="title">手机号未添加？</span>
      <p>
      由于后台没有录入您的手机号码或者手机号码录入错误，您可以用学生的身份证号码或者护照号码 (外国朋友) 进行激活绑定您的手机号码后，您就可以正常登陆。
      </p>
      <p>
      若您已经有其他家长已经加入了该平台，您可以联系其他家长帮你添加。<span>(在家长端-我的-设置-添加家长)</span>
      </p>
    </pre>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
#loginMobileErrNext {
  pre {
    padding: 20rpx;
    > .title {
      font-size: 40rpx;
    }
    > p {
      text-indent: 2em;
      padding-top: 20rpx;
      color: #666666;
      font-size: 35rpx;
      >span{
        color: #2E9EFC;
      }
    }
    > img {
      vertical-align: middle;
      width: 44rpx;
      height: 44rpx;
    }
  }
}
</style>
