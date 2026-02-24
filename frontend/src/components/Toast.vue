<template>
  <Teleport to="body">
    <Transition name="toast">
      <div 
        v-if="visible"
        :class="[
          'fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-[9999]',
          typeClass
        ]"
      >
        <span class="text-lg">{{ icon }}</span>
        <span>{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const visible = ref(false)
const message = ref('')
const type = ref('success')
let timeout = null

const typeClass = computed(() => {
  const classes = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white'
  }
  return classes[type.value] || classes.success
})

const icon = computed(() => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }
  return icons[type.value] || icons.success
})

const show = (msg, t = 'success', duration = 2000) => {
  message.value = msg
  type.value = t
  visible.value = true
  
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => {
    visible.value = false
  }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
