<template>
  <div class="my-form">
    <input placeholder="标题" v-model="title">
    <textarea placeholder="描述" v-model="des"></textarea>
  </div>
</template>

<script setup>
import { onMounted, reactive, toRefs, watch } from 'vue';
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  des: {
    type: String,
    default: ''
  },
  update: {
    type: Function
  }
})
const data = reactive({
  title: '',
  des: ''
})
let { title, des } = toRefs(data)
watch(data, () => {
  props.update && props.update({ title: title.value.trim(), des: des.value.trim() })
})
onMounted(() => {
  title.value = props.title
  des.value = props.des
})
</script>

<style lang="less" scoped>
.my-form {
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

  textarea {
    flex: none;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 18px;
    padding: 10px;
    min-height: 100px;
    resize: vertical;
  }
}
</style>