<template>
  <div v-if="visible" @click="emit('close')" class="fixed inset-0 z-50">
    <div @click.stop :class="['absolute right-4 top-16 w-56 rounded-lg shadow-lg py-2', darkMode ? 'bg-gray-800' : 'bg-white']">
      <div class="px-4 py-2 border-b" :class="darkMode ? 'border-gray-700' : 'border-gray-100'">
        <p :class="['font-medium', darkMode ? 'text-white' : 'text-gray-800']">{{ username }}</p>
      </div>
      <router-link 
        to="/favorites" 
        @click="emit('close')" 
        :class="['block px-4 py-2 hover:bg-gray-100', darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700']"
      >
        ⭐ 我的收藏
      </router-link>
      <router-link 
        to="/history" 
        @click="emit('close')" 
        :class="['block px-4 py-2 hover:bg-gray-100', darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700']"
      >
        🕐 最近使用
      </router-link>
      <button 
        @click="emit('showVip')" 
        class="block w-full text-left px-4 py-2 text-orange-500 hover:bg-gray-100" 
        :class="darkMode ? 'hover:bg-gray-700' : ''"
      >
        💎 开通会员
      </button>
      <router-link 
        to="/feedback" 
        @click="emit('close')" 
        :class="['block px-4 py-2 hover:bg-gray-100', darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700']"
      >
        💬 意见反馈
      </router-link>
      <button 
        @click="emit('logout')" 
        class="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100" 
        :class="darkMode ? 'hover:bg-gray-700' : ''"
      >
        退出登录
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  username: {
    type: String,
    default: ''
  },
  darkMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'logout', 'showVip'])
</script>
