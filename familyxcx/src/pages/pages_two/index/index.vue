<template>
  <div id="index_section">
    <swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" circular="true" class="swiper_container">
      <block v-for="(item,index) in bannerList" :key="index">
        <swiper-item class="swiper_item">
          <image :src="item.imgUrl" class="slide-image" />
        </swiper-item>
      </block>
    </swiper>
    
    <div class="tip_container" @click="goHerf">
      <navigator open-type="navigateTo" class="herf" url='/pages/pages_one/notice/main'>
        <div class="tip_img">
          <img src="http://img.mseenet.com/iOS_CutDiagram/home/home_notification@2x.png" alt="">
        </div>
        <div class="tip_text">
          <swiper :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" display-multiple-items="2" vertical="true" circular="true" class="swiper_container_two">
            <block v-for="(item,index) in noticsList" :key="index">
              <swiper-item>
                <div class="swiper_item">
                  <div class="tip_title">{{item.newsStyleTypeStr}}</div>
                  <div>
                    <a> {{item.title}}</a>
                  </div>
                </div>
              </swiper-item>
            </block>
          </swiper>
        </div>
        <div class="right">
          <img src="http://img.mseenet.com/iOS_CutDiagram/home/disclosure arrow@3x.png" alt="">
        </div>
      </navigator>
    </div>
    <div class="tab">
      <scroll-view scroll-x="true" class="tab_h">
        <view v-for="(item,index) in item" :class="[isActive==index?'active':'','tab_item']" :key="index" @click="swichNav(index)">{{item.label}}</view>
      </scroll-view>
      <swiper class="tab-content" :current="isActive" duration="300" @change="switchTab" :style="{'height':swiperHeight+'rpx'}">
        <swiper-item v-for="(itemone,indexone) in item" :key="indexone" class="tab-swiper-item">
          <scroll-view scroll-y="true" class="scoll-h" @click="goDetail(isActive,item.id,(item.classId||0),item.linkUrl)" v-for="(item,index) in (isActive==0?newsList:recommendList)" :key="index">
            <!-- <scroll-view scroll-y="true" class="scoll-h" v-for="(item,index) in info" :key="index"> -->
            <block>
              <div class="swiper_block_title" v-if="isActive==0">
                <div class="info">
                  <span class="title">{{item.newsStyleTypeStr}}</span>{{item.title}}
                </div>
              </div>

              <div class="img_item" v-if="isActive==0">
                <img :src="item.titleImgUrl" alt="" v-if="item.titleImgUrl.length>0" />
              </div>

              <div class="img_tip" v-if="isActive==0">
                <div>发布人：{{item.createUserName}}</div>
                <div>{{item.createTime}}</div>
              </div>

              <div class="img_item active" v-if='isActive==1'>
                <img :src="item.titleImgUrl" alt="">
                <div class="groomInfo">{{item.title}}</div>
              </div>

              <div class="img_tip" v-if="isActive==1">
                <div class="groomButton"> </div>
                <div class="groom_flex">
                  <div><img :src="item.boMarkGood?'http://img.mseenet.com/iOS_CutDiagram/information/information_like@3x.png':'http://img.mseenet.com/iOS_CutDiagram/home/home_like_icon@3x.png'" alt=""> {{item.goodCount}}</div>
                  <div><img src="http://img.mseenet.com/iOS_CutDiagram/home/home_information_icon@3x.png" alt=""> {{item.commentCount}}</div>
                  <div><img src="http://img.mseenet.com/iOS_CutDiagram/home/home_share_icon@3x.png" alt=""></div>
                </div>
              </div>
            </block>
          </scroll-view>
        </swiper-item>
      </swiper>
    </div>
    <!-- tabbar -->
    <tab-bar :activeIndex='0' :objIndex='1'></tab-bar>
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
      item: [{ label: "校园" }, { label: "推荐" }],
      isActive: 0,
      swiperHeight: "",
      windowHeight: "",
      indicatorDots: false,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      bannerList: [],
      noticsList: [], //通知列表，按接口命名写的
      recommendList: [],
      newsList: []
    };
  },
  computed: {
    ...mapState(["family"])
  },
  mounted() {
        wx.setNavigationBarTitle({
      title: this.family.schoolName || "喵喵校园" //页面标题 显示学校名称
    });
   
    this.getIndexInfo();
  },
  components: {
    tabBar
  },
  methods: {
    getIndexInfo() {
      index({}).then(res => {
        //console.log(res)
        if (res.data.code == 200) {
          //轮播开始
          var bannerList = res.data.data.bannerList;
          if (bannerList.length > 0) {
            bannerList.forEach(function(item) {
              item.imgUrl = utils.formatImgUrl(item.imgUrl);
            });
          }
          this.bannerList = bannerList;
          //轮播结束

          //通知列表 开始
          var noticsList = res.data.data.noticsList;
          this.noticsList = noticsList;
          //通知列表 结束

          //校园风采列表 开始
          var newsList = res.data.data.newsList;
          if (newsList.length > 0) {
            newsList.forEach(function(item) {
              item.titleImgUrl = utils.formatImgUrl(item.titleImgUrl);
              item.createTime = utils.formatTimeDiff(item.createTime);
            });
          }
          this.newsList = newsList;
          // console.log(this.newsList)
          // var count = 0
          // // console.log(this.newsList)
          // this.newsList.forEach(function(item, index) {
          //   if (item.titleImgUrl == '') {
          //     count++
          //   }
          // })

          //校园风采列表 结束

          //作业列表 开始
          // var homeworkList = res.data.data.homeworkList
          // if (homeworkList.length > 0) {
          //   homeworkList.forEach(function(item) {
          //     item.finishTime = utils.formatTimeDate(
          //       utils.transLocalTime(item.finishTime)
          //     )
          //     ;(item.createTime = utils.formatTimeDiff(item.createTime)),
          //       (item.imgsrc =
          //         item.commAttachList.length > 0
          //           ? item.commAttachList[0].pathName
          //           : '')
          //   })
          // }
          // this.homeworkList = homeworkList
          // console.log(this.homeworkList)
          //作业列表 结束

          //推荐列表 开始
          var recommendList = res.data.data.recommendList;
          if (recommendList.length > 0) {
            recommendList.forEach(function(item) {
              item.titleImgUrl = utils.formatImgUrl(item.titleImgUrl);
              item.createTime = utils.formatTimeDiff(item.createTime);
            });
          }
          this.recommendList = recommendList;
          //推荐列表 结束

          //计算高度
          if (this.isActive == 0) {
            this.swiperHeight = utils.countHeight(this.isActive, this.newsList);
          } else if (this.isActive == 1) {
            this.swiperHeight = utils.countHeight(2, this.recommendList);
          }

          //计算高度 结束
        } else {
          console.log(res.data.message);
        }
      });
    },
    bindViewTap() {
      const url = "../logs/main";
      wx.navigateTo({ url });
    },
    goDetail(isActive, id, classId, linkUrl) {
      var url = "";
      switch (isActive) {
        case 0:
          url = "/pages/pages_one/newsInfo/main?id=" + id;
          if (linkUrl && linkUrl.length > 0)
            url = "/pages/webview/main?url=" + linkUrl;
          break;
        case 1:
          url = "/pages/pages_one/newsInfo/main?id=" + id;
          if (linkUrl && linkUrl.length > 0)
            url = "/pages/webview/main?url=" + linkUrl;
          break;
      }
      wx.navigateTo({ url });
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
    },
    switchTab(e) {
      // if (this.$mp.query.type == '0') {
      // } else if (this.$mp.query.type == '1') {
      // }
      this.isActive = e.target.current;
    },
    swichNav(index) {
      // if (this.$mp.query.type == '0') {
      // } else if (this.$mp.query.type == '1') {
      // }
      this.isActive = index;
    }
  },
  watch: {
    isActive() {
      if (this.isActive == 0) {
        this.swiperHeight = utils.countHeight(this.isActive, this.newsList);
      } else if (this.isActive == 1) {
        this.swiperHeight = utils.countHeight(2, this.recommendList);
      }
    }
  },
  //下拉刷新
  onPullDownRefresh: function() { 
    this.getIndexInfo();
    setTimeout(() => {
      wx.stopPullDownRefresh(); //停止下拉元点
    },1500)
  },
  onShareAppMessage: function(res) {
    return {
      title: "教师端_喵喵校园",
      path: "/pages/pages_two/index/main"
    };
  }
};
</script>

