import express from 'express'
import multer from 'multer'
import sharp from 'sharp'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'

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
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    cb(null, allowedTypes.includes(file.mimetype))
  }
})

router.post('/compress', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传图片' })
    }

    const quality = parseInt(req.body.quality) || 80
    const outputPath = path.join(
      __dirname, 
      '../../uploads', 
      `compressed_${req.file.filename}`
    )

    await sharp(req.file.path)
      .jpeg({ quality, mozjpeg: true })
      .toFile(outputPath)

    res.json({
      success: true,
      original: {
        size: req.file.size,
        path: `/uploads/${req.file.filename}`
      },
      compressed: {
        size: (await sharp(outputPath).metadata()).size,
        path: `/uploads/compressed_${req.file.filename}`
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/resize', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传图片' })
    }

    const width = parseInt(req.body.width)
    const height = parseInt(req.body.height)
    const outputPath = path.join(
      __dirname, 
      '../../uploads', 
      `resized_${req.file.filename}`
    )

    let resizeOptions = {}
    if (width) resizeOptions.width = width
    if (height) resizeOptions.height = height

    await sharp(req.file.path)
      .resize(resizeOptions)
      .toFile(outputPath)

    res.json({
      success: true,
      path: `/uploads/resized_${req.file.filename}`
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/convert', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传图片' })
    }

    const format = req.body.format || 'jpeg'
    const outputPath = path.join(
      __dirname, 
      '../../uploads', 
      `converted_${uuidv4()}.${format}`
    )

    await sharp(req.file.path)
      .toFormat(format)
      .toFile(outputPath)

    res.json({
      success: true,
      path: `/uploads/converted_${path.basename(outputPath)}`
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
