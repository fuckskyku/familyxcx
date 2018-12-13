<template>
  <div id="mySelect">
    <div v-for="item in studentsObj" :key="item.id" @click="selectStudent(item.studentId,item.parentId,item.studentName,item.schoolId,item.schoolName)">
      <!-- {{item.studentName}} -->
      <div class="photo"><img :src="item.studentImg" alt=""></div>
      <div class="name">{{item.studentName}}</div>
      <!-- <div class="type">{{item.schoolName}}</div> -->
      <div class="button" v-if="item.isFull==0"  @click.stop="perfectInfo(item)">
        <button>完善信息</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { studentsParent, schoolList, students } from "@/api/api";
import utils from "@/utils/index";

export default {
  data() {
    return {
      studentsObj: '',
      isFull: '',
      currStudentInfo: ''
    };
  },
  computed: {
    ...mapState(["family", "judgeuserType"])
  },
  mounted() {
    this.init();
    // console.log(utils.wxGetStorageSync('students'))
  },
  methods: {
    ...mapActions(["setFamily", "setToKen", "setSchoolList"]),
    init() {
      var that = this;
      // var students = utils.wxGetStorage('students')
      students().then(res => {
        res.data.data.forEach(item => {
          item.studentImg = utils.formatImgUrl(item.studentImg);
        });
        this.studentsObj = res.data.data;
        console.log("studentsObj:",this.studentsObj)
      });
      
     
      // students.forEach(item => {
      //   item.studentImg = utils.formatImgUrl(item.studentImg)
      // })
      // this.studentsObj = students
      // this.studentsObj = this.students
      // this.studentsObj.forEach(item => {
      //   item.studentImg = utils.formatImgUrl(item.studentImg)
      // })
      // console.log(this.students)
    },
    selectStudent(studentId, parentId, studentName,schoolId,schoolName) {
      
      studentsParent({ parentId: parentId, studentId: studentId }).then(res => {
        console.log(res);
        var obj = [
          { key: "studentId", value: studentId },
          { key: "parentId", value: parentId },
          { key: "studentName", value: studentName },
          {
            key: "schoolId",
            value: schoolId
          },
          {
            key: "schoolName",
            value: schoolName
          }
        ];
        utils.wxSetStorageSync("students", res.data.data.students);
        // utils.wxSetStorageSync('studentId', studentId)
        // utils.wxSetStorageSync('token', res.data.data.token)
        this.setToKen(res.data.data.token);
        this.setFamily(obj);
        schoolList({ userType: this.judgeuserType, studentId: studentId }).then(
          res => {
            if (res.data.code == "200") {
              res.data.data.forEach(item => {
                item["isActive"] = false;
              });
              this.setSchoolList(res.data.data);
              if (res.data.data.length > 1) {
                wx.navigateTo({ url: "../institutionSelect/main" });
              } else {
                wx.reLaunch({ url: "../index/main" });
              }
            }
          }
        );
        // // this.setStudents(res.data.data.students)
      });
    },
    perfectInfo(currStudentInfo) {
      if(currStudentInfo.isFull == 0){
        this.currStudentInfo = JSON.stringify(currStudentInfo);
      }
      console.log('currS',this.currStudentInfo)
      var url = "../myReviseInfo/main?currStudentInfo=" + this.currStudentInfo;
      wx.navigateTo({ url });
    }
  }
};
</script>

<style lang="scss" scoped>
#mySelect {
  > div {
    margin: 45rpx 0;
    &.active {
      .photo > img {
        box-shadow: 0 0 0 10rpx yellow;
      }
    }
    > div {
      margin-top: 25rpx;
      text-align: center;
    }
    .photo {
      > img {
        border-radius: 100rpx;
        width: 200rpx;
        height: 200rpx;
      }
    }
    .name {
      color: #333333;
      font-size: 36rpx;
    }
    .type {
      color: #808080;
      font-size: 28rpx;
    }
    .button {
      // height: 64rpx;
      margin: 0 auto;
      margin-top: 25rpx;
      width: 200rpx;
      color: #333333;
      > button {
        border-radius: 32px;
        background: #ffea55;
        font-size: 28rpx;
      }
    }
  }
}
</style>
