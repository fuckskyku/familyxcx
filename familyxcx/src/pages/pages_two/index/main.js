import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()


export default {
    config: {
        navigationBarTitleText: '喵喵校园',
        "enablePullDownRefresh": true,
    }
}