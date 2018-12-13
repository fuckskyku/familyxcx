<template>
  <issueList :type="type" :issueList="issueList" :draftList="draftList"></issueList>
</template>

<script>
import issueList from '@/components/issueList'

// import moment from "moment"
import { mapState, mapActions } from 'vuex'
import {
  publishList,
  draftSchoolNewsList,
  draftHomeworkList,
  draftSchoolNoticeList
} from '@/api/api'
import utils from '@/utils/index'

export default {
  data() {
    return {
      type: 1,
      issueList: [],
      draftList: []
    }
  },
  components: {
    issueList
  },
  mounted() {
    this.loadData()
  },
  // 下拉刷新方法，与methods方法同级
  async onPullDownRefresh() {
    this.loadData()
    // 停止下拉刷新
    wx.stopPullDownRefresh()
  },

  // 上拉加载，拉到底部触发
  onReachBottom() {
    // 到这底部在这里需要做什么事情
    console.log(1)
  },
  methods: {
    loadData() {
      var that = this
      // console.log(that.type);
      that.type = this.$mp.query.type
      var typeName = ''
      switch (that.type) {
        case '1':
          typeName = '校园风采'
          that.getdraftSchoolNewsList(that.type)
          break
        case '2':
          typeName = '新闻'
          that.getdraftSchoolNewsList(that.type)
          break
        case '3':
          typeName = '通知'
          that.getdraftSchoolNoticeList(that.type)
          break
        case '4':
          typeName = '作业管理'
          that.getdraftHomeworkList(that.type)
          break
      }

      that.getIssueList(that.type)
      wx.setNavigationBarTitle({
        title: typeName //页面标题
      })
    },
    getIssueList: function(type) {
      this.initData()
      publishList({
        publishType: type,
        pageNo: 1,
        pageSize: 10
      }).then(res => {
        if (res.data.code == 200) {
          var _issueList = res.data.data.data
          if (_issueList.length > 0) {
            _issueList.forEach(function(item) {
              item.titleImgUrl =
                item.titleImgUrl && item.titleImgUrl.length > 0
                  ? utils.formatImgUrl(item.titleImgUrl)
                  : ''
              item.createTime = utils.formatTimeDiff(item.createTime)
              item.finishTime = item.finishTime
                ? utils.formatTimeDateDay(item.finishTime)
                : null
            })
          }
          this.issueList = _issueList
        } else {
          console.log(res.data.message)
        }
      })
    },

    /*通知草稿列表*/
    getdraftSchoolNoticeList: function(type) {
      draftSchoolNoticeList({ pageNo: 1, pageSize: 10 }).then(res => {
        if (res.data.code == 200) {
          var _List = res.data.data.data
          if (_List.length > 0) {
            _List.forEach(function(item) {
              item.titleImgUrl =
                item.titleImgUrl && item.titleImgUrl.length > 0
                  ? utils.formatImgUrl(item.titleImgUrl)
                  : ''
              item.createTime = utils.formatTimeDiff(item.createTime)
              item.finishTime = item.finishTime
                ? utils.formatTimeDate(utils.transLocalTime(item.finishTime))
                : null
            })
          }
          this.draftList = _List
        } else {
          console.log(res.data.message)
        }
      })
    },
    /*通知草稿列表 结束*/

    /*新闻风采草稿列表*/
    getdraftSchoolNewsList: function(type) {
      draftSchoolNewsList({ publishType: type, pageNo: 1, pageSize: 10 }).then(
        res => {
          if (res.data.code == 200) {
            var _List = res.data.data.data
            if (_List.length > 0) {
              _List.forEach(function(item) {
                item.titleImgUrl =
                  item.titleImgUrl && item.titleImgUrl.length > 0
                    ? utils.formatImgUrl(item.titleImgUrl)
                    : ''
                item.createTime = utils.formatTimeDiff(item.createTime)
                item.finishTime = item.finishTime
                  ? utils.formatTimeDateDay(item.finishTime)
                  : null
              })
            }
            this.draftList = _List
          } else {
            console.log(res.data.message)
          }
        }
      )
    },
    /*新闻风采草稿列表 结束*/

    
    /*作业草稿列表*/
    getdraftHomeworkList: function(type) {
      draftHomeworkList({ pageNo: 1, pageSize: 10 }).then(res => {
        if (res.data.code == 200) {
          var _List = res.data.data.data
          if (_List.length > 0) {
            _List.forEach(function(item) {
              item.titleImgUrl =
                item.titleImgUrl && item.titleImgUrl.length > 0
                  ? utils.formatImgUrl(item.titleImgUrl)
                  : ''
              item.createTime = utils.formatTimeDiff(item.createTime)
              item.finishTime = item.finishTime
                ? utils.formatTimeDateDay(item.finishTime)
                : null
            })
          }
          this.draftList = _List
        } else {
          console.log(res.data.message)
        }
      })
    },
    /*作业草稿列表 结束*/

    //初始化数据
    initData: function() {
      this.issueList = []
      this.draftList = []
    }
  }
}
</script>

<style>
</style>
