<template>
  <div id="approvalInfo">
  
    <div class="approvalInfo_title">
      <div class="approvalInfo_titleimg">
        <img :src="approvalInfo.createUserImg" alt="">
      </div>
        <div class="approvalInfo_titleText">
          <div class="approvalInfo_flex">
            <div class="name">{{approvalInfo.createUserName}}</div>
            <div class="time">创建时间: {{approvalInfo.createTime}}</div>
          </div>
          <div class="approvalInfo_flex">
            <div :class="approvalInfo.auditStatus==1?'orange':approvalInfo.auditStatus==2?'green':'red'">{{approvalInfo.auditStatus==1?'待审批':approvalInfo.auditStatus==2?'审批通过':'未通过'}}</div>
          </div>
        </div>
      </div>
      <div class="approvalInfo_content">

        <div class="tip">
          <span>审批编号</span>
          {{approvalInfo.createTimeTwo}}
        </div>
        <div class="tip">
          <span>发布类型：</span>
          {{approvalInfo.newsStyleTypeStr}}
        </div>
        <div class="tip">
          <span>发布内容：</span>
        </div>
        <div class="content">
          {{approvalInfo.title}}
        </div>
        <div class="img" v-if="approvalInfo.titleImgUrl&&approvalInfo.titleImgUrl!=''">
          <img :src="approvalInfo.titleImgUrl" alt="" mode="aspectFit">
      </div>

          <div class="button" @click="goDetail(approvalInfo.id)">查看全部内容 <img src="http://img.mseenet.com/A57E646155F9DB63E721C07D831E5676.png" alt=""></div>
          </div>

          <div class="approvalInfo_footer">
            <!-- 审批 -->
            <div class="footer_examine">
              <div class="examine_item" @click="toggle">
                <div class="check" v-show="flags"></div>
                <div class="examin_info_container">
                  <div class="examine_img">
                    <img :src="approvalInfo.createUserImg" alt="">
                  </div>
                    <div class="examine_info">
                      <div>
                        <div>{{approvalInfo.createUserName}}</div>
                        <div>
                          {{approvalInfo.createTime}}</div>
                      </div>
                      <div class="apply">
                        发起申请
                      </div>
                    </div>
                  </div>
                  <div class="examine_tip">

                  </div>
                </div>

                <div class="examine_item" v-for="(item,index) in approvalInfo.approvalUsers" :key="index" v-if="approvalInfo.approvalUsers&&approvalInfo.approvalUsers.length>0">
                  <div class="examin_info_container">
                    <div class="examine_img">
                      <img :src="item.avatarImg" alt="">
                    </div>
                    <div class="examine_info">
                      <div>
                        <div>{{item.approvalUser}}</div>
                        <div v-if="item.approvalTime&&item.approvalTime.length>0">
                          <span>审批时间：</span>{{item.approvalTime}}</div>
                      </div>
                      <div :style="item.approvalStatus==2?'color:green':item.approvalStatus==3?'color:red':'color:orange'">
                        {{item.approvalStatus==2?"通过":item.approvalStatus==3?"拒绝":"待审批"}}
                      </div>
                    </div>
                    </div>
                    <div class="examine_tip">
                      {{item.approvalContent}}
                    </div>
                  </div>
                </div>

                <!-- 抄送 -->
                <div class="footer_make" v-if="approvalInfo.copyUsers&&approvalInfo.copyUsers.length>0">
                  <div class="title">
                    <span class="tip">抄送人</span>
                    <span>审批通过后，通知抄送人</span>
                  </div>
                  <div class="make_container">
                    <div class="make_item" v-for="(item,index) in approvalInfo.copyUsers" :key="index">
                      <img :src="item.avatarImg" alt="">
                      <div>{{item.nickName}}</div>
                    </div>

                  </div>
                </div>

              </div>
              <div class="approval_btn" v-if="isMyApproval&&isMyApproval==true">
                <view class="approval_choose" @click="SetAuditStatus(approvalInfo.id,2)" style="color:red">
                  <text>同意</text>
                </view>
                <view class="approval_choose" @click="moadShow" style=" background-color: #FFEA55;">
                  <text>拒绝</text>
                </view>
              </div>

              <div class="modal" v-if="modal_show">
                <div class="modal_container">
                  <div class="modal_title">拒绝</div>
                  <div class="modal_tip">请说明拒绝理由</div>
                  <div class="modal_input">
                    <input type="text" placeholder="理由" v-model="modal_value">
              </div>
                    <div class="modal_group">
                      <button type="button" @click="modal_cancel">取消</button>
                      <button type="button" @click="modal_confirm(approvalInfo.id,3)">提交</button>
                    </div>
                  </div>
                </div>
              </div>
</template>

