<template>
  <div id="issueHomeWork" :class="[step==2?'two':'',step==3?'three':'']">
    <section class="issueHomeWork_one" v-show="step==1">
      <h3 class="title">第一步</h3>
      <!--科目-->
      <div class="kemu">
        <p>科目：</p>
        <picker @change="bindPickerChange" :value="index" :range="array" range-key="subjectName" class="picker">
          <div class="kemu-con">
            <div>{{array[index].subjectName}}</div>
            <img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png">
          </div>
        </picker>
      </div>
      <!--班级-->
      <div class="banji">
        <p>请选择班级：</p>
        <div class="class_container">
          <div class="class_container_item">
            <div class="class_item" v-for="(item,index) in issueHomeWork.classIds" :key="index" @click="del(item)">
              <!-- <img src="http://img.mseenet.com/iOS_CutDiagram/home/check_bg@2x.png" alt=""> -->
              <div class="className">{{item.gradeName+item.className}}</div>
            </div>
            <div class="class_container_item_add" @click="pickHomeWorkList">
              <div>+添加</div>
              <!-- <img src="http://img.mseenet.com/iOS_CutDiagram/information/chat_more@2x.png" alt=""> -->
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="issueHomeWork_two" v-show="step==2">
      <h3 class="title">第二步</h3>
      <!--科目-->
      <div class="kemu">
        <p>提交作业时间</p>
        <picker mode="date" :value="date" :start='start' @change="bindDateChange">
          <div class="kemu-con">
            <!-- <input :value="data" @click="blur($even)" /> -->
            <div>{{data}}</div>
            <img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png">
          </div>
        </picker>
      </div>

      <div class="kemu">
        <p>标题</p>
        <div class="kemu-con">
          <input placeholder="标题（40字以内）" maxlength="40" v-model="title" />
        </div>
      </div>
    </section>

    <section class="issueHomeWork_three" v-show="step==3">
      <h3 class="title">第三步</h3>
      <!--科目-->
      <div class="kemu">
        <p>内容：</p>
        <textarea :maxlength=-1 class="textarea" placeholder="输入内容" v-model="content" @input="getInput()" />
      </div>
    </section>
    <div class="button_group">
      <button @click="rough" v-if="step==3" class="rough">存草稿</button>
      <!-- <button @click="preview" v-if="step==3" class="rough">预览</button> -->
      <button v-if="step!=1" class="rough" @click="black">上一步</button>
      <button @click="next">{{step==3?'确认发布':'下一步'}}</button>
    </div>
  </div>
