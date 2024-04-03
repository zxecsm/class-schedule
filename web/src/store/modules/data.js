import { defineStore } from 'pinia'
import { _getData, _setData, updateTitle } from '../../utils/common'
import { updateCourseReq } from '../../api'

export const useData = defineStore({
  id: 'data',
  state: () => ({
    duration: [],
    schedule: [],
    username: _getData('username') || ''
  }),
  getters: {

  },
  actions: {
    setUsername(val) {
      this.username = val
      _setData('username', val)
      updateTitle()
    },
    updateData() {
      updateCourseReq().then(res => {
        if (res.code == 0) {
          let { duration, schedule } = res.data
          this.duration = duration
          this.schedule = schedule
        }
      }).catch(err => { })
    },
    AddDuration(data) {
      // let { title } = data
      // this.duration.push({
      //   id: nanoid(),
      //   title
      // })
    },
    removeSchedule(id) {
      // this.data.schedule = this.data.schedule.filter(item => item.id !== id)
    },
    editSchedule(data) {
      // let { id, title, des } = data
      // this.data.schedule = this.data.schedule.map((item) => {
      //   if (item.id == id) {
      //     item = {
      //       ...item,
      //       title,
      //       describe: des
      //     }
      //   }
      //   return item
      // })
    },
    addSchedule(data) {
      // let { title, des, durationId,
      //   week } = data
      // this.data.schedule.push({
      //   id: nanoid(),
      //   title,
      //   week, durationId, describe: des
      // })
    },
    editDuration(data) {
      // let { id, title } = data
      // this.data.duration = this.data.duration.map((item) => {
      //   if (item.id == id) {
      //     item = {
      //       ...item,
      //       title
      //     }
      //   }
      //   return item
      // })
    },
    removeDuration(id) {
      // this.data.schedule = this.data.schedule.filter(item => item.durationId !== id)
      // this.data.duration = this.data.duration.filter(item => item.id !== id)
    }
  },
  // persist: true
})