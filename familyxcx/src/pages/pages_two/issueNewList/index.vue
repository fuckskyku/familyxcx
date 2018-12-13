<template>
  <div id="NewList" :style="{'height': height + 'rpx'}">

    <checkbox-group @change="Allcheckbox" class="checkbox_item" v-if="type=='true'">
      <!-- <label class="checkbox"> -->
      <label class="checkbox" style="display:flex;">
        <checkbox :value="true" :checked="Allbtn" />
        <span>全选</span>
      </label>
      <!-- </label> -->
    </checkbox-group>

    <div class="NewList_examine" v-if="type=='false'">
      <div class="examine_group" v-for="(item,index) in showObj" :key="index" @click="examineItem(item)">
        <div class="photo">
          <img :src="item.avatarImg" alt="" v-if="item.avatarImg!=''">
          <div class="name">{{item.userId==""?item.departmentName:item.teacherName}}</div>
        </div>
        <div class="icon"><img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt="" v-if="item.childTreeList.length!=0"></div>
      </div>
    </div>

    <div v-for="(item,index) in showObj" :key="index" class="checkboxGroup">
      <checkbox-group @change="checkboxItem(item)" class="checkbox_item" v-if="type=='true'">
        <checkbox :value="item.line" :checked="item.checked" :disabled="item.disabled" />
        <div class="checkbox" @click="examineItem(item)">
          <img :src="item.avatarImg" alt="" v-if="item.avatarImg!=''">
          <span>{{item.userId==""?item.departmentName:item.teacherName}}</span>
          <div class="icon" @click="examineItem(item)"><img src="http://img.mseenet.com/iOS_CutDiagram/next@3x.png" alt="" v-if="item.childTreeList.length!=0"></div>
        </div>
      </checkbox-group>
    </div>

    <div class="button_group">
      <button v-if="index>0" @click="back ">上一步</button>
      <button @click="submit ">确定</button>
    </div>

  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { departmentUsersTree } from '@/api/api'
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
    ...mapState(['issueNew'])
  },
  mounted() {
    this.type = this.$mp.query.type
    this.sign = this.$mp.query.sign
    if (this.sign == 1) {
      if (this.issueNew.ObjParentOne == '') {
        departmentUsersTree().then(res => {
          var _this = this
          if (res.data.code == '200') {
            console.log(res)
            function examineObjFor(data) {
              data.childTreeList.forEach((item, index) => {
                item.avatarImg = utils.formatImgUrl(item.avatarImg)
                item.checked = false
                item.disabled = false
                _this.issueNew.approvalUserId.forEach(itemOne => {
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
            this.Allbtn = this.showObj.every((item, index, array) => {
              return item.checked == true
            })
          }
        })
      } else {
        this.showObj = this.issueNew.ObjParentOne
        this.ObjParent = this.issueNew.ObjParentOne
        this.Allbtn = this.showObj.every((item, index, array) => {
          return item.checked == true
        })
      }
    } else {
      if (this.issueNew.ObjParent == '') {
        departmentUsersTree().then(res => {
          var _this = this
          if (res.data.code == '200') {
            console.log(res)
            function examineObjFor(data) {
              data.childTreeList.forEach((item, index) => {
                item.avatarImg = utils.formatImgUrl(item.avatarImg)
                item.checked = false
                item.disabled = false
                _this.issueNew.copyUserId.forEach(itemOne => {
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
            this.Allbtn = this.showObj.every((item, index, array) => {
              return item.checked == true
            })
          }
        })
      } else {
        this.showObj = this.issueNew.ObjParent
        this.ObjParent = this.issueNew.ObjParent

        this.Allbtn = this.showObj.every((item, index, array) => {
          return item.checked == true
        })
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
    ...mapActions(['setIssueNew']),
    examineItem(obj) {
      if (this.type == 'false') {
        if (obj.userId != '') {
          var List = this.issueNew.approvalUserId
          console.log(obj.userId)
          console.log(List)
          if (List) {
            var flag = List.some((item, index, array) => {
              return item.userId == obj.userId
            })
            if (flag) {
              utils.showDialog('已经添加过了')
              return
            } else {
              List.unshift(obj)
            }
          } else {
            var flag = List.some((item, index, array) => {
              return item.userId == obj.userId
            })
            if (flag) {
              utils.showDialog('已经添加过了')
              return
            } else {
              List = []
              List.unshift(obj)
            }
          }
          let objNew = [{ key: 'approvalUserId', value: List }]
          this.setIssueNew(objNew)
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
          if (!obj.disabled) {
            obj.checked = !obj.checked
          }
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
        { key: 'ObjParent', value: this.ObjParent }
      ]

      this.setIssueNew(objNew)
      wx.navigateBack(1)
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
  .button_group {
    margin: 0 auto;
    position: relative;
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