</template>
<script>
import { subjects, homeworkSave } from '@/api/api'
import { mapState, mapActions } from 'vuex'
import utils from '@/utils/index'
export default {
  data() {
    return {
      step: 1,
      array: [{}],
      index: 0,
      data: '请选择',
      start: new Date().format('yyyy-MM-dd'),
      title: '',
      content: '',
      text: '',
      classObj: []
    }
  },
  computed: {
    ...mapState(['issueHomeWork'])
  },
  
  mounted() {
    // console.log(this.issueHomeWork.finishTime.split(' '))
    // console.log(this.$mp.query)
    this.step = 1
    this.init()
    
    subjects().then(res => {
      // console.log(res)
      if (res.data.code == '200') {
        this.array = res.data.data
        var Obj = {
          id: 0,
          schoolId: 0,
          subjectName: '请选择',
          createTime: 1532684223000
        }
        this.array.unshift(Obj)
        if (this.issueHomeWork.subjectId != '') {
          var flag = this.array.some((item, index, array) => {
            this.index = index
            return this.issueHomeWork.subjectId == item.id
          })
        }
      }
    })
    
  },

  //离开当前页面后执行
  // destroyed: function() {
  //   this.step = 1;
  //   console.log(this.step)
  // },
  methods: {
    ...mapActions(['setIssueHomeWork', 'setClearHomeWork']),
    //下一步
    next() {
      if (this.step == 1) {
        if (this.array[this.index].id < 1) {
          utils.showDialog('请选择科目')
          return
        }
        if (this.issueHomeWork.classIds.length < 1) {
          utils.showDialog('请选择班级')
          return
        }
        let objNew = [{ key: 'subjectId', value: this.array[this.index].id }]
        this.setIssueHomeWork(objNew)
        this.step = 2
      } else if (this.step == 2) {
        if (!utils.required(this.title)) {
          utils.showDialog('请输入标题')
          return
        }
        if (!utils.maxlength(this.title, 40)) {
          utils.showDialog('标题内容过长')
          return
        }
        

        let objNew = [{ key: 'finishTime', value: this.data }]
        this.setIssueHomeWork(objNew)
        this.step = 3
      } else if (this.step == 3) {
        if (!utils.required(this.content)) {
          utils.showDialog('请输入内容')
          return
        }
        var objNew = [{ key: 'content', value: this.content }]
        // console.log(this.content)
        this.setIssueHomeWork(objNew)
        this.issueHomeWorkSubMit(2)
      }
    },

    //发布作业接口方法封装
    issueHomeWorkSubMit(type) {
      var that = this
      homeworkSave({
        title: this.issueHomeWork.title,
        subjectId: this.issueHomeWork.subjectId,
        classIds: this.issueHomeWork.classIds
          .map((item, index, array) => {
            return item.classId
          })
          .toString(),
        gradeIds: this.issueHomeWork.classIds
          .map((item, index, array) => {
            return item.gradeId
          })
          .toString(),
        finishTime: this.issueHomeWork.finishTime,
        content: '<section><p>' + this.content + '</p></section>',
        editStatus: type
      }).then(res => {
        console.log(res)
        if (res.data.code == '200') {
          var r = type == 1 ? '已存入草稿箱' : '发布成功'
          this.setClearHomeWork()
          wx.showToast({
            title: r,
            icon: 'success',
            duration: 2000
          })
          setTimeout(function() {
            wx.reLaunch({ url: '../index/main' })
          }, 2000)
        } else {
          utils.showDialog(res.data.message)
        }
      })
    },

    //选择科目
    bindPickerChange(value) {
      // console.log(value)
      this.index = value.mp.detail.value
      // console.log(this.index)
      var objNew = [{ key: 'subjectId', value: this.array[this.index].id }]
      this.setIssueHomeWork(objNew)
      
    },
    pickHomeWorkList() {
      let url = '../issueHomeWorkList/main'
      wx.navigateTo({ url })
    },
    //提交作业时间
    bindDateChange(value) {
      this.data = value.mp.detail.value
    },

    // //内容事件
    // bindblur(value) {
    //   this.content = value.mp.detail.value
    //   // var objNew = [{ key: 'content', value: this.content }]
    //   // this.setIssueHomeWork(objNew)
    //   // console.log(this.issueHomeWork.content)
    //   console.log(value)
    // },

    //草稿箱
    rough() {
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
            _this.issueHomeWorkSubMit(1)
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    //初始化数据
    init() {
      console.log(this.issueHomeWork.content)
      this.step = 1
      this.array = [{}]
      this.index = 0
      this.data =
        this.issueHomeWork.finishTime == ''
          ? '请选择'
          : this.issueHomeWork.finishTime.split(' ')[0]
      this.start = new Date().format('yyyy-MM-dd')
      this.title =
        this.issueHomeWork.title == '' ? '' : this.issueHomeWork.title
      // this.content = 
      //   this.issueHomeWork.content == '' ? '' : this.issueHomeWork.content
      this.content = wx.getStorageSync('work')
      this.text = ''
      this.classObj = []
    },
    //预览
    preview() {},

    del(item) {
      this.issueHomeWork.classIds.forEach((itemOne, index) => {
        if (item.classId == itemOne.classId) {
          this.issueHomeWork.classIds.splice(index, 1)
        }
      })
      // console.log(item)
    },

    //返回上一页
    black() {
      if (this.step == 3) {
        this.step = 2
      } else if (this.step == 2) {
        this.step = 1
      }
    },
    getInput() {
      wx.setStorageSync("work",this.content)
    }
  },

  watch: {
    step(value) {
      //console.log(value);
    },
    title(value) {
      var objNew = [{ key: 'title', value: value }]
      this.setIssueHomeWork(objNew)
      
      if(this.title.length > 39){
        utils.showDialog('已输入40字')
      }
    }
  },
  //监听返回
  onUnload() {
    console.log('clear')
    var value = wx.getStorageSync('work')
    this.content = value
    console.log(this.content)
    // this.setClearHomeWork()
    // wx.showModal({
    //   title: '',
    //   content: '返回数据将丢失,确定返回？',
    //   success: function(sm) {
    //     if (sm.confirm) {
    //       // var url = '/pages/pages_one/logout/main'
    //       // wx.reLaunch({
    //       //   url: url
    //       // })
    //     } else if (sm.cancel) {
    //       // console.log('用户点击取消')
    //     }
    //   }
    // })
  }
  
}
</script>
<style lang="scss">
$fontColor-a: #000000;
$fontColor-b: #808080;
#issueHomeWork {
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
  .issueHomeWork_one,
  .issueHomeWork_two,
  .issueHomeWork_three {
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
    .kemu,
    .banji {
      margin-top: 90rpx;
      p {
        font-size: 36rpx;
        color: $fontColor-b;
        margin-bottom: 20rpx;
      }
      .textarea {
        width: 100%;
        height: 500rpx;
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

      .class_container {
        display: flex;
        // flex-wrap: wrap;
        flex-direction: column;
        .class_container_item {
          display: flex;
          flex-wrap: wrap;
          // flex: 1;
          // display: flex;
          align-items: center;
          // flex-wrap: wrap;
          .class_container_item_add {
            display: flex;
            align-items: center;
            margin-left: 15rpx;
            margin-top: 20rpx;
            color: #3498ff;
          }
          .class_item {
            flex: 0 160rpx;
            padding: 10rpx;
            border-radius: 10rpx;
            margin: 0 20rpx;
            margin-top: 20rpx;
            background: #fff4aa;
            position: relative;
            // border: 1px solid red;
            .className {
              font-size: 32rpx;
            }

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
            // font-size: 24rpx;
            // padding: 10rpx;
            // text-align: center;
            // > img {
            // width: 88rpx;
            // height: 88rpx;
            // }
          }
        }
      }
    }
  }

  .button_group {
    margin: 20rpx 0 20rpx;
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

