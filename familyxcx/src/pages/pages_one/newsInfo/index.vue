<template><div v-if="showLoading">
  loading……
</div>
</template>
<template>
  <info :detail="newsInfo" :comment="commentList" :userType="selectLoginType" v-if="showLoading==false"></info>
</template>

<script>
import info from "@/components/info";
import { getSchoolNews, getComment } from "@/api/api";
import { mapState, mapActions } from "vuex";
import utils from "@/utils/index";
export default {
  data() {
    return {
      showLoading:true,
      newsInfo: {},
      commentList: null,
      id: 0
    };
  },
  components: {
    info
  },
  computed: {
    ...mapState(["selectLoginType"])
  },
  mounted() {
    // console.log(this);
    this.initData();
    this.id = this.$mp.query.id;
    this.getnewsInfo(this.id);
    this.getComment(this.id);
    this.showLoading=false;
  },
  methods: {
    getnewsInfo: function(id) {
      getSchoolNews({
        id: id
      }).then(res => {
        if (res.data.code == 200) {
          this.newsInfo = res.data.data;
          if (this.newsInfo) {
            this.newsInfo.createTime = utils.formatTimeDiff(
              this.newsInfo.createTime
            );
            this.newsInfo.titleImgUrl = utils.formatImgUrl(
              this.newsInfo.titleImgUrl
            );
            wx.setNavigationBarTitle({
              title: "详情页面"//this.newsInfo.title //页面标题
            });
            this.newsInfo.type = 1; //设置类型
          }
        } else {
          console.log(res.data.message);
        }
      });
    },
    getComment: function(id) {
      getComment({
        infoId: id,
        infoType: 1, //评论类型 1为新闻评论类型
        pageNo: 1,
        pageSize: 20
      }).then(res => {
        if (res.data.code == 200) {
          var commentList = res.data.data.data;
          if (commentList.length > 0) {
            commentList.forEach(function(item) {
              item.avatarImg = utils.formatImgUrl(item.avatarImg);
              item.createTime = utils.formatTimeDiff(item.createTime);
            });
            this.commentList = commentList;
          }
        } else {
          console.log(res.data.message);
        }
      });
    },
    //初始化数据
    initData: function() {
      this.newsInfo = {};
      this.commentList = [];
    }
  },
  onShareAppMessage: function(res) {
    return {
      title: this.newsInfo.title + "_咪师校园",
      path: "pages/pages_one/newsInfo/main?id=" + this.id
    };
  }
};
</script>

<style>
</style>
