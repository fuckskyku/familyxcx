<template>
  <div id="noticeComponents">
    <div class="tab">
      <scroll-view scroll-x="true" class="tab_h">
        <view v-for="(item,index) in item" :class="[isActive==index?'active':'','tab_item']" :key="index" @click="swichNav(index)">{{item.label}}</view>
      </scroll-view>
      <swiper class="tab-content" :current="isActive" duration="300" @change="switchTab">
        <swiper-item v-for="(itemone,indexone) in item" :key="indexone" class="tab-swiper-item">
          <scroll-view scroll-y="true" class="scoll-h">
            <block>
              <div :class="[item.isActive?'active':'','issued_item']" v-for="(approval,index) in approvalList" :key="index" v-if="approvalList.length>0" @click="bindViewApprovalInfo(approval.id)">
                <div class="issued_item_title">
                  <div class="title_img">
                    <img :src="approval.createUserImg" alt="">
                  </div>
                  <div class="title_text">
                    <div class="text_flex">
                      <div>{{approval.createUserName}}</div>
                      <div>{{approval.createTime}}</div>
                    </div>
                    <div :class=" approval.auditStatus==1?'orange':approval.auditStatus==2?'green':'red'">{{approval.auditStatus==1?'待审批':approval.auditStatus==2?'审批通过':'审批不通过'}}</div>
                  </div>
                </div>
                <div class="issued_item_info">
                  <div>
                    <span class="title">发布类型：</span>
                    {{approval.newsStyleTypeStr}}
                  </div>

                  <div class="issued_item_infoChild">
                    <div>
                      <div class="title"> 发布内容：</div>
                      <div class="info">
                        {{approval.title}}
                      </div>
                    </div>
                    <div>
                      <img :src="approval.titleImgUrl" alt="">
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="approvalList.length==0" class="noData">
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
import wxParse from 'mpvue-wxparse'
import utils from '@/utils/index'
import { approvalList, approvalCopyList } from '@/api/api'

export default {
  props: {
    type: 0 //类型 0 待审核  1 抄送我的 2 已经审批
  },
  data() {
    return {
      item: [{ label: '待审核' }, { label: '抄送我的' }, { label: '已审批' }],
      isActive: '0',
      approvalList: []
    }
  },
  mounted() {
    this.initData()
    this.loadData(this.type)
  },
  onShow() {
    //console.log("onShow")
    this.initData()
    this.loadData(this.type)
  },

  // 下拉刷新方法，与methods方法同级
  async onPullDownRefresh() {
    //console.log("onPullDownRefresh")
    this.loadData(this.type)
    // 停止下拉刷新
    wx.stopPullDownRefresh()
  },

  // 上拉加载，拉到底部触发
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    // this.loadMore();
  },

  methods: {
    /*审批列表*/
    getapprovalList: function(type) {
      var auditStatusType = ''
      switch (type) {
        case 1:
          auditStatusType = 'noAuditStatus' //未审核
          break
        case 2:
          auditStatusType = 'hasAuditStatus' //已审核
          break
      }
      approvalList({
        pageNo: 1,
        pageSize: 10,
        auditStatusType: auditStatusType
      }).then(res => {
        if (res.data.code == 200) {
          var _List = res.data.data.data
          if (_List.length > 0) {
            _List.forEach(function(item) {
              item.titleImgUrl =
                item.titleImgUrl && item.titleImgUrl.length > 0
                  ? utils.formatImgUrl(item.titleImgUrl)
                  : ''
              item.createUserImg =
                item.createUserImg && item.createUserImg.length > 0
                  ? utils.formatImgUrl(item.createUserImg)
                  : ''

              item.createTime = utils.formatTimeMin(item.createTime)
              item.finishTime = item.finishTime
                ? utils.formatTimeMin(utils.transLocalTime(item.finishTime))
                : null
            })
          }
          this.approvalList = _List
        } else {
          console.log(res.data.message)
        }
      })
    },
    /*审批列表 结束*/

    /*抄送我的列表*/
    getapprovalCopyList: function() {
      approvalCopyList({ pageNo: 1, pageSize: 10 }).then(res => {
        if (res.data.code == 200) {
          var _List = res.data.data.data
          if (_List.length > 0) {
            _List.forEach(function(item) {
              item.titleImgUrl =
                item.titleImgUrl && item.titleImgUrl.length > 0
                  ? utils.formatImgUrl(item.titleImgUrl)
                  : ''
              item.createUserImg =
                item.createUserImg && item.createUserImg.length > 0
                  ? utils.formatImgUrl(item.createUserImg)
                  : ''
              item.createTime = utils.formatTimeMin(item.createTime)
              item.finishTime = item.finishTime
                ? utils.formatTimeDate(utils.transLocalTime(item.finishTime))
                : null
            })
          }
          this.approvalList = _List
        } else {
          console.log(res.data.message)
        }
      })
    },
    /*抄送我的列表 结束*/

    /*跳转审批详情 */
    bindViewApprovalInfo(id) {
      let url = '/pages/pages_two/myApprovalInfo/main?id=' + id
      wx.navigateTo({ url })
    },
    /*审批详情 */

    switchTab(e) {
      this.isActive = e.target.current
      this.loadData(this.isActive)
    },
    loadData(type) {
      // console.log("type",type)
      switch (type) {
        case 0:
          this.getapprovalList(1)
          break
        case 1:
          this.getapprovalCopyList()
          break
        case 2:
          this.getapprovalList(2)
          break
      }
    },
    swichNav(index) {
      this.isActive = index
    },
    //初始化数据
    initData: function() {
      this.isActive = 0
      this.approvalList = []
    }
  }
}
</script>

