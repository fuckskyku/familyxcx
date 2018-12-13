<template>
  <div id="my" :style="{'height': height + 'rpx'}">
    <div class="header">
      <!-- <img src="http://img.mseenet.com/iOS_CutDiagram/mybackground2x.png" alt=""> -->
      <div class="head_portrait" @click="jumpInfo">
        <img :src="userInfo.avatarImg" alt="">
      </div>
      <!-- <div class="name">{{userInfo.realName}}</div> -->
      <div class="relation">{{userInfo.nickName}}</div>
    </div>
    <div class="select_container" @click="bindViewMyStudentSelect">
      <div class="select_container_one">
        <div>当前登录孩子姓名</div>
        <div class="name">{{family.studentName}}
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt=""></div>
        </div>
      </div>
    </div>

    <div class="select_container">
      <div class="select_container_one" @click="bindViewMyinfo()">
        <!-- <img src="" alt=""> -->
        <div>
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/my/student information_icon@3x.png" alt=""></div> 学生个人信息</div>
        <div class="name">
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt=""></div>
        </div>
      </div>
      <div class="select_container_one" @click="studentCheck">
        <!-- <img src="" alt=""> -->
        <div>
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/my/call_over_icon@3x.png" alt=""></div>
          学生考勤</div>
        <div class="name">
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt=""></div>
        </div>
      </div>
      <div class="select_container_one" @click="bindViewTapSet()">
        <!-- <img src="" alt=""> -->
        <div>
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/my/install_icon@3x.png" alt=""></div>
          设置</div>
        <div class="name">
          <div><img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt=""></div>
        </div>
      </div>
    </div>
    
      <!-- <img mode='scaleToFill' src="https://admin.school.mseenet.com/upload/file/20181127/1543306976173824775.jpg" alt=""> -->
    <tab-bar :activeIndex='2' :objIndex='0'></tab-bar>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import tabBar from '@/components/tabbar'
import { userCenter } from '@/api/api'
import utils from '@/utils/index'
export default {
  data() {
    return {
      height: '',
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['family', 'students'])
  },
  components: {
    tabBar
  },
  mounted() {
    // console.log(JSON.parse(window.localStorage.getItem('vuex')))

    //console.log("I'am My!")
    // 高度自适应
    var _this = this
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth
        _this.height = clientHeight * rpxR
      }
    })

    //获取studentName
    // utils.wxGetStorage('students').forEach((item, index) => {
    //   if (item.studentId == utils.wxGetStorage('studentId')) {
    //     this.studentName = item.studentName
    //   }
    // })

    _this.getUserCenter()
  },
  onShow() { //返回显示页面状态函数
      //错误处理
      this.getUserCenter()//再次加载，实现返回上一页页面刷新
      //正确方法
      //只执行获取地址的方法，来进行局部刷新
  },
  methods: {
    ...mapActions(['setUserMobile']),
    getUserCenter() {
      userCenter().then(res => {
        console.log(res)
        if (res.data.code == 200) {
          // utils.wxSetStorageSync('mobile', res.data.data.mobile, null)
          this.setUserMobile(res.data.data.mobile)
          this.userInfo = res.data.data
          if (this.userInfo) {
            this.userInfo.avatarImg = utils.formatImgUrl(
              this.userInfo.avatarImg
            )
          }
          console.log("this.userInfo.avatarImg",this.userInfo.avatarImg)
        } else {
          console.log(res.data.message)
        }
      })
    },
    //跳转个人信息
    bindViewMyinfo() { 
      console.log("family:",this.family)
      let url = '../myReviseInfo/main?sign=1'//sign标记是有my跳转至个人信息
      wx.navigateTo({ url })

    },
    //跳转选择学生
    bindViewMyStudentSelect() {
      let url = '../mySelect/main'
      wx.navigateTo({ url })
    },
    studentCheck() {
      let url = '../checkTime/main'
      wx.navigateTo({ url })
    },
    //跳转设置
    bindViewTapSet() {
      let url = '../set/main'
      wx.navigateTo({ url })
    },
    //跳转家长信息
    jumpInfo() { 
      console.log("userInfo:",this.userInfo)
      let url = '../myfamilyInfo/main'
      utils.wxSetStorageSync("familyInfo",this.userInfo);
      console.log("my:familyInfo",utils.wxGetStorage('familyInfo'))
      wx.navigateTo({ url })
    }
  }
}
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
    height: 365rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    > .head_portrait {
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
    .relation {
      margin-top: 20rpx;
      color: #333333;
      font-size: 24rpx;
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
        content: '';
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
