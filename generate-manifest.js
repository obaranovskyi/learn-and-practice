import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const MARKDOWNS_DIR = path.join(__dirname, 'public', 'markdowns')
const MANIFEST_PATH = path.join(MARKDOWNS_DIR, 'manifest.json')

function getTopicFolders() {
  if (!fs.existsSync(MARKDOWNS_DIR)) {
    console.error(`Error: ${MARKDOWNS_DIR} does not exist`)
    process.exit(1)
  }

  return fs.readdirSync(MARKDOWNS_DIR)
    .filter(name => {
      const fullPath = path.join(MARKDOWNS_DIR, name)
      return fs.statSync(fullPath).isDirectory()
    })
    .sort()
}

function validateTopic(topicId) {
  const topicPath = path.join(MARKDOWNS_DIR, topicId)
  const requiredFiles = ['index.md', 'exercises.md', 'meta.json']
  const missing = []

  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(topicPath, file))) {
      missing.push(file)
    }
  }

  return { valid: missing.length === 0, missing }
}

function loadMeta(topicId) {
  const metaPath = path.join(MARKDOWNS_DIR, topicId, 'meta.json')
  try {
    const content = fs.readFileSync(metaPath, 'utf-8')
    return JSON.parse(content)
  } catch (err) {
    console.error(`Error reading meta.json for ${topicId}:`, err.message)
    return { title: topicId, order: 999 }
  }
}

function generateManifest() {
  console.log('Generating manifest.json...')
  console.log(`Scanning: ${MARKDOWNS_DIR}\n`)

  const folders = getTopicFolders()
  
  if (folders.length === 0) {
    console.warn('Warning: No topic folders found')
    fs.writeFileSync(MANIFEST_PATH, '[]')
    console.log('Created empty manifest.json')
    return
  }

  const topics = []
  const errors = []

  for (const folder of folders) {
    const validation = validateTopic(folder)
    
    if (!validation.valid) {
      errors.push(`${folder}: missing ${validation.missing.join(', ')}`)
      continue
    }

    const meta = loadMeta(folder)
    const hasFlashcards = fs.existsSync(path.join(MARKDOWNS_DIR, folder, 'flashcards.json'))
    
    topics.push({
      id: folder,
      title: meta.title || folder,
      description: meta.description || '',
      order: meta.order || 999,
      index: `${folder}/index.md`,
      exercises: `${folder}/exercises.md`,
      flashcards: hasFlashcards ? `${folder}/flashcards.json` : null
    })
  }

  if (errors.length > 0) {
    console.warn('Validation warnings:')
    errors.forEach(err => console.warn(`  - ${err}`))
    console.log('')
  }

  topics.sort((a, b) => a.order - b.order)

  const manifest = topics.map(({ order, ...rest }) => rest)

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
  
  console.log(`Generated manifest.json with ${manifest.length} topic(s):`)
  manifest.forEach((t, i) => console.log(`  ${i + 1}. ${t.title}`))
}

generateManifest()

