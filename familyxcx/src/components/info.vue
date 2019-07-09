<template>
  <div id="info" v-if="detail">
    <article class="article">
      <div class="title">{{detail.title}}</div>
      <div class="tip_item_title" v-if="detail.type&& detail.type==2">
        <span class="info_title">{{detail.subjectName}}</span>
        <div class="class">{{detail.classGradeName}}</div>
        <div class="classTime">交作业时间：{{detail.finishTime}}</div>
      </div>
      <div class="tip_content">
        <div class="number" v-if="(userType==1 && detail.noReadCount>0)">{{detail.noReadCount}}人未读</div>
        <div :style="{'textAlign':userType==1 && detail.noReadCount>0?'center':'left'}">发布人：{{detail.createUserName||detail.teacherName}}</div>
        <div class="time">{{detail.createTime}}</div>

      </div>
      <address class="address">
        <!-- {{detail.content}} -->
        <wxParse :content="detail.content" @preview="preview" @navigate="navigate" v-if="detail.content" />
        <div v-else>
          <span>暂时没有内容哦~</span>
        </div>
        <!-- <div></div> -->
        <!-- <img :src="detail.titleImgUrl" alt="" mode="aspectFit" v-if="detail.titleImgUrl&&detail.titleImgUrl.length>0"> -->
      </address>
    </article>
    <div class="commentOn" v-if="comment">
      <div class="title">评论 {{detail.commentCount}}</div>
      <article class="article_comment">
        <div class="comment_item" v-for="(item,index) in comment" :key="index">
          <div class="comment_img"><img :src="item.avatarImg" alt="" mode='aspectFit'></div>
            <div class="comment_container">
              <div class="comment_title">
                <div>{{item.createUser}}</div>
                <div>{{item.createTime}}</div>
              </div>
              <div class="comment_info">
                {{item.commentText}}
              </div>
            </div>
          </div>
      </article>
    </div>
    <div class="input" v-if="detail.isNotice!=1 && detail.type==1">
      <input placeholder="评论" confirm-type="send" @confirm="saveComment($event)" v-model="commentText" />
      <div class="input_img">
        <div @click="postMarkGood()" >
          <img :src="detail.boMarkGood?'http://img.mseenet.com/iOS_CutDiagram/information/information_like@3x.png':'http://img.mseenet.com/iOS_CutDiagram/home/home_like_icon@3x.png'" alt="" mode='aspectFit'>
          <span> {{detail.goodCount}}</span>
        </div>
        <div>
          <img src="http://img.mseenet.com/iOS_CutDiagram/tab/tab_information_nor@3x.png" alt="" mode='aspectFit'>
          <span> {{detail.commentCount}}</span>
        </div>
      </div>
    </div>

    <div v-if="flagType=='true'" class="btn_group">
      <button type="button" class="del" @click="del">删除</button>
      <button type="button" class="make" @click="make">编辑</button>
    </div>

  </div>
  <div id="noInfo" v-else>
    <img src="/static/img/vacancy_release.png">
    <span>暂时没有内容哦~</span>
  </div>
</template>

