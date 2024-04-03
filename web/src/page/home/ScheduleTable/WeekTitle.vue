<template>
  <tr>
    <th @click="hdUserClick" :title="data.username" class="user-info">{{ data.username }}</th>
    <th class="week-title" v-for="item in weekDay" :key="item.id">{{ item.title }}</th>
  </tr>
</template>

<script setup>
import { h } from 'vue'
import weekDay from '../../../data/week'
import { useData } from '../../../store/modules/data';
import MyMessageBox from '../MessageBox'
import UserForm from './UserForm.vue';
import { changeuserReq } from '../../../api';
const data = useData()
let username = ''
const hdUserClick = () => {
  MyMessageBox({
    title: '修改用户名',
    btnCancelText: '取消',
    btnConfirmText: '提交',
    insert: h(UserForm, {
      username: data.username,
      type: 'changeuser',
      update(data) {
        username = data.username
      }
    }),
    confirm(close) {
      if (!username || username == data.username) return
      close()
      changeuserReq({ username }).then(() => {
        data.setUsername(username)
      }).catch(err => { })
    },
    cancel() {
    }
  })
}
</script>

<style lang="less" scoped>
tr {
  .week-title {
    color: #004085;
    background-color: #cce5ff;
  }

  .user-info {
    color: dimgray;
    word-break: break-all;
    cursor: pointer;
  }

  th {
    padding: 20px;
  }
}
</style>