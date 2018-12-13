<template>
  <div id="NewList" :style="{'height': height + 'rpx'}">

    <checkbox-group @change="Allcheckbox" class="checkbox_item" v-if="type=='1'||type=='3'">
      <!-- <label class="checkbox"> -->
      <label class="checkbox" style="display:flex;">
        <checkbox :value="true" :checked="Allbtn" />
        <span>全选</span>
      </label>
      <!-- </label> -->
    </checkbox-group>

    <div class="NewList_examine" v-if="type=='2'">
      <div class="examine_group" v-for="(item,index) in showObj" :key="index" @click="examineItem(item)">
        <div class="photo">
          <img :src="item.avatarImg" alt="" v-if="item.avatarImg!=''">
          <div class="name">{{item.userId==""?item.departmentName:item.teacherName}}</div>
        </div>
        <div class="icon"><img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt="" v-if="item.childTreeList.length!=0"></div>
      </div>
    </div>
    <div>
      <div v-for="(item,index) in showObj" :key="index" class="checkboxGroup" v-if="type=='3'||type == '1'">
        <checkbox-group @change="checkboxItem(item)" class="checkbox_item">
          <checkbox :value="item.line" :checked="item.checked" :disabled="item.disabled" />
          <div class="checkbox" @click="examineItem(item)">
            <img :src="item.avatarImg" alt="" v-if="item.avatarImg!=''">
            <span>{{item.userId!=""?item.teacherName||item.gradeName+item.className:item.departmentName}}</span>
            <div class="icon" @click="examineItem(item)"><img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt="" v-if="item.childTreeList.length!=0"></div>
          </div>
        </checkbox-group>
      </div>
    </div>
    <!-- <label class="checkbox" v-for="(item,index) in showObj" :key="index">
        <checkbox :value="item.userId" :checked="item.checked" />
        <img :src="item.avatarImg" alt="" v-if="item.avatarImg!=''">
        <span>{{item.userId==""?item.departmentName:item.teacherName}}</span>
      </label> -->

    <div class="button_group">
      <button v-if="index>0" @click="back">上一步</button>
      <button @click="submit">确定</button>
    </div>

  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { departmentUsersTree, classGradeTree } from '@/api/api'
