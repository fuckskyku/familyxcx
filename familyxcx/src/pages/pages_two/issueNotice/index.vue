<template>
  <div id="issueNew" :class="[step==2?'two':'',step==3?'three':'']">
    <section class="issueNew_two" v-show="step==1">
      <h3 class="title">第一步</h3>
      <!--科目-->
      <div class="kemu">
        <p>类型:</p>
        <picker :value="index" :range="array" range-key="dictName" @change="bindPickerChange">
          <div class="kemu-con">
            <!-- <input :value="data" @click="blur($even)" /> -->
            <div>{{array[index].dictName}}</div>
            <img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png">
          </div>
        </picker>
      </div>

      <div class="kemu" v-if="index==4">
        <p>回签提醒截止时间:</p>
        <picker :value="data" mode="date" :start='start' @change="bindDateChange">
          <div class="kemu-con">
            <!-- <input :value="data" @click="blur($even)" /> -->
            <div>{{data}}</div>
            <img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png">
          </div>
        </picker>
      </div>

      <div class="kemu">
        <p>通知对象:</p>
        <div class="ObjContainer">
          <div class="Obj_item" v-for="(item,index) in issueNotice.classList" :key="index" @click="del('obj',item)">
            <div class="addExamine_item_text">{{item.teacherName?item.teacherName:item.gradeName+item.className}}</div>
          </div>
          <div class="Obj_item" v-for="(item,index) in issueNotice.userList" :key="index" @click="del('obj',item)">
            <div class="addExamine_item_text">{{item.teacherName?item.teacherName:item.gradeName+item.className}}</div>
          </div>

          <div class="addObjMake" @click="addObj">
            <div>+添加</div>
          </div>

        </div>
      </div>
    </section>

    <section class="issueNew_two" v-show="step==2">
      <h3 class="title">第二步</h3>
      <!--科目-->
      <div class="kemu">
        <p>审批人：</p>
        <radio-group class="radio-group" @change="examineradioChange" v-if="issueNotice.approvalUserId.length==0">
          <label class="radio">
            <radio value='true' :checked="true" />是
          </label>
          <label class="radio">
            <radio value='false' :checked="false" />否
          </label>
        </radio-group>
        <div class="addExamineContainer" v-if="examine=='true'">
          <div class="addExamine" v-if="issueNotice.approvalUserId.length<4" @click="addExamine">
            <img src="http://img.mseenet.com/iOS_CutDiagram/information/chat_more@2x.png" alt="">
            <div>添加</div>
          </div>
          <div class="addExamine_item" v-for="(item,index) in issueNotice.approvalUserId" :data-flag='item.flag||item.disabled||false' :key="index" @click="del('examine',item)">
            <div class="addExamine_item_img">
              <img :src="item.avatarImg" alt="">
            </div>
            <div class="addExamine_item_text">{{item.teacherName}}</div>
          </div>

        </div>
      </div>
      <div class="kemu">
        <p>抄送人：</p>
        <radio-group class="radio-group" @change="makeradioChange" v-if="issueNotice.copyUserId.length==0">
          <label class="radio">
            <radio value='true' :checked="true" />是
          </label>
          <label class="radio">
            <radio value='false' :checked="false" />否
          </label>
        </radio-group>
        <div class="makeContainer" v-if="make=='true'">
          <div class="addMake" @click="addMake">
            <img src="http://img.mseenet.com/iOS_CutDiagram/information/chat_more@2x.png" alt="">
            <div>添加</div>
          </div>
          <!-- 抄送人列表 -->
          <div class="make_item" v-for="(item,index) in issueNotice.copyUserObj" :key="index" :data-flag='item.flag||item.disabled||false' @click="del('copy',item)">
            <div class="addExamine_item_img">
              <img :src="item.avatarImg " alt=" ">
            </div>
            <div class="addExamine_item_text ">{{item.teacherName}}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="issueNew_two" v-show="step==3">
      <h3 class="title">第三步</h3>
      <div class="kemu">
        <p>标题：</p>
        <div class="kemu-con">
          <input placeholder="标题（40字以内）" v-model="title" @input="getTitle()" />
        </div>
      </div>

      <div class="kemu">
        <p>内容：</p>
        <textarea bindblur="bindTextAreaBlur" @input="getInput()" :maxlength=-1 class="textarea" placeholder="请输入" v-model="content" />
      </div>
    </section>

    <div class="button_group">
      <button @click="rough" v-if="step==3" class="rough">存草稿</button>
      <!-- <button @click="preview" v-if="step==3" class="rough">预览</button> -->
      <button v-if="step!=1" class="rough" @click="black">上一步</button>
      <button @click="next" style="margin-bottom: 20px;">{{step==3?'确认发布':'下一步'}}</button>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import utils from '@/utils/index'
