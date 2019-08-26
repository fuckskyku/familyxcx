<template>
    <div id="mcDetail">
        <div class="userInfo">
            <img :src="storeInfo.storeLogoImg">
            <div class="titleScope">
                <h3>{{storeInfo.storeName}}</h3>
                <div class="titleScope-item">
                    <scope-view :scope="storeInfo.storeScore"></scope-view>
                    <span class="comment">{{storeInfo.countReview}}人评价</span>
                    <img src="/static/img/approve_icon@2x.png" v-if="storeInfo.storeStatus==2">
                </div>
            </div>
        </div>
        <!--图片部分 可以滑动-->
        <div class="swiper-home" v-if="storeImgs.length>0">
            <scroll-view scroll-x="true" style="width: 100%">
                <view class="swiper-item" v-for="(item,index) in storeImgs" :key="index" >
                    <img :src="item" @click="imgYu" :data-list="storeImgs" :data-src="item">
                </view>
            </scroll-view>
        </div>
        <div class="address" @click="openAddress(storeInfo.storeLng,storeInfo.storeLat)">
            <img src="/static/img/location@2x.png">
            <span>{{storeInfo.address}}</span>
        </div>
        <!--课程列表数据-->
        <div class="cur-home">
            <h3 class="cur-title">本店课程</h3>
            <ul class="cur-list">
                <li @click="getCurDetail(item.id)" v-for="(item,index) in goodsList" :key="index">
                    <img mode="aspectFill" :src="item.titleImg">
                    <p>{{item.goodName}}</p>
                </li>
            </ul>
            <!-- <div v-if="goodsList.length>0" class="more">查看更多教程&nbsp;></div> -->
            <div v-if="goodsList.length<=0" class="noData">暂无数据</div>
        </div>
        <!--品牌介绍-->
        <div class="curIntroduce">
            <h3 class="cur-title">品牌介绍</h3>
            <p>{{storeInfo.storeInfo}}
            </p>
        </div>

        <!--底部导航-->
        <div class="bottomNav">
          <div class="xiao" @click="goHome">
            <img class="homeimg" src="/static/img/home.png">
            <p>首页</p>
          </div>
          <button class="share" plain="true" open-type="share">
            <img src="/static/img/share.png">
            <p>分享</p>
          </button>
          <div class="large" @click="goPhone()">
            咨询我们
          </div>
        </div>
    </div>
</template>
<script>
import { getStoreInfo } from "@/api/apiRetailer";
import utils from "@/utils/index";
import scopeView from "@/components/scopeView";

