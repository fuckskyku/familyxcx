<template>
  <div id="issue">

    <navigator class="navigator" v-for="(item,index) in itemData" :key="index" open-type="navigateTo" :url='item.toUrl'>
      <img :src="item.img">
    </navigator>
    <tab-bar :activeIndex='1' :objIndex='1'></tab-bar>
  </div>
</template>
<script>
import tabBar from '@/components/tabbar'
export default {
  data() {
    return {
      itemData: [
        {
          toUrl: '../issueHomeWork/main',
          img: 'http://img.mseenet.com/31B507F07D9E00585596087AD92AF592.png'
        }, //作业
        {
          toUrl: '../issueNotice/main',
          img: 'http://img.mseenet.com/A9C30D6949E49BBAC3593DC985C3F223.png'
        }, //通知
        {
          toUrl: '../issueNew/main',
          img: ' http://img.mseenet.com/96F4923FB96C1139A76E386FAC2C135C.png'
        } //新闻
      ]
    }
  },
  components: {
    tabBar
  },
  methods: {
    issue(type) {
      var url = ''
      if (type == 1) {
        //作业
        url = 'pages/pages_two/issueTaskOne/main'
      }
      wx.navigateTo({ url })
    }
  }
}
</script>
<style lang="scss">
#issue {
  width: 100%;
  box-sizing: border-box;
  .navigator {
    img {
      display: block;
      width: 690rpx;
      height: 330rpx;
      margin: 0 auto;
      margin-bottom: 29rpx;
    }
  }
}
</style>

