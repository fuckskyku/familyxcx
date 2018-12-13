<template>
  <div id="HomeWorkList" :style="{'height': height + 'rpx'}">
    <div>
      <checkbox-group @change="Allcheckbox" class="checkbox_item">
        <!-- <label class="checkbox"> -->
        <label class="checkbox">
          <checkbox :value="true" :checked="Allbtn" />
          <span>全选</span>
        </label>
        <!-- </label> -->
      </checkbox-group>
      <checkbox-group @change="checkboxItem" class="checkbox_item">
        <label class="checkbox" v-for="(item,index) in classList" :key="index">
          <checkbox :value="item.classId" :checked="item.checked" />
          <span>{{item.gradeName+item.className}}</span>
        </label>
      </checkbox-group>
    </div>
    <div class="group_button">
      <button @click="submit">确定</button>
    </div>
  </div>
</template>


<script>
import { mapState, mapActions } from 'vuex'
import { classTeacher } from '@/api/api'
import utils from '@/utils/index'
export default {
  data() {
    return {
      height: '',
      Allbtn: false,
      classList: '',
      checkedList: ''
    }
  },
  computed: {
    ...mapState(['issueHomeWork'])
  },
  mounted() {
    if (this.issueHomeWork.Allbtn) {
      this.Allbtn = this.issueHomeWork.Allbtn
      console.log(this.Allbtn)
    } else if (this.issueHomeWork.Allbtn == '') {
      this.Allbtn = false
    } else {
      this.Allbtn = false
    }

    //高度计算
    var _this = this
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth
        _this.height = clientHeight * rpxR
      }
    })
    classTeacher().then(res => {
      if (res.data.code == '200') {
        this.classList = res.data.data
        if (this.Allbtn) {
          this.classList.forEach(item => {
            item.checked = true
          })
        } else {
          this.classList.forEach(item => {
            item.checked = false
          })

          if (this.issueHomeWork.classIds != '') {
            this.classList.forEach(item => {
              this.issueHomeWork.classIds.forEach(itemOne => {
                if (itemOne.classId == item.classId) {
                  item.checked = true
                }
              })
            })
          }
        }
        if (this.classList && this.classList.length > 0) {
          this.classList = this.classList.sort(utils.arrCompare('gradeId'))
          console.log(this.classList)
        }
        // console.log(this.classList)
      }
    })
  },
  methods: {
    ...mapActions(['setIssueHomeWork']),
    //全选
    Allcheckbox(value) {
      // console.log(this.AllBtn)
      // if (!this.issueHomeWork.Allbtn) {
      this.Allbtn = !this.Allbtn
      // }

      console.log(this.Allbtn)
      this.classList.forEach(item => {
        item.checked = this.Allbtn
      })
    },
    //选择事件
    checkboxItem(value) {
      // console.log(value)
      // let valueObj = []
      // valueObj = value.mp.detail.value
      //console.log(value.mp.detail.value)
      this.checkedList = value.mp.detail.value
      if (this.checkedList.length == this.classList.length) {
        this.Allbtn = true
        this.classList.forEach(item => {
          item.checked = this.Allbtn
        })
      } else {
        this.Allbtn = false
        this.classList.forEach(item => {
          var flag = this.checkedList.indexOf(item.classId + '') > -1
          item.checked = flag
        })
      }
    },
    submit() {
      // console.log(this.checkedList)
      var _this = this
      if (this.Allbtn) {
        // var classIds = []
        // this.classList.forEach(item => {
        //   classIds.push(item.classId)
        // })
        // console.log(this.classList)
        var objNew = [
          { key: 'classIds', value: this.classList },
          { key: 'Allbtn', value: this.Allbtn }
        ]
        this.setIssueHomeWork(objNew)
      } else {
        // console.log(this.checkedList);
        var checkBox =
          this.issueHomeWork.classIds == '' ? [] : this.issueHomeWork.classIds
        if (_this.classList.length > 0) {
          _this.classList.forEach((item, index) => {
            if (_this.checkedList.length > 0) {
              _this.checkedList.forEach((itemone, indexone) => {
                if (itemone == item.classId) {
                  checkBox.push(_this.classList[index])
                }
              })
            }
          })
        }
        
        if (checkBox.length < 1 && this.issueHomeWork.classIds != '') {
          utils.showDialog('请选择班级')
          return
        }

        var objNew = [
          { key: 'classIds', value: checkBox },
          { key: 'Allbtn', value: this.Allbtn }
        ]
        this.setIssueHomeWork(objNew)
        // console.log(objNew);
      }

      wx.navigateBack({ url: '../issueHomeWork/main' })
    }
  }
}
</script>

<style lang="scss" scoped>
#HomeWorkList {
  .group_button {
    margin-top: 50rpx;
    > button {
      margin: 0 auto;
      width: 690rpx;
      border-radius: 10rpx;
      background: #ffea55;
    }
  }
  > div {
    padding-top: 20rpx;
  }
  // height: 100%;
  background: rgb(242, 244, 244);
  // border: 1px solid red;
  .checkbox_item {
    background: white;
    &:first-child {
      // border: 1px solid red;
      // margin-top: 20rpx;
      border-bottom: 1px solid #e5e5e5;
    }
    .checkbox {
      padding: 15rpx 30rpx;
      display: flex;
      width: 100%;
      align-items: center;
      & + .checkbox {
        border-top: 1px solid #e5e5e5;
      }
      > span {
        margin-left: 20rpx;
      }
    }
  }
}
</style>

