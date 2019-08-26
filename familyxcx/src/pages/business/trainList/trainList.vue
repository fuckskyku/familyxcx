<template>
    <div id="mechanism">
        <img v-if="banner.length>0" class="bannerTop" :src="banner">
        <div class="talBar-home">
            <div class="talBar">
                <!-- <div v-for="(item,index) in talBarData" :key="index" @click="talBar(item.type)">
                    {{item.name}}<img :class="item.isShow?'imgsel':'imgdefault'" :src="item.isShow?'/static/img/drow-sel.png':'/static/img/drow.png'"/>
                </div> -->
                <div @click="talBar(1)">{{allName}}<img :class="isAll?'imgsel':'imgdefault'" :src="isAll?drowSel:drowDefault"></div>
                <div @click="talBar(2)">{{fjName}}<img :class="isFj?'imgsel':'imgdefault'" :src="isFj?drowSel:drowDefault"></div>
                <div @click="talBar(3)">{{znName}}<img :class="isZn?'imgsel':'imgdefault'" :src="isZn?drowSel:drowDefault"></div>
            </div>
            <!--全部-->
            <ul v-if="isAll" class="allShow">
                <li @click="allShowClick(item.id,item.name)" v-for="(item,index) in allData" :key="index">
                    <span>{{item.name}}</span>
                </li>
            </ul>
            <!--智能排序-->
            <ul v-if="isZn" class="intellShow">
                <li @click="intellShowClick(item.id,item.name)" v-for="(item,index) in intellData" :key="index">
                    <span>{{item.name}}</span>
                </li>
            </ul>
            <!--附近-->
            <div v-if="isFj" class="nearby">
                <ul class="title-home">
                    <li @click="fjClick(item.areaName,item.id)" v-for="(item,index) in nearData" :key="index">
                        <span :class="item.isShow?'title-active':''" @click="nearbyTab(index)">{{item.areaName}}</span>
                        <ul v-if="item.isShow" class="item-home">
                            <li @click="fjItemClick(arr.id,arr.val)" v-for="(arr,tindex) in item.list" :key="tindex">
                                {{arr.val}}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            <!-- <ul v-if="isFj" class="fjShow"></ul> -->

        </div>
        <!--课程列表-->
        <ul class="curList">
            <li @click="goPlay(item.storeId)" v-for="(item,index) in curDataOK" :key="index">
                <div class="top">
                    <img :src="item.storeLogoImg">
                    <div class="titleScope">
                        <h3>{{item.storeName}}</h3>
                        <div class="titleScope-item">
                            <scope-view :scope="item.score"></scope-view>
                            <span class="comment">{{item.totalReviewer}}人评价</span>
                            <span class="distance">{{item.distance}}km</span>
                        </div>
                    </div>
                </div>
                <ul class="middle">
                    <li v-if="tindex<2" v-for="(title,tindex) in item.goodsOut" :key="tindex">
                        [{{title.goodTypeStr}}]&nbsp;{{title.goodName}}
                    </li>
                </ul>
                <div v-if="item.isOut" class="more">
                    查看更多<span>{{item.type}}</span>课程
                    <img :src="drowDefault">
                </div>
            </li>
        </ul>
        <p class="noData" v-if="curData.length==0">
          <img src="/static/img/vacancy_release.png">
          <span>暂时没有内容哦~</span>
        </p>
        <!-- <scope-view></scope-view> -->
    </div>
