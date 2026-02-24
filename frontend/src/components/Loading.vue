<template>
  <div v-loading="loading" :element-loading-text="text" :element-loading-spinner="spinner" :element-loading-background="background" class="loading-wrapper">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: '加载中...'
  },
  spinner: {
    type: String,
    default: 'el-icon-loading'
  },
  background: {
    type: String,
    default: 'rgba(0, 0, 0, 0.7)'
  }
})
</script>

<style scoped>
.loading-wrapper {
  min-height: 100px;
}
</style>
