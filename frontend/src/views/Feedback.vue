<template>
  <div>
    <router-link to="/" :class="['hover:underline mb-4 inline-block', isDark ? 'text-blue-400' : 'text-blue-500']">
      ← 返回首页
    </router-link>
    
    <div :class="['rounded-2xl shadow-sm p-6 mt-4 transition-colors duration-300', isDark ? 'bg-gray-800' : 'bg-white']">
      <h1 :class="['text-2xl font-bold mb-6', isDark ? 'text-white' : 'text-gray-800']">💬 意见反馈</h1>
      
      <div class="space-y-4 max-w-2xl">
        <div>
          <label :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700']">反馈类型</label>
          <select v-model="form.type" :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']">
            <option value="bug">Bug 反馈</option>
            <option value="feature">功能建议</option>
            <option value="other">其他</option>
          </select>
        </div>
        
        <div>
          <label :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700']">详细描述</label>
          <textarea 
            v-model="form.content"
            rows="6"
            :class="['w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none', isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
            placeholder="请详细描述您遇到的问题或建议..."
          ></textarea>
        </div>
        
        <div>
          <label :class="['block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700']">联系方式（可选）</label>
          <input 
            v-model="form.contact"
            type="text"
            :class="['w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500', isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200']"
            placeholder="邮箱或微信"
          />
        </div>
        
        <button 
          @click="submit"
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
        >
          提交反馈
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'

const isDark = inject('isDark')

const form = ref({
  type: 'feature',
  content: '',
  contact: ''
})

const submit = () => {
  if (!form.value.content.trim()) {
    alert('请填写反馈内容')
    return
  }
  
  const feedback = {
    ...form.value,
    time: new Date().toISOString(),
    user: localStorage.getItem('user') || 'anonymous'
  }
  
  const feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]')
  feedbacks.push(feedback)
  localStorage.setItem('feedbacks', JSON.stringify(feedbacks))
  
  alert('感谢您的反馈！我们会认真处理。')
  form.value = { type: 'feature', content: '', contact: '' }
}
</script>
