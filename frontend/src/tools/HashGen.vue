<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">输入文本</label>
      <textarea 
        v-model="input"
        rows="4"
        class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
        placeholder="输入要计算哈希值的文本..."
      ></textarea>
    </div>
    
    <div class="space-y-4">
      <h3 class="text-sm font-medium text-gray-700">哈希结果</h3>
      
      <div class="space-y-3">
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-medium text-gray-600">MD5</span>
            <button 
              @click="copyHash(hashes.md5)"
              class="text-blue-500 hover:text-blue-600 text-sm"
            >
              复制
            </button>
          </div>
          <code class="text-xs break-all text-gray-800">{{ hashes.md5 || '-' }}</code>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-medium text-gray-600">SHA-1</span>
            <button 
              @click="copyHash(hashes.sha1)"
              class="text-blue-500 hover:text-blue-600 text-sm"
            >
              复制
            </button>
          </div>
          <code class="text-xs break-all text-gray-800">{{ hashes.sha1 || '-' }}</code>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-medium text-gray-600">SHA-256</span>
            <button 
              @click="copyHash(hashes.sha256)"
              class="text-blue-500 hover:text-blue-600 text-sm"
            >
              复制
            </button>
          </div>
          <code class="text-xs break-all text-gray-800">{{ hashes.sha256 || '-' }}</code>
        </div>
        
        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-medium text-gray-600">SHA-512</span>
            <button 
              @click="copyHash(hashes.sha512)"
              class="text-blue-500 hover:text-blue-600 text-sm"
            >
              复制
            </button>
          </div>
          <code class="text-xs break-all text-gray-800">{{ hashes.sha512 || '-' }}</code>
        </div>
      </div>
    </div>
    
    <div class="flex space-x-2">
      <button 
        @click="clearInput"
        class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
      >
        清空
      </button>
      <button 
        @click="copyAllHashes"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
      >
        复制全部
      </button>
    </div>
    
    <div class="border-t pt-4">
      <h3 class="text-sm font-medium text-gray-700 mb-2">关于哈希算法</h3>
      <div class="text-sm text-gray-500 space-y-1">
        <p><strong>MD5:</strong> 128位，常用于校验文件完整性，不推荐用于安全场景</p>
        <p><strong>SHA-1:</strong> 160位，已被认为不够安全</p>
        <p><strong>SHA-256:</strong> 256位，广泛用于安全场景</p>
        <p><strong>SHA-512:</strong> 512位，更安全的哈希算法</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
const input = ref('')
const hashes = ref({
  md5: '',
  sha1: '',
  sha256: '',
  sha512: ''
})

