<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="emit('close')">
    <div :class="['rounded-lg p-6 w-full max-w-md', darkMode ? 'bg-gray-800' : 'bg-white']">
      <div class="flex items-center justify-between mb-4">
        <h2 :class="['text-xl font-bold', darkMode ? 'text-white' : 'text-gray-800']">{{ isRegister ? '注册' : '登录' }}</h2>
        <button @click="emit('toggle')" :class="['text-sm', darkMode ? 'text-blue-400' : 'text-blue-500']">
          {{ isRegister ? '已有账号？登录' : '没有账号？注册' }}
        </button>
      </div>
      <div class="space-y-4">
        <input 
          v-model="form.username"
          type="text" 
          placeholder="用户名" 
          :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                   darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
        />
        <input 
          v-if="isRegister"
          v-model="form.email"
          type="email" 
          placeholder="邮箱（可选）" 
          :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                   darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
        />
        <input 
          v-model="form.password"
          type="password" 
          placeholder="密码" 
          :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                   darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
        />
        <input 
          v-if="isRegister"
          v-model="form.confirmPassword"
          type="password" 
          placeholder="确认密码" 
          :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                   darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
          @keyup.enter="emit('submit', form)"
        />
        <button 
          @click="emit('submit', form)" 
          :disabled="loading"
          class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {{ loading ? '处理中...' : (isRegister ? '注册' : '登录') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  isRegister: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  darkMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit', 'toggle'])

const form = reactive({
  username: '',
  password: '',
  email: '',
  confirmPassword: ''
})
</script>
