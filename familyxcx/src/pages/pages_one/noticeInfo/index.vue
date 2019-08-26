<template>
<div v-if="showLoading">
  loading……
</div>
</template>
<template >
  <info :detail="noticeInfo" :comment="null" :userType="selectLoginType" :flagType="flag" :SchoolNewsId="id"  v-if="showLoading==false"></info>
</template>

<script>
import info from "@/components/info";
import { getSchoolNews } from "@/api/api";
import { mapState, mapActions } from "vuex";
import utils from "@/utils/index";
export default {
  data() {
    return {
      showLoading: true,
      noticeInfo: {},
      id: 0,
      flag: ''
    };
  },
  components: {
    info
  },
  computed: {
    ...mapState(["selectLoginType"])
  },
  mounted() {
    // console.log(this.selectLoginType);
    this.initData();
    this.flag = this.$mp.query.flag
    this.id = this.$mp.query.id;
    this.getNoticeInfo(this.id);
    this.showLoading=false;
    console.log(this.$mp.query)
  },
  methods: {
    getNoticeInfo: function(id) {
      getSchoolNews({
        id: id
      }).then(res => {
        if (res.data.code == 200) {
          this.noticeInfo = res.data.data;
          if (this.noticeInfo) {
            this.noticeInfo.createTime = utils.formatTimeDiff(
              this.noticeInfo.createTime
            );
            this.noticeInfo.titleImgUrl = utils.formatImgUrl(
              this.noticeInfo.titleImgUrl
            );
            wx.setNavigationBarTitle({
              title: "详情页面"//this.noticeInfo.title //页面标题
            });
          }
        } else {
          console.log(res.data.message);
        }
      });
    },
    //初始化数据
    initData: function() {
      this.noticeInfo = {};
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: this.noticeInfo.title + "_喵喵校园",
      path: "pages/pages_one/noticeInfo/main?id=" + this.id
    };
  }
};
</script>

<style>
</style>