<script>
import { mapState } from 'vuex'
import utils from '@/utils/index'
import { approvalPage, auditStatus } from '@/api/api'
export default {
  props: ['approvalInfo', 'isMyApproval', 'flag'],
  data() {
    return {
      modal_show: false,
      modal_value: '',
      flags: true
    }
  },
  mounted() {
    //初始化数据
    this.init()
  },

  methods: {
    //初始化数据方法
    init() {
      this.modal_show = false
      this.modal_value = ''
    },
    SetAuditStatus: function(id, auditState) {
      var _this = this
      // if (type == 'false') {
      //   this.modal_show = true
      // } else {
      auditStatus({
        id: id,
        auditStatus: auditState
      }).then(res => {
        if (res.data.code == 200) {
          wx.showToast({
            title: '审核成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function() {
            wx.navigateTo({ url: '../myApproval/main' })
          }, 2000)
        } else {
          utils.showDialog(res.data.message)
        }
      })
      // }
    },
    moadShow() {
      this.modal_show = true
    },
    modal_cancel() {
      this.modal_show = false
    },

    modal_confirm(id, auditState) {
      auditStatus({
        id: id,
        auditStatus: auditState,
        remark: this.modal_value
      }).then(res => {
        if (res.data.code == 200) {
          wx.showToast({
            title: '审核成功',
            icon: 'success',
            duration: 2000
          })

          setTimeout(function() {
            wx.navigateBack(1)
            // wx.redirectTo({ url: '../myApproval/main' })
          }, 2000)
        } else {
          utils.showDialog(res.data.message)
        }
      })
      this.modal_show = false;
    },

    goDetail(id) {
      var url = '/pages/pages_one/noticeInfo/main?id=' + id
      wx.navigateTo({ url })
    },

    init() {
      this.modal_show = false
      this.modal_value = ''
    },
    toggle() {
      
      // this.flags = !this.flags;
    }
  },

  computed: {
    // time() {
    //   // console.log(utils.parseDate(this.approvalInfo.createTimeTwo).getTime())
    //   // console.log(this.approvalInfo.createTime)
    //   console.log(this.approvalInfo)
    //   return this.approvalInfo.createTime
    // }
  }
}
</script>

