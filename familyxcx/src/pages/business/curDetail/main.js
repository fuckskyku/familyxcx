import Vue from 'vue'
import App from './curDetail'

const app = new Vue(App)
app.$mount()

export default{
    config:{
        "navigationBarTitleText":"课程详情",
        // "navigationBarBackgroundColor":'#FFEA55',
    }
}