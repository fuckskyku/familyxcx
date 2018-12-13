// component/hasBeenSent/hasBeenSent.js
const { baseUrl } = getApp().globalData
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    templateUrl:{
      type:String,
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
        this.gimbianl(newVal)
      }
    },
    title:{
      type:String,
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
      }
    },
    createTime:{
      type:String,
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
     
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    iscard:true,
    themeImg:""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gimbianl(gimgs){
      this.data.themeImg=`${baseUrl+gimgs}`
      this.setData(this.data)
     },
    removeCard:function(e){
       this.setData({
        iscard: false
      })
    },
    determine:function(e){
     console.log('删除')
    }
  }
})
