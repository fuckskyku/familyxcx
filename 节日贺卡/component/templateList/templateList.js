// component/templateList/templateList.js
const { baseUrl } = getApp().globalData
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    templateUrl: {
      type: String,
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {
        this.gimbianl(newVal)
      }
    },
    theTheme: {
      type: Object,
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal, changedPath) {

      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    themeImg: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gimbianl(gimgs) {
      this.data.themeImg = `${baseUrl + gimgs}`
      this.setData(this.data)
    },
    selected: function () {
      wx.setStorage({
        key: "theTheme",
        data: this.data.theTheme,
        success: () => {
          wx.navigateTo({
            url: '/pages/newpage/newpage'
            //url:'/pages/cardDetail/cardDetail?id=465'
          })

        }
      })

    }
  }
})
