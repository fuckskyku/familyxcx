<template>
  <div id="notice">
    <div class="notice_item" @click="goDetail(item.id)" v-for="(item,index) in noticsList" :key="index" v-if="noticsList&&noticsList.length>0">
      <div class="item_icon">
        <img src="http://img.mseenet.com/iOS_CutDiagram/home/information_inform@3x.png" alt="" mode="aspectFit">
      </div>
      <div class="item_info">
        <div class="item_info_flex">
          <div :class="['title',!item.markRead?'active':'']">{{item.newsStyleTypeStr}}</div>
          <div class="time">{{item.createTime}}</div>
        </div>
        <div class="item_text">
          {{item.title}}
        </div>
      </div>
    </div>
     <div class="noData" v-if="noticsList.length==0">   <img src="/static/img/vacancy_release.png">
          <span>暂时没有内容哦~</span></div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { noticsList, info } from "@/api/api";
import utils from "@/utils/index";
export default {
  data() {
    return {
      noticsList: [], //通知列表，按接口命名写的
      url: ""
    };
  },
  computed: {
    ...mapState(["family"])
  },
  onShow() {
    this.initData();
    this.getNoticsList();
  },
  methods: {
    getNoticsList: function() {
      var param = {
        pageNo: 1,
        pageSize: 20,
        studentId: this.family.studentId
      };
      noticsList(param).then(res => {
       // console.log(res);
        if (res.data.code == 200) {
          //通知列表 开始
          var noticsList = res.data.data.data;
          if (noticsList.length > 0) {
            noticsList.forEach(function(item) {
              item.createTime = utils.formatTimeDiff(item.createTime);
            });
          }
          this.noticsList = noticsList;
          //通知列表 结束
        } else {
          console.log(res.data.message);
        }
      });
    },
    goDetail(id) {
      let url = "../noticeInfo/main?id=" + id;
     // console.log(id);
      info({ id: id }).then(res => {
        if (res.data.code == "200") {
          wx.navigateTo({ url });
        }
      });
    },
    //初始化数据
    initData: function() {
      this.noticsList = [];
    }
  },

  // 下拉刷新方法，与methods方法同级
  async onPullDownRefresh() {
 //console.log("onPullDownRefresh")
   this.getNoticsList();
  // 停止下拉刷新
  wx.stopPullDownRefresh();
},

// 上拉加载，拉到底部触发
onReachBottom() {
  // 到这底部在这里需要做什么事情
 // this.loadMore();
},

};
</script>

<style scoped lang="scss">
$fontSize: 30rpx;
#notice {
  display: flex;
  align-items: center;
  flex-direction: column;
  .navigator {
    width: 100%;
  }
  .notice_item {
    position: relative;
    display: flex;
    width: 100%;
    box-sizing: border-box;
    & + .notice_item::after {
      position: absolute;
      top: 0;
      right: 0;
      height: 1rpx;
      background: #e6e6e6;
      display: block;
      content: "";
      width: 95%;
    }
    .item_icon {
      padding: 16rpx 30rpx;
      img {
        width: 88rpx;
        height: 88rpx;
      }
    }
    .item_info {
      padding-right: 15rpx;
      flex: 1;
      display: flex;
      font-size: $fontSize;
      flex-direction: column;
      justify-content: center;
      .item_info_flex {
        display: flex;
        > div {
          flex: 1;
        }
        .title {
          position: relative;
          color: #333333;
          &.active::before {
            position: absolute;
            content: "";
            display: block;
            width: 10rpx;
            height: 10rpx;
            background: #ff0000;
            border-radius: 10rpx;
            left: -20rpx;
            top: 50%;
            margin-top: -5rpx;
            border: 1px solid #ff0000;
          }
        }
        .time {
          color: #b3b3b3;
          text-align: right;
          font-size: 22rpx;
        }
      }
      .item_text {
        width: 93%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 15rpx;
        color: #808080;
      }
    }
  }
  .noData {
    background: #fff;
    text-align: center;
    font-size: $fontSize;
    color: #a8aab3;
    padding-top: 50rpx;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    img {
      width: 300rpx;
      height: 334rpx;
      display: block;
    }
    span {
      width: 100%;
      display: block;
      margin-top: 30rpx;
    }
  }
}
</style>
