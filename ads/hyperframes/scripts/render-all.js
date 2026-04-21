import { execSync } from 'node:child_process'
import { readdirSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')
const COMPS = join(ROOT, 'compositions')
const OUT = join(ROOT, 'output')

const files = readdirSync(COMPS).filter(f => f.endsWith('.html')).sort()

console.log(`Rendering ${files.length} compositions...`)

for (const file of files) {
  const name = file.replace('.html', '')
  const parts = name.split('-')
  const dur = parts.at(-1)
  const style = parts.slice(-3, -1).join('-')
  const adId = parts.slice(0, -3).join('-')

  const outDir = join(OUT, adId, style)
  mkdirSync(outDir, { recursive: true })

  const outFile = join(outDir, `${dur}.mp4`)
  const cmd = `npx hyperframes render ${join(COMPS, file)} --output ${outFile}`

  console.log(`  → ${adId} / ${style} / ${dur}`)
  execSync(cmd, { cwd: ROOT, stdio: 'inherit' })
}

console.log(`\n✓ Done. Check output/ for ${files.length} MP4 files.`)
