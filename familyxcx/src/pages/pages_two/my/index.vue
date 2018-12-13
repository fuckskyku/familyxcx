<template>
  <div id="my" :style="{'height': height + 'rpx'}">
    <div class="header">
      <!-- <img src="http://test.admin.school.mseenet.com/html/img/iOS切图/mybackground2x.png" alt=""> -->
      <div class="head_portrait" @click="reviseInfo">
        <img :src="userInfo.avatarImg" alt="">
      </div>
      <!-- <div class="name">{{userInfo.realName}}</div> -->
      <div class="relationContainer">
        <div class="relation">{{userInfo.nickName}}</div>
        <div class="relation_job">{{userInfo.jobTitle}}</div>
      </div>
    </div>
    <div class="select_container" @click="bindViewMySchool" v-if="schoolList!=''">
      <div class="select_container_one">
        <div>切换机构</div>
        <div class="name">
          {{family.schoolName}}
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt=""></div>
        </div>
      </div>
    </div>
    <div class="select_container">
      <div class="select_container_one" @click="bindViewMyissue">
        <!-- <img src="" alt=""> -->
        <div>
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/my/issue_icon@2x.png" alt=""></div>我的发布</div>
        <div class="name">
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt=""></div>
        </div>
      </div>
      <div class="select_container_one" @click="bindViewMyApproval">
        <!-- <img src="" alt=""> -->
        <div>
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/my/auditl_icon@2x.png" alt=""></div>
          审批</div>
        <div class="name">
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt=""></div>
        </div>
      </div>
      <!-- <div class="select_container_one">
        <div>
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/my/call_over_icon@3x.png" alt=""></div>
          每日点名</div>
        <div class="name">
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt=""></div>
        </div>
      </div> -->
      <div class="select_container_one" @click="bindViewTapSet()">
        <!-- <img src="" alt=""> -->
        <div>
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/my/install_icon@3x.png" alt=""></div>
          设置
        </div>
        <div class="name">
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt=""></div>
        </div>
      </div>
    </div>
    <tab-bar :activeIndex='2' :objIndex='1'></tab-bar>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import tabBar from "@/components/tabbar";
import { userCenter, myRlease } from "@/api/api";
import utils from "@/utils/index";
export default {
  data() {
    return {
      height: "",
      userInfo: {}
    };
  },
  computed: {
    ...mapState(["family", "students", "schoolList"])
  },
  components: {
    tabBar
  },
  mounted() {
    // 高度自适应
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        _this.height = clientHeight * rpxR;
      }
    });

    this.getUserCenter();

    //
    
  },
  created() {
    console.log(this.family)
  },
  methods: {
    ...mapActions(["setUserMobile"]),

    getUserCenter() {
      userCenter().then(res => {
        // console.log(res)
        if (res.data.code == 200) {
          this.setUserMobile(res.data.data.mobile);
          this.userInfo = res.data.data;
          this.userInfo.avatarImg = utils.formatImgUrl(res.data.data.avatarImg);
        } else {
          console.log(res.data.message);
        }
      });
    },
    reviseInfo() {
      let url = "../myUserInfo/main";
      wx.navigateTo({ url });
    },
    //跳转我的发布
    bindViewMyissue() {
      let url = "../myIssue/main";
      wx.navigateTo({ url });
    },
    //跳转我的审批
    bindViewMyApproval() {
      let url = "../myApproval/main";
      wx.navigateTo({ url });
    },

    //跳转选择学生
    bindViewMySchool() {
      let url = "../institutionSelect/main";
      wx.navigateTo({ url });
    },
    studentCheck() {
      // let url = '../checkTime/main'
      // wx.navigateTo({ url })
    },
    //跳转设置
    bindViewTapSet() {
      let url = "/pages/pages_one/set/main";
      wx.navigateTo({ url });
    }
  }
};
</script>

<style lang='scss' scoped>
#my {
  background: rgb(242, 244, 245);
  //   height: 1110rpx;
  //   border: 1px solid red;
  .header {
    // margin-bottom: 25rpx;
    // background: url('http://img.mseenet.com/A09D388D198FA5C5483A401C56526F90.jpg?imageMogr2/strip|imageView2/1/w/750/h/350/q/85')no-repeat;
    // background-size: cover;
    background: #ffea55;
    width: 100%;
    height: 250rpx;
    display: flex;
    // justify-content: center;
    // flex-direction: column;
    align-items: center;
    > .head_portrait {
      margin-left: 40rpx;
      margin-right: 50rpx;
      width: 140rpx;
      height: 140rpx;
      border-radius: 70rpx;
      overflow: hidden;
      box-shadow: 0px 0px 0 5rpx yellow;
      > img {
        max-width: 100%;
        height: 100%;
      }
    }
    .name {
      margin-top: 26rpx;
      color: #333333;
      font-size: 34rpx;
    }
    .relationContainer {
      height: 100rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .relation {
        color: #333333;
        font-size: 34rpx;
        font-weight: bold;
      }
      .relation_job {
        font-size: 30rpx;
      }
    }
  }
  .select_container {
    font-size: 34rpx;
    background: white;
    margin-top: 20rpx;
    // border: 1px solid red;
    & + .select_container {
      border-top: 1px solid #e6e6e6;
    }
    .select_container_one {
      // border: 1px solid red;
      &::after {
        display: block;
        content: "";
        clear: both;
      }
      > div {
        padding: 0 30rpx;
        line-height: 98rpx;
        height: 98rpx;
        &:nth-child(1) {
          float: left;
          > div {
            margin-right: 10rpx;
            display: inline-block;
            img {
              width: 50rpx;
              height: 50rpx;
              vertical-align: middle;
            }
          }
        }
        &:nth-child(2) {
          float: right;
          > div {
            margin-left: 10rpx;
            display: inline-block;
            img {
              vertical-align: middle;
              width: 15rpx;
              height: 26rpx;
            }
          }
        }
        // &:nth-child(3) {
        //   float: right;
        //   border: 1px solid red;
        //   float: right;
        // }
      }
      .name {
        color: #808080;
      }
    }
  }
}
</style>
