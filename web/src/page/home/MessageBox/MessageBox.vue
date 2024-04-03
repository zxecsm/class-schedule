<template>
  <transition name="messagebox-fade">
    <div @click="ClickMask" v-show="visible" class="message-mask">
      <div class="box">
        <header class="box-hd">
          <h1>{{ title }}</h1>
        </header>
        <div class="box-board">
          <component :is="insert"></component>
          <div class="btn-group">
            <MyButton @click="hdCancelClick">{{ btnCancelText }}</MyButton>
            <MyButton @click="hdConfirmClick" type="primary">{{ btnConfirmText }}</MyButton>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, reactive, toRefs } from 'vue';
import MyButton from '../MyButton'
const props = defineProps({
  title: {
    type: String
  },
  btnCancelText: {
    type: String,
    default: 'Cancel'
  },
  btnConfirmText: {
    type: String,
    default: 'Confirm'
  },
  insert: {
    typeof: Object
  },
  close: {
    type: Function
  },
  cancel: {
    type: Function
  },
  confirm: {
    type: Function
  }
})
const state = reactive({
  visible: false
})
const close = () => {
  visible.value = false
  setTimeout(() => {
    props.close()
  }, 500)
}
let { visible } = toRefs(state)
const hdCancelClick = () => {
  props.cancel && props.cancel()
  close()
}
const hdConfirmClick = () => {
  props.confirm && props.confirm(close)
}
const ClickMask = (e) => {
  if (e.target.className === 'message-mask') {
    close()
  }
}
onMounted(() => {
  visible.value = true
})
</script>

<style lang="less" scoped>
.message-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0000007d;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  z-index: 999;

  .box {
    width: 90%;
    max-width: 450px;
    border-radius: 5px;
    overflow: hidden;
    background-color: #fff;
    margin: auto;

    .box-hd {
      color: #fff;
      background-color: #17a2b8;
      padding: 10px;

      h1 {
        font-size: 18px;
      }
    }

    .box-board {
      padding: 10px;

      .btn-group {
        float: right;
      }

    }
  }
}

.messagebox-fade-enter-from,
.messagebox-fade-leave-to {
  opacity: 0;
}

.messagebox-fade-leave-active,
.messagebox-fade-enter-active {
  transition: .5s;
}
</style>