<template>
  <div id="instiutionSelect" :style="{'height': height + 'rpx'}">
    <div class="instiution_container">
      <div class="instiution_item" @click="bindViewTapMyIssue(4)">
        <div class="instiution_item_title">作业管理</div>
        <div class="instiution_item_icon">
          <span>{{list.numberHomework}}</span>
          <img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt="">
        </div>
      </div>
      <div class="instiution_item" @click="bindViewTapMyIssue(3)">
        <div class="instiution_item_title">通知</div>
        <div class="instiution_item_icon">
          <span>{{list.numberNotics}}</span>
          <img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt="">
        </div>
      </div>
      <div class="instiution_item" @click="bindViewTapMyIssue(2)">
        <div class="instiution_item_title">新闻</div>
        <div class="instiution_item_icon">
          <span>{{list.numberNews}}</span>
          <img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt="">
        </div>
      </div>
      <div class="instiution_item" @click="bindViewTapMyIssue(1)">
        <div class="instiution_item_title">校园风采</div>
        <div class="instiution_item_icon">
          <span>{{list.numberStyle}}</span>
          <img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { myRlease } from '@/api/api'
import utils from '@/utils/index'

export default {
  data() {
    return {
      height: '',
      list: ''
    }
  },
  computed: {},
  mounted() {
    //自适应高度
    var _this = this
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth
        _this.height = clientHeight * rpxR
      }
    })
    _this.loadData();

  },
 // 下拉刷新方法，与methods方法同级
async onPullDownRefresh() {
this.loadData();
  // 停止下拉刷新
  wx.stopPullDownRefresh();
},

// 上拉加载，拉到底部触发
onReachBottom() {
  // 到这底部在这里需要做什么事情 
},
  methods: {
    //跳转我的发布
    bindViewTapMyIssue(type) {
      let url = '../myIssueList/main?type=' + type
      wx.navigateTo({ url })
    },
    loadData(){
    myRlease().then(res => {
      // console.log(res)
      if ((res.data.code = '200')) {
        this.list = res.data.data
      }
    })
    }
  }
}
</script>

<style lang="scss" scoped>
#instiutionSelect {
  background: rgb(242, 244, 245);
  .instiution_container {
    padding-top: 20rpx;
    .instiution_item {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      position: relative;
      background: white;
      font-size: 34rpx;
      padding: 35rpx 20rpx;
      align-items: center;
      justify-content: space-between;
      // border: 1px solid red;
      &::after {
        display: block;
        position: absolute;
        content: '';
        height: 1rpx;
        width: calc(100% - 20rpx);
        right: 0;
        bottom: 1rpx;
        background: #e6e6e6;
      }
      .instiution_item_icon {
        > span {
          font-size: 30rpx;
          color: #f70044;
          margin-right: 20rpx;
          display: inline-block;
        }
        > img {
          width: 15rpx;
          height: 26rpx;
        }
      }
    }
  }
}
</style>
