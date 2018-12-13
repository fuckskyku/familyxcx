import './utils/ald-stat'
import './utils/ald-stat-conf'
import Vue from 'vue'
import App from './App'
import store from './Store/store'
Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$store = store;

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    // 'pages/pages_one/logs/main',
    pages: [
      '^pages/welcome/main',
      'pages/pages_one/loginSelect/main',
      'pages/pages_one/index/main',
      'pages/pages_one/notice/main',
      'pages/pages_one/noticeInfo/main',
      'pages/pages_one/loginMobile/main',
      'pages/pages_one/forgetPassword/main',
      'pages/pages_one/loginMobileErr/main',
      'pages/pages_one/loginMobileErrNext/main',
      'pages/pages_one/loginActivation/main',
      'pages/pages_one/institutionSelect/main',
      'pages/pages_one/my/main',
      'pages/pages_one/mySelect/main',
      'pages/pages_one/myReviseInfo/main',  
      'pages/pages_one/myfamilyInfo/main',
      'pages/pages_one/checkTime/main',
      'pages/pages_one/set/main',
      'pages/pages_one/about/main',
      'pages/pages_one/setAccount/main',
      'pages/pages_one/setMobileSelect/main',
      'pages/pages_one/setMobileSelectInputCode/main',
      'pages/pages_one/setRevisePw/main',

      
      //另一个小程序界面写在下面
      'pages/pages_two/index/main',
      'pages/pages_two/my/main',
      '^pages/pages_two/issue/main',
      'pages/pages_two/issueHomeWork/main',
      'pages/pages_two/issueHomeWorkList/main',
      'pages/pages_two/issueNew/main',
      'pages/pages_two/issueNewList/main',
      'pages/pages_two/issueNotice/main',
      'pages/pages_two/issueNoticeList/main',
      'pages/pages_two/institutionSelect/main',
      'pages/pages_two/myIssue/main',
      'pages/pages_two/myIssueList/main',
      'pages/pages_two/myApproval/main',
      'pages/pages_two/myUserInfo/main',
      'pages/pages_two/myApprovalInfo/main',

      //协议
      'pages/registerAgreement/main',
      'pages/useAgreement/main'
    ],

    // tabBar: {
    // "list": [{
    //   "pagePath": "pages/pages_one/index/main",
    //   "text": "首页",
    //   "iconPath": '/static/img/tab/tab_school_nor@3x.png',
    //   "selectedIconPath": '/static/img/tab/tab_school_sel@3x.png',
    // }, {
    //   "pagePath": "pages/pages_one/my/main",
    //   "text": "我的",
    //   "iconPath": '/static/img/tab/tab_me_nor@3x.png',
    //   "selectedIconPath": '/static/img/tab/tab_me_sel@3x.png',
    // }]
    // },

    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '咪师校园',
      navigationBarTextStyle: 'black',
      // enablePullDownRefresh: true
    }
    , networkTimeout: {
      request: 10000,
      downloadFile: 10000
    },
    debug: false
  }
}
