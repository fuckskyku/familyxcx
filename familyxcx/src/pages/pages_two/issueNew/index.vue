<template>
  <div id="issueNew" :class="[step==2?'two':'',step==3?'three':'',step==4?'four':'']">
    <section class="issueNew_two" v-show="step==1">
      <h3 class="title">第一步</h3>
      <!--科目-->
      <div class="kemu">
        <p>类型</p>
        <picker :value="index" :range="array" range-key="dictName" @change="bindPickerChange">
          <div class="kemu-con">
            <!-- <input :value="data" @click="blur($even)" /> -->
            <div>{{array[index].dictName}}</div>
            <img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png">
          </div>
        </picker>
      </div>
      <div class="kemu">
        <p>标题</p>
        <div class="kemu-con">
          <input placeholder="输入标题" v-model="title" />
        </div>
      </div>
    </section>

    <section class="issueNew_two" v-show="step==2">
      <h3 class="title">第二步</h3>
      <!--科目-->
      <div class="kemu">
        <p>审批人：</p>
        <radio-group class="radio-group" @change="examineradioChange" v-if="issueNew.approvalUserId.length==0">
          <label class="radio">
            <radio value='true' :checked="true" />是
          </label>
          <label class="radio">
            <radio value='false' :checked="false" />否
          </label>
        </radio-group>
        <div class="addExamineContainer" v-if="examine== 'true'">
          <div class="addMake" v-if="issueNew.approvalUserId.length<4" @click="addExamine">
            <img src="http://img.mseenet.com/iOS_CutDiagram/information/chat_more@2x.png" alt="">
            <div>添加</div>
          </div>
          <div class="addExamine_item" v-for="(item,index) in issueNew.approvalUserId" :key="index" :data-flag='item.flag||false' @click.stop="del('examine',item)">
            <div class="addExamine_item_img">
              <img :src="item.avatarImg" alt="">
            </div>
            <div class="addExamine_item_text">{{item.teacherName}}</div>
          </div>

        </div>
      </div>
      <div class="kemu">
        <p>抄送人：</p>

        <radio-group class="radio-group" @change="makeradioChange" v-if="issueNew.copyUserId.length==0">
          <label class=" radio ">
            <radio value='ture' :checked="true " />是
          </label>
          <label class="radio ">
            <radio value='false' :checked="false " />否
          </label>
        </radio-group>

        <div class="makeContainer" v-if="make=='true'">
          <div class="addMake " @click="addMake">
            <img src="http://img.mseenet.com/iOS_CutDiagram/information/chat_more@2x.png " alt="">
            <div>添加</div>
          </div>

          <div class="make_item " v-for="(item,index) in issueNew.copyUserObj " :key="index " :data-flag='item.flag||item.disabled||false' @click.stop="del('copy',item)">
            <div class="addExamine_item_img ">
              <img :src="item.avatarImg " alt="">
            </div>
            <div class="addExamine_item_text ">{{item.teacherName}}</div>
          </div>

        </div>

      </div>
    </section>

    <section class="issueNew_two " v-show="step==3 ">
      <h3 class="title ">第三步</h3>
      <div class="kemu ">
        <p>选择内容方式：</p>
        <radio-group class="radio-group " @change="contentTypeChange ">
          <label class="radio ">
            <radio value='1' :checked="true " />图文内容
          </label>
          <label class="radio ">
            <radio value='2' :checked="false " />文章链接
          </label>
        </radio-group>
      </div>
      <div class="kemu " v-if="contentType==2 ">
        <p>网址链接：</p>
        <div class="kemu-con ">
          <input placeholder="请输入网址 " v-model="urlAddress" />
        </div>
      </div>
      <div class="kemu " v-if="contentType==1 ">
        <p>内容：</p>
        <textarea :maxlength=-1 class="textarea " placeholder="输入内容" v-model="content" />
      </div>
    </section>

    <section class="issueNew_two " v-show="step==4 ">
      <h3 class="title ">第四步</h3>
      <div class="kemu ">
        <p>头图：</p>
      </div>

      <div class="kemu ">
        <div class="pickImg " @click="uploadImg(null) ">
          <span v-if="uploadImgSrcShow=='' ">点击选择图片</span>
          <img :src="uploadImgSrcShow" alt="">
        </div>
        <div class="pickImg_replace" @click="uploadImg('replace')">更换头图</div>
      </div>

    </section>

    <div class="button_group ">
      <button @click="rough " v-if="step==4 " class="rough ">存草稿</button>
      <!-- <button @click="preview " v-if="step==4 " class="rough ">预览</button> -->
      <button v-if="step!=1" class="rough" @click="black">上一步</button>
      <button @click="next" style="margin-bottom:  20px;">{{step==4?'确认发布':'下一步'}}</button>
    </div>

  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import utils from '@/utils/index'