<style lang='scss'>
$fontColor: #333333;
$fontSize: 28rpx;
page{
  height: 100%
}
#noticeComponents {
  height: 100%;
  .tab {
    // background: rgb(242, 244, 245);
    height: 100%;
    // border: 1px solid red;
    .tab_h {
      border-top: 1px solid #e6e6e6;
      background: white;
      // border: 1px solid red;
      box-sizing: border-box;
      padding: 0 50rpx;
      margin: 0 auto;
      // margin-bottom: 20rpx;
      // margin-top: 20rpx;
      // margin-bottom: 20rpx;
      width: 100%;
      text-align: center;
      // height: 88rpx;
      &::after {
        content: '';
        display: block;
        clear: both;
      }
      .tab_item {
        padding: 30rpx 0;
        color: #808080;
        // line-height: 88rpx;
        display: inline-block;
        position: relative;
        &:last-child {
          float: right;
        }
        &:first-child {
          float: left;
        }
        &.active {
          color: #333333;
          &::after {
            content: '';
            width: 100%;
            height: 4rpx;
            display: block;
            position: absolute;
            background: #ffea55;
            bottom: 5rpx;
          }
        }
      }
    }
  }
  .tab-content {
    height: 88%;
    margin-top: 20rpx;
    .scoll-h {
      height: 100%;
      box-sizing: border-box;
      margin-bottom: 10rpx;
      .issued_item {
        position: relative;
        padding: 30rpx 0;
        background: white;
        margin-bottom: 20rpx;
        // & + .issued_item {
        //   border-top: 1px solid #e6e6e6;
        // }
        &.active::after {
          position: absolute;
          width: 170rpx;
          height: 130rpx;
          content: '';
          background: url('http://img.mseenet.com/26220DC3375B2144FAB6EBDB827CEA6A.png')
            no-repeat;
          background-size: cover;
          top: 50rpx;
          right: 30rpx;
        }
        .issued_item_title {
          box-sizing: border-box;
          padding: 0 30rpx;
          display: flex;
          width: 100%;
          .title_img {
            margin-right: 20rpx;
            > img {
              width: 108rpx;
              height: 108rpx;
              display: block;
              border-radius: 54rpx;
            }
          }
          .title_text {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            width: 100%;
            .text_flex {
              width: 100%;
              font-size: 30rpx;
              display: flex;
              justify-content: space-between;
              align-items: center;
              > div:last-child {
                font-size: 24rpx;
                color: #b3b3b3;
              }
            }
            > div:last-child {
              font-size: 26rpx;
            }
            .orange {
              color: #ff7800;
            }
            .green {
              color: green;
            }
            .red {
              color: red;
            }
          }
          // display: -webkit-box;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // word-break: break-all;
          // -webkit-box-orient: vertical;
          // -webkit-line-clamp: 2;
          // font-size: 36rpx;
          // color: #333333;
          // font-weight: bold;
          // .title {
          //   border-radius: 5rpx;
          //   color: #252732;
          //   text-align: center;
          //   display: inline-block;
          //   font-size: 28rpx;
          //   padding: 10rpx;
          //   background: #ffda44;
          //   width: 120rpx;
          //   font-weight: normal;
          // }
        }
        .issued_item_info {
          padding: 20rpx 30rpx;
          border-top: 1px solid #e6e6e6;
          margin-top: 20rpx;
          font-size: 26rpx;
          .title {
            line-height: 50rpx;
            color: #808080;
          }

          .issued_item_infoChild {
            display: flex;
            align-items: center;
            // border: 1px solid red;
            .info {
              margin-right: 30rpx;
              display: -webkit-box;
              overflow: hidden;
              text-overflow: ellipsis;
              word-break: break-all;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
            }
            > div:last-child {
              > img {
                display: block;
                width: 144rpx;
                height: 144rpx;
              }
            }
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
