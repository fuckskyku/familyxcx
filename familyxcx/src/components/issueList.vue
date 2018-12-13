<template>
  <div id="issueListComponents">
    <div class="tab">
      <scroll-view scroll-x="true" class="tab_h">
        <view v-for="(item,index) in item" :class="[isActive==index?'active':'','tab_item']" :key="index" @click="swichNav(index)">{{item.label}}</view>
      </scroll-view>
      <swiper class="tab-content" :current="isActive" duration="300" @change="switchTab">
        <swiper-item v-for="(itemone,indexone) in item" :key="indexone" class="tab-swiper-item">

          <scroll-view scroll-y="true" class="scoll-h" v-if="indexone==0">
            <block v-if="type==1||type==2||type==3">
              <div :class="[item.isActive?'active':'','issued_item']" v-for="(issue,index) in issueList" :key="index" v-if="issueList.length>0" @click="goDetail(type,issue.id,(issue.classId||0),issue.linkUrl,false)">
                <div class="issued_item_title">
                  <span class="title">{{issue.newsStyleTypeStr}}</span>
                  {{issue.title}}
                </div>
                <div class="issued_item_img" v-if="issue.titleImgUrl&&issue.titleImgUrl!=''">
                  <img :src="issue.titleImgUrl" alt="">
                </div>
                  <div class="issued_item_tip">
                    <div class="name">发布人：{{issue.createUserName}}</div>
                    <div class="time">{{issue.createTime}}</div>
                  </div>
                  <!-- <div class="issued_item_tag" v-if="isActive==0">
                  <div class="blue">{{item.tag}}</div> -->
                  <!-- <div class="red">需回签</div> -->
                  <!-- <div class="gray">需回签</div> -->
                  <!-- </div> -->
                </div>
                <div v-if="issueList.length==0" class="noData">
                  <img src="/static/img/vacancy_release.png">
                  <span>暂时没有内容哦~</span>
                </div>
            </block>

            <block v-if="type==4">
              <div class="draft_item" v-for="(issue,index) in issueList" :key="index" v-if="issueList.length>0" @click="goDetail(type,issue.id,(issue.classId||0),issue.linkUrl,false)">
                <div class="draft_item_title">
                  <div class="class">{{issue.gradeName}}{{issue.className}}</div>
                  <div class="classTime">交作业时间：{{issue.finishTime}}</div>
                </div>
                <div class="draft_item_info">
                  <span class="info_title">{{issue.subjectName}}作业</span>
                  {{issue.title}}
                </div>
                <div class="draft_item_tip">
                  <div class="unread">
                    <span> {{issue.noReadCount}}</span> 人未读</div>
                  <div class="teacherName">发布人：{{issue.teacherName}}</div>
                  <div class="time">{{issue.createTime}}</div>
                </div>
              </div>
              <div v-if="issueList.length==0" class="noData">
                <img src="/static/img/vacancy_release.png">
                <span>暂时没有内容哦~</span>
              </div>

            </block>
          </scroll-view>

          <!-- 草稿箱 -->
          <scroll-view scroll-y="true" class="scoll-h" v-if="indexone==1">
            <block v-if="type==1||type==2||type==3">
              <div :class="[item.isActive?'active':'','issued_item']" v-for="(issue,index) in draftList" :key="index" v-if="draftList.length>0" @click="goDetail(type,issue.id,(issue.classId||0),issue.linkUrl,true)">
                <div class="issued_item_title">
                  <span class="title">{{issue.newsStyleTypeStr}}</span>
                  {{issue.title}}
                </div>
                <div class="issued_item_img" v-if="issue.titleImgUrl&&issue.titleImgUrl!=''">
                  <img :src="issue.titleImgUrl" alt="">
                </div>
                  <div class="issued_item_tip">
                    <div class="name">发布人：{{issue.createUserName}}</div>
                    <div class="time">保存时间：{{issue.createTime}}</div>
                  </div>
                  <!-- <div class="issued_item_tag" v-if="isActive==0">
                  <div class="blue">{{item.tag}}</div> -->
                  <!-- <div class="red">需回签</div> -->
                  <!-- <div class="gray">需回签</div> -->
                  <!-- </div> -->
                </div>
                <div v-if="draftList.length==0" class="noData">
                  <img src="/static/img/vacancy_release.png">
                  <span>暂时没有内容哦~</span>
                </div>
            </block>

            <block v-if="type==4">
              <!-- <div class="draft_item" v-for="(issue,index) in draftList" :key="index" v-if="draftList.length>0" @click="goDetail(type,issue.id,(issue.classId||0),issue.linkUrl)">
                <div class="draft_item_title">
                  <div class="class">{{issue.gradeName}}{{issue.className}}</div>
                  <div class="classTime">保存时间：{{issue.createTime}}</div>
                </div>
                <div class="draft_item_info">
                  <span class="info_title">{{issue.subjectName}}作业</span>
                  {{issue.title}}
                </div>

              </div>
              <div v-if="draftList.length==0" class="noData">
                <img src="/static/img/vacancy_release.png">
                <span>暂时没有内容哦~</span>
              </div> -->

              <div class="draft_item" v-for="(issue,index) in draftList" :key="index" v-if="draftList.length>0" @click="goDetail(type,issue.id,(issue.classId||0),issue.linkUrl,true)">
                <div class="draft_item_title">
                  <div class="class">{{issue.gradeName}}{{issue.className}}</div>
                  <div class="classTime">交作业时间：{{issue.finishTime}}</div>
                </div>
                <div class="draft_item_info">
                  <span class="info_title">{{issue.subjectName}}作业</span>
                  {{issue.title}}
                </div>
                <div class="draft_item_tip">
                  <div class="unread">
                    <span> {{issue.noReadCount}}</span> 人未读</div>
                  <div class="teacherName">发布人：{{issue.teacherName}}</div>
                  <div class="time">保存时间：{{issue.createTime}}</div>
                </div>
              </div>
              <div v-if="draftList.length==0" class="noData">
                <img src="/static/img/vacancy_release.png">
                <span>暂时没有内容哦~</span>
              </div>
            </block>
          </scroll-view>

        </swiper-item>
      </swiper>
    </div>
  </div>
