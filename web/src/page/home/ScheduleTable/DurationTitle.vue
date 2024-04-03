<template>
  <td>
    {{ data.title }}
    <div class="editBox">
      <i class="icon" @click.stop="hdRemoveClick">&times;</i>
      <div class="edit"><span @click.stop="hdEditClick">编辑</span></div>
    </div>

  </td>
</template>

<script setup>
import { h } from 'vue'
import MyMessageBox from '../MessageBox/index'
import DurationForm from './DurationForm'
import { useData } from '../../../store/modules/data'
import { delDurationReq, editDurationReq } from '../../../api';
const store = useData()
const props = defineProps({
  data: {
    type: Object
  }
})
const hdRemoveClick = () => {
  MyMessageBox({
    title: '删除课程时间',
    btnCancelText: '取消',
    btnConfirmText: '删除',
    insert: h('p', '确认要删除此课程时间吗'),
    confirm(close) {
      close()
      delDurationReq({ id: props.data.id }).then(res => {
        if (res.code == 0) {
          store.updateData()
        }
      }).catch(err => { })
    },
    cancel() {
    }
  })
}
let durationTitle = ''
const hdEditClick = () => {
  MyMessageBox({
    title: '编辑课程时间',
    btnCancelText: '取消',
    btnConfirmText: '提交',
    insert: h(DurationForm, {
      title: props.data.title,
      update(data) {
        durationTitle = data.trim()
      }
    }),

    confirm(close) {
      if (durationTitle === '') return
      close()
      editDurationReq({ id: props.data.id, title: durationTitle }).then(res => {
        if (res.code == 0) {
          store.updateData()
        }
      }).catch(err => { })
    },
    cancel() {
    }
  })
}
</script>

<style lang="less" scoped>
td {
  position: relative;
  color: #856404;
  background-color: #fff3cd;
  overflow: hidden;
  padding: 5px;

  &:hover {
    &>.editBox {
      transform: translateY(0);
    }
  }

  .editBox {
    position: absolute;
    background-color: #fff3cd;
    top: 0;
    left: 0;
    transform: translateY(100%);
    width: 100%;
    height: 100%;
    transition: .5s;

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
}
</style>