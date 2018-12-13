<template>
    <div id="curDetail">
        <!--轮播图片-->
        <!-- <div class="swiper-home" v-if="bannerList">
            <swiper-view :bannerList="bannerList"></swiper-view>
        </div> -->
        <!--课程信息-->
        <!-- <div class="curInfo">
            <h3>大拇指语言艺术课程</h3>
            <p>见舞舞蹈</p>
        </div>
        <div class="line"></div> -->
        <!--课程介绍-->
        <!-- <div class="curIntro">
            <div class="curIntro-title">
                <img src="/static/img/particulars_course@2x.png">课程介绍
            </div>
        </div> -->
        <!-- <div>{{resultUrl}}</div> -->        
        <web-view :src="resultUrl"></web-view>
    </div>
</template>
<script>
import { hex_md5 } from "@/utils/md5.js";
import { getMobileGoodsInfo } from "@/api/apiRetailer";
import utils from "@/utils/index";
export default {
  data() {
    return {
      curId: "",
      resultUrl: ""
    };
  },
  onLoad: function(option) {
    //接收参数
    wx.setNavigationBarTitle({
      title: "课程详情" //页面标题
    });
    this.curId = option.curId;
    if (!wx.getStorageSync("addressData")) {
      wx.getLocation({
        type: "wgs84",
        success: res => {
          wx.setStorageSync("addressData", res);
        },
        cancel: function(res) {
          //"用户拒绝授权获取地理位置"
        }
      });
    }
    this.showView(option.curId);
  },
  methods: {
    getMd5(id, myLat, myLng) {
      return hex_md5(
        "id=" + id + "&myLng=" + myLng + "&myLat=" + myLat + "mseenet.com"
      );
    },
    //获取课程详情
    getCurDetail(curId) {
      let address = wx.getStorageSync("addressData");
      var lat =
        address.latitude &&
        address.latitude != "" &&
        address.latitude != "undefined"
          ? address.latitude
          : 24.5118;
      var lng =
        address.longitude &&
        address.longitude != "" &&
        address.longitude != "undefined"
          ? address.longitude
          : 118.14577;
      let data = {
        id: this.curId || curId,
        myLng: lng, //纬度
        myLat: lat, //经度
        random: this.getMd5(curId, lat, lng)
      };

      getStoreInfo(data).then(res => {
        if (res.data.code == 200) {
          console.log(res);
        }
      });
    },
    //视图
    showView(curId) {
      let address = wx.getStorageSync("addressData");
      var lat =
        address.latitude &&
        address.latitude != "" &&
        address.latitude != "undefined"
          ? address.latitude
          : 24.5118;
      var lng =
        address.longitude &&
        address.longitude != "" &&
        address.longitude != "undefined"
          ? address.longitude
          : 118.14577;

      let ran = this.getMd5(curId, lat, lng);
      this.resultUrl =
        "https://admin.retailer.mseenet.com/api/goods/getMobileGoodsInfo?id=" +
        curId +
        "&myLng=" +
        lng +
        "&myLat=" +
        lat +
        "&random=" +
        ran;
    }
  }
};
</script>
<style lang="scss">
$fontColor: #333333;
#curDetail {
  .swiper-home {
    width: 100%;
    height: 350rpx;
    box-sizing: border-box;
  }
  .curInfo {
    width: 100%;
    height: 158rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 15rpx 0;
    h3 {
      width: 100%;
      text-align: center;
      font-size: 34rpx;
      color: $fontColor;
    }
    p {
      padding: 10rpx 50rpx;
      background: #ffea55;
      border-radius: 23rpx;
      color: $fontColor;
      font-size: 28rpx;
    }
  }
  .line {
    width: 100%;
    height: 20rpx;
    background: #e6e6e6;
  }
  /*课程介绍*/
  .curIntro {
    width: 100%;
    box-sizing: border-box;
    .curIntro-title {
      height: 90rpx;
      line-height: 90rpx;
      border-bottom: dotted 1rpx #e6e6e6;
      padding-left: 30rpx;
      color: $fontColor;
      font-size: 30rpx;
      vertical-align: middle;
      > img {
        width: 36rpx;
        height: 34rpx;
        margin-right: 20rpx;
        vertical-align: middle;
      }
    }
  }
}
</style>

