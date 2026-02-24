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
            <SearchBox v-model="searchInput" :dark-mode="isDark" />
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
          <SearchBox v-model="searchInput" :dark-mode="isDark" />
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
    
    <UserMenu 
      :visible="showUserMenu" 
      :username="userInfo?.username"
      :dark-mode="isDark"
      @close="showUserMenu = false"
      @logout="logout"
    />
    
    <LoginModal 
      :visible="showLoginModal"
      :is-register="isRegister"
      :loading="loading"
      :dark-mode="isDark"
      @close="showLoginModal = false"
      @toggle="isRegister = !isRegister"
      @submit="handleAuth"
    />
  </div>
</template>

<script setup>
import { ref, provide, onMounted, watch } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { debounce } from './utils'
import SearchBox from './components/SearchBox.vue'
import LoginModal from './components/LoginModal.vue'
import UserMenu from './components/UserMenu.vue'

const searchInput = ref('')
const searchQuery = ref('')
const isDark = ref(false)
const userInfo = ref(null)
const showLoginModal = ref(false)
const showUserMenu = ref(false)
const isRegister = ref(false)
const loading = ref(false)

provide('searchQuery', searchQuery)
provide('isDark', isDark)
provide('user', userInfo)

const debouncedSearch = debounce((value) => {
  searchQuery.value = value
}, 300)

watch(searchInput, (newVal) => {
  debouncedSearch(newVal)
})

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

const handleAuth = async (form) => {
  if (!form.username || !form.password) {
    ElMessage.warning('请填写用户名和密码')
    return
  }
  
  if (isRegister.value && form.password !== form.confirmPassword) {
    ElMessage.warning('两次密码输入不一致')
    return
  }
  
  loading.value = true
  try {
    const endpoint = isRegister.value ? '/api/auth/register' : '/api/auth/login'
    const data = isRegister.value 
      ? { username: form.username, password: form.password, email: form.email }
      : { username: form.username, password: form.password }
    
    const res = await axios.post(endpoint, data)
    
    localStorage.setItem('token', res.data.token)
    userInfo.value = res.data.user
    showLoginModal.value = false
    ElMessage.success(isRegister.value ? '注册成功' : '登录成功')
  } catch (error) {
    ElMessage.error(error.response?.data?.error || '操作失败')
  } finally {
    loading.value = false
  }
}

const logout = () => {
  localStorage.removeItem('token')
  userInfo.value = null
  showUserMenu.value = false
  ElMessage.success('已退出登录')
}
</script>
