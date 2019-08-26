<template>
  <info :detail="homeworkInfo" :comment="null" :userType="selectLoginType" :flagType="flag" :homeworkId="id"></info>
</template>

<script>
import info from '@/components/info'
import { getHomework } from '@/api/api'
import { mapState, mapActions } from 'vuex'
import utils from '@/utils/index'
export default {
  data() {
    return {
      homeworkInfo: {},
      id: 0,
      flag: '',
      classId: 0
    }
  },
  components: {
    info
  },
  computed: {
    ...mapState(['selectLoginType'])
  },
  mounted() {
    //  console.log(this);
    this.initData()
    this.flag = this.$mp.query.flag
    this.id = this.$mp.query.id
    this.classId = this.$mp.query.classId
    this.getHomeworkInfo(this.id, this.classId)
    console.log(this.$mp.query)
    
  },

  methods: {
    getHomeworkInfo: function(id, classId) {
      getHomework({
        id: id,
        classId: classId
      }).then(res => {
        // console.log(res);
        if (res.data.code == 200) {
          this.homeworkInfo = res.data.data
          if (this.homeworkInfo) {
            this.homeworkInfo.createTime = utils.formatTimeDiff(
              this.homeworkInfo.createTime
            )
            this.homeworkInfo.finishTime = utils.formatTimeDateDay(
              this.homeworkInfo.finishTime
            )
            this.homeworkInfo.titleImgUrl = utils.formatImgUrl(
              this.homeworkInfo.titleImgUrl
            )
            this.homeworkInfo.type = 2 //设置类型 作业
            // wx.setNavigationBarTitle({
            //   title: this.homeworkInfo.title //页面标题
            // });
          }
        } else {
          console.log(res.data.message)
        }
      })
    },
    //初始化数据
    initData: function() {
      this.homeworkInfo = {}
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: this.homeworkInfo.title + '_喵喵校园',
      path:
        'pages/pages_one/homeworkInfo/main?id=' +
        this.id +
        '&classId=' +
        this.classId
    }
  }
}
</script>

<style>
</style>
