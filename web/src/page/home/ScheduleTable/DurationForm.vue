<template>
  <div class="duration-form">
    <input v-model="data.title">
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '00:00-00:00'
  },
  update: {
    type: Function
  }
})
const data = reactive({
  title: '00:00-00:00'
})
watch(data, () => {
  props.update && props.update(data.title.trim())
})
onMounted(() => {
  data.title = props.title
})
</script>

<style lang="less" scoped>
.duration-form {
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