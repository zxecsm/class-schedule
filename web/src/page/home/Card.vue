<template>
  <div>
    <div class="editBox">
      <i class="icon" @click.stop="removeCard">&times;</i>
      <div class="edit"><span @click.stop="hdEdit">编辑</span></div>
    </div>
    <span>{{ duration.title.split('-')[0] }} {{ toChinese(week) }}</span>
    <h1>{{ data.title }}</h1>
    <p>{{ data.describe }}</p>
  </div>
</template>

<script setup>
import { h } from 'vue';
import { useData } from '../../store/modules/data'
import MyMessageBox from './MessageBox'
import MyFormVue from './ScheduleTable/MyForm.vue';
import { delScheduleReq, editScheduleReq } from '../../api';
import { toChinese } from '../../utils/common'
const store = useData()
const props = defineProps({
  data: {
    type: Object
  },
  week: {
    type: Number
  },
  duration: {
    type: Object
  }
})
console.log(toChinese(props.week))
const removeCard = () => {
  MyMessageBox({
    title: '删除课程安排',
    btnCancelText: '取消',
    btnConfirmText: '删除',
    insert: h('p', '确定要删除此课程安排吗'),
    confirm(close) {
      close()
      delScheduleReq({ id: props.data.id }).then(res => {
        if (res.code == 0) {
          store.updateData()
        }
      }).catch(err => { })
    },
    cancel() {
    }
  })
}
let formData = {}
const hdEdit = () => {
  MyMessageBox({
    title: '编辑课程安排',
    btnCancelText: '取消',
    btnConfirmText: '提交',
    insert: h(MyFormVue, {
      title: props.data.title,
      des: props.data.describe,
      update(data) {
        formData = data
      }
    }),

    confirm(close) {
      let { title = '', des } = formData
      if (title === '' || title === props.data.title && des === props.data.describe) return
      close()
      editScheduleReq({ id: props.data.id, title, describe: des }).then(res => {
        if (res.code == 0) {
          store.updateData()
        }
      }).catch(err => { })
    },
    cancel() { }
  })

}
</script>

<style lang="less" scoped>
div {
  position: relative;
  width: 100%;
  height: 100%;
  color: #155724;
  background-color: #d4edda;
  flex-flow: column;
  padding: 10px;
  overflow: hidden;

  span {
    font-size: 12px;
  }

  &:hover {
    &>.editBox {
      transform: translateY(0);
    }
  }

  .editBox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: translateY(100%);
    transition: .5s;
    overflow: hidden;
    padding: 0;

    .edit {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        cursor: pointer;
        font-size: 20px;

        &:hover {
          color: #000;
        }
      }
    }

    .icon {
      width: 30px;
      line-height: 30px;
      text-align: center;
      position: absolute;
      top: 0;
      right: 0;
      font-style: normal;
      font-size: 30px;
      z-index: 2;
      cursor: pointer;

      &:hover {
        font-weight: bold;
      }
    }
  }

  h1 {
    width: 100%;
    border-bottom: .01px solid #ccc;
    padding-bottom: 5px;
  }

  p {
    margin-top: 5px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
}
</style>