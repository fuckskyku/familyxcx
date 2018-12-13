<template>
  <div id="index">
    <!--轮播图片-->
    <div class="swiper-home">    

          <div id="swiper">
        <swiper :indicator-dots="indicatorDots" circular="true"
          :autoplay="autoplay" :next-margin="nextMargin" :vertical="vertical" :display-multiple-items="displayItems" :interval="interval" :duration="duration" indicator-color="rgba(255,255,255,.5)" indicator-active-color="#fff">
          <block v-if="bannerList" v-for="(item,index) in bannerList" :key="index">
            <swiper-item>
              <image @click="toPlay('/pages/business/trainDetail/main?storeId='+item.storeId)" :src="item.adImg" class="slide-image"/>
            </swiper-item>
          </block>       
        </swiper>       
    </div>

    </div>
    <!--tab导航栏-->
    <!-- <tab-view :tabActive="0"></tab-view> -->
    <!--搜索框-->
    <a class="search" href="/pages/business/trainList/main">
      <img src="/static/img/nearby_search_grey@2x.png">
      <span>搜索</span>
    </a>
    <!--教程分类-->
    <div class="typeClass">
        <ul class="classList-home">
          <li @click="specialClick(item.id,item.title)" v-for="(item,index) in typeClassList" :key="index" class="classList-item">
            <img :src="item.icon"/>
            <p>{{item.title}}</p>
          </li>
        </ul>
        <!-- <a class="guanggao" href=""><img src="/static/img/Coupon@2x.png"/></a> -->
    </div>
    <!--广告-->
    <a class="Advertisement" href="" v-for="(item,index) in adMidList" :key="index">
      <img mode="aspectFill" :src="item.adImg" @click="toPlay('/pages/business/trainDetail/main?storeId='+item.storeId)"/>
    </a>
   
    <!--分割线-->
    <div class="line"></div>
    <!--课程专区-->
    <div class="special">
      <h3 class="special-title">妙课专区</h3>
      <ul class="special-home">
        <li  @click="goCur(item)" class="special-item" v-for="(item,index) in resultListOK" :key="index">
          <img v-if="!item.isGG" mode="aspectFill" :src="item.goodImg"/>
          <img v-else mode="aspectFill" :src="item.adImg"/>
          <h2 v-if="item.isGG">{{item.adName}}</h2>
          <h2 v-else><span v-if="item.isTop>0" class="special-top">精品 </span>{{item.goodName}}</h2>
          <!-- <h2 v-else><span>广告</span>{{item.adName}}</h2> -->
          <p><span v-if="item.isGG">广告</span>{{item.storeName}}</p>
        </li>
      </ul>
    </div>
     <!-- tabbar -->
    <tab-bar :activeIndex='1' :objIndex='0'></tab-bar>
  </div>
</template>

<script>
import tabBar from '@/components/tabbar'
import { getBannerAdGood } from "@/api/apiRetailer";
import utils from "@/utils/index";

