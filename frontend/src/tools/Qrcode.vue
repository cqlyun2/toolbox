<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">内容类型</label>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="type in contentTypes" 
          :key="type.value"
          @click="changeType(type.value)"
          :class="['px-4 py-2 rounded-lg text-sm transition-all',
                   contentType === type.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
        >
          {{ type.icon }} {{ type.label }}
        </button>
      </div>
    </div>
    
    <div v-if="contentType === 'url'" class="space-y-3">
      <label class="block text-sm font-medium text-gray-700">网址链接</label>
      <input 
        v-model="urlInput"
        type="url"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="https://example.com"
      />
    </div>
    
    <div v-else-if="contentType === 'text'" class="space-y-3">
      <label class="block text-sm font-medium text-gray-700">文本内容</label>
      <textarea 
        v-model="textInput"
        rows="3"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="输入要显示的文本内容"
      ></textarea>
      <p class="text-xs text-gray-400">提示：纯文本二维码部分扫码软件可能不支持，建议使用网址类型</p>
    </div>
    
    <div v-else-if="contentType === 'tel'" class="space-y-3">
      <label class="block text-sm font-medium text-gray-700">电话号码</label>
      <input 
        v-model="telInput"
        type="tel"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        placeholder="13800138000"
      />
    </div>
    
    <div v-else-if="contentType === 'sms'" class="space-y-3 grid md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">电话号码</label>
        <input 
          v-model="smsTel"
          type="tel"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="13800138000"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">短信内容</label>
        <input 
          v-model="smsContent"
          type="text"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="输入短信内容"
        />
      </div>
    </div>
    
    <div v-else-if="contentType === 'wifi'" class="space-y-3 grid md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">WiFi名称 (SSID)</label>
        <input 
          v-model="wifiSsid"
          type="text"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="WiFi名称"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">密码</label>
        <input 
          v-model="wifiPassword"
          type="text"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="WiFi密码"
        />
      </div>
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700">加密方式</label>
        <select v-model="wifiEncryption" class="w-full px-4 py-3 border border-gray-200 rounded-lg">
          <option value="WPA">WPA/WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">无密码</option>
        </select>
      </div>
    </div>
    
    <div v-else-if="contentType === 'contact'" class="space-y-3 grid md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">姓名</label>
        <input v-model="contactName" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-lg" placeholder="张三" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">电话</label>
        <input v-model="contactTel" type="tel" class="w-full px-4 py-3 border border-gray-200 rounded-lg" placeholder="13800138000" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">邮箱</label>
        <input v-model="contactEmail" type="email" class="w-full px-4 py-3 border border-gray-200 rounded-lg" placeholder="email@example.com" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">公司</label>
        <input v-model="contactOrg" type="text" class="w-full px-4 py-3 border border-gray-200 rounded-lg" placeholder="公司名称" />
      </div>
    </div>
    
    <div class="flex items-center space-x-4">
      <div class="flex-1">
        <label class="block text-sm font-medium text-gray-700 mb-2">尺寸: {{ size }}px</label>
        <input v-model="size" type="range" min="100" max="400" class="w-full" />
      </div>
      <div class="flex items-center space-x-2">
        <input v-model="darkColor" type="color" class="w-8 h-8 rounded cursor-pointer" />
        <span class="text-sm text-gray-600">前景</span>
      </div>
      <div class="flex items-center space-x-2">
        <input v-model="lightColor" type="color" value="#ffffff" class="w-8 h-8 rounded cursor-pointer" />
        <span class="text-sm text-gray-600">背景</span>
      </div>
    </div>
    
    <div class="bg-white border border-gray-200 rounded-lg p-6 text-center">
      <canvas ref="canvasRef" class="mx-auto" :style="{ width: size + 'px', height: size + 'px' }"></canvas>
    </div>
    
    <div class="flex flex-wrap gap-2 justify-center">
      <button 
        @click="download('png')"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
      >
        下载 PNG
      </button>
      <button 
        @click="download('svg')"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
      >
        下载 SVG
      </button>
      <button 
        @click="copyImage"
        class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
      >
        复制图片
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import QRCode from 'qrcode'

