<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-800">工具箱</span>
          </router-link>
          
          <div class="flex-1 max-w-xl mx-8">
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="搜索工具..." 
                class="w-full px-4 py-2 pl-10 bg-gray-100 border border-transparent rounded-full focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
              />
              <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <router-view />
    </main>

    <footer class="bg-white border-t mt-auto py-6">
      <div class="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        <p>在线工具箱 - 提供便捷的在线工具服务</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'

const searchQuery = ref('')
provide('searchQuery', searchQuery)
</script>
