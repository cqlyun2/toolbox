import express from 'express'
import multer from 'multer'
import { PDFDocument } from 'pdf-lib'
import mammoth from 'mammoth'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'))
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }
})

router.post('/word-to-pdf', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传文档' })
    }

    const result = await mammoth.extractRawText({ path: req.file.path })
    
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89])
    
    const font = await pdfDoc.embedFont('Helvetica')
    page.drawText(result.value, {
      x: 50,
      y: 750,
      size: 12,
      font
    })
    
    const pdfBytes = await pdfDoc.save()
    const outputPath = path.join(__dirname, '../../uploads', `${uuidv4()}.pdf`)
    await fs.writeFile(outputPath, pdfBytes)

    res.json({
      success: true,
      path: `/uploads/${path.basename(outputPath)}`
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/merge', upload.array('pdfs', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: '请上传至少2个PDF文件' })
    }

    const mergedPdf = await PDFDocument.create()

    for (const file of req.files) {
      const pdfBytes = await fs.readFile(file.path)
      const pdf = await PDFDocument.load(pdfBytes)
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      pages.forEach(page => mergedPdf.addPage(page))
    }

    const mergedPdfBytes = await mergedPdf.save()
    const outputPath = path.join(__dirname, '../../uploads', `${uuidv4()}.pdf`)
    await fs.writeFile(outputPath, mergedPdfBytes)

    res.json({
      success: true,
      path: `/uploads/${path.basename(outputPath)}`
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/info', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传PDF文件' })
    }

    const pdfBytes = await fs.readFile(req.file.path)
    const pdf = await PDFDocument.load(pdfBytes)
    
    res.json({
      success: true,
      pages: pdf.getPageCount()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/split', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传PDF文件' })
    }

    const pdfBytes = await fs.readFile(req.file.path)
    const pdf = await PDFDocument.load(pdfBytes)
    const totalPages = pdf.getPageCount()
    const mode = req.body.mode || 'range'
    const files = []

    if (mode === 'each') {
      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create()
        const [page] = await newPdf.copyPages(pdf, [i])
        newPdf.addPage(page)
        const newPdfBytes = await newPdf.save()
        const outputPath = path.join(__dirname, '../../uploads', `split_${i + 1}_${uuidv4()}.pdf`)
        await fs.writeFile(outputPath, newPdfBytes)
        files.push({ name: `第${i + 1}页.pdf`, path: `/uploads/${path.basename(outputPath)}` })
      }
    } else if (mode === 'interval') {
      const interval = parseInt(req.body.interval) || 1
      let fileIndex = 1
      for (let i = 0; i < totalPages; i += interval) {
        const newPdf = await PDFDocument.create()
        const endPage = Math.min(i + interval, totalPages)
        const pageIndices = []
        for (let j = i; j < endPage; j++) {
          pageIndices.push(j)
        }
        const pages = await newPdf.copyPages(pdf, pageIndices)
        pages.forEach(page => newPdf.addPage(page))
        const newPdfBytes = await newPdf.save()
        const outputPath = path.join(__dirname, '../../uploads', `split_${fileIndex}_${uuidv4()}.pdf`)
        await fs.writeFile(outputPath, newPdfBytes)
        files.push({ name: `第${i + 1}-${endPage}页.pdf`, path: `/uploads/${path.basename(outputPath)}` })
        fileIndex++
      }
    } else {
      const rangeStr = req.body.range || '1'
      const ranges = parseRanges(rangeStr, totalPages)
      
      for (let i = 0; i < ranges.length; i++) {
        const newPdf = await PDFDocument.create()
        const pageIndices = ranges[i].map(p => p - 1)
        const pages = await newPdf.copyPages(pdf, pageIndices)
        pages.forEach(page => newPdf.addPage(page))
        const newPdfBytes = await newPdf.save()
        const outputPath = path.join(__dirname, '../../uploads', `split_${i + 1}_${uuidv4()}.pdf`)
        await fs.writeFile(outputPath, newPdfBytes)
        files.push({ name: `拆分${i + 1}.pdf`, path: `/uploads/${path.basename(outputPath)}` })
      }
    }

    res.json({ success: true, files })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/pdf-to-word', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传PDF文件' })
    }

    const pdfBytes = await fs.readFile(req.file.path)
    const pdf = await PDFDocument.load(pdfBytes)
    
    let textContent = ''
    const pages = pdf.getPages()
    for (const page of pages) {
      const text = page.getTextContent ? await page.getTextContent() : null
      if (text) {
        textContent += text.items.map(item => item.str).join(' ') + '\n\n'
      }
    }
    
    if (!textContent) {
      textContent = 'PDF内容提取受限，建议使用专业工具进行转换。'
    }
    
    const wordContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" 
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"></head>
        <body>
          <h1>PDF转换结果</h1>
          <p>原始文件: ${req.file.originalname}</p>
          <hr/>
          <pre style="white-space: pre-wrap;">${textContent}</pre>
        </body>
      </html>
    `
    
    const outputPath = path.join(__dirname, '../../uploads', `${uuidv4()}.doc`)
    await fs.writeFile(outputPath, wordContent)

    res.json({
      success: true,
      path: `/uploads/${path.basename(outputPath)}`
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

function parseRanges(rangeStr, maxPage) {
  const result = []
  const parts = rangeStr.split(',')
  
  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()))
      const pages = []
      for (let i = start; i <= end && i <= maxPage; i++) {
        if (i > 0) pages.push(i)
      }
      if (pages.length > 0) result.push(pages)
    } else {
      const page = parseInt(trimmed)
      if (page > 0 && page <= maxPage) {
        result.push([page])
      }
    }
  }
  
  return result
}

export default router