import { newSave, commonDictList, getApprovalCopy } from '@/api/api'
export default {
  data() {
    return {
      step: 1,
      isValid: '',
      array: [{}],
      index: 0,
      title: '',
      content: '',
      contentType: '1',
      uploadImgSrcShow: '',
      uploadImgSrc: '',
      urlAddress: '',
      examine: 'true',
      make: 'true'
    }
  },

  computed: {
    ...mapState(['token', 'issueNew'])
  },

  mounted() {
    this.step = 1
    this.init()
    commonDictList({ dataTypeCode: 'news_type' }).then(res => {
      if (res.data.code == '200') {
        this.array = res.data.data
        var Obj = {
          id: 0,
          dictCode: '1',
          dictName: '请选择'
        }
        this.array.unshift(Obj)
        // console.log(res.data.data)
      } else {
        console.log(res.data.message)
      }
    })
    //打印详情
    console.log("this.issueNew",this.issueNew)
  },
  methods: {
    ...mapActions(['setIssueNew', 'setClearNew']),

    next() {
      if (this.step == 1) {
        if (this.array[this.index].id < 1) {
          utils.showDialog('请选择类型')
          return
        }
        if (!utils.required(this.title)) {
          utils.showDialog('请输入标题')
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
          this.setIssueNew(objNew)
        })
      } else if (this.step == 2) {
        // console.log("examine", this.examine);
        // console.log("examine", this.issueNew.approvalUserId);
        if (
          this.examine == 'true' &&
          this.issueNew.approvalUserId.length == 0
        ) {
          utils.showDialog('请选择审批人')
          return
        }
        // console.log("make", this.make);
        // console.log("make", this.issueNew.copyUserObj);
        if (this.make == 'true' && this.issueNew.copyUserObj.length == 0) {
          utils.showDialog('请选择抄送人')
          return
        }
        // return;
        this.step = 3
      } else if (this.step == 3) {
        if (this.contentType == 2 && !utils.required(this.urlAddress)) {
          utils.showDialog('请输入网址')
          return
        }
        if (this.contentType == 1 && !utils.required(this.content)) {
          utils.showDialog('请输入内容')
          return
        }
        this.step = 4
      } else {
        if (!utils.required(this.uploadImgSrcShow)) {
          utils.showDialog('请上传图片')
          return
        }

        this.issueNewSave(2)
      }
    },
    //切换类型
    bindPickerChange(value) {
      this.index = value.mp.detail.value
      // console.log(value)
    },

    //抄送人
    makeradioChange(value) {
      this.make = value.mp.detail.value
    },

    //审批人
    examineradioChange(value) {
      this.examine = value.mp.detail.value
      console.log(this.examine)
    },

    //添加审批
    addExamine() {
      let url = '../issueNewList/main?type=false&sign=1'
      wx.navigateTo({ url })
    },

    //添加抄送
    addMake() {
      let url = '../issueNewList/main?type=true&sign=2'
      wx.navigateTo({ url })
    },

    contentTypeChange(value) {
      this.contentType = value.mp.detail.value
    },
    uploadImg(type) {
      var _this = this
      if (!type) {
        if (this.uploadImgSrcShow == '') {
          wx.chooseImage({
            count: 1,
            success: function(res) {
              var tempFilePaths = res.tempFilePaths
              wx.uploadFile({
                url:
                  'https://admin.school.mseenet.com/api/storage/uploadSingleFile',
                filePath: tempFilePaths[0],
                name: 'file',
                header: {
                  Authorization: 'Bearer  ' + _this.token
                },
                formData: {},
                success: function(res) {
                  var data = JSON.parse(res.data)
                  _this.uploadImgSrc = data.data.url
                  _this.uploadImgSrcShow = utils.formatImgUrl(data.data.url)
                }
              })
            }
          })
        } else {
          var listImg = []
          listImg.push(this.uploadImgSrcShow)
          wx.previewImage({
            urls: listImg,
            success: function(res) {
              console.log(res)
            }
          })
        }
      } else {
        wx.chooseImage({
          count: 1,
          success: function(res) {
            var tempFilePaths = res.tempFilePaths
            wx.uploadFile({
              url:
                'https://admin.school.mseenet.com/api/storage/uploadSingleFile',
              filePath: tempFilePaths[0],
              name: 'file',
              header: {
                Authorization: 'Bearer  ' + _this.token
              },
              formData: {},
              success: function(res) {
                var data = JSON.parse(res.data)
                _this.uploadImgSrc = data.data.url
                _this.uploadImgSrcShow = utils.formatImgUrl(data.data.url)
              }
            })
          }
        })
      }
    },
    //草稿箱
    rough() {
      if (!utils.required(this.uploadImgSrcShow)) {
        utils.showDialog('请上传图片')
        return
      }

      var _this = this
      wx.showModal({
        title: '',
        content: '是否放入草稿箱？',
        success: function(sm) {
          if (sm.confirm) {
            _this.issueNewSave(1)
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

    issueNewSave(type) {
      newSave({
        title: this.title,
        content: '<section><p>' + this.content + '</p></section>',
        newsStyleType: this.array[this.index].dictCode,
        titleImgUrl: this.uploadImgSrc,
        attachUrl: this.urlAddress,
        approvalUserId: this.issueNew.approvalUserId
          .map((item, index, array) => {
            return item.userId
          })
          .toString(),
        copyUserId: this.issueNew.copyUserId.toString(),
        editStatus: type
      }).then(res => {
        console.log(res)
        if (res.data.code == 200) {
          this.setClearNew()
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
    },
    del(type, item) {
      if (type == 'examine') {
        if (!item.flag) {
          if (!item.disabled) {
            // var list = this.issueNew.approvalUserId
            this.issueNew.approvalUserId.forEach((itemOne, index) => {
              if (itemOne.userId == item.userId) {
                this.issueNew.approvalUserId.splice(index, 1)
              }
            })

            // console.log(list)
            // console.log(this.issueNew.approvalUserId)
            // let objNew = [
            //   { key: 'approvalUserId', value: list },
            // ]
            // this.setIssueNew(objNew)

            // setIssueNew
          }
        }
      } else if (type == 'copy') {
        if (!item.flag) {
          if (!item.disabled) {
            this.issueNew.copyUserId.forEach((itemOne, index) => {
              if (itemOne == item.userId) {
                this.issueNew.copyUserId.splice(index, 1)
              }
            })
            this.issueNew.copyUserObj.forEach((itemOne, index) => {
              if (itemOne.userId == item.userId) {
                this.issueNew.copyUserObj.splice(index, 1)
              }
            })

            function examineObjFor(data) {
              data.forEach((itemOne, index) => {
                if (itemOne.userId) {
                  if (itemOne.userId == item.userId) {
                    itemOne.checked = false
                  }
                }

                if (itemOne.childTreeList.length != 0) {
                  itemOne.checked = itemOne.childTreeList.every(
                    (itemTwo, index, array) => {
                      return itemTwo.checked == true
                    }
                  )
                }

                examineObjFor(itemOne.childTreeList)
              })
            }

            examineObjFor(this.issueNew.ObjParent)
          }
          // console.log(type, item, 2)
        }
      }
    },
    init() {
      this.step = 1
      this.isValid = ''
      this.array = [{}]
      this.index = 0
      this.title = ''
      this.content = ''
      this.contentType = '1'
      this.uploadImgSrcShow = ''
      this.uploadImgSrc = ''
      this.urlAddress = ''
      this.examine = 'true'
      this.make = 'true'
    }
  },
  watch: {
    step(value) {
      console.log(value)
    }
  },
  destroyed() {
    alert('Del')
  },
  //监听返回
  onUnload() {
    this.setClearNew()
  }
}
</script>
<style lang="scss">
$fontColor-a: #000000;
$fontColor-b: #808080;
#issueNew {
  &::before {
    content: '';
    height: 1rpx;
    background: #ffea55;
    width: 25%;
    position: fixed;
    top: 0;
    left: 0;
  }
  &.two {
    &::before {
      width: 50%;
    }
  }
  &.three {
    &::before {
      width: 75%;
    }
  }
  &.four {
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
          // max-width: 100%;
          width: 100%;
          height: 100%;
        }
      }
      .pickImg_replace {
        font-size: 30rpx;
        margin-top: 20rpx;
        text-align: right;
        color: #2093fe;
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
        height: 500rpx;
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
        align-items: center;
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
          // border: 1px solid red;
          position: relative;
          flex: 0 170rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
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
              width: 100rpx;
              height: 100rpx;
            }
          }
          .addExamine_item_text {
            margin-top: 7rpx;
            text-align: center;
            font-size: 32rpx;
          }
        }
        .addExamine,
        .addMake {
          > img {
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
      .addExamineContainer{
        .addMake {
           width: 170rpx;
           height: 142rpx;
           text-align: center;
           div{
             width: 100%;
           }
        }
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