export default {
  data() {
    return {
      userInfo: {},
      //分类课程导航
      typeClassList: [
        {
          id: 1,
          title: "舞蹈",
          icon: "/static/img/wd@2x.png"
        },
        {
          id: 2,
          title: "语言",
          icon: "/static/img/yy@2x.png"
        },
        {
          id: 3,
          title: "美术",
          icon: "/static/img/ms@2x.png"
        },
        {
          id: 4,
          title: "体育",
          icon: "/static/img/ty@2x.png"
        },
        // {
        //   id:5,
        //   title: "音乐",
        //   icon: "/static/img/music@2x.png"
        // },
        // {
        //   id:6,
        //   title: "兴趣",
        //   icon: "/static/img/xq@2x.png"
        // },
        {
          id: "",
          title: "更多",
          icon: "/static/img/more@2x.png"
        }
      ],

      bannerList: [],
      adMidList: [],
      adList: [],
      goodList: [],
      setList: [], //课程和广告数据结合
      resultList: [],
      resultListOK: [],
      pageNo: 1,
      pageSize: 10,
      zongPage: "",
      cnt: 0
    };
  },

  components: {
    tabBar
  },
 
  methods: {
    //教程分类点击事件
    specialClick: function(typeId, title) {
      var url = "/pages/business/trainList/main?typeId=" + typeId;
      wx.navigateTo({ url });
    },
    //课程点击
    goCur: function(item) {
    
      if (!item.isGG) {
        let url = "/pages/business/curDetail/main?curId=" + item.id;
        wx.navigateTo({ url });
      } else {
        let url = "/pages/business/trainList/main?storeId=" + item.storeId;
        wx.navigateTo({ url });
      }
    },
    toPlay(url) {
      wx.navigateTo({ url });
    },
    getBannerAdGood: function() {
      wx.showLoading({
        title: "加载中"
      });
      var that = this;
      var address = wx.getStorageSync("addressData");

      getBannerAdGood({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        lng: address.longitude || 118.1521347866904,
        lat: address.latitude || 24.52903356359807
      }).then(res => {
        if (res.data.code == 200) {       
          that.zongPage = Math.ceil(
            res.data.data.goodList.totalCount / that.pageSize
          );
          /*轮播 开始*/
          var bannerList = res.data.data.bannerList;
       
          if (bannerList.length > 0) {
            bannerList.forEach(function(item) {
              item.adImg = utils.formatImgUrlRetailer(item.adImg);
            });
          } else {
            bannerList = [
              {
                adImg:
                  "http://img.mseenet.com/A09D388D198FA5C5483A401C56526F90.jpg?imageMogr2/strip|imageView2/1/w/750/h/350/q/85"
              }
            ];
          }
          this.bannerList = bannerList;
          /*轮播 结束*/

          /*中间广告 开始*/
          var adMidList = res.data.data.adMidList;
          if (adMidList.length > 0) {
            adMidList.forEach(function(item) {
              item.adImg = utils.formatImgUrlRetailer(item.adImg);
            });
          } else {
            adMidList = [
              {
                adImg:
                  "http://pic.qiantucdn.com/58pic/20/86/72/5763782c686b2_1024.jpg"
              }
            ];
          }
          this.adMidList = adMidList;
          /*中间广告 结束*/

          this.goodList = [];
          this.adList = [];
          this.setList = [];
          this.resultList = [];

          /*课程 开始*/
          var goodList = res.data.data.goodList.data;
          var yuki = res.data.data.goodList.data.length;
          if (goodList.length > 0) {
            goodList.forEach(function(item) {
              item.goodImg = utils.formatImgUrlRetailer(item.goodImg);
            });
          }

          this.goodList = goodList;
          /*课程 结束*/

          /*课程广告 开始*/
          var adList = res.data.data.adList;
          if (adList.length > 0) {
            adList.forEach(function(item) {
              item.adImg = utils.formatImgUrlRetailer(item.adImg);
            });
          }
          this.adList = adList;
          /*课程广告 结束*/

          /*处理课程和广告*/
          this.setList = this.goodList;
          //var cnt = 0;
          var setListLength = this.goodList.length;
          for (var i = 0; i < yuki; i++) {
            if (i % 4 == 0 && i != 0) {
              if (this.adList[that.cnt]) {
                this.adList[that.cnt].isGG = true;
                this.setList.splice(i, 0, this.adList[that.cnt]);
                that.cnt++;
              }
            }

            if (i == setListLength - 1 && that.pageNo == 1) {
              for (let j = that.cnt; j < this.adList.length; j++) {
                this.adList[j].isGG = true;
                this.setList.push(this.adList[j]);
                this.resultList = this.setList;
              }
            } else {
              this.resultList = this.setList;
            }
          }
          this.resultListOK = this.resultListOK.concat(this.resultList);
           wx.hideLoading();
      
          // 数据成功后，停止下拉刷新
          wx.stopPullDownRefresh();
        }
      });
    },
    //获取用户经纬度
    getAddress() {
      if (!wx.getStorageSync("addressData")) {
        wx.getLocation({
          type: "wgs84",
          success: res => {
            wx.setStorageSync("addressData", res);
          }
        });
      }
    }
  },

  mounted() {
    this.getAddress();
    this.getBannerAdGood();
  },
  //页面上拉刷新
  onReachBottom: function() {
    this.pageNo++;
    if (this.pageNo <= this.zongPage) {
      this.getBannerAdGood();
    }
  },
  //下拉刷新
  onPullDownRefresh: function() {
    this.pageNo = 1;
    this.cnt = 0;
    this.resultListOK = [];
    this.getAddress();
    this.getBannerAdGood();
  },
  onShareAppMessage: function(res) {
    return {
      title: "咪师教育",
      path: "pages/business/index/main"
    };
  }
};
</script>