import utils from '@/utils/index'
export default {
  data() {
    return {
      Allbtn: false,
      type: '',
      sign: '',
      height: '',
      index: 0,
      tier: 0,
      tierNameArr: [],
      itemName: '',
      showObj: '',
      ObjParent: ''
    }
  },

  computed: {
    ...mapState(['issueNotice'])
  },
  onLoad() {
    this.index = 0;
  },
  mounted() {
    this.type = this.$mp.query.type
    this.sign = this.$mp.query.sign
    if (this.type == '1') {
      if (this.issueNotice.ObjParent == '') {
        departmentUsersTree().then(res => {
          var _this = this
          if (res.data.code == '200') {
            classGradeTree().then(resOne => {
              var Obj = [
                {
                  departmentName: '老师',
                  checked: false,
                  userId: '',
                  tier: 1,
                  tierName: '1-'
                },
                {
                  departmentName: '班级',
                  checked: false,
                  userId: '',
                  tier: 1,
                  tierName: '1-'
                }
              ]
              Obj[0].childTreeList = res.data.data[0].childTreeList
              Obj[1].childTreeList = resOne.data.data
              function examineObjFor(data) {
                data.forEach((item, index) => {
                  item.avatarImg = utils.formatImgUrl(item.avatarImg)
                  item.checked = false

                  if (item.childTreeList != '') {
                    examineObjFor(item.childTreeList)
                  }
                })
              }
              examineObjFor(Obj)
              this.showObj = Obj
              this.ObjParent = Obj
            })
          }
        })
      } else {
        this.showObj = this.issueNotice.ObjParent
        this.ObjParent = this.issueNotice.ObjParent
        this.Allbtn = this.showObj.every((item, index, array) => {
          return item.checked == true
        })
      }
    } else {
      if (this.sign == 1) {
        if (this.issueNotice.ObjParentTwo == '') {
          departmentUsersTree().then(res => {
            var _this = this
            if (res.data.code == '200') {
              function examineObjFor(data) {
                data.childTreeList.forEach((item, index) => {
                  item.avatarImg = utils.formatImgUrl(item.avatarImg)
                  item.checked = false
                  item.disabled = false
                  _this.issueNotice.approvalUserId.forEach(itemOne => {
                    if (item.userId == itemOne) {
                      item.checked = true
                      item.disabled = true
                    }
                  })
                  if (item.childTreeList != '') {
                    examineObjFor(item)
                  }
                })
              }
              examineObjFor(res.data.data[0])
              res.data.data[0].childTreeList.forEach(item => {
                item.tier = 1
                item.tierName = '1-'
              })

              this.showObj = res.data.data[0].childTreeList
              this.ObjParent = res.data.data[0].childTreeList
            }
          })
        } else {
          this.showObj = this.issueNotice.ObjParentTwo
          this.ObjParent = this.issueNotice.ObjParentTwo
          this.Allbtn = this.showObj.every((item, index, array) => {
            return item.checked == true
          })
        }
      } else {
        if (this.issueNotice.ObjParentOne == '') {
          departmentUsersTree().then(res => {
            var _this = this
            if (res.data.code == '200') {
              function examineObjFor(data) {
                data.childTreeList.forEach((item, index) => {
                  item.avatarImg = utils.formatImgUrl(item.avatarImg)
                  item.checked = false
                  item.disabled = false
                  _this.issueNotice.copyUserId.forEach(itemOne => {
                    if (item.userId == itemOne) {
                      item.checked = true
                      item.disabled = true
                    }
                  })
                  if (item.childTreeList != '') {
                    examineObjFor(item)
                  }
                })
              }
              examineObjFor(res.data.data[0])
              res.data.data[0].childTreeList.forEach(item => {
                item.tier = 1
                item.tierName = '1-'
              })

              this.showObj = res.data.data[0].childTreeList
              this.ObjParent = res.data.data[0].childTreeList
            }
          })
        } else {
          this.showObj = this.issueNotice.ObjParentOne
          this.ObjParent = this.issueNotice.ObjParentOne
          this.Allbtn = this.showObj.every((item, index, array) => {
            return item.checked == true
          })
        }
      }
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
  },
  methods: {
    ...mapActions(['setIssueNotice']),
    examineItem(obj) {
      if (this.type == '2') {
        if (obj.userId != '') {
          var List = this.issueNotice.approvalUserId
          if (List) {
            List.unshift(obj)
          } else {
            List = []
            List.unshift(obj)
          }
          let objNew = [{ key: 'approvalUserId', value: List }]
          this.setIssueNotice(objNew)
          wx.navigateBack(1)
        }
        if (obj.childTreeList.length != 0) {
          this.showObj = obj.childTreeList
        }
      } else {
        if (obj.childTreeList.length != 0) {
          this.index++
          this.tier = obj.tier
          this.itemName = obj.gradeName || obj.departmentName
          this.tierNameArr.push(obj.tierName)
          obj.childTreeList.forEach(item => {
            item.tier = this.tier + 1
            item.tierName = item.tier + '-' + this.itemName
          })

          this.showObj = obj.childTreeList
          this.Allbtn = this.showObj.every((item, index, array) => {
            return item.checked == true
          })
        } else {
          obj.checked = !obj.checked
          this.Allbtn = this.showObj.every((item, index, array) => {
            return item.checked == true
          })
          if (this.Allbtn) {
            var _this = this
            function examineObjFor(data) {
              data.forEach((item, index) => {
                if (item.gradeName || item.departmentName == _this.itemName) {
                  item.checked = _this.Allbtn
                }
                if (item.childTreeList != '') {
                  examineObjFor(item.childTreeList)
                }
              })
            }
            examineObjFor(this.ObjParent)
          }
        }
      }
    },
    Allcheckbox(value) {
      var _this = this
      this.Allbtn = !this.Allbtn
      function examineObjFor(data) {
        data.forEach(item => {
          item.avatarImg = utils.formatImgUrl(item.avatarImg)
          item.checked = _this.Allbtn
          if (item.childTreeList != '') {
            examineObjFor(item.childTreeList)
          }
        })
      }
      examineObjFor(this.showObj)
    },

    checkboxItem(obj) {
      // console.log(obj)
      obj.checked = !obj.checked
      var _this = this
      function examineObjFor(data) {
        data.forEach((item, index) => {
          if (obj.childTreeList.length != 0) {
            item.checked = obj.checked
            if (obj.classId) {
              _this.showObj.forEach(itemOne => {
                if (item.classId != '' && item.classId == itemOne.classId) {
                  itemOne.checked = obj.checked
                }
              })
            }
            if (item.userId) {
              _this.showObj.forEach(itemOne => {
                if (item.userId != '' && item.userId == itemOne.userId) {
                  itemOne.checked = obj.checked
                }
              })
            }
          }
          examineObjFor(item.childTreeList)
        })
      }
      examineObjFor(obj.childTreeList)

      this.Allbtn = this.showObj.every((item, index, array) => {
        return item.checked == true
      })
    },
    back() {
      // console.log(this.tier)
      this.index--
      var _this = this
      var list = []
      //获取上一级名字表示
      console.log(_this.tierNameArr)
      function examineObjFor(data) {
        // console.log(_this.itemName)
        data.forEach((item, index) => {
          // console.log(item.gradeName, item.departmentName, _this.tierName)
          // console.log(item)
          if (
            item.tier == _this.tier &&
            (item.tier == 1 ||
              (_this.tierNameArr.length > 0
                ? item.tierName ==
                  _this.tierNameArr[_this.tierNameArr.length - 1]
                : false))
          ) {
            // console.log(item)
            list.push(item)
            _this.showObj = list
          }
          if (item.childTreeList != '') {
            examineObjFor(item.childTreeList)
          }
        })
      }

      this.tier = this.showObj[0].tier - 1
      examineObjFor(this.ObjParent)
      console.log(this.tier)

      let idList = []
      this.showObj.forEach(item => {
        idList.forEach(itemId => {
          if (item.userId == itemId) {
            item.checked = true
          }
        })

        if (item.childTreeList.length != 0) {
          item.checked = item.childTreeList.every((itemOne, index, array) => {
            if (itemOne.checked == true) {
              idList.push(itemOne.userId)
            }
            return itemOne.checked == true
          })
        }
      })

      this.Allbtn = this.showObj.every((item, index, array) => {
        return item.checked == true
      })

      if (this.tierNameArr.length > 1) {
        this.tierNameArr.splice(this.tierNameArr.length - 1, 1)
      }
      // console.log(this.showObj)
    },
    submit() {
      if (this.type == '1') {
        let userIdList = []
        let classIdList = []
        let classObjList = []
        let userObjList = []
        function examineObjFor(data) {
          data.forEach((item, index) => {
            if (item.checked == true) {
              if (item.userId) {
                userObjList.push(item)
                userIdList.push(item.userId)
              }

              if (item.classId) {
                classObjList.push(item)
                classIdList.push(item.classId)
              }
            }
            examineObjFor(item.childTreeList)
          })
        }
        examineObjFor(this.ObjParent)

        var classList = []
        var objClist = {}
        classObjList.forEach((item, index) => {
          if (!objClist[item.classId]) {
            classList.push(item)
            objClist[item.classId] = true
          }
        })
        var userList = []
        var objUser = {}
        userObjList.forEach((item, index) => {
          if (!objUser[item.userId]) {
            userList.push(item)
            objUser[item.userId] = true
          }
        })

        let objNew = [
          { key: 'classIds', value: Array.from(new Set(classIdList)) },
          { key: 'userIds', value: Array.from(new Set(userIdList)) },
          { key: 'classList', value: classList },
          { key: 'userList', value: userList },
          { key: 'ObjParent', value: this.ObjParent }
        ]
        console.log(
          Array.from(new Set(classIdList)),
          Array.from(new Set(userIdList))
        )
        console.log(classList, userList)

        this.setIssueNotice(objNew)
        wx.navigateBack(1)
      } else {
        let userIdList = []
        let userIdObjList = []
        // console.log(this.showObj)
        function examineObjFor(data) {
          data.forEach((item, index) => {
            if (item.checked == true) {
              if (item.userId) {
                userIdList.push(item.userId)
                userIdObjList.push(item)
              }
            }
            examineObjFor(item.childTreeList)
          })
        }
        examineObjFor(this.ObjParent)
        var result = []
        var obj = {}
        userIdObjList.forEach((item, index) => {
          if (!obj[item.userId]) {
            result.push(item)
            obj[item.userId] = true
          }
        })

        let objNew = [
          { key: 'copyUserId', value: Array.from(new Set(userIdList)) },
          { key: 'copyUserObj', value: result },
          { key: 'ObjParentOne', value: this.ObjParent }
        ]
        console.log('copyUserId', Array.from(new Set(userIdList)),"copyUserObj:",result,'ObjParentOne', this.ObjParent)
        this.setIssueNotice(objNew)
        wx.navigateBack(1)
      }
    }



  }
}
</script>

<style lang="scss" scoped>
#NewList {
  .checkbox_item {
    border-bottom: 1px solid #e5e5e5;
    checkbox {
      margin-left: 10rpx;
    }
    padding: 20rpx 25rpx;
  }
  .checkboxGroup {
    // border: 1px solid red;
    border-bottom: 1px solid #e5e5e5;
    .checkbox_item {
      border: none;
      display: flex;
      // border: 1px solid red;
      padding: 20rpx 25rpx;

      .checkbox {
        margin-left: 10rpx;
        // border: 1px solid red;
        display: flex;
        align-items: center;
        flex: 1;
        position: relative;
        img {
          border-radius: 30rpx;
          display: block;
          width: 60rpx;
          height: 60rpx;
          margin-right: 20rpx;
        }
        .icon {
          position: absolute;
          right: 20rpx;
          img {
            width: 15rpx;
            height: 26rpx;
          }
        }
      }
    }
  }

  .NewList_examine {
    border-top: 1px solid #e5e5e5;
    // border: 1px solid red;
    .examine_group {
      padding: 20rpx 25rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e5e5e5;
      img {
        display: block;
      }
      // border: 1px solid red;
      .photo {
        display: flex;
        align-items: center;
        img {
          border-radius: 30rpx;
          display: block;
          width: 60rpx;
          height: 60rpx;
        }
      }
      .name {
        margin-left: 30rpx;
      }
      .icon {
        float: right;
        img {
          width: 15rpx;
          height: 26rpx;
        }
      }
    }
  }
  .checkboxGroup:last-child{
    margin-bottom: 400rpx;
  }
  .button_group {
    width: 690rpx;
    position: fixed;
    left: 50%;
    margin-left: -345rpx;
    bottom: 8%;
    > button {
      margin-top: 10rpx;
      margin-bottom: 10rpx;
      background: #ffe155;
      width: 690rpx;
      border-radius: 10px;
    }
  }
}
</style>