const md5 = (string) => {
  function md5cycle(x, k) {
    let a = x[0], b = x[1], c = x[2], d = x[3]
    a = ff(a, b, c, d, k[0], 7, -680876936)
    d = ff(d, a, b, c, k[1], 12, -389564586)
    c = ff(c, d, a, b, k[2], 17, 606105819)
    b = ff(b, c, d, a, k[3], 22, -1044525330)
    a = ff(a, b, c, d, k[4], 7, -176418897)
    d = ff(d, a, b, c, k[5], 12, 1200080426)
    c = ff(c, d, a, b, k[6], 17, -1473231341)
    b = ff(b, c, d, a, k[7], 22, -45705983)
    a = ff(a, b, c, d, k[8], 7, 1770035416)
    d = ff(d, a, b, c, k[9], 12, -1958414417)
    c = ff(c, d, a, b, k[10], 17, -42063)
    b = ff(b, c, d, a, k[11], 22, -1990404162)
    a = ff(a, b, c, d, k[12], 7, 1804603682)
    d = ff(d, a, b, c, k[13], 12, -40341101)
    c = ff(c, d, a, b, k[14], 17, -1502002290)
    b = ff(b, c, d, a, k[15], 22, 1236535329)
    a = gg(a, b, c, d, k[1], 5, -165796510)
    d = gg(d, a, b, c, k[6], 9, -1069501632)
    c = gg(c, d, a, b, k[11], 14, 643717713)
    b = gg(b, c, d, a, k[0], 20, -373897302)
    a = gg(a, b, c, d, k[5], 5, -701558691)
    d = gg(d, a, b, c, k[10], 9, 38016083)
    c = gg(c, d, a, b, k[15], 14, -660478335)
    b = gg(b, c, d, a, k[4], 20, -405537848)
    a = gg(a, b, c, d, k[9], 5, 568446438)
    d = gg(d, a, b, c, k[14], 9, -1019803690)
    c = gg(c, d, a, b, k[3], 14, -187363961)
    b = gg(b, c, d, a, k[8], 20, 1163531501)
    a = gg(a, b, c, d, k[13], 5, -1444681467)
    d = gg(d, a, b, c, k[2], 9, -51403784)
    c = gg(c, d, a, b, k[7], 14, 1735328473)
    b = gg(b, c, d, a, k[12], 20, -1926607734)
    a = hh(a, b, c, d, k[5], 4, -378558)
    d = hh(d, a, b, c, k[8], 11, -2022574463)
    c = hh(c, d, a, b, k[11], 16, 1839030562)
    b = hh(b, c, d, a, k[14], 23, -35309556)
    a = hh(a, b, c, d, k[1], 4, -1530992060)
    d = hh(d, a, b, c, k[4], 11, 1272893353)
    c = hh(c, d, a, b, k[7], 16, -155497632)
    b = hh(b, c, d, a, k[10], 23, -1094730640)
    a = hh(a, b, c, d, k[13], 4, 681279174)
    d = hh(d, a, b, c, k[0], 11, -358537222)
    c = hh(c, d, a, b, k[3], 16, -722521979)
    b = hh(b, c, d, a, k[6], 23, 76029189)
    a = hh(a, b, c, d, k[9], 4, -640364487)
    d = hh(d, a, b, c, k[12], 11, -421815835)
    c = hh(c, d, a, b, k[15], 16, 530742520)
    b = hh(b, c, d, a, k[2], 23, -995338651)
    a = ii(a, b, c, d, k[0], 6, -198630844)
    d = ii(d, a, b, c, k[7], 10, 1126891415)
    c = ii(c, d, a, b, k[14], 15, -1416354905)
    b = ii(b, c, d, a, k[5], 21, -57434055)
    a = ii(a, b, c, d, k[12], 6, 1700485571)
    d = ii(d, a, b, c, k[3], 10, -1894986606)
    c = ii(c, d, a, b, k[10], 15, -1051523)
    b = ii(b, c, d, a, k[1], 21, -2054922799)
    a = ii(a, b, c, d, k[8], 6, 1873313359)
    d = ii(d, a, b, c, k[15], 10, -30611744)
    c = ii(c, d, a, b, k[6], 15, -1560198380)
    b = ii(b, c, d, a, k[13], 21, 1309151649)
    a = ii(a, b, c, d, k[4], 6, -145523070)
    d = ii(d, a, b, c, k[11], 10, -1120210379)
    c = ii(c, d, a, b, k[2], 15, 718787259)
    b = ii(b, c, d, a, k[9], 21, -343485551)
    x[0] = add32(a, x[0])
    x[1] = add32(b, x[1])
    x[2] = add32(c, x[2])
    x[3] = add32(d, x[3])
  }
  function cmn(q, a, b, x, s, t) { a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b) }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t) }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t) }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t) }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t) }
  function md5blk(s) {
    const md5blks = []
    for (let i = 0; i < 64; i += 4) { md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24) }
    return md5blks
  }
  function md5blk_array(a) {
    const md5blks = []
    for (let i = 0; i < 64; i += 4) { md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24) }
    return md5blks
  }
  function rhex(n) {
    let s = ''
    for (let j = 0; j < 4; j++) s += ('0' + ((n >> (j * 8 + 4)) & 0x0F).toString(16) + (n >> (j * 8) & 0x0F).toString(16))
    return s
  }
  function hex(x) { for (let i = 0; i < x.length; i++) x[i] = rhex(x[i]); return x.join('') }
  function add32(a, b) { return (a + b) & 0xFFFFFFFF }
  function md5_1(s) {
    let n = s.length
    const state = [1732584193, -271733879, -1732584194, 271733878]
    let i
    for (i = 64; i <= s.length; i += 64) { md5cycle(state, md5blk(s.substring(i - 64, i))) }
    s = s.substring(i - 64)
    const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3)
    tail[i >> 2] |= 0x80 << ((i % 4) << 3)
    if (i > 55) { md5cycle(state, tail); for (i = 0; i < 16; i++) tail[i] = 0 }
    tail[14] = n * 8
    md5cycle(state, tail)
    return state
  }
  return hex(md5_1(string))
}

const calculateHashes = async () => {
  if (!input.value) {
    hashes.value = { md5: '', sha1: '', sha256: '', sha512: '' }
    return
  }
  
  const encoder = new TextEncoder()
  const data = encoder.encode(input.value)
  
  hashes.value.md5 = md5(input.value)
  hashes.value.sha1 = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-1', data))).map(b => b.toString(16).padStart(2, '0')).join('')
  hashes.value.sha256 = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data))).map(b => b.toString(16).padStart(2, '0')).join('')
  hashes.value.sha512 = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-512', data))).map(b => b.toString(16).padStart(2, '0')).join('')
}

watch(input, calculateHashes)

const copyHash = async (hash) => {
  if (hash) {
    await navigator.clipboard.writeText(hash)
    ElMessage.success('已复制哈希值')
  }
}

const copyAllHashes = async () => {
  const text = `MD5: ${hashes.value.md5}\nSHA-1: ${hashes.value.sha1}\nSHA-256: ${hashes.value.sha256}\nSHA-512: ${hashes.value.sha512}`
  await navigator.clipboard.writeText(text)
  ElMessage.success('已复制全部哈希值')
}

const clearInput = () => {
  input.value = ''
}
