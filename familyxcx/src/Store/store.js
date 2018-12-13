import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);
//数据
const state = {
  tasteType: '',
  selectLoginType: '', //登录页面选择的登录类型（一般和judgeuserType值相同）
  token: '',
  userId: '',
  cookieId: '',
  judgeuserType: '',
  // students: '',
  userMobile: '',
  schoolId: '',
  schoolList: '',
  family: { studentId: '', parentId: '', studentName: '' /*addisFull: ''*/ },
  issueHomeWork: {
    Allbtn: '', title: '', subjectId: '', classIds: '', finishTime: '', content: ''
  },
  issueNew: {
    title: '', content: '', newsStyleType: '', titleImgUrl: '', attachUrl: '', approvalUserId: '', copyUserId: '', copyUserObj: '', ObjParent: '', ObjParentOne: ''
  },
  issueNotice: {
    title: '', content: '', newsStyleType: '', classList: '', userList: '', classIds: '', userIds: '', classAnduserIdObj: '', signExp: '', approvalUserId: '', copyUserId: '', copyUserObj: '', ObjParent: '', ObjParentOne: '', ObjParentTwo: ''
  }
}

//获取数据（或者说是自定义过滤计算）
const getters = {
  getIssueHomeWork: state => state.issueHomeWork,
  getIssueNotice: state => state.issueNotice,
  getIssueNew: state => state.issueNew,
  getTasteType: state => state.tasteType,
  getSelectLoginType: state => state.selectLoginType,
  gettoKen: state => state.token,
  getUserId: state => state.userId,
  getcookieId: state => state.cookieId,
  getJudgeUserType: state => state.judgeuserType,
  // getStudnets: state => state.students,
  getUserMobile: state => state.userMobile,
  getSchoolID: state => state.schoolId,
  getSchoolList: state => state.schoolList,
  getFamily: state => state.family
}

//提交方法
const mutations = {
  //清空方法
  clearStore(state) {
    if (state) {
      state.tasteType = ''
      state.selectLoginType = ''
      state.token = ''
      state.userId = ''
      state.cookieId = ''
      state.judgeuserType = ''
      state.userMobile = ''
      state.schoolId = ''
      state.schoolList = ''
      state.family.studentId = ''
      state.family.parentId = ''
      state.family.studentName = ''
      // /*add*/
      // state.family.isFull = ''
    }
  },


  //清空发布作业数据
  clearHomeWork(state) {
    if (state) {
      state.issueHomeWork.Allbtn = false
      state.issueHomeWork.title = ''
      state.issueHomeWork.subjectId = ''
      state.issueHomeWork.classIds = ''
      state.issueHomeWork.finishTime = ''
      state.issueHomeWork.content = ''
    }
  },

  //清空通知发布风采数据
  clearNew(state) {
    if (state) {
      state.issueNew.title = ''
      state.issueNew.content = ''
      state.issueNew.newsStyleType = ''
      state.issueNew.titleImgUrl = ''
      state.issueNew.attachUrl = ''
      state.issueNew.approvalUserId = ''
      state.issueNew.copyUserId = ''
      state.issueNew.copyUserObj = ''
      state.issueNew.ObjParent = ''
      state.issueNew.ObjParentOne = ''
    }
  },
  //清空发布通知数据
  clearNotice(state) {
    if (state) {
      state.issueNotice.title = ''
      state.issueNotice.content = ''
      state.issueNotice.newsStyleType = ''
      state.issueNotice.classList = ''
      state.issueNotice.userList = ''
      state.issueNotice.classIds = ''
      state.issueNotice.userIds = ''
      state.issueNotice.classAnduserIdObj = ''
      state.issueNotice.signExp = ''
      state.issueNotice.approvalUserId = ''
      state.issueNotice.copyUserId = ''
      state.issueNotice.copyUserObj = ''
      state.issueNotice.ObjParent = ''
      state.issueNotice.ObjParentOne = ''
      state.issueNotice.ObjParentTwo = ''

    }
  },

  tasteType(state, value) {
    state.tasteType = value;
  },
  selectLoginType(state, value) {
    state.selectLoginType = value;
  },
  token(state, value) {
    state.token = value;
  },
  userId(state, value) {
    state.userId = value;
  },
  cookieId(state, value) {
    state.cookieId = value;
  },
  judgeuserType(state, value) {
    state.judgeuserType = value;
  },
  // students(state, value) {
  //     state.students = value;
  // },
  userMobile(state, value) {
    state.userMobile = value;
  },
  schoolId(state, value) {
    state.schoolId = value;
  },
  schoolList(state, value) {
    state.schoolList = value
  },
  family(state, obj) {
    obj.forEach((item) => {
      Vue.set(state.family, item.key, item.value);
    })
  },

  issueHomeWork(state, obj) {
    obj.forEach((item) => {
      Vue.set(state.issueHomeWork, item.key, item.value);
    })
  },
  issueNew(state, obj) {
    obj.forEach((item) => {
      Vue.set(state.issueNew, item.key, item.value);
    })
  },
  issueNotice(state, obj) {
    obj.forEach((item) => {
      Vue.set(state.issueNotice, item.key, item.value);
    })
  }
};

//提交拦截
const actions = {
  //清空方法
  setClearStore(state) {
    state.commit('clearStore');
  },
  //清空发布作业方法
  setClearHomeWork(state) {
    state.commit('clearHomeWork');
  },
  //清空发布新闻方法
  setClearNew(state) {
    state.commit('clearNew');
  },
  //清空通知
  setClearNotice(state) {
    state.commit('clearNotice');
  },

  setTasteType(state, value) {
    state.commit('tasteType', value);
  },
  setSelectLoginType(state, value) {
    state.commit('selectLoginType', value);
  },
  setToKen(state, value) {
    state.commit('token', value)
  },
  setUserId(state, value) {
    state.commit('userId', value)
  },
  setCookieId(state, value) {
    state.commit('cookieId', value)
  },
  setJudgeUserType(state, value) {
    state.commit("judgeuserType", value);
  },
  setUserMobile(state, value) {
    state.commit('userMobile', value);
  },
  setSchoolId(state, value) {
    state.commit('schoolId', value);
  },
  setSchoolList(state, value) {
    state.commit('schoolList', value);
  },
  setFamily(state, obj) {
    state.commit("family", obj);
  },

  setIssueHomeWork(state, obj) {
    state.commit("issueHomeWork", obj);
  },
  setIssueNotice(state, obj) {
    state.commit("issueNotice", obj);
  },
  setIssueNew(state, obj) {
    state.commit("issueNew", obj);
  }

}

// const vuexLocal = new VuexPersistence({
//   storage: window.localStorage, 
// });

export default new Vuex.Store({
  state,
  getters,
  actions,
  plugins: [createPersistedState({
    storage: {
      getItem: key => wx.getStorageSync(key),
      setItem: (key, value) => wx.setStorageSync(key, value),
      removeItem: key => { }
    }
  })],
  mutations,
  // plugins: [vuexLocal.plugin]
})

// export default Store