<script>
import wxParse from 'mpvue-wxparse'
import utils from '@/utils/index'
import { mapState, mapActions } from 'vuex'
import {
  postComment,
  markGood,
  cancelMarkGood,
  deleteHomework,
  deleteSchoolNews
} from '@/api/api'
export default {
  //userType 1 老师，2 家长
  props: ['detail', 'comment', 'userType', 'flagType', 'homeworkId','schoolNewsId'],
  data() {
    return {
      flagMark: true,
      // article: '<div>我是HTML代码</div>'
      commentText: '',
      isRun: true
    }
  },
  computed: {
    ...mapState(['issueHomeWork','issueNotice','issueNew'])
  },
  mounted() {
    // console.log(this.flagType);
    //console.log(this.userType);
    
  },

  methods: {
    ...mapActions(['setIssueHomeWork', 'setClearHomeWork','setIssueNotice','setClearNotice','setIssueNew','setClearNew']),
    preview(src, e) {
      // do something
    },
    navigate(href, e) {
      // do something
    },
    saveComment(e) {
      // utils.showDialog("您输入的是" + e.target.value + " " + this.detail.id);
      if (!utils.required(e.target.value)) {
        utils.showDialog('随便说点什么吧')
        return
      }
      postComment({
        infoId: this.detail.id,
        commentText: e.target.value,
        infoType: this.detail.type || 0
      }).then(res => {
        if (res.data.code == 200) {
          var newcomment = res.data.data
          if (newcomment) {
            utils.showDialog('提交成功')
            newcomment.createTime = '刚刚' // utils.formatTimeDiff(newcomment.createTime);
            newcomment.avatarImg = utils.formatImgUrl(newcomment.avatarImg)

            this.comment.unshift(newcomment)

            this.detail.commentCount = this.detail.commentCount + 1
            this.commentText = ''
          }
        } else {
          console.log(res.data.message)
        }
      })
    },
    //点赞 & 取消点赞
    doubleClick() {
      var	first = 0;
      var second = 0;
      var date = new Date();
      var one = date.getTime();
      if(this.isRun){
        first = one;
        this.isRun = false;
      } else {
        second = one;
        this.isRun = true;
      }
      if(second > first){
      var end = second - first ;
        if(end > 300 && end < 1000 ){
          console.log("时间间隔"+end+"毫秒");
          this.lockClick();      
        }
        else{
          utils.showDialog("点击频率太快")
        }
      }
    },
    lockClick() {
      let data = {
        infoId: this.detail.id,
        infoType: this.detail.type || 0
      }
      if (!this.detail.boMarkGood) {
            markGood(data).then(res => {
              if (res.data.code == 200) {
                this.detail.boMarkGood = true
                this.detail.goodCount = this.detail.goodCount + 1
                // this.flagtMark = true
              } else {
                console.log(res.data.message)
              }
            })
          }else {
            cancelMarkGood(data).then(res => {
              if (res.data.code == 200) {
                this.detail.boMarkGood = false
                this.detail.goodCount =
                  this.detail.goodCount > 1 ? this.detail.goodCount - 1 : 0
                // this.flagtMark = true
              } else {
                console.log(res.data.message)
              }
            })
          }
          //
    },
   
    postMarkGood() {
      var _this = this;
      if(this.isRun){
        this.lockClick();
        this.isRun = false
        setTimeout(()=>{
          this.isRun = true
        },500)
      }
    },

    del() {
      deleteHomework({ id: this.homeworkId }).then(res => {
        if (res.data.code == '200') {
          wx.redirectTo({ url: '/pages/pages_two/myIssue/main' })
        }
      })

      // deleteSchoolNews({ id: this.SchoolNewsId }).then(res => {
      //   if (res.data.code == '200') {
      //     wx.redirectTo({ url: '/pages/pages_two/myIssue/main' })
      //   }
      // })
    },
    make() {
      var flagIndex
      var checkBox = []
      console.log(this.homeworkId)
      var obj = utils.wxGetStorage('draftList')
      var flag = obj.some((item, index, array) => {
        flagIndex = index
        return item.id == this.homeworkId
      })

      obj[flagIndex].homeworkReadLogs.forEach(item => {
        item.checked = true
        checkBox.push(item)
      })
      // console.log(checkBox);
      var objNew = [
        { key: 'classIds', value: checkBox },
        { key: 'subjectId', value: obj[flagIndex].subjectId },
        { key: 'finishTime', value: obj[flagIndex].finishTime },
        { key: 'title', value: obj[flagIndex].title },
        { key: 'content', value: obj[flagIndex].content }
      ]
      this.setIssueHomeWork(objNew)

      // console.log(flagIndex)
      // utils.wxGetStorage('draftList').index
      // console.log(this.detail)
      // let objNew = [{ key: 'subjectId', value: this.array[this.index].id }]
      // this.setIssueHomeWork(objNew)
      wx.redirectTo({
        url: '/pages/pages_two/issueHomeWork/main'
      })
    }
  },
  components: {
    wxParse
  }
}
</script>

