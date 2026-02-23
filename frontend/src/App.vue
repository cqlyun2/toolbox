<template>
  <div :class="['min-h-screen transition-colors duration-300', isDark ? 'bg-gray-900' : 'bg-gray-50']">
    <header :class="['shadow-sm sticky top-0 z-50 transition-colors duration-300', isDark ? 'bg-gray-800' : 'bg-white']">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span :class="['text-xl font-bold', isDark ? 'text-white' : 'text-gray-800']">雲歌工具小站</span>
          </router-link>
          
          <div class="flex-1 max-w-xl mx-8 hidden md:block">
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="搜索工具..." 
                :class="['w-full px-4 py-2 pl-10 border rounded-full focus:outline-none transition-all',
                         isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' : 'bg-gray-100 border-transparent focus:bg-white focus:border-blue-500']"
              />
              <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <button 
              v-if="userInfo"
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all"
              :class="isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'"
            >
              <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {{ userInfo.username.charAt(0).toUpperCase() }}
              </div>
              <span :class="['hidden sm:inline', isDark ? 'text-white' : 'text-gray-700']">{{ userInfo.username }}</span>
            </button>
            <button 
              v-else
              @click="showLoginModal = true"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              登录
            </button>
            <button 
              @click="toggleDark"
              :class="['p-2 rounded-lg transition-all', isDark ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600']"
            >
              <svg v-if="isDark" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div class="mt-4 md:hidden">
          <div class="relative">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="搜索工具..." 
              :class="['w-full px-4 py-2 pl-10 border rounded-full focus:outline-none transition-all',
                       isDark ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400' : 'bg-gray-100 border-transparent focus:bg-white focus:border-blue-500']"
            />
            <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <router-view />
    </main>

    <footer :class="['border-t mt-auto py-6 transition-colors duration-300', isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200']">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
        <p>雲歌工具小站 - 提供便捷的在线工具服务</p>
        <p class="mt-2">
          <a href="https://beian.miit.gov.cn/" target="_blank" class="hover:text-blue-500">渝ICP备2026002583号-1</a>
        </p>
      </div>
    </footer>
    
    <div v-if="showUserMenu" @click="showUserMenu = false" class="fixed inset-0 z-50">
      <div @click.stop :class="['absolute right-4 top-16 w-48 rounded-lg shadow-lg py-2', isDark ? 'bg-gray-800' : 'bg-white']">
        <div class="px-4 py-2 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-100'">
          <p :class="['font-medium', isDark ? 'text-white' : 'text-gray-800']">{{ userInfo?.username }}</p>
        </div>
        <router-link to="/favorites" @click="showUserMenu = false" :class="['block px-4 py-2 hover:bg-gray-100', isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700']">
          ⭐ 我的收藏
        </router-link>
        <router-link to="/history" @click="showUserMenu = false" :class="['block px-4 py-2 hover:bg-gray-100', isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700']">
          🕐 最近使用
        </router-link>
        <router-link to="/feedback" @click="showUserMenu = false" :class="['block px-4 py-2 hover:bg-gray-100', isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700']">
          💬 意见反馈
        </router-link>
        <button @click="logout" class="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100" :class="isDark ? 'hover:bg-gray-700' : ''">
          退出登录
        </button>
      </div>
    </div>
    
    <div v-if="showLoginModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showLoginModal = false">
      <div :class="['rounded-lg p-6 w-full max-w-md', isDark ? 'bg-gray-800' : 'bg-white']">
        <div class="flex items-center justify-between mb-4">
          <h2 :class="['text-xl font-bold', isDark ? 'text-white' : 'text-gray-800']">{{ isRegister ? '注册' : '登录' }}</h2>
          <button @click="isRegister = !isRegister" :class="['text-sm', isDark ? 'text-blue-400' : 'text-blue-500']">
            {{ isRegister ? '已有账号？登录' : '没有账号？注册' }}
          </button>
        </div>
        <div class="space-y-4">
          <input 
            v-model="loginForm.username"
            type="text" 
            placeholder="用户名" 
            :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                     isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
          />
          <input 
            v-if="isRegister"
            v-model="loginForm.email"
            type="email" 
            placeholder="邮箱（可选）" 
            :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                     isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
          />
          <input 
            v-model="loginForm.password"
            type="password" 
            placeholder="密码" 
            :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                     isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
          />
          <input 
            v-if="isRegister"
            v-model="loginForm.confirmPassword"
            type="password" 
            placeholder="确认密码" 
            :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
                     isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
            @keyup.enter="handleAuth"
          />
          <button @click="handleAuth" :disabled="loading" class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400">
            {{ loading ? '处理中...' : (isRegister ? '注册' : '登录') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'
import axios from 'axios'

const searchQuery = ref('')
const isDark = ref(false)
const userInfo = ref(null)
const showLoginModal = ref(false)
const showUserMenu = ref(false)
const isRegister = ref(false)
const loading = ref(false)
const loginForm = ref({ username: '', password: '', email: '', confirmPassword: '' })

provide('searchQuery', searchQuery)
provide('isDark', isDark)
provide('user', userInfo)

onMounted(async () => {
  const savedDark = localStorage.getItem('darkMode')
  if (savedDark === 'true') {
    isDark.value = true
  }
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const res = await axios.get('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
      userInfo.value = res.data.user
    } catch {
      localStorage.removeItem('token')
    }
  }
})

const toggleDark = () => {
  isDark.value = !isDark.value
  localStorage.setItem('darkMode', isDark.value)
}

const handleAuth = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    alert('请填写用户名和密码')
    return
  }
  
  if (isRegister.value && loginForm.value.password !== loginForm.value.confirmPassword) {
    alert('两次密码输入不一致')
    return
  }
  
  loading.value = true
  try {
    const endpoint = isRegister.value ? '/api/auth/register' : '/api/auth/login'
    const data = isRegister.value 
      ? { username: loginForm.value.username, password: loginForm.value.password, email: loginForm.value.email }
      : { username: loginForm.value.username, password: loginForm.value.password }
    
    const res = await axios.post(endpoint, data)
    
    localStorage.setItem('token', res.data.token)
    userInfo.value = res.data.user
    showLoginModal.value = false
    loginForm.value = { username: '', password: '', email: '', confirmPassword: '' }
  } catch (error) {
    alert(error.response?.data?.error || '操作失败')
  } finally {
    loading.value = false
  }
}

const logout = () => {
  localStorage.removeItem('token')
  userInfo.value = null
  showUserMenu.value = false
}
</script>
