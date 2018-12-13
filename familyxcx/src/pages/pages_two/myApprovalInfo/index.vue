<template>
  <approvalInfo :approvalInfo="approvalInfo" :isMyApproval="isMyApproval" :flag="flag"></approvalInfo>
</template>

<script>
import approvalInfo from '@/components/approvalInfo'
import { mapState } from 'vuex'
import utils from '@/utils/index'
import { approvalPage, auditStatus } from '@/api/api'
export default {
  data() {
    return {
      id: 0,
      flag: '',
      approvalInfo: {},
      isMyApproval: false //是否轮到我审批
    }
  },
  components: {
    approvalInfo
  },

  computed: {
    ...mapState(['userId'])
  },
  mounted() {
    console.log(this.$mp.query)
    var that = this
    // console.log(that.id);
    that.id = this.$mp.query.id
    that.flag = this.$mp.query.flag
    that.initData()
    that.getApprovalPage(that.id)
  },
  methods: {
    getApprovalPage: function(id) {
      var _this = this
      approvalPage({
        id: id
      }).then(res => {
        if (res.data.code == 200) {
          this.approvalInfo = res.data.data
          //  console.log(this.approvalInfo);
          if (this.approvalInfo) {
            this.approvalInfo.createTime = utils.formatTimeMin(
              this.approvalInfo.createTime
            )

            this.approvalInfo.createTimeTwo = utils.parseDate(this.approvalInfo.createTime.split(' ')[0]).getTime();
              

            this.approvalInfo.createUserImg = utils.formatImgUrl(
              this.approvalInfo.createUserImg
            )
            this.approvalInfo.titleImgUrl = utils.formatImgUrl(
              this.approvalInfo.titleImgUrl
            )
            //审批人列表
            if (
              this.approvalInfo.approvalUsers &&
              this.approvalInfo.approvalUsers.length > 0
            ) {
              this.approvalInfo.approvalUsers.forEach(function(item) {
                item.avatarImg =
                  item.avatarImg && item.avatarImg.length > 0
                    ? utils.formatImgUrl(item.avatarImg)
                    : ''
                item.createTime = utils.formatTimeMin(item.createTime)
                item.approvalTime =
                  item.approvalTime && item.approvalTime != ''
                    ? utils.formatTimeMin(item.approvalTime)
                    : ''
                if (
                  item.approvalIndex == true &&
                  _this.isMyApproval == false &&
                  item.approvalUserId == _this.userId
                ) {
                  _this.isMyApproval = item.approvalIndex //判断是否是轮到我审批
                }
              })
            }
            //审批人列表 结束

            //抄送人列表
            if (
              this.approvalInfo.copyUsers &&
              this.approvalInfo.copyUsers.length > 0
            ) {
              this.approvalInfo.copyUsers.forEach(function(item) {
                item.avatarImg =
                  item.avatarImg && item.avatarImg.length > 0
                    ? utils.formatImgUrl(item.avatarImg)
                    : ''
                item.createTime = utils.formatTimeMin(item.createTime)
              })
            }
            //抄送人列表 结束
          }
        } else {
          console.log(res.data.message)
        }
      })
    },
    initData() {
      this.isMyApproval = false
      this.approvalInfo = {}
    }
  }
}
</script>

<style>
</style>