<style lang='scss'>
page {
  // border: 1px solid red;
  width: 100%;
  // height: 100%;
}
.apply{
  color:#31BFAB !important;
}
#approvalInfo {
  height: 100%;
  background: rgb(242, 244, 245);
  .orange {
    color: #ff7800;
  }
  .green {
    color: green;
  }
  .red {
    color: red;
  }
  
  .approvalInfo_title {
    background: white;
    padding: 38rpx 25rpx 26rpx 25rpx;
    border-style: solid;
    border-width: 1rpx;
    border-color: #e6e6e6 transparent #e6e6e6 transparent;
    display: flex;
    .approvalInfo_titleimg {
      > img {
        width: 108rpx;
        height: 108rpx;
        display: block;
        border-radius: 54rpx;
      }
    }
    .approvalInfo_titleText {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      margin-left: 20rpx;
      .approvalInfo_flex {
        width: 100%;
        color: #808080;
        font-size: 26rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .name {
          color: #333333;
          font-size: 30rpx;
        }
        .time {
          color: #b3b3b3;
          font-size: 24rpx;
        }
      }
    }
  }
  .approvalInfo_content {
    background: white;
    padding: 30rpx;
    font-size: 28rpx;
    .tip {
      margin-bottom: 10rpx;
      > span {
        color: #808080;
      }
      color: #333333;
    }
    .content {
      margin-bottom: 20rpx;
      color: #333333;
    }
    .img {
      > img {
        // width: 226rpx;
        // height: 144rpx;
        width: 690rpx;
        height: 300rpx;
      }
    }
    .button {
      font-style: 26rpx;
      color: #b3b3b3;
      margin-top: 25rpx;
      text-align: center;
      > img {
        vertical-align: middle;
        width: 36rpx;
        height: 16rpx;
      }
    }
  }

  .approval_btn {
    width: 100%;
    height: 170rpx;
    background-color: #F3F4F6;
    z-index: 1;
    position: fixed;
    // position: relative;
    bottom: 0;
    display: flex;
    align-items: center;
    /* justify-content: center; */
  }
  .approval_choose {
    width: 330rpx;
    height: 98rpx;
    background: #fff;
    border: 1px solid #ffea55;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    margin-left: 30rpx;
  }

  .approvalInfo_footer {
    margin-top: 50rpx;
    margin-bottom: 110px;
    // height: 300rpx;

    .footer_examine {
      // background: white;
      .examine_item {
        border-radius: 10rpx;
        border: 1px solid #e6e6e6;
        margin: 0 50rpx 40rpx 110rpx;
        background: white;
        padding: 20rpx 10rpx 20rpx 30rpx;
        position: relative;
        // display: flex;
        // flex-direction: column;
        .examin_info_container {
          display: flex;
          .examine_img {
            margin-right: 20rpx;
            > img {
              display: block;
              width: 72rpx;
              height: 72rpx;
            }
          }
          .examine_info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 100%;
            .examine_tip {
              padding: 0 20rpx;
              font-size: 26rpx;
              border-top: 1px solid #e6e6e6;
            }
            & > div:first-child {
              display: flex;
              justify-content: space-between;
              color: #b3b3b3;
              > div:first-child {
                font-size: 28rpx;
              }
              > div:last-child {
                font-size: 24rpx;
              }
            }
            & > div:last-child {
              color: #333333;
              font-size: 26rpx;
            }
          }
        }
        .examine_tip {
          font-size: 26rpx;
          margin-top: 20rpx;
          padding-top: 20rpx;
          border-top: 1px solid #e6e6e6;
        }
        &::after {
          position: absolute;
          left: -90rpx;
          width: 38rpx;
          height: 38rpx;
          top: 0rpx;
          content: '';
          border: 1px solid #2ad7be;
          border-radius: 20rpx;
         
        }
        .check{
          position: absolute;
          left: -92rpx;
          width: 46rpx;
          height: 46rpx;
          top: -2rpx;
          content: '';
          border-radius: 50%;
          z-index: 99;
           background: url('http://img.mseenet.com/A8864FACC18A8CDF56A732CAF094BDD8.png?imageMogr2/strip|imageView2/1/w/200/h/200/q/85')
            no-repeat 0 0;
          background-size: cover;
        }
        &.active::after {
          position: absolute;
          left: -90rpx;
          width: 40rpx;
          height: 40rpx;
          top: 0rpx;
          content: '';
          border: none;
          border-radius: 20rpx;
          background: url('http://img.mseenet.com/A8864FACC18A8CDF56A732CAF094BDD8.png')
            no-repeat;
          background-size: cover;
        }
        &.delete::after {
          position: absolute;
          left: -90rpx;
          width: 40rpx;
          height: 40rpx;
          top: 0rpx;
          content: '';
          border: none;
          border-radius: 20rpx;
          background: url('http://img.mseenet.com/7EB5798624DEFA90814F7A2F09E6A981.png')
            no-repeat;
          background-size: cover;
        }
        &::before {
          position: absolute;
          top: 20rpx;
          left: -20rpx;
          content: '';
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 20rpx;
          border-color: white white transparent transparent;
        }
      }
    }

    .footer_make {
      position: relative;
      padding: 20rpx 10rpx 10rpx 30rpx;
      background: white;
      margin: 0 50rpx 110rpx 110rpx;
      .title {
        font-size: 24rpx;
        > span.tip {
          font-size: 28rpx;
          color: #2fd8bf;
          margin-right: 20rpx;
        }
        > span {
          color: #b3b3b3;
        }
      }
      .make_container {
        display: flex;
        flex-wrap: wrap;
        margin-top: 25rpx;
        .make_item {
          flex: 0 130rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 30rpx;
          // width: 150rpx;
          > img {
            border-radius: 44rpx;
            width: 88rpx;
            height: 88rpx;
            display: block;
          }
          > div {
            margin-top: 20rpx;
            color: #333333;
            font-size: 26rpx;
          }
        }
      }
      &::after {
        position: absolute;
        left: -90rpx;
        width: 40rpx;
        height: 40rpx;
        top: 0rpx;
        content: '';
        background: #ffea55;
        border-radius: 50%;
        // background: url('http://img.mseenet.com/A8864FACC18A8CDF56A732CAF094BDD8.png?imageMogr2/strip|imageView2/1/w/200/h/200/q/85')
        //   no-repeat;
      }

      &::before {
        position: absolute;
        top: 20rpx;
        left: -20rpx;
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 20rpx;
        border-color: white white transparent transparent;
      }
    }
  }
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 9999;
    .modal_container {
      width: 80%;
      border-radius: 20rpx;
      // padding: 0 40rpx;
      // border: 1px solid red;
      background: #f8f8f8;
      display: flex;
      flex-direction: column;

      .modal_title {
        font-weight: bold;
        text-align: center;
        padding: 20rpx 0;
        // border: 1px solid red;
      }
      .modal_tip {
        font-size: 15px;
        padding: 20rpx 0;
        text-align: center;
        // border: 1px solid red;
      }
      .modal_input {
        padding: 10rpx 20rpx;
        // border: 1px solid red;
        > input {
          background: white;
          padding: 10rpx 0 10rpx 20rpx;
          border: 1px solid #ccc;
          border-radius: 12rpx;
        }
      }
      .modal_group {
        margin-top: 20rpx;
        display: flex;
        // border: 1px solid red;
        button {
          flex: 1;
          &:first-child {
            color: #ccc;
          }
          &:last-child {
            color: #000;
          }
        }
      }
    }
  }
  
}
</style>