</template>
<script>
import utils from '@/utils/index'
export default {
  //什么类型的 1是校园风采,2 校园新闻 3 通知 4  作业管理
  // props: {
  //   type: 1,
  //   issueList: [],
  //   draftList: []
  // },
  props: {
    type: String,
    issueList: Array,
    draftList: Array
  },
  // type: 1,
  // issueList: [],
  // draftList: []
  data() {
    return {
      // swiperHeight: '',
      item: [{ label: '已发布' }, { label: '草稿箱' }],
      isActive: '0'
    }
  },
  mounted() {
    // console.log(this.type);
    // // 高度自适应
    // var _this = this

    // wx.getSystemInfo({
    //   success: function(res) {
    //     var clientHeight = res.windowHeight,
    //       clientWidth = res.windowWidth,
    //       rpxR = 750 / clientWidth
    //     _this.swiperHeight = clientHeight * rpxR - 102
    //   }
    // })
    this.initData()
  },
  methods: {
    switchTab(e) {
      this.isActive = e.target.current
      // console.log(this.isActive)
    },
    swichNav(index) {
      this.isActive = index
      // console.log(this.isActive)
    },
    goDetail(type, id, classId, linkUrl, flag) {
      var url = ''
      switch (type) {
        case '1':
        case '2':
          url =
            '/pages/pages_two/myApprovalInfo/main?id=' + id + '&flag=' + flag
          break
        case '3':
          url =
            '/pages/pages_two/myApprovalInfo/main?id=' + id + '&flag=' + flag
          break
        case '4':
          utils.wxSetStorageSync('draftList', this.draftList)
          console.log(this.draftList)
          url =
            '/pages/pages_one/homeworkInfo/main?id=' +
            id +
            '&classId=' +
            classId +
            '&flag=' +
            flag
          break
      }
      wx.navigateTo({ url })
    },
    //初始化数据
    initData: function() {
      this.isActive = '0'
    }
  }
}
</script>

