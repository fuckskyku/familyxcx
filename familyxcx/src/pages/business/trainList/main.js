import Vue from 'vue'
import App from './trainList'

const app = new Vue(App)
app.$mount()

export default{
    config:{
        "navigationBarTitleText":"培训机构"
        // "navigationBarBackgroundColor":'#FFEA55',
    }
}