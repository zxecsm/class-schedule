<template>
  <div class="user-form">
    <input v-if="type === 'changeuser'" placeholder="用户名" v-model="username">
    <input type="password" v-if="type === 'changepd'" placeholder="旧密码" v-model="oldPassword">
    <input type="password" v-if="type === 'changepd'" placeholder="新密码" v-model="newPassword">
    <input type="password" v-if="type === 'changepd'" placeholder="确认密码" v-model="rePassword">
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs, watch } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'changepd'
  },
  username: {
    type: String,
    default: ''
  },
  oldPassword: {
    type: String,
    default: ''
  },
  newPassword: {
    type: String,
    default: ''
  },
  rePassword: {
    type: String,
    default: ''
  },
  update: {
    type: Function
  }
})
const data = reactive({
  username: '',
  oldPassword: '',
  newPassword: '',
  rePassword: ''
})
let { username,
  oldPassword,
  newPassword,
  rePassword } = toRefs(data)
watch(data, () => {
  props.update && props.update({
    username: username.value.trim(),
    oldPassword: oldPassword.value.trim(),
    newPassword: newPassword.value.trim(),
    rePassword: rePassword.value.trim()
  })
})
onMounted(() => {
  username.value = props.username
  oldPassword.value = props.oldPassword
  newPassword.value = props.newPassword
  rePassword.value = props.rePassword
})
</script>

<style lang="less" scoped>
.user-form {
  display: flex;
  flex-flow: column;

  input {
    flex: none;
    font-size: 18px;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 3px;
    border: 1px solid #ccc;
  }
}
</style>