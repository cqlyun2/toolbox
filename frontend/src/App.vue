<template>
  <div :class="['min-h-screen transition-colors duration-300', isDark ? 'bg-gray-900' : 'bg-gray-50']">
    <header :class="['shadow-sm sticky top-0 z-50 transition-colors duration-300', isDark ? 'bg-gray-800' : 'bg-white']">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center space-x-3 group">
            <div class="w-10 h-10 bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span :class="['text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent', isDark ? '' : '']">雲歌工具小站</span>
          </router-link>
          
          <div class="flex-1 max-w-xl mx-8 hidden md:block">
            <SearchBox v-model="searchInput" :dark-mode="isDark" />
          </div>
          
          <div class="flex items-center space-x-4">
            <router-link 
              v-if="userInfo?.vip"
              to="/vip"
              class="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-medium"
            >
              VIP
            </router-link>
            <button 
              v-if="userInfo"
              @click="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all"
              :class="isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'"
            >
              <div class="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {{ userInfo.phone?.charAt(-1) || 'U' }}
              </div>
              <span :class="['hidden sm:inline', isDark ? 'text-white' : 'text-gray-700']">{{ userInfo.phone }}</span>
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

        <!-- 板块导航 -->
        <div class="mt-4 flex space-x-2 overflow-x-auto pb-2">
          <router-link 
            to="/"
            :class="[
              'px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all shadow-sm',
              $route.path === '/' ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white' : (isDark ? 'bg-gray-700 text-gray-300 hover:from-gray-600 hover:to-gray-600' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200')
            ]"
          >
            🌐 Web小工具
          </router-link>
          <router-link 
            to="/yugong"
            :class="[
              'px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all shadow-sm',
              $route.path === '/yugong' ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white' : (isDark ? 'bg-gray-700 text-gray-300 hover:from-gray-600 hover:to-gray-600' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200')
            ]"
          >
            🏛️ 渝工小工具
          </router-link>
          <button 
            :class="[
              'px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-400 cursor-not-allowed border border-gray-200'
            ]"
            disabled
          >
            🛒 技能商店
          </button>
          <button 
            :class="[
              'px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-400 cursor-not-allowed border border-gray-200'
            ]"
            disabled
          >
            📥 工作流下载
          </button>
          <button 
            :class="[
              'px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
              isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-400 cursor-not-allowed border border-gray-200'
            ]"
            disabled
          >
            🤖 Agent
          </button>
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
      :username="userInfo?.phone"
      :dark-mode="isDark"
      @close="showUserMenu = false"
      @logout="logout"
      @showVip="showVipPage"
    />
    
    <LoginModal 
      :visible="showLoginModal"
      :is-register="isRegister"
      :loading="loading"
      :is-dark="isDark"
      @close="showLoginModal = false"
      @toggle="isRegister = !isRegister"
      @success="onLoginSuccess"
      @showVip="showVipPage"
    />
  </div>
</template>

<script setup>
import { ref, provide, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { debounce } from './utils'
import SearchBox from './components/SearchBox.vue'
import LoginModal from './components/LoginModal.vue'
import UserMenu from './components/UserMenu.vue'
import request from './utils/request'

const router = useRouter()
const $route = useRoute()
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
provide('showLogin', () => { showLoginModal.value = true })
provide('showVip', () => { router.push('/vip') })

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
      const res = await request.get('/api/vip/info')
      userInfo.value = res.data
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})

const toggleDark = () => {
  isDark.value = !isDark.value
  localStorage.setItem('darkMode', isDark.value)
}

const onLoginSuccess = (user) => {
  userInfo.value = user
  showLoginModal.value = false
}

const showVipPage = () => {
  showUserMenu.value = false
  router.push('/vip')
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  userInfo.value = null
  showUserMenu.value = false
  ElMessage.success('已退出登录')
}
</script>