import { commonDictList, getApprovalCopy, noticeSave } from '@/api/api'
export default {
  data() {
    return {
      step: 1,
      array: [{}],
      index: 0,
      contentType: '1',
      uploadImgSrc: '',
      data: '请选择',
      start: new Date().format('yyyy-MM-dd'),
      examine: 'true',
      make: 'true',
      title: '',
      content: ''
    }
  },
  computed: {
    ...mapState(['token', 'issueNotice'])
  },
  mounted() {
    this.init()
    this.step = 1
    commonDictList({ dataTypeCode: 'notify_type' }).then(res => {
      // console.log(res)
      if (res.data.code == '200') {
        this.array = res.data.data
      }
    })
    //打印详情
    console.log("this.issueNotice",this.issueNotice)
  },
  methods: {
    ...mapActions(['setIssueNotice', 'setClearNotice']),
    bindPickerChange(value) {
      this.index = value.mp.detail.value
    },

    bindDateChange(value) {
      this.data = value.mp.detail.value
    },
    next() {
      if (this.step == 1) {
        if (this.array[this.index].id < 1) {
          utils.showDialog('请选择通知类型')
          return
        }

        if (
          this.issueNotice.classList.length < 1 &&
          this.issueNotice.userList.length < 1
        ) {
          utils.showDialog('请选择通知的对象')
          return
        }
        this.step = 2
        getApprovalCopy({
          newsStyleType: this.array[this.index].dictCode
        }).then(res => {
          console.log(res)
          this.isValid = res.data.data.isValid
          res.data.data.approvalUserList.forEach(item => {
            item.avatarImg = utils.formatImgUrl(item.avatarImg)
          })
          res.data.data.copyUserList.forEach(item => {
            item.avatarImg = utils.formatImgUrl(item.avatarImg)
          })
          let userId = []
          res.data.data.copyUserList.forEach(item => {
            userId.push(item.userId)
          })
          let objNew = [
            { key: 'approvalUserId', value: res.data.data.approvalUserList },
            { key: 'copyUserObj', value: res.data.data.copyUserList },
            { key: 'copyUserId', value: userId }
          ]
          this.setIssueNotice(objNew)
        })
      } else if (this.step == 2) {
        console.log("examine", this.examine);
        console.log("this.issueNotice", this.issueNotice.approvalUserId);
        if (
          this.examine == 'true' &&
          this.issueNotice.approvalUserId.length == 0
        ) {
          utils.showDialog('请选择审批人')
          return
        }
        console.log("this.make", this.make);
        console.log("this.issueNotice", this.issueNotice);
        if (this.make == 'true' && this.issueNotice.copyUserObj.length == 0) {
          utils.showDialog('请选择抄送人')
          return
        }
        this.step = 3
      } else if (this.step == 3) {
        if (!utils.required(this.title)) {
          utils.showDialog('请输入标题')
          return
        }
        if (!utils.maxlength(this.title, 40)) {
          utils.showDialog('标题内容过长')
          return
        }
        if (!utils.required(this.content)) {
          utils.showDialog('请输入内容')
          return
        }
        this.issueNoticeSave(2)
      }
    },

    examineradioChange(value) {
      console.log(value)
      this.examine = value.mp.detail.value
      console.log(this.examine)
    },
    makeradioChange(value) {
      this.make = value.mp.detail.value
    },

    //选择对象
    addObj() {
      let url = '../issueNoticeList/main?type=1'
      wx.navigateTo({ url })
    },
    //选择审批人
    addExamine() {
      let url = '../issueNoticeList/main?type=2&sign=1'
      wx.navigateTo({ url })
    },
    //选择抄送人
    addMake() {
      let url = '../issueNoticeList/main?type=3&sign=2'
      wx.navigateTo({ url })
    },
    //草稿箱
    rough() {
      if (!utils.required(this.title)) {
        utils.showDialog('请输入标题')
        return
      }
      if (!utils.required(this.content)) {
        utils.showDialog('请输入内容')
        return
      }
      var _this = this
      wx.showModal({
        title: '',
        content: '是否放入草稿箱？',
        success: function(sm) {
          if (sm.confirm) {
            _this.issueNoticeSave(1)
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    black() {
      if (this.step > 1) {
        this.step = this.step - 1
      } else {
        this.step = 1
      }
    },
    //预览
    preview() {},
    //删除审批、抄送人
    del(type, item) {
      console.log("type",type,"item",item)
      if (type == 'obj') {
        this.issueNotice.classList.forEach((itemOne, index) => {
          if (item.classId == itemOne.classId) {
            this.issueNotice.classList.splice(index, 1)
          }
        })

        this.issueNotice.userList.forEach((itemOne, index) => {
          if (item.userId == itemOne.userId) {
            this.issueNotice.userList.splice(index, 1)
          }
        })

        function examineObjFor(data) {
          data.forEach((itemOne, index) => {
            if (itemOne.userId) {
              if (itemOne.userId == item.userId) {
                itemOne.checked = false
              }
            }
            if (itemOne.classId) {
              if (itemOne.classid == item.classid) {
                itemOne.checked = false
              }
            }
            examineObjFor(itemOne.childTreeList)
          })
        }
        examineObjFor(this.issueNotice.ObjParent)
      } else if (type == 'examine') {
        if (!item.flag) {
          if (!item.disabled) {
            this.issueNotice.approvalUserId.forEach((itemOne, index) => {
              if (itemOne.userId == item.userId) {
                this.issueNotice.approvalUserId.splice(index, 1)
              }
            })
          }
        }
      } else if (type == 'copy') {
        // this.issueNotice.copyUserId
				// 中查找
				// item.userId
        if (!item.flag) {
          if (!item.disabled) {
            this.issueNotice.copyUserId.forEach((itemOne, index) => {
              if (itemOne == item.userId) {
                console.log(itemOne)
                this.issueNotice.copyUserId.splice(index, 1)
              }
            })
            this.issueNotice.copyUserObj.forEach((itemOne, index) => {
              if (itemOne.userId == item.userId) {
                this.issueNotice.copyUserObj.splice(index, 1)
              }
            })

            function examineObjFor(data) {
              data.forEach((itemOne, index) => {
                if (itemOne.userId) {
                  if (itemOne.userId == item.userId) {
                    itemOne.checked = false
                  }
                }
                examineObjFor(itemOne.childTreeList)
              })
            }

            examineObjFor(this.issueNotice.ObjParentOne)
          }
          // console.log(type, item, 2)
        }
        // ...mapState(['token', 'issueNotice'])
        // let objNew = [
        //   this.issueNotice
        // ]
        //抄送，审批人信息
        console.log("this.issueNotice.copyUserId",this.issueNotice.copyUserId)
        console.log("this.issueNotice.userList",this.issueNotice.userList,"this.issueNotice.copyUserObj",this.issueNotice.copyUserObj)
        // this.setIssueNotice(objNew)
      }
    },
    //del结束
    getTitle() {

    },
    issueNoticeSave(type) {
      console.log("this.issueNotice.copyUserId",this.issueNotice.copyUserId)
      noticeSave({
        title: this.title,
        content: '<section><p>' + this.content + '</p></section>',
        newsStyleType: this.array[this.index].dictCode,
        classIds: this.issueNotice.classIds.toString(),
        userIds: this.issueNotice.userIds.toString(),
        signExp: this.date,
        approvalUserId: this.issueNotice.approvalUserId
          .map((item, index, array) => {
            return item.userId
          })
          .toString(),
        copyUserId: this.issueNotice.copyUserId.toString(),
        editStatus: type
      }).then(res => {
        console.log(res)
        if (res.data.code == 200) {
          this.setClearNotice()
          var r = type == 1 ? '已存入草稿箱' : '发布成功'
          wx.showToast({
            title: r,
            icon: 'success',
            duration: 2000
          })
          setTimeout(function() {
            wx.reLaunch({ url: '../index/main' })
          }, 2000)
        } else {
          console.log(res.data.message)
        }
      })
// **************************************************************************
      // wx.showModal({
      //   title: '',
      //   content: '作业发布成功（恭喜您获得 5 积分）',
      //   cancelText:'关闭',
      //   confirmText:'查看',
      //   success: function(res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //     }
      //   }
      // })
    },
    init() {
      this.step = 1
      this.array = [{}]
      this.index = 0
      this.contentType = '1'
      this.uploadImgSrc = ''
      this.data = '请选择'
      this.start = new Date().format('yyyy-MM-dd')
      this.examine = 'true'
      this.make = 'true'
      this.title = ''
      this.content = wx.getStorageSync('notice')
    },
    onload() {
      console.log()
    },
    onUnload() {
      var value = wx.getStorageSync('notice')
      this.content = value
      console.log()
    },
    getInput() {
      wx.setStorageSync("notice",this.content)
      console.log(this.content)
    }
  },
  watch: {
    step(value) {
      console.log(value)
    }
  }
}
</script>
<style lang="scss" scoped>
$fontColor-a: #000000;
$fontColor-b: #808080;
#issueNew {
  &::before {
    content: '';
    height: 1rpx;
    background: #ffea55;
    width: 33%;
    position: fixed;
    top: 0;
    left: 0;
  }
  &.two {
    &::before {
      width: 66%;
    }
  }
  &.three {
    &::before {
      width: 100%;
    }
  }

  .issueNew_one,
  .issueNew_two,
  .issueNew_three {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding: 47rpx 30rpx;
    .title {
      color: $fontColor-a;
      font-size: 42rpx;
      font-family: 'PingFang-SC-Bold';
      font-weight: bold;
    }
    .kemu {
      margin-top: 90rpx;
      p {
        font-size: 36rpx;
        color: $fontColor-b;
        margin-bottom: 20rpx;
      }
      .pickImg {
        background: #ececec;
        width: 100%;
        height: 250rpx;
        text-align: center;
        line-height: 250rpx;
        > img {
          max-width: 100%;
          height: 100%;
        }
      }
      .radio-group {
        display: flex;
        > label {
        }
        .radio {
          flex: 1;
        }
      }
      .textarea {
        width: 100%;
        height: 200rpx;
      }
      .ObjContainer {
        display: flex;
        flex-wrap: wrap;
        .Obj_item {
          flex: 0 160rpx;
          padding: 10rpx;
          border-radius: 10rpx;
          margin: 0 20rpx;
          margin-top: 20rpx;
          background: #fff4aa;
          position: relative;
          &::after {
            position: absolute;
            top: 0rpx;
            right: 0rpx;
            display: block;
            width: 26rpx;
            height: 26rpx;
            background: url('http://img.mseenet.com/7EB5798624DEFA90814F7A2F09E6A981.png')
              no-repeat;
            background-size: 100%;
            content: '';
          }
        }
        .addExamine_item_text {
          text-align: center;
          width: 100%;
          font-size: 34rpx;
        }
        .addObjMake {
          display: flex;
          align-items: center;
          // margin-left: 10rpx;
          margin-top: 20rpx;
          color: #3498ff;
        }
      }

      .makeContainer {
        justify-content: flex-start !important;
        > div {
          margin-top: 20rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 0 170rpx;
        }
      }
      .addExamineContainer,
      .makeContainer {
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-around;
        margin-top: 40rpx;
        .make_item[data-flag='false'],
        .addExamine_item[data-flag='false'] {
          &::after {
            position: absolute;
            display: block;
            // color: red;
            content: '';
            right: 0rpx;
            top: -5rpx;
            width: 46rpx;
            height: 46rpx;
            background: url('http://img.mseenet.com/7EB5798624DEFA90814F7A2F09E6A981.png')
              no-repeat;
            background-size: 100%;
          }
        }

        .addExamine_item,
        .addExamine,
        .make_item {
          flex: 0 170rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          & + .addExamine_item::before {
            background: url('http://img.mseenet.com/A57E646155F9DB63E721C07D831E5676.png')
              no-repeat;
            display: block;
            position: absolute;
            left: -20rpx;
            top: 40rpx;
            content: '';
            width: 50rpx;
            height: 50rpx;
          }
          .addExamine_item_img {
            width: 100rpx;
            height: 100rpx;
            > img {
              border-radius: 50rpx;
              // display: block;
              width: 100rpx;
              height: 100rpx;
            }
          }
          .addExamine_item_text {
            text-align: center;
            margin-top: 7rpx;
            // width: 100%;
            font-size: 32rpx;
          }
        }
        .addExamine,
        .addMake {
          > img {
            // display: block;
            width: 100rpx;
            height: 100rpx;
          }
          > div {
            color: #2e9efc;
            font-size: 32rpx;
            width: 100rpx;
            text-align: center;
          }
        }
        // .addMake {
        //   display: flex;
        //   flex-direction: column;
        //   align-items: center;
        //   width: 170rpx;
        // }
      }
      .kemu-con {
        width: 100%;
        border-bottom: solid #e5e5e5 1rpx;
        padding: 30rpx 0;
        display: flex;
        align-items: center;
        div,
        input {
          font-size: 36rpx;
          flex: 1;
        }
        img {
          width: 15rpx;
          height: 26rpx;
        }
      }
    }
  }

  .button_group {
    margin-top: 40rpx;
    > button {
      &.rough {
        background: transparent;
        border: 1px solid #ffea55;
        margin-bottom: 30rpx;
      }
      width: 690rpx;
      background: #ffea55;
      border-radius: 10rpx;
    }
  }
}
</style>