<style scoped lang="scss">
$backgroundColor: white;
$fontSize: 28rpx;
$fontSizeColor: #333333;
#index_section {
  // border: 1px solid red;
  background: rgb(242, 244, 245);
  .swiper_container {
    height: 350rpx;
    .slide-image {
      width: 100%;
      height: 100%;
    }
  }
  .tip_container {
    > .herf {
      background: $backgroundColor;
      box-sizing: border-box;
      padding: 32rpx 30rpx;
      display: flex;
      align-items: center;
      height: 140rpx;
      .tip_img {
        margin-right: 15rpx;
        > img {
          vertical-align: middle;
          width: 84rpx;
          height: 76rpx;
        }
      }
      .tip_text {
        width: 100%;
        height: 125%;
        .swiper_container_two {
          height: 102%;
          .swiper_item {
            height: 100%;
            font-size: $fontSize;
            display: flex;
            align-items: center;
            color: $fontSizeColor;
            .tip_title {
              margin-right: 20rpx;
              padding: 5rpx 9rpx;
              font-size: 22rpx;
              background: #ffea55;
            }
          }
        }
      }
      .right {
        img {
          max-width: 100%;
          // border: 1px solid red;
          width: 15rpx;
          height: 26rpx;
        }
      }
    }
  }
  .tab {
    height: 100%;
    // height: 500rpx;
    position: relative;
    background: $backgroundColor;
    margin-top: 10rpx;
    .tab_h {
      height: 65rpx;
      width: 100%;
      background: $backgroundColor;
      // border: 1px solid red;
      padding-top: 29rpx;
      // text-align: center;
      white-space: nowrap;
      padding-bottom: 10rpx;
      text-align: center;
      .tab_item {
        & + .tab_item {
          margin-left: 150rpx;
        }
        color: #808080;
        font-size: 35rpx;
        display: inline-block;
        margin: 0 29rpx;
        &.active {
          color: #333333;
          position: relative;
          // background: yellow;
          &::after {
            position: absolute;
            bottom: -14rpx;
            left: 0;
            right: 0;
            height: 6rpx;
            content: "";
            display: block;
            background: #ffea55;
          }
        }
      }
    }
    .tab-content {
      // border: 1px solid red;
      margin-bottom: 95rpx;
      .tab-swiper-item {
        box-sizing: border-box;
        padding: 0 32rpx;
      }
      .scoll-h {
        margin-bottom: 15rpx;
        width: 100%;
        .swiper_block_title {
          width: 100%;
          font-size: 28rpx;
          .info {
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            .title {
              display: inline-block;
              margin-right: 10rpx;
              border-radius: 5px;
              color: #333333;
              text-align: center;
              background: #ffea55;
              padding: 5rpx 10rpx;
              line-height: 28rpx;
            }
          }
          .homeWorkinfo {
            display: flex;
            align-items: center;
            justify-content: space-between;
            // text-align: center;
            .new {
              flex: 1;
              font-weight: 600;
              color: #fd0000;
            }
            .class {
              flex: 2;
            }
            .timeOK {
              text-align: right;
              flex: 6;
              color: #b3b3b3;
              font-size: 28rpx;
            }
          }
        }
        .img_item {
          .info {
            padding-top: 25rpx;
            font-size: 28rpx;
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            .title {
              display: inline-block;
              margin-right: 10rpx;
              border-radius: 5px;
              color: #333333;
              text-align: center;
              background: #ffea55;
              padding: 5rpx 10rpx;
              line-height: 28rpx;
            }
          }
          img {
            margin-top: 10rpx;
            // flex: 1;
            display: block;
            // border: 1px solid red;
            width: 690rpx;
            height: 300rpx;
          }
          &.active {
            flex-direction: column;
          }
          .groomInfo {
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            padding-top: 20rpx;
            font-size: 26rpx;
            color: #333333;
          }
        }
        .img_tip {
          padding: 20rpx 0;
          width: 100%;
          display: flex;
          border-bottom: 1px solid #e6e6e6;
          > div {
            font-size: 24rpx;
            color: #808080;
            flex: 1;
            &:first-child {
              text-align: left;
            }
            &:last-child {
              text-align: right;
            }
          }
          .homeWorkNotice {
            &.active {
              color: #29d7be;
            }
          }
          .homeWorkTacher {
            color: #808080;
          }
          .time {
            color: #808080;
          }
          .groomButton {
            font-size: 26rpx;
            color: #f70044;
          }
          .groom_flex {
            display: flex;
            justify-content: space-around;
            align-items: center;
            > div {
              // flex: 1;
              > img {
                vertical-align: middle;
              }
              &:nth-child(1) {
                > img {
                  width: 32rpx;
                  height: 28rpx;
                }
              }
              &:nth-child(2) {
                > img {
                  width: 32rpx;
                  height: 30rpx;
                }
              }
              &:nth-child(3) {
                > img {
                  width: 30rpx;
                  height: 30rpx;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
