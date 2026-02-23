<template>
  <div class="space-y-6">
    <div class="grid md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">原始提示词</label>
          <textarea 
            v-model="originalPrompt"
            rows="6"
            class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="输入你的原始提示词..."
          ></textarea>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">优化目标</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="goal in goals"
              :key="goal.value"
              @click="toggleGoal(goal.value)"
              :class="['px-3 py-1 rounded-full text-sm transition-all',
                       selectedGoals.includes(goal.value) ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600']"
            >
              {{ goal.label }}
            </button>
          </div>
        </div>
        
        <button 
          @click="optimize"
          class="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-all font-medium"
        >
          ✨ 优化提示词
        </button>
      </div>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <label class="block text-sm font-medium text-gray-700">优化结果</label>
          <button 
            @click="copyResult"
            class="text-sm text-blue-500 hover:text-blue-600"
          >
            复制
          </button>
        </div>
        <div class="bg-gray-50 border rounded-lg p-4 min-h-[200px] whitespace-pre-wrap text-sm">
          {{ optimizedPrompt || '优化结果将显示在这里...' }}
        </div>
        
        <div v-if="suggestions.length > 0" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">改进建议</label>
          <ul class="text-sm text-gray-600 space-y-1">
            <li v-for="(suggestion, index) in suggestions" :key="index" class="flex items-start space-x-2">
              <span class="text-green-500">✓</span>
              <span>{{ suggestion }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="border-t pt-6">
      <h3 class="text-sm font-medium text-gray-700 mb-3">提示词编写技巧</h3>
      <div class="grid md:grid-cols-3 gap-4 text-sm">
        <div class="bg-blue-50 rounded-lg p-4">
          <h4 class="font-medium text-blue-700 mb-2">🎯 明确角色</h4>
          <p class="text-gray-600">指定AI扮演的角色，如"你是一个专业的..."</p>
        </div>
        <div class="bg-green-50 rounded-lg p-4">
          <h4 class="font-medium text-green-700 mb-2">📋 结构清晰</h4>
          <p class="text-gray-600">使用分点、分段，让提示词更易理解</p>
        </div>
        <div class="bg-purple-50 rounded-lg p-4">
          <h4 class="font-medium text-purple-700 mb-2">💡 给出示例</h4>
          <p class="text-gray-600">提供示例输出，帮助AI理解期望格式</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const originalPrompt = ref('')
const optimizedPrompt = ref('')
const selectedGoals = ref(['clarity'])
const suggestions = ref([])

const goals = [
  { value: 'clarity', label: '更清晰' },
  { value: 'structure', label: '结构化' },
  { value: 'detail', label: '更详细' },
  { value: 'role', label: '添加角色' },
  { value: 'example', label: '添加示例' },
  { value: 'constraint', label: '添加约束' }
]

const toggleGoal = (goal) => {
  const index = selectedGoals.value.indexOf(goal)
  if (index > -1) {
    selectedGoals.value.splice(index, 1)
  } else {
    selectedGoals.value.push(goal)
  }
}

const optimize = () => {
  if (!originalPrompt.value.trim()) {
    alert('请输入原始提示词')
    return
  }
  
  suggestions.value = []
  let result = originalPrompt.value
  
  if (selectedGoals.value.includes('role')) {
    if (!result.toLowerCase().includes('你是') && !result.toLowerCase().includes('you are')) {
      result = '你是一个专业的助手。\n\n' + result
      suggestions.value.push('添加了角色设定，让AI更好理解任务背景')
    }
  }
  
  if (selectedGoals.value.includes('structure')) {
    if (!result.includes('\n1') && !result.includes('\n-') && !result.includes('\n•')) {
      const lines = result.split(/[。！？.!?]/).filter(l => l.trim())
      if (lines.length > 1) {
        result = lines.map((line, i) => `${i + 1}. ${line.trim()}`).join('\n')
        suggestions.value.push('将内容结构化为分点形式')
      }
    }
  }
  
  if (selectedGoals.value.includes('detail')) {
    if (result.length < 50) {
      result += '\n\n请详细说明你的回答，包括：\n- 具体步骤\n- 注意事项\n- 可能的变体'
      suggestions.value.push('添加了详细输出的引导')
    }
  }
  
  if (selectedGoals.value.includes('clarity')) {
    result = result.replace(/请/g, '请务必').replace(/要/g, '需要')
    if (!result.includes('输出格式') && !result.includes('格式要求')) {
      result += '\n\n输出格式要求：请用清晰的段落组织回答。'
      suggestions.value.push('添加了输出格式要求')
    }
  }
  
  if (selectedGoals.value.includes('example')) {
    if (!result.includes('示例') && !result.includes('例子') && !result.includes('例如')) {
      result += '\n\n示例输出：\n[这里是一个期望输出的示例格式]'
      suggestions.value.push('添加了示例输出模板')
    }
  }
  
  if (selectedGoals.value.includes('constraint')) {
    if (!result.includes('不要') && !result.includes('避免') && !result.includes('限制')) {
      result += '\n\n注意：\n- 不要输出无关内容\n- 保持回答简洁准确'
      suggestions.value.push('添加了约束条件')
    }
  }
  
  optimizedPrompt.value = result
  
  if (suggestions.value.length === 0) {
    suggestions.value.push('原始提示词已经比较完善，建议根据需要微调')
  }
}

const copyResult = async () => {
  if (optimizedPrompt.value) {
    await navigator.clipboard.writeText(optimizedPrompt.value)
    alert('已复制到剪贴板')
  }
}
</script>
