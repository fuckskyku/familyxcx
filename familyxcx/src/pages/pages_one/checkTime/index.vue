<template>
  <div>
    <Calendar @next="next" @prev="prev" :events="events" @select="select" ref="calendar" @selectMonth="selectMonth" @selectYear="selectYear" />

    <button @click="setToday">返回今日</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Calendar from 'mpvue-calendar'
import { monthRfidClock } from '@/api/api'
import utils from '@/utils/index'
export default {
  data() {
    return {
      events: {}
    }
  },
  components: {
    Calendar
  },
  computed: {
    ...mapState(['family'])
  },
  mounted() {
    var date = new Date()
    var dateTime = new Date(new Date().format('yyyy-MM')).getTime()
    this.dateData(dateTime)
  },
  methods: {
    //数据请求方法
    dateData(date) {
      monthRfidClock({
        studentId: this.family.studentId,
        month: date
      }).then(res => {
        console.log(res)
      })
    },
    selectMonth(month, year) {
      var date = new Date(year + '-' + month).getTime()
      this.dateData(date)
    },
    prev(month) {
      console.log(month)
    },
    next(month) {
      console.log(month)
    },
    selectYear(year) {
      console.log(year)
    },
    setToday(val, val1, val2) {
      this.$refs.calendar.setToday()
    },
    select(val, val2) {
      console.log(val)
      console.log(val2)
    }
  }
}
</script>

<style>
</style>
