<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
      <textarea 
        v-model="text"
        class="w-full h-40 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        placeholder="请输入要统计的文本..."
      ></textarea>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-blue-50 rounded-lg p-4 text-center">
        <div class="text-3xl font-bold text-blue-600">{{ stats.chars }}</div>
        <div class="text-sm text-gray-500 mt-1">字符数</div>
      </div>
      <div class="bg-green-50 rounded-lg p-4 text-center">
        <div class="text-3xl font-bold text-green-600">{{ stats.charsNoSpace }}</div>
        <div class="text-sm text-gray-500 mt-1">字符(不含空格)</div>
      </div>
      <div class="bg-purple-50 rounded-lg p-4 text-center">
        <div class="text-3xl font-bold text-purple-600">{{ stats.chinese }}</div>
        <div class="text-sm text-gray-500 mt-1">中文字数</div>
      </div>
      <div class="bg-orange-50 rounded-lg p-4 text-center">
        <div class="text-3xl font-bold text-orange-600">{{ stats.lines }}</div>
        <div class="text-sm text-gray-500 mt-1">行数</div>
      </div>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-pink-50 rounded-lg p-4 text-center">
        <div class="text-3xl font-bold text-pink-600">{{ stats.paragraphs }}</div>
        <div class="text-sm text-gray-500 mt-1">段落数</div>
      </div>
      <div class="bg-indigo-50 rounded-lg p-4 text-center">
        <div class="text-3xl font-bold text-indigo-600">{{ stats.words }}</div>
        <div class="text-sm text-gray-500 mt-1">英文单词</div>
      </div>
      <div class="bg-cyan-50 rounded-lg p-4 text-center">
        <div class="text-3xl font-bold text-cyan-600">{{ stats.numbers }}</div>
        <div class="text-sm text-gray-500 mt-1">数字组</div>
      </div>
      <div class="bg-yellow-50 rounded-lg p-4 text-center">
        <div class="text-3xl font-bold text-yellow-600">{{ stats.punctuation }}</div>
        <div class="text-sm text-gray-500 mt-1">标点符号</div>
      </div>
    </div>
    
    <div class="flex justify-end space-x-2">
      <button @click="clearText" class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all">
        清空
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const text = ref('')

const stats = computed(() => {
  const t = text.value
  
  const chinese = (t.match(/[\u4e00-\u9fa5]/g) || []).length
  
  const paragraphs = t.split(/\n\s*\n/).filter(p => p.trim()).length
  
  return {
    chars: t.length,
    charsNoSpace: t.replace(/\s/g, '').length,
    chinese,
    words: t.trim() ? t.trim().split(/\s+/).filter(w => /[a-zA-Z]/.test(w)).length : 0,
    lines: t ? t.split('\n').length : 0,
    paragraphs: t.trim() ? paragraphs : 0,
    numbers: (t.match(/\d+/g) || []).length,
    punctuation: (t.match(/[，。！？、；：""''（）【】《》,.!?;:'"()\[\]{}]/g) || []).length
  }
})

const clearText = () => {
  text.value = ''
}
</script>