</template>
<script>
import { getStoreList, getAddress } from "@/api/apiRetailer";
import utils from "@/utils/index";
export default {
  components: {},
  data() {
    return {
      pageSize: 5,
      pageNo: 1,
      zongPage: "", //总条数
      banner: "",
      talBarData: [
        //tab栏数据
        {
          type: 1,
          name: "全部",
          isAll: false
        },
        {
          type: 2,
          name: "附近",
          isFj: false
        },
        {
          type: 3,
          name: "智能排序",
          isZn: false
        }
      ],
      isAll: false,
      isFj: false,
      isZn: false,
      allName: "全部",
      fjName: "附近",
      znName: "智能排序",
      drowDefault: "/static/img/drow.png",
      drowSel: "/static/img/drow-sel.png",
      goodType: "",
      allData: [
        //筛选条件 全部
        { id: "", name: "全部" },
        { id: 1, name: "舞蹈" },
        { id: 2, name: "语言" },
        { id: 3, name: "美术" },
        { id: 4, name: "体育" },
        { id: 5, name: "音乐" },
        { id: 6, name: "兴趣" }
      ],
      intellData: [
        //筛选条件 智能排序
        { id: "", name: "智能排序" },
        { id: 0, name: "时间" },
        { id: 1, name: "离我最近" },
        { id: 2, name: "好评优先" },
        { id: 3, name: "人气最高" }
      ],
      //筛选条件 附近
      oneFJ: [
        // {
        //   areaName:'全市',
        //   id:'',
        //   isShow:false
        // },
        {
          areaName: "附近",
          isShow: true,
          id: "附近",
          list: [
            { val: "1km", id: 1 },
            { val: "3km", id: 3 },
            { val: "5km", id: 5 }
            // { val: "全城", id:""}
          ]
        }
      ],
      nearData: [
        {
          title: "湖里区",
          isShow: false,
          id: 350206
        },
        {
          title: "思明区",
          id: 350203,
          isShow: false
        },
        {
          title: "海沧区",
          id: 350205,
          isShow: false
        },
        {
          title: "集美区",
          id: 350211,
          isShow: false
        },
        {
          title: "同安区",
          id: 350212,
          isShow: false
        },
        {
          title: "翔安区",
          id: 350213,
          isShow: false
        }
      ],
      curData: [""], //课程列表数据
      curDataOK: [], //课程列表数据
      goodType: "", //课程类型
      qtype: "", //智能排序
      countyId: "", //所在区 的id
      dis: "" //距离几千米
    };
  },
  methods: {
    talBar: function(type) {
      switch (type) {
        case 1:
          this.isFj = false;
          this.isZn = false;
          this.isAll = !this.isAll;
          break;
        case 2:
          this.isZn = false;
          this.isAll = false;
          this.isFj = !this.isFj;
          break;
        case 3:
          this.isZn = !this.isZn;
          this.isAll = false;
          this.isFj = false;
          break;
      }
    },
    //机构列表进入详情
    goPlay(storeId) {
      let url = "/pages/business/trainDetail/main?storeId=" + storeId;
      wx.navigateTo({ url });
    },
    //筛选条件 附近 切换地址
    nearbyTab(index) {
      for (let i = 0; i < this.nearData.length; i++) {
        this.nearData[i].isShow = false;
      }
      this.nearData[index].isShow = true;
    },
    //根据经纬度获取地区
    getAddress() {
      var result = wx.getStorageSync("addressData");
      if (!result) {
        wx.getLocation({
          type: "wgs84",
          success: res => {
            wx.setStorageSync("addressData", res);
            result = res;
          },
          cancel: function(res) {
            //"用户拒绝授权获取地理位置"
            result.longitude = 118.14577;
            result.latitude = 24.5118;
          }
        });
      }
      var lat =
        result.latitude &&
        result.latitude != "" &&
        result.latitude != "undefined"
          ? result.latitude
          : 24.5118;
      var lng =
        result.longitude &&
        result.longitude != "" &&
        result.longitude != "undefined"
          ? result.longitude
          : 118.14577;

      let data = {
        storeLng: lng,
        storeLat: lat,
        levelType: 2
      };
      getAddress(data).then(res => {
        if (res.data.code == 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            res.data.data[i].isShow = false;
          }
          this.nearData = this.oneFJ.concat(res.data.data);
        }
      });
    },
    //获取机构列表
    getMechan() {
      var that = this;
      wx.showLoading({
        title: "加载中"
      });
      var result = wx.getStorageSync("addressData");
      var lat =
        result.latitude &&
        result.latitude != "" &&
        result.latitude != "undefined"
          ? result.latitude
          : 24.5118;
      var lng =
        result.longitude &&
        result.longitude != "" &&
        result.longitude != "undefined"
          ? result.longitude
          : 118.14577;

      let data = {
        dis: this.dis, //距离 (千米)
        countyId: this.countyId, //所在区 id
        goodType: this.goodType, //筛选条件 全部课程
        qtype: this.qtype, //智能排序
        lng: lng, //纬度
        lat: lat, //经度
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };

      getStoreList(data).then(res => {
        if (res.data.code == 200) {
          that.zongPage = Math.ceil(
            res.data.data.store.totalCount / that.pageSize
          );
          this.banner =
            res.data.data.banner.length > 0
              ? utils.formatImgUrlRetailer(res.data.data.banner[0].adImg)
              : ""; //顶部图片
          this.curData = res.data.data.store.data;
          this.upData();
          wx.hideLoading();
        }
      });
    },
    //处理数据
    upData() {
      for (let i = 0; i < this.curData.length; i++) {
        this.curData[i].distance = this.curData[i].distance.toFixed(3);
        this.curData[i].storeLogoImg = utils.formatImgUrlRetailer(
          this.curData[i].storeLogoImg
        );
        if (this.curData[i].goodsOut.length > 0) {
          this.curData[i].isOut = true;
        } else {
          this.curData[i].isOut = false;
        }
      }
      this.curDataOK = this.curDataOK.concat(this.curData);
    },
    //筛选条件 全部类型
    allShowClick(type, name) {
      this.curDataOK = [];
      this.pageNo = 1;
      this.goodType = type;
      this.allName = name;
      this.getMechan();
      this.isAll = !this.isAll;
    },
    //筛选条件 智能排序
    intellShowClick(type, name) {
      this.curDataOK = [];
      this.pageNo = 1;
      this.qtype = type;
      this.znName = name;
      this.getMechan();
      this.isZn = !this.isZn;
    },
    //筛选条件 附近 选择区
    fjClick(title, id) {
      if (id != "附近") {
        this.curDataOK = [];
        this.pageNo = 1;
        this.countyId = id;
        this.fjName = title;
        this.getMechan();
        this.isFj = !this.isFj;
      }
    },
    //筛选条件 附近 距离(千米)
    fjItemClick(id, val) {
      this.curDataOK = [];
      this.pageNo = 1;
      this.dis = id;
      this.fjName = val;
      this.getMechan();
      this.isFj = !this.isFj;
    },
    //初始化数据
    initData() {
      this.curDataOK = [];
      this.goodType = ""; //课程类型
      this.qtype = ""; //智能排序
      this.countyId = "";
      this.dis = "";
      this.allName = "全部";
      this.fjName = "附近";
      this.znName = "智能排序";
    }
  },
  onLoad(option) {
    this.initData();
    this.goodType = option.typeId == undefined ? "" : option.typeId;
    if (this.allData[this.goodType]) {
      this.allName = this.allData[this.goodType].name;
    } else {
      this.goodType = "";
    }
    var data = wx.getStorageSync("addressData");
    if (!data) {
      wx.getLocation({
        type: "wgs84",
        success: res => {
          wx.setStorageSync("addressData", res);         
        }
      });
    }
    this.getMechan();
    this.getAddress();
  },
  //上拉刷新
  onReachBottom: function() {
    this.pageNo++;
    if (this.pageNo <= this.zongPage) {
      this.getMechan();
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: "喵喵教育",
      path: "pages/business/trainList/main"
    };
  }
};
</script>
<style lang="scss">
$fontColor: #333333;
$fontSize: 28rpx;
#mechanism {
  background: #e6e6e6;
  .bannerTop {
    width: 100%;
    height: 350rpx;
  }
  .talBar-home {
    position: relative;
    .talBar {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      color: #9798a0;
      font-size: 28rpx;
      background: #fff;
      height: 88rpx;
      > div {
        flex: 1;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .imgdefault {
          width: 16rpx;
          height: 24rpx;
          margin-left: 15rpx;
        }
        .imgsel {
          width: 15rpx;
          height: 9rpx;
          margin-left: 15rpx;
        }
      }
      > div:nth-of-type(2) {
        position: relative;
        border-left: solid #e6e6e6 1px;
        border-right: solid #e6e6e6 1px;
      }
    }
    .allShow,
    .intellShow,
    .nearby {
      background: #fff;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      box-shadow: 0 5px 5px #edeff0;
      > li {
        height: 88rpx;
        line-height: 88rpx;
        padding-left: 81rpx;
        border-top: solid #edeff0 1px;
        font-size: $fontSize;
        color: $fontSize;
      }
    }
    .nearby {
      display: flex;
      .title-home {
        width: 250rpx;
        position: relative;
        > li {
          width: 100%;
          height: 88rpx;
          box-sizing: border-box;
          border-bottom: solid #edeff0 1rpx;
          span {
            display: block;
            height: 88rpx;
            line-height: 88rpx;
            width: 100%;
            color: $fontColor;
            font-size: $fontSize;
            text-align: center;
          }
          span.title-active {
            background: rgba(242, 244, 245, 1);
          }
          .item-home {
            position: absolute;
            top: 0;
            left: 100%;
            width: 500rpx;
            height: 99.8%;
            background: rgba(242, 244, 245, 1);
            li {
              width: 100%;
              height: 88rpx;
              line-height: 88rpx;
              color: $fontColor;
              font-size: $fontSize;
              box-sizing: border-box;
              padding-left: 38rpx;
              border-bottom: solid #edeff0 1rpx;
            }
          }
        }
      }
    }
  }
  .curList {
    li {
      background: #fff;
      margin-top: 20rpx;
      .top {
        display: flex;
        flex-wrap: nowrap;
        border-bottom: dotted #e6e6e6 1px;
        padding: 30rpx;
        > img {
          width: 88rpx;
          height: 88rpx;
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
            .comment,
            .distance {
              font-size: 24rpx;
              color: #a8aab3;
              margin-left: 20rpx;
            }
            .distance {
              float: right;
              margin-top: 10rpx;
            }
          }
        }
      }
      .middle {
        padding-left: 138rpx;
        li {
          width: 436rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: $fontSize;
          color: $fontColor;
          margin: 30rpx 0;
        }
      }
      .more {
        border-top: dotted #e6e6e6 1px;
        height: 70rpx;
        line-height: 70rpx;
        text-align: center;
        font-size: 24rpx;
        color: #a8aab3;
        span {
          font-size: $fontSize;
          color: #f70044;
          margin: 0 5rpx;
        }
        img {
          width: 16rpx;
          height: 24rpx;
          margin-left: 10rpx;
          margin-top: 5rpx;
        }
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


