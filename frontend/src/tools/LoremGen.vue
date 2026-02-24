<template>
  <div class="space-y-6">
    <div class="grid md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">生成类型</label>
        <select v-model="type" class="w-full px-4 py-3 border border-gray-200 rounded-lg">
          <option value="paragraphs">段落</option>
          <option value="sentences">句子</option>
          <option value="words">单词</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">数量: {{ count }}</label>
        <input v-model="count" type="range" min="1" max="20" class="w-full" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">语言</label>
        <select v-model="language" class="w-full px-4 py-3 border border-gray-200 rounded-lg">
          <option value="chinese">中文</option>
          <option value="english">英文</option>
        </select>
      </div>
    </div>
    
    <div class="flex items-center space-x-4">
      <label class="flex items-center space-x-2 cursor-pointer">
        <input v-model="startWithClassic" type="checkbox" class="rounded text-blue-500" />
        <span class="text-sm">以经典开头开始</span>
      </label>
    </div>
    
    <button 
      @click="generate"
      class="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium"
    >
      生成文本
    </button>
    
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-gray-700">生成结果</label>
        <button 
          @click="copyResult"
          class="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-all"
        >
          复制
        </button>
      </div>
      <textarea 
        v-model="result"
        readonly
        class="w-full h-64 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 resize-none"
      ></textarea>
      <div class="text-sm text-gray-500 mt-2">
        共 {{ result.length }} 字符，{{ result.split(/\s+/).filter(w => w).length }} 个词
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
const type = ref('paragraphs')
const count = ref(3)
const language = ref('chinese')
const startWithClassic = ref(true)
const result = ref('')

const chineseWords = [
  '的', '了', '和', '是', '就', '都', '而', '及', '与', '着',
  '或', '一个', '没有', '我们', '你们', '他们', '它们', '这个', '那个', '这些',
  '那些', '自己', '什么', '怎么', '这个', '那个', '因为', '所以', '但是', '然后',
  '如果', '虽然', '可以', '这样', '那样', '这里', '那里', '现在', '已经', '正在',
  '将要', '应该', '可能', '必须', '需要', '能够', '已经', '一直', '还是', '或者',
  '就是', '只有', '还有', '也是', '不是', '都是', '总是', '从不', '常常', '有时',
  '生活', '工作', '学习', '时间', '时候', '地方', '东西', '事情', '人们', '朋友',
  '家人', '国家', '社会', '发展', '问题', '方法', '重要', '不同', '非常', '很多',
  '一些', '这样', '那样', '如何', '为什么', '哪里', '什么时候', '谁', '多少'
]

const englishWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde',
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque',
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo',
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta',
  'explicabo', 'nemo', 'ipsam', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit'
]

const classicStart = {
  chinese: '这是一个测试文本，用于展示中文排版效果。在实际项目中，您可以用真实的中文内容替换这段文字。',
  english: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
}

const generateSentence = () => {
  const words = language.value === 'chinese' ? chineseWords : englishWords
  const length = Math.floor(Math.random() * 10) + 8
  let sentence = []
  for (let i = 0; i < length; i++) {
    sentence.push(words[Math.floor(Math.random() * words.length)])
  }
  if (language.value === 'chinese') {
    return sentence.join('') + '。'
  }
  return sentence.join(' ') + '.'
}

const generateParagraph = () => {
  const sentenceCount = Math.floor(Math.random() * 4) + 4
  let sentences = []
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence())
  }
  return sentences.join(' ')
}

const generate = () => {
  let parts = []
  
  if (type.value === 'paragraphs') {
    for (let i = 0; i < count.value; i++) {
      if (i === 0 && startWithClassic.value) {
        parts.push(classicStart[language.value])
      } else {
        parts.push(generateParagraph())
      }
    }
    result.value = parts.join('\n\n')
  } else if (type.value === 'sentences') {
    for (let i = 0; i < count.value; i++) {
      if (i === 0 && startWithClassic.value) {
        parts.push(classicStart[language.value])
      } else {
        parts.push(generateSentence())
      }
    }
    result.value = parts.join(' ')
  } else {
    const words = language.value === 'chinese' ? chineseWords : englishWords
    for (let i = 0; i < count.value; i++) {
      parts.push(words[Math.floor(Math.random() * words.length)])
    }
    result.value = parts.join(language.value === 'chinese' ? '' : ' ')
  }
}

const copyResult = async () => {
  if (result.value) {
    await navigator.clipboard.writeText(result.value)
    ElMessage.success('已复制到剪贴板')
  }
}
</script>