export default {
  components: {
    scopeView
  },
  data() {
    return {
      storeInfo: {},
      storeImgs: [
        //轮播图
      ],
      goodsList: {},
      reviewList: {},
      teacherList: {},
      storeId: "",
      phone: ""
    };
  },
  methods: {
    //点击图片 实现图片预览
    imgYu: function(event) {
      var src = event.currentTarget.dataset.src; //获取data-src
      var imgList = event.currentTarget.dataset.list; //获取data-list
      //图片预览
      wx.previewImage({
        current: src, // 当前显示图片的http链接
        urls: imgList // 需要预览的图片http链接列表
      });
    },
    //地理定位
    openAddress: function(lng, lat) {
      wx.openLocation({
        latitude: lat,
        longitude: lng,
        scale: 28
      });
    },
    getStoreInfo: function(storeId) {
      var that = this;
      wx.showLoading({
        title: "加载中"
      });

      getStoreInfo({
        storeId: storeId || 3
      }).then(res => {
        if (res.data.code == 200) {
          /*商铺信息 开始*/
          that.phone = res.data.data.storeExList[0].storeTel;
          var storeExList = res.data.data.storeExList;
          if (storeExList.length > 0) {
            storeExList.forEach(function(item) {
              item.storeLogoImg = utils.formatImgUrlRetailer(item.storeLogoImg);
            });
            this.storeInfo = storeExList[0];
            wx.setNavigationBarTitle({
              title: this.storeInfo.storeName //页面标题
            });
          }

          /*商铺信息 结束*/

          /*商铺图片 开始*/
          var storeImgs = res.data.data.storeExList[0].storeImgs;

          if (storeImgs.length > 0) {
            var result = storeImgs;
            for (let i = 0; i < result.length; i++) {
              result[i] = utils.formatImgUrlRetailer(result[i]);
            }
            this.storeImgs = result;
          }

          /*商铺图片 结束*/

          /*本店课程 开始*/
          var goodsList = res.data.data.goodsList;
          if (goodsList.length > 0) {
            goodsList.forEach(function(item) {
              item.titleImg = utils.formatImgUrlRetailer(item.titleImg);
            });
            this.goodsList = goodsList;
          }

          /*本店课程 结束*/
          wx.hideLoading();
        }
      });
    },
    //初始化数据
    initData: function() {
      this.storeInfo = {};
      this.storeImgs = [];
      this.goodsList = {};
      this.reviewList = {};
      this.teacherList = {};
    },
    //查看课程详情
    getCurDetail: function(curId) {
      let url = "/pages/business/curDetail/main?curId=" + curId;
      wx.navigateTo({ url });
    },
    //返回首页
    goHome() {
      wx.navigateTo({
        url: "/pages/business/index/main"
      });
    },
    //联系我
    goPhone() {
      console.log(this.phone);
      wx.makePhoneCall({
        phoneNumber: this.phone
      });
    }
  },
  onLoad: function(option) {
    this.initData();
    var storeId = option.storeId;
    this.storeId = option.storeId;
    this.getStoreInfo(storeId);
  },
  onShareAppMessage: function(res) {
    return {
      title: this.storeInfo.storeName || "喵喵教育",
      path: "pages/business/trainDetail/main?storeId=" + this.storeId
    };
  }
};
</script>
<style lang="scss">
$fontColor: #333333;
$fontSize: 28rpx;
#mcDetail {
  background: #e6e6e6;
  .userInfo {
    background: #ffea55;
    display: flex;
    flex-wrap: nowrap;
    border-bottom: dotted #e6e6e6 1px;
    padding: 30rpx;
    > img {
      width: 120rpx;
      height: 120rpx;
      margin-right: 20rpx;
      border-radius: 8rpx;
    }
    .titleScope {
      box-sizing: border-box;
      flex: 1;
      padding: 5rpx 0;
      h3 {
        color: $fontColor;
        font-size: 30rpx;
        margin-bottom: 20rpx;
      }
      .titleScope-item {
        .comment {
          font-size: 24rpx;
          color: $fontColor;
          margin-left: 20rpx;
          padding-right: 20rpx;
          border-right: solid 1px #fff;
        }
        > img {
          width: 88rpx;
          height: 28rpx;
          margin-left: 20rpx;
          position: relative;
          top: 5rpx;
        }
      }
    }
  }
  .swiper-home {
    background: #fff;
    width: 100%;
    height: 162rpx;
    box-sizing: border-box;
    display: flex;
    white-space: nowrap; //这个属性很重要
    .swiper-item {
      width: 216rpx;
      height: 100%;
      display: inline-block;
      margin-right: 4rpx;
    }
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .address {
    padding: 25rpx 30rpx;
    color: $fontColor;
    font-size: 26rpx;
    display: flex;
    align-items: center;
    background: #fff;
    margin-bottom: 20rpx;
    > img {
      width: 35rpx;
      height: 40rpx;
      margin-right: 20rpx;
    }
  }
  /*本店课程*/
  .cur-home {
    background: #fff;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 20rpx;
    .cur-title {
      padding: 30rpx;
      color: $fontColor;
      font-size: 30rpx;
      border-bottom: dotted #e6e6e6 1rpx;
    }
    .cur-list {
      padding-left: 20rpx;
      li {
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: dotted #e6e6e6 1rpx;
        > img {
          width: 88rpx;
          height: 88rpx;
          border-radius: 8rpx;
          margin-right: 20rpx;
        }
        > p {
          color: $fontColor;
          font-size: 30rpx;
          width: 520rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .more {
      height: 65rpx;
      line-height: 65rpx;
      text-align: center;
      color: #f70044;
      font-size: 26rpx;
    }
    .noData {
      height: 65rpx;
      line-height: 65rpx;
      text-align: center;
      font-size: 26rpx;
      color: #e6e6e6;
    }
  }
  /**/
  .curIntroduce {
    background: #fff;
    margin-bottom: 100rpx;
    .cur-title {
      padding: 30rpx;
      color: $fontColor;
      font-size: 30rpx;
      border-bottom: dotted #e6e6e6 1rpx;
    }
    p {
      padding: 30rpx;
      box-sizing: border-box;
      color: $fontColor;
      font-size: 30rpx;
      line-height: 40rpx;
    }
  }
  /*底部导航*/
  .bottomNav {
    width: 100%;
    height: 90rpx;
    box-sizing: border-box;
    padding-left: 10rpx;
    padding: 5rpx 10rpx;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    position: fixed;
    left: 0;
    bottom: 0;
    background: #fff;
    img {
      width: 40rpx;
      height: 40rpx;
    }
    div {
      display: block;
      text-align: center;
      font-size: 26rpx;
    }
    .xiao {
      width: 100rpx;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-content: space-around;
      justify-content: center;

      p {
        width: 100%;
        color: $fontColor;
      }
    }
    .share {
      display: block;
      width: 100rpx;
      height: 80rpx;
      padding: 0;
      position: relative;
      border: none;
      outline: none;
      img {
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -20rpx;
      }
      p {
        font-size: 26rpx;
        position: absolute;
        bottom: -16rpx;
        left: 0;
        text-align: center;
        padding: 0;
        width: 100%;
        color: $fontColor;
      }
    }
    .large {
      flex: 1;
      background: #ffea55;
      color: #fff;
      height: 100%;
      line-height: 80rpx;
      font-size: 30rpx;
      border-radius: 10rpx;
    }
  }
}
</style>