<style lang="scss" scoped>
@import url('~mpvue-wxparse/src/wxParse.css');
#info {
  background: rgb(242, 244, 245);
  //   border: 1px solid red;
  .article {
    background: white;
    padding: 25rpx 0rpx;
    .title {
      padding: 0rpx 20rpx;
      font-weight: 600;
      font-size: 36rpx;
      color: #333;
    }
    .tip_content {
      padding: 30rpx 20rpx 20rpx 20rpx;
      border-bottom: 1px solid #e6e6e6;
      display: flex;
      //   border: 1px solid red;
      justify-content: space-between;
      align-items: center;
      > div {
        font-size: 26rpx;
        color: #b3b3b3;
        text-align: center;
        flex: 1;
        &.number {
          color: #f70044;
          text-align: left;
        }
        &.time {
          text-align: right;
        }
      }
    }
    .tip_item_title {
      padding: 30rpx 20rpx 20rpx 20rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 28rpx;
      .class {
        color: #252732;
      }
      .classTime {
        color: #b3b3b3;
      }
      .info_title {
        border-radius: 5rpx;
        color: #252732;
        text-align: center;
        display: inline-block;
        font-size: 26rpx;
        padding: 8rpx;
        background: #ffda44;
        width: 120rpx;
        font-weight: normal;
      }
    }
    .address {
      font-size: 32rpx;
      color: #666666;
      padding: 25rpx 20rpx;
      > img {
        width: 100%;
      }
    }
  }
  .commentOn {
    margin-top: 30rpx;
    background: white;
    > .title {
      // border-bottom: 1px solid #e6e6e6;
      position: relative;
      // margin-left: 50rpx;
      padding: 25rpx 0 25rpx 50rpx;
      font-size: 32rpx;
      color: #333333;
      &::after {
        position: absolute;
        left: 30rpx;
        background: #ffea55;
        width: 4rpx;
        height: 50rpx;
        top: 50%;
        margin-top: -25rpx;
        content: '';
      }
    }
    .article_comment {
      padding-bottom: 140rpx;
      .comment_item {
        box-sizing: border-box;
        padding: 24rpx 30rpx;
        display: flex;
        align-items: center;
        border-top: 1px solid #e6e6e6;
        .comment_img {
          // flex: 1 86rpx;
          > img {
            display: block;
            width: 86rpx;
            height: 86rpx;
            border-radius: 42rpx;
            overflow: hidden;
          }
          width: 86rpx;
          height: 86rpx;
        }
        .comment_container {
          margin-left: 20rpx;
          flex: 1;
          // overflow: hidden;
          width: 0;
          height: 95rpx;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          // height: 100%;
          .comment_title {
            display: flex;
            justify-content: space-between;
            // border: 1px solid red;
            > div:nth-child(1) {
              font-size: 34rpx;
              color: #f58711;
            }
            > div:nth-child(2) {
              font-size: 24rpx;
              color: #b3b3b3;
            }
          }
          .comment_info {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #333333;
            font-size: 28rpx;
          }
        }
      }
    }
  }

  .input {
    border-top: 1px solid #e6e6e6;
    background: white;
    padding: 15rpx 30rpx;
    width: 690rpx;
    height: 100rpx;
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    .input_img {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > div {
        height: 130rpx;
        position: relative;
        text-align: center;
        font-size: 26rpx;
        color: #808080;
        flex: 1;
        display: flex;
        justify-content: center;//水平居中
        align-items: center;//垂直居中
        &:nth-child(2) {
          flex: 1;
          justify-content: center;//水平居中
          align-items: center;//垂直居中
        }
        img {
          
          justify-content: center;//水平居中
          align-items: center;//垂直居中
          width: 32rpx;
          height: 28rpx;
        }
      }
    }
    // border: 1px solid red;
    input {
      //   flex: 1;
      padding-left: 20rpx;
      font-size: 28rpx;
      // width: 400rpx;
      width: 460rpx;
      height: 68rpx;
      background: #fafafa;
      border: 1px solid #e6e6e6;
      border-radius: 10rpx;
    }
  }
  .btn_group {
    display: flex;
    width: 690rpx;
    position: fixed;
    bottom: 35rpx;
    left: 50%;
    margin-left: -345rpx;
    // transform: translate(-50%);
    justify-content: space-between;
    button {
      width: 330rpx;
    }
    .del {
      color: #fc3d39;
      font-size: 35rpx;
      background: white;
    }
    .make {
      background: #ffea55;
      color: #000000;
    }
  }
}
</style>
