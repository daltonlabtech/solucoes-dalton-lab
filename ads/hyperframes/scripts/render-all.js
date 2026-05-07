import { execSync } from 'node:child_process'
import { readdirSync, mkdirSync, copyFileSync, cpSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

import { STYLES, DURATIONS } from '../src/timing.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')
const COMPS = join(ROOT, 'compositions')
const ASSETS = join(ROOT, 'src/assets')
const OUT = join(ROOT, 'output')
const HF = join(ROOT, 'node_modules/.bin/hyperframes')

function parseName(name) {
  for (const dur of DURATIONS) {
    for (const style of STYLES) {
      const suffix = `-${style}-${dur}`
      if (name.endsWith(suffix)) {
        return { adId: name.slice(0, -suffix.length), style, dur }
      }
    }
  }
  throw new Error(`Cannot parse composition name: ${name}`)
}

const filter = process.argv[2]

const files = readdirSync(COMPS)
  .filter(f => f.endsWith('.html'))
  .filter(f => !filter || f.includes(filter))
  .sort()

if (files.length === 0) {
  console.error(`No compositions matched filter "${filter}"`)
  process.exit(1)
}

const tmp = join(tmpdir(), `hf-render-${process.pid}`)
mkdirSync(join(tmp, 'src/assets'), { recursive: true })
cpSync(ASSETS, join(tmp, 'src/assets'), { recursive: true })

console.log(`Rendering ${files.length} composition${files.length === 1 ? '' : 's'}...`)

try {
  for (const file of files) {
    const name = file.replace('.html', '')
    const { adId, style, dur } = parseName(name)

    const outDir = join(OUT, adId, style)
    mkdirSync(outDir, { recursive: true })

    const outFile = join(outDir, `${dur}.mp4`)
    copyFileSync(join(COMPS, file), join(tmp, 'index.html'))

    console.log(`  → ${adId} / ${style} / ${dur}`)
    execSync(`${HF} render ${tmp} --output ${outFile} --quiet`, { stdio: 'inherit' })
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}

console.log(`\n✓ Done. Check output/ for ${files.length} MP4 file${files.length === 1 ? '' : 's'}.`)