<style lang='scss'>
$fontColor: #333333;
$fontSize: 28rpx;
page {
  height: 100%;
}
#issueListComponents {
  height: 100%;
  .tab {
    height: 100%;
    // border: 1px solid red;
    .tab_h {
      margin: 0 auto;
      width: 60%;
      text-align: center;
      height: 88rpx;
      &::after {
        content: '';
        display: block;
        clear: both;
      }
      .tab_item {
        line-height: 88rpx;
        display: inline-block;
        position: relative;
        &:last-child {
          float: right;
        }
        &:first-child {
          float: left;
        }
        &.active::after {
          content: '1213';
          width: 100%;
          height: 4rpx;
          display: block;
          position: absolute;
          background: #ffea55;
          bottom: 0;
        }
      }
    }
  }
  .tab-content {
    height: 90%;
    margin-top: 20rpx;
    .scoll-h {
      height: 100%;
      box-sizing: border-box;
      padding: 0 30rpx;
      .issued_item {
        position: relative;
        padding: 30rpx 0;
        & + .issued_item {
          border-top: 1px solid #e6e6e6;
        }
        &.active::after {
          position: absolute;
          width: 170rpx;
          height: 130rpx;
          content: '';
          background: url('http://img.mseenet.com/1E9CBCB2C51F79FF7F64517103A1B051.png')
            no-repeat;
          background-size: cover;
          top: 50rpx;
          right: 30rpx;
        }
        .issued_item_title {
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          font-size: 32rpx;
          color: #333333;
          // font-weight: bold;
          .title {
            border-radius: 5rpx;
            color: #252732;
            text-align: center;
            display: inline-block;
            font-size: 28rpx;
            padding: 10rpx;
            background: #ffda44;
            width: 120rpx;
            font-weight: normal;
          }
        }
        .issued_item_img {
          padding: 20rpx 0;
          > img {
            margin-top: 10rpx;
            // flex: 1;
            display: block;
            // border: 1px solid red;
            width: 690rpx;
            height: 300rpx;
          }
        }
        .issued_item_tip {
          padding-top: 20rpx;
          font-size: 28rpx;
          color: #666666;
          display: flex;
          justify-content: space-between;
        }
        .issued_item_tag {
          margin-top: 20rpx;
          font-size: 26rpx;
          display: flex;
          > div {
            padding: 10rpx;
          }

          .blue,
          .red,
          .gray {
            margin-right: 20rpx;
            border-radius: 5px;
          }

          .blue {
            border: 1px solid #157efb;
            color: #157efb;
          }
          .red {
            border: 1px solid #ff0000;
            color: #ff0000;
          }
          .gray {
            border: 1px solid #666666;
            color: #666666;
          }
        }
      }
      .draft_item {
        // border: 1px solid red;
        & + .draft_item {
          margin-top: 35rpx;
          padding-top: 35rpx;
          border-top: 1px solid #e6e6e6;
        }
        .draft_item_title {
          display: flex;
          justify-content: space-between;
          font-size: 28rpx;
          .class {
            color: #252732;
          }
          .classTime {
            color: #666666;
          }
        }
        .draft_item_info {
          margin: 25rpx 0;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          font-size: 32rpx;
          color: #333333;
          // font-weight: bold;
          .info_title {
            border-radius: 5rpx;
            color: #252732;
            text-align: center;
            display: inline-block;
            font-size: 26rpx;
            padding: 8rpx;
            background: #ffda44;
            width: 180rpx;
            font-weight: normal;
          }
        }
        .draft_item_tip {
          display: flex;
          font-size: 28rpx;
          color: #666666;
          justify-content: space-between;
          .unread {
            color: #f70044;
          }
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
