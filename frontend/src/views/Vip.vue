<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-center mb-2" :class="isDark ? 'text-white' : 'text-gray-800'">开通会员</h1>
      <p class="text-center text-gray-500 mb-8">畅享 AI 生成特权</p>
      
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div 
          v-for="vip in vipList" 
          :key="vip.type"
          @click="selectVip(vip)"
          :class="[
            'p-6 rounded-xl border-2 cursor-pointer transition-all',
            selected?.type === vip.type 
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
              : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
          ]"
        >
          <h3 class="text-lg font-bold mb-1" :class="isDark ? 'text-white' : 'text-gray-800'">{{ vip.name }}</h3>
          <p class="text-gray-500 text-sm mb-2">{{ vip.desc }}</p>
          <p class="text-3xl font-bold text-orange-500">¥{{ vip.price }}</p>
        </div>
      </div>

      <div v-if="user" class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6">
        <h3 class="font-bold mb-4" :class="isDark ? 'text-white' : 'text-gray-800'">当前状态</h3>
        <div class="flex items-center justify-between">
          <div>
            <p :class="isDark ? 'text-gray-300' : 'text-gray-600'">
              会员状态：<span :class="user.vip ? 'text-orange-500 font-bold' : 'text-gray-500'">{{ user.vip ? 'VIP会员' : '普通用户' }}</span>
            </p>
            <p v-if="user.vip" class="text-sm text-gray-500">到期时间：{{ new Date(user.vipExpire).toLocaleDateString() }}</p>
          </div>
          <button 
            @click="buyVip" 
            :disabled="!selected || buying"
            class="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:bg-gray-400"
          >
            {{ buying ? '处理中...' : '立即开通' }}
          </button>
        </div>
      </div>

      <div v-else class="text-center">
        <button @click="showLogin" class="px-6 py-2 bg-blue-500 text-white rounded-lg">请先登录</button>
      </div>

      <div class="mt-8">
        <h3 class="font-bold mb-4 text-gray-800 dark:text-white">会员特权</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <span class="text-2xl">🤖</span>
            <div>
              <p class="font-medium text-gray-800 dark:text-white">AI 智能生成</p>
              <p class="text-sm text-gray-500">基于大模型智能生成内容</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <span class="text-2xl">⚡</span>
            <div>
              <p class="font-medium text-gray-800 dark:text-white">极速响应</p>
              <p class="text-sm text-gray-500">VIP 专属通道</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <span class="text-2xl">📝</span>
            <div>
              <p class="font-medium" :class="isDark ? 'text-white' : 'text-gray-800'">无限次生成</p>
              <p class="text-sm text-gray-500">会员期间无限使用</p>
            </div>
          </div>
          <div class="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <span class="text-2xl">🎁</span>
            <div>
              <p class="font-medium" :class="isDark ? 'text-white' : 'text-gray-800'">新用户优惠</p>
              <p class="text-sm text-gray-500">注册即送 3 次免费</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '../utils/request'

const router = useRouter()
const isDark = inject('isDark')
const user = inject('user')
const showLogin = inject('showLogin')

const vipList = [
  { type: 'month', name: '月度会员', desc: '30天', price: 99 },
  { type: 'quarter', name: '季度会员', desc: '90天', price: 199 },
  { type: 'year', name: '年度会员', desc: '365天', price: 999 }
]

const selected = ref(vipList[0])
const buying = ref(false)

const selectVip = (vip) => {
  selected.value = vip
}

const buyVip = async () => {
  if (!user.value) {
    showLogin()
    return
  }
  
  buying.value = true
  try {
    const res = await request.post('/api/vip/buy', { type: selected.value.type })
    user.value = { ...user.value, ...res.data }
    ElMessage.success('开通成功！')
  } catch (e) {
    ElMessage.error(e.response?.data?.error || '开通失败')
  } finally {
    buying.value = false
  }
}
</script>
