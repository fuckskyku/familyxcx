<template>
  <div id="instiutionSelect" :style="{'height': height + 'rpx'}">
    <div class="instiution_container">
      <div class="instiution_item" v-for="item in schoolList" :key="item.id" @click="active(item)">
        <div>{{item.schoolName}} </div><img v-if="item.isActive" src="http://img.mseenet.com/iOS_CutDiagram/checked mark@2x.png" /> </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { switchSchool } from '@/api/api'
import utils from '@/utils/index'

export default {
  data() {
    return {
      height: ''
    }
  },
  computed: {
    ...mapState(['schoolList', 'judgeuserType', 'family'])
  },
  mounted() {
    //自适应高度
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
    ...mapActions(['setSchoolId', 'setToKen','setFamily']),
    active(obj) {
      this.setSchoolId(obj.id)
      obj.isActive = true
      switchSchool({
        schoolId: obj.id,
        userType: this.judgeuserType,
        parentId: this.family.parentId,
        studentId: this.family.studentId
      }).then(res => {
        this.setToKen(res.data.data.token)
          var objNew = [
                             
                {
                  key: 'schoolId',
                  value: obj.id,
                },
                {
                  key: 'schoolName',
                  value: obj.schoolName
                }
              ]
              this.setFamily(objNew)
        wx.reLaunch({ url: '../index/main' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#instiutionSelect {
  background: rgb(242, 244, 245);
  .instiution_container {
    padding-top: 20rpx;
    .instiution_item {
      box-sizing: border-box;
      display: flex;
      width: 100%;
      position: relative;
      background: white;
      font-size: 30rpx;
      padding: 20rpx 20rpx;
      align-items: center;
      justify-content: space-between;
      // border: 1px solid red;
      &::after {
        display: block;
        position: absolute;
        content: '';
        height: 1rpx;
        width: calc(100% - 20rpx);
        right: 0;
        bottom: 1rpx;
        background: #e6e6e6;
      }
      > img {
        width: 44rpx;
        height: 44rpx;
      }
    }
  }
}
</style>