const contentTypes = [
  { value: 'url', label: '网址', icon: '🔗' },
  { value: 'tel', label: '电话', icon: '📞' },
  { value: 'wifi', label: 'WiFi', icon: '📶' },
  { value: 'contact', label: '名片', icon: '👤' },
  { value: 'sms', label: '短信', icon: '💬' },
  { value: 'text', label: '文本', icon: '📝' }
]

const contentType = ref('url')
const size = ref(200)
const darkColor = ref('#000000')
const lightColor = ref('#ffffff')
const canvasRef = ref(null)

const urlInput = ref('https://www.baidu.com')
const textInput = ref('')
const telInput = ref('')
const smsTel = ref('')
const smsContent = ref('')
const wifiSsid = ref('')
const wifiPassword = ref('')
const wifiEncryption = ref('WPA')
const contactName = ref('')
const contactTel = ref('')
const contactEmail = ref('')
const contactOrg = ref('')

const qrContent = computed(() => {
  switch (contentType.value) {
    case 'url':
      if (!urlInput.value) return ''
      const url = urlInput.value
      return url.startsWith('http') ? url : 'https://' + url
    case 'tel':
      if (!telInput.value) return ''
      return `tel:${telInput.value}`
    case 'sms':
      if (!smsTel.value) return ''
      return `smsto:${smsTel.value}:${smsContent.value}`
    case 'wifi':
      if (!wifiSsid.value) return ''
      return `WIFI:T:${wifiEncryption.value};S:${wifiSsid.value};P:${wifiPassword.value};;`
    case 'contact':
      if (!contactName.value) return ''
      return `BEGIN:VCARD\nVERSION:3.0\nN:${contactName.value}\nFN:${contactName.value}\nTEL:${contactTel.value}\nEMAIL:${contactEmail.value}\nORG:${contactOrg.value}\nEND:VCARD`
    case 'text':
      return textInput.value
    default:
      return ''
  }
})

const changeType = (type) => {
  contentType.value = type
}

const generate = async () => {
  if (!canvasRef.value) return
  
  if (!qrContent.value) {
    const ctx = canvasRef.value.getContext('2d')
    canvasRef.value.width = size.value
    canvasRef.value.height = size.value
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(0, 0, size.value, size.value)
    ctx.fillStyle = '#9ca3af'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('请输入内容', size.value / 2, size.value / 2)
    return
  }
  
  try {
    await QRCode.toCanvas(canvasRef.value, qrContent.value, {
      width: size.value,
      margin: 2,
      color: {
        dark: darkColor.value,
        light: lightColor.value
      }
    })
  } catch (error) {
    console.error('生成二维码失败:', error)
  }
}

const download = (format) => {
  if (!qrContent.value) return
  
  if (format === 'svg') {
    QRCode.toString(qrContent.value, {
      type: 'svg',
      width: size.value,
      margin: 2,
      color: {
        dark: darkColor.value,
        light: lightColor.value
      }
    }, (err, svg) => {
      if (err) return
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'qrcode.svg'
      a.click()
      URL.revokeObjectURL(url)
    })
  } else {
    const a = document.createElement('a')
    a.href = canvasRef.value.toDataURL('image/png')
    a.download = 'qrcode.png'
    a.click()
  }
}

const copyImage = async () => {
  if (!canvasRef.value || !qrContent.value) return
  
  try {
    const blob = await new Promise(resolve => canvasRef.value.toBlob(resolve))
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
    alert('已复制到剪贴板')
  } catch (error) {
    alert('复制失败，请尝试下载图片')
  }
}

watch([qrContent, size, darkColor, lightColor], generate)
onMounted(generate)
</script>