<style lang="scss">
$fontColor: #333333;
#index {
  margin-bottom: 100rpx;
  .swiper-home {
    width: 100%;
    height: 350rpx;
    box-sizing: border-box;
  }
  /*分割线*/
  .line {
    width: 100%;
    height: 10rpx;
    background: #e6e6e6;
  }
  /*搜索框*/
  .search {
    display: block;
    width: 548rpx;
    height: 60rpx;
    background: yellow;
    border-radius: 10rpx;
    position: fixed;
    top: 10rpx;
    left: 50%;
    margin-left: -274rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(238, 239, 240, 0.8);
    img {
      width: 26rpx;
      height: 26rpx;
      margin-right: 15rpx;
    }
    span {
      font-size: 28rpx;
      color: #909199;
    }
  }

  #swiper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    swiper {
      height: 100%;
    }
    .slide-image {
      width: 100%;
      height: 100%;
    }
  }
  /*教程分类*/
  .typeClass {
    padding: 0 59rpx 5rpx 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    box-sizing: border-box;
    .classList-home {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      li {
        margin: 30rpx 0 9rpx 70rpx;
        text-align: center;
        > img {
          width: 67rpx; //60rpx
          height: 67rpx;
        }
        p {
          font-family: "PingFang-SC-Regular";
          font-size: 24rpx;
          color: $fontColor;
          margin-top: 16rpx;
        }
      }
    }
    /*体验卷*/
    .guanggao {
      display: block;
      width: 130rpx;
      height: 185rpx;
      margin-top: 25rpx;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  /*教程分类下面的广告*/
  .Advertisement {
    width: 100%;
    padding: 20rpx 0;
    img {
      width: 700rpx;
      height: 160rpx;
      border-radius: 80rpx;
      display: block;
      margin: 0 auto;
    }
  }
  /*课程专区*/
  .special {
    padding: 20rpx 30rpx;
    box-sizing: border-box;
    .special-title {
      color: $fontColor;
      font-size: 30rpx;
    }
    .special-top {
      color: red;     
    }
    .special-home {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .special-item {
        width: 330rpx;
        margin-top: 37rpx;
        > img {
          width: 330rpx;
          height: 167rpx;
        }
        > h2 {
          font-size: 28rpx;
          color: $fontColor;
          line-height: 40rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        > p {
          font-size: 24rpx;
          color: #808080;
          margin-top: 10rpx;
          span {
            box-sizing: border-box;
            color: #b3b3b3;
            font-size: 20rpx;
            padding: 1rpx 10rpx;
            border: solid #e5e5e5 1px;
            border-radius: 10rpx;
            margin-right: 13rpx;
          }
        }
      }
    }
    /*广告样式*/
    .gg-item {
      width: 690rpx;
      margin-top: 37rpx;
      > img {
        width: 100%;
        height: 168rpx;
      }
      > h2 {
        font-size: 28rpx;
        color: $fontColor;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-top: 20rpx;
        padding-bottom: 5rpx;
        span {
          box-sizing: border-box;
          color: #b3b3b3;
          font-size: 20rpx;
          padding: 1rpx 10rpx;
          border: solid #e5e5e5 1px;
          border-radius: 10rpx;
          margin-right: 10rpx;
          position: relative;
          top: -1rpx;
        }
      }
    }
  }
}
</style>
