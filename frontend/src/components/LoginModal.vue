<template>
  <div v-if="visible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="emit('close')">
    <div :class="['rounded-lg p-6 w-full max-w-md', isDark ? 'bg-gray-800' : 'bg-white']">
      <div class="flex items-center justify-between mb-4">
        <h2 :class="['text-xl font-bold', isDark ? 'text-white' : 'text-gray-800']">{{ isRegister ? '注册' : '登录' }}</h2>
        <button @click="emit('toggle')" :class="['text-sm', isDark ? 'text-blue-400' : 'text-blue-500']">
          {{ isRegister ? '已有账号？登录' : '没有账号？注册' }}
        </button>
      </div>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">手机号</label>
          <input 
            v-model="form.phone"
            type="tel" 
            placeholder="请输入手机号" 
            :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                     isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
          />
        </div>
        
        <div v-if="isRegister" class="flex gap-2">
          <input 
            v-model="form.code"
            type="text" 
            placeholder="验证码" 
            :class="['flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                     isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
          />
          <button 
            @click="sendCode" 
            :disabled="countdown > 0"
            :class="['px-4 py-2 rounded-lg text-sm', isDark ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700']"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </button>
        </div>
        
        <div v-if="!isRegister" class="flex gap-2">
          <input 
            v-model="form.code"
            type="text" 
            placeholder="验证码" 
            :class="['flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                     isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
          />
          <button 
            @click="sendCode" 
            :disabled="countdown > 0"
            :class="['px-4 py-2 rounded-lg text-sm', isDark ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700']"
          >
            {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
          </button>
        </div>
        
        <input 
          v-model="form.password"
          type="password" 
          placeholder="设置密码" 
          :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                   isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
        />
        
        <button 
          @click="submit" 
          :disabled="loading"
          class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {{ loading ? '处理中...' : (isRegister ? '注册' : '登录') }}
        </button>
      </div>
      
      <div v-if="!isRegister" class="mt-4 text-center">
        <button @click="emit('showVip')" :class="['text-sm text-orange-500 hover:text-orange-600']">
          开通会员享AI生成特权
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import request from '../utils/request'
import { ElMessage } from 'element-plus'

const props = defineProps({
  visible: Boolean,
  isRegister: Boolean,
  loading: Boolean,
  isDark: Boolean
})

const emit = defineEmits(['close', 'submit', 'toggle', 'success', 'showVip'])

const form = reactive({
  phone: '',
  code: '',
  password: ''
})

const countdown = ref(0)

const sendCode = async () => {
  if (!form.phone) {
    ElMessage.warning('请输入手机号')
    return
  }
  try {
    await request.post('/api/vip/verify-code', { phone: form.phone })
    ElMessage.success('验证码已发送')
    countdown.value = 60
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) clearInterval(timer)
    }, 1000)
  } catch (e) {
    ElMessage.error(e.message || '发送失败')
  }
}

const submit = async () => {
  if (!form.phone || !form.password) {
    ElMessage.warning('请填写完整信息')
    return
  }
  try {
    const url = props.isRegister ? '/api/vip/register' : '/api/vip/login'
    const res = await request.post(url, {
      phone: form.phone,
      password: form.password,
      code: form.code || '666666'
    })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    ElMessage.success(props.isRegister ? '注册成功' : '登录成功')
    emit('success', res.data.user)
    emit('close')
  } catch (e) {
    ElMessage.error(e.message || '操作失败')
  }
}
</script>
