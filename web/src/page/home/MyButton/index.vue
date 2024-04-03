<template>
  <button :class="`my-btn btn-${type}`">
    <slot></slot>
  </button>
</template>

<script setup>
const props = defineProps({
  type: String,
  default: 'default'
})
</script>

<style lang="less" scoped>
.my-btn {
  height: 35px;
  padding: 0 15px;
  border-radius: 3px;
  cursor: pointer;
  margin: 20px 10px;

  &.btn-default {
    color: #212529;
    background-color: #f8f9fa;
    border-color: #f8f9fa;

  }

  &:hover {
    transform: scale(1.1);
  }

  &.btn-primary {
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d;
  }

  &.btn-danger {
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545;
  }
}
</style>