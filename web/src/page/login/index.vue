<template>
  <div class="login">
    <div class="box-card">
      <h1>Hello {{ form.username }}</h1>
      <input @keyup.enter="submit" @blur="ruleUsername" v-model.trim="form.username" placeholder="用户名" type="text" />
      <p>{{ uerr }}</p>
      <input @keyup.enter="submit" v-model.trim="form.password" placeholder="密码" type="password" />
      <p></p>
      <input @keyup.enter="submit" v-if="!islogin" v-model.trim="form.repassword" placeholder="确认密码" type="password"
        @blur="rulePassword" />
      <p v-if="!islogin">{{ perr }}</p>
      <MyButton type="primary" @click="submit">{{ islogin ? "登录" : "注册" }}</MyButton>
      <span @click="islogin = !islogin">
        {{
          islogin ? "注册" : "登录"
        }}
      </span>
    </div>
  </div>
</template>

<script setup>
import MyButton from '../home/MyButton'
// API
import { loginReq, registerReq } from "../../api";
//路由
import { useRouter } from 'vue-router'
//密码加密
import md5 from 'md5'
//工具
import { _getData, _setData, _success, _err, debounce, updateTitle, deepClone, isUserName } from "../../utils/common";
import { reactive, toRefs } from "vue"
let router = useRouter()
let data = reactive({
  form: {
    username: _getData("username") || "",
    password: "",
    repassword: ""
  },
  islogin: true,
  uerr: "",
  perr: ""
})
let { form, islogin, uerr, perr } = toRefs(data);
//用户名验证
let ruleUsername = () => {
  if (form.value.username === "") {
    uerr.value = "请输入用户名~";
    return false;
  } else if (!isUserName(form.value.username)) {
    uerr.value = "用户名格式错误~";
    return false;
  } else if (form.value.username.length > 20) {
    uerr.value = "用户名不能超过20字符~";
    return false;
  } else {
    uerr.value = "";
    return true;
  }
}
// 密码验证
let rulePassword = () => {
  if (!islogin.value) {
    if (form.value.password !== form.value.repassword) {
      perr.value = "密码输入不同~";
      return false;
    } else {
      perr.value = "";
      return true;
    }
  } else {
    perr.value = "";
    return true;
  }
}
//提交
let submit = debounce(() => {
  if (!ruleUsername() || !rulePassword()) return;
  let obj = deepClone(form.value);
  obj.password = md5(obj.password);
  if (islogin.value) {
    loginReq(obj).then(res => {
      if (res.code == 0) {
        _success(res.codeText);
        _setData("username", res.data.username);
        _setData("id", res.data.id);
        updateTitle();
        router.replace("/");
      }
    }).catch(err => { })
  } else {
    registerReq(obj).then(res => {
      if (res.code == 0) {
        _success(res.codeText);
        _setData("username", res.data.username);
        _setData("id", res.data.id);
        updateTitle();
        router.replace("/");
      }
    }).catch(err => { })
  }
}, 500, true)
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/img/bg.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  font-size: 18px;

  .box-card {
    width: 90%;
    max-width: 400px;
    text-align: center;
    padding: 20px 0 50px 0;
    position: relative;
    border-radius: 6px;
    border: 1px solid #ccc;

    h1 {
      font-weight: bold;
      font-size: 20px;
      margin-bottom: 20px;
    }

    button {
      width: 50%;
    }

    input {
      font-size: 18px;
      padding: 10px;
      border-radius: 3px;
      border: 1px solid #ccc;
      width: 80%;
      text-align: center;
    }

    p {
      color: rgb(217, 61, 61);
      height: 25px;
      line-height: 25px;
    }

    span {
      position: absolute;
      right: 35px;
      bottom: 14px;
      font-size: 20px;
      cursor: pointer;
      color: #555454;

      &:hover {
        color: #000;
      }
    }
  }
}
</style>