<template>
  <div id="myReviseInfo" :style="{'height':height + 'rpx'}">
    <div
      class="tip"
    >为方便核实您孩子的信息，请上传孩子身份证信息和头像，将用于考勤时人脸识别等情况（请务必上传孩子正式头像照片，否则人脸识别无法正常进行，将会统计成缺勤。）我司承诺不会以任何形式泄露您孩子的信息。</div>
    <div class="myReviseInfo_container">
      <div class="myReviseInfo_container_item" @click="uploadFile">
        <div class="title">学生正脸照</div>
        <div class="photo">
          <img :src="userStudentInfo.studentImg" alt="">
          <div>
            <img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt>
          </div>
        </div>
      </div>
      <div class="myReviseInfo_container_item info">
        <div class="title_one">学生姓名</div>
        <div class="name">
          <input placeholder="请输入姓名" v-model="userStudentInfo.studentName" disabled="true">
        </div>
      </div>
      <!-- <div class="myReviseInfo_container_item info">
        <div class="title_one">学生班级</div>
        <div class="name"><input placeholder="请输入班级" v-model="userStudentInfo.communityName" disabled='true' /></div>
      </div>-->
      <div class="myReviseInfo_container_item info">
        <div class="title_one">学生身份证号码</div>
        <div class="name">
          <input
            @blur="changeId(userStudentInfo.idCard)"
            placeholder="请输入身份证号码"
            v-model="userStudentInfo.idCard"
          >
        </div>
      </div>
    </div>

    <!-- <div class="buttonGroup">
      <button @click="submit"> 保存 </button>
    </div>
    -->
  </div>
</template>

<script>
import { userCenter, updateStudent } from "@/api/api";
import utils from "@/utils/index";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      height: "",
      userStudentInfo: { studentName: "", studentImg: "", idCard: "" },
      currStudentInfo: "",
      sign: "",
      studentList: "",
    };
  },
  computed: {
    ...mapState(["family", "token"])
  },
  onLoad() {
    var pages = getCurrentPages(); //获取加载的页面
    var currentPage = pages[pages.length - 1]; //获取当前页面的对象
    // console.log(currentPage)
    var url = currentPage.route; //当前页面url
    var options = currentPage.options; //如果要获取url中所带的参数可以查看options
    var currList = "";
    for (var key in options) {
      var value = options[key];
      currList += value;
    }
    this.currStudentInfo = JSON.parse(currList);
  },
  onUnload() {
    this.userStudentInfo = "";
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
    this.studentList = utils.wxGetStorage("students");
    if (this.studentList.length > 0) {
      console.log("studentList", this.studentList);
      this.studentList.forEach(item => {
        if (
          item.studentId == _this.family.studentId &&
          item.isFull == 1 &&
          _this.currStudentInfo == 1
        ) {
          item.studentImg = utils.formatImgUrl(item.studentImg);
          _this.userStudentInfo = item;
          // console.log("进入个人信息")
          console.log("个人信息_this.userStudentInfo", _this.userStudentInfo);
        }
        if (item.isFull == 0 && item.studentId == _this.family.studentId) {
          item.studentImg = utils.formatImgUrl(item.studentImg);
          _this.userStudentInfo = item;
          // console.log("进入完善信息")
          console.log("完善信息_this.userStudentInfo", _this.userStudentInfo);
        }
      });
    }
  },

  methods: {
    ...mapActions(["setStudents"]), // 映射 this.setStudents() 到 this.$store.dispatch('setStudents')

    //图片上传、个人信息修改
    uploadFile() {
      if (!utils.required(this.userStudentInfo.idCard)) {
        utils.showDialog("请输入身份证号码");
        return;
      }
      var _this = this;
      wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片，只有一张图片获取下标为0
          const tempFilePaths = res.tempFilePaths;
          console.log("tempFilePaths", tempFilePaths);
          _this.tempFilePath = res.tempFilePaths;
          // _this.userStudentInfo.studentImg = res.tempFilePaths
          //将本地资源上传到开发者服务器，客户端发起一个 HTTPS POST 请求
          wx.uploadFile({
            url:"https://admin.school.mseenet.com/api/storage/uploadSingleFile",
            filePath: tempFilePaths[0],
            name: "file",
            header: {
              Authorization: "Bearer  " + _this.token,
              "Content-Type": "multipart/form-data"
            },
            formData: {
              token: encodeURI(_this.token),
            },
            success (res) {
              var data = JSON.parse(res.data);
              //do something
              console.log("res.data.data", data.data);
              console.log("url", data.data.url);
              updateStudent({
                id: _this.family.studentId,
                studentImg:"https://admin.school.mseenet.com" + data.data.url,
                idCard: _this.userStudentInfo.idCard
              }).then(res => {
                console.log("res.data", res.data.data);
                utils.showDialog(res.data.message);
                var StorageStudents = utils.wxGetStorage("students");
                StorageStudents.forEach((item,index) => {
                  if (item.studentId == _this.family.studentId) { 
                    StorageStudents.splice(index, 1, res.data.data)
                  }
                });
                console.log("StorageStudents", StorageStudents);
                utils.wxSetStorage("students", StorageStudents, function() {
                  _this.userStudentInfo = res.data.data;
                  for (const key in res.data.data) {
                    if (res.data.data.hasOwnProperty(key)) {
                      if (key == "studentImg") {
                        res.data.data[key] = utils.formatImgUrl(
                          res.data.data[key]
                        );
                      }
                    }
                  }
                });
                console.log("StorageStudents", StorageStudents);
                // setTimeout(() => {
                //   wx.navigateBack()
                // }, 2000)
              });
            }
          });
        }
      });
    },
    changeId(id) {
      utils.wxSetStorageSync("students", this.studentList);
      updateStudent({
        id: this.family.studentId,
        studentImg: this.userStudentInfo.studentImg,
        idCard: this.userStudentInfo.idCard
      }).then(res => {
        // console.log("res",res.data)
      });
    }
    // submit() {
    //   updateStudent({ id: utils.wxGetStorage('studentId') }).then(res => {
    //     console.log(res)
    //   })
    // }
  }
};
</script>

<style lang="scss" scoped>
#myReviseInfo {
  background: rgb(242, 244, 245);
  .tip {
    padding: 40rpx 30rpx;
    color: #333333;
    font-size: 26rpx;
  }
  .myReviseInfo_container {
    background: white;

    .myReviseInfo_container_item {
      padding: 25rpx 30rpx;

      &::after {
        display: block;
        content: "";
        clear: both;
      }
      .title {
        font-size: 34rpx;
        color: #808080;
        line-height: 100rpx;
        float: left;
      }
      .photo {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;

        > img {
          width: 100rpx;
          height: 100rpx;
          border-radius: 50rpx;
          overflow: hidden;
        }
        > div {
          margin-left: 20rpx;
          > img {
            width: 15rpx;
            height: 26rpx;
          }
        }
        float: right;
      }
      &.info {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
      }
      .title_one {
        margin-right: 20rpx;
        width: 300rpx;
        display: inline-block;
        font-size: 34rpx;
        color: #808080;
      }
      .name {
        > input {
          font-size: 34rpx;
          color: #333;
          display: inline-block;
        }
      }
    }
  }
  .buttonGroup {
    margin-top: 100rpx;
    text-align: center;
    > button {
      width: 690rpx;
    }
  }
}
</style>
