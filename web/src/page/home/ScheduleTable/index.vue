<template>
  <div class="schedule-table">
    <table border="1" cellpadding="0">
      <WeekTitle></WeekTitle>
      <tr v-for="item in duration" :key="item.id">
        <DurationTitle :data="item"></DurationTitle>
        <td class="addDuration" v-for="n in 7" :key="n">
          <Card :week="n" :duration="item" :data="scheduleObj[`${n}_${item.id}`]" v-if="scheduleObj[`${n}_${item.id}`]">
          </Card>
          <span v-if="!scheduleObj[`${n}_${item.id}`]" @click="hdTdClick(n, item.id)">+</span>
        </td>
      </tr>
      <tr>
        <td class="addDuration"><span @click.stop="hdAddClick">+</span></td>
        <td colspan="7">
          <MyButton @click="hdChangePd">修改密码</MyButton>
          <MyButton type="danger" @click="delAccount">删除账号</MyButton>
          <MyButton type="primary" @click="hdOut">退出</MyButton>
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { h, computed, onMounted, toRefs } from "vue"
import WeekTitle from "./WeekTitle.vue";
import { useData } from '../../../store/modules/data'
import DurationTitle from "./DurationTitle.vue";
import MyButton from '../MyButton'
import DurationForm from './DurationForm.vue'
import { _delData, _err, _success, formatScheduleData, updateTitle } from '../../../utils/common'
import Card from "../Card.vue";
import MyForm from "./MyForm.vue";
import MyMessageBox from '../MessageBox/index'
import UserForm from "./UserForm.vue";
import { changepdReq, logoutReq, addScheduleReq, addDurationReq } from "../../../api";
import { useRouter } from "vue-router";
import md5 from "md5";
import { deleteUserReq } from "../../../api";
const router = useRouter()
const store = useData()
const { duration, schedule } = toRefs(store)
const scheduleObj = computed(() => {
  return formatScheduleData(schedule.value)
})
let formData = {}
const hdTdClick = (week, durationId) => {
  if (scheduleObj.value[`${week}_${durationId}`]) return
  //新增
  MyMessageBox({
    title: '新增课程安排',
    btnCancelText: '取消',
    btnConfirmText: '提交',
    insert: h(MyForm, {
      update(data) {
        formData = data
      }
    }),

    confirm(close) {
      let { title = '', des } = formData
      if (title === '') return
      close()
      addScheduleReq({ title, describe: des, week, durationId }).then(res => {
        if (res.code == 0) {
          store.updateData()
        }
      }).catch(err => { })
    },
    cancel() {
    }
  })
}
let durationTitle = '00:00-00:00'
const hdAddClick = () => {
  MyMessageBox({
    title: '新增课程时间',
    btnCancelText: '取消',
    btnConfirmText: '提交',
    insert: h(DurationForm, {
      update(data) {
        durationTitle = data
      }
    }),

    confirm(close) {
      if (durationTitle.trim() === '') return
      close()
      addDurationReq({ title: durationTitle }).then(res => {
        if (res.code == 0) {
          store.updateData()
        }
      }).catch(err => { })
    },
    cancel() {
    }
  })
}
let pdData = {}
const hdChangePd = () => {
  MyMessageBox({
    title: '修改密码',
    btnCancelText: '取消',
    btnConfirmText: '提交',
    insert: h(UserForm, {
      update(data) {
        pdData = data
      }
    }),

    confirm(close) {
      let { oldPassword, newPassword, rePassword } = pdData
      if (newPassword !== rePassword) {
        _err('输入密码不同')
        return
      }
      close()
      changepdReq({ password: md5(newPassword), oldpassword: md5(oldPassword) }).then(res => {
        if (res.code == 0) {
          _success(res.codeText)
        }
      }).catch(err => { })
    },
    cancel() {
    }
  })
}
const hdOut = () => {
  MyMessageBox({
    title: '退出提示',
    btnCancelText: '取消',
    btnConfirmText: '退出',
    insert: h('p', '确认退出登录？'),
    confirm(close) {
      close()
      logoutReq().then(res => {
        if (res.code == 0) {
          _success('退出成功')
          _delData('id')
          router.replace('/login')
        }
      }).catch(() => { })
    },
    cancel() {
    }
  })
}
const delAccount = () => {
  MyMessageBox({
    title: '删除账号提示',
    btnCancelText: '取消',
    btnConfirmText: '删除',
    insert: h('p', '确认删除账号？'),
    confirm(close) {
      close()
      deleteUserReq().then(res => {
        if (res.code == 0) {
          _success(res.codeText)
          _delData('id')
          _delData('username')
          router.replace('/login')
        }
      }).catch(err => { })
    },
    cancel() {
    }
  })
}
onMounted(() => {
  updateTitle()
  store.updateData()
})
</script>

<style lang="less" scoped>
.schedule-table {
  width: 100%;
  height: 100%;
  overflow: auto;

  table {
    width: 100%;
    margin: 0 auto;
    min-width: 1000px;
    max-width: 1400px;
    border-collapse: collapse;
    table-layout: fixed;
    border-color: #ccc;

    tr {

      td {
        word-break: break-all;
        height: 150px;
        text-align: center;
      }

      .addDuration {
        &:hover {
          &>span {
            opacity: 1;
          }
        }

        span {
          cursor: pointer;
          opacity: 0;
          color: #aaa;
          font-size: 50px;
          transition: .5s;

          // &:hover {
          //   color: #000;
          // }
        }
      }
    }
  }

}
</style>