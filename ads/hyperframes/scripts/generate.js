import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = join(__dirname, '..')

const { TIMING, DURATIONS, STYLES } = await import('../src/timing.js')

const template = readFileSync(join(ROOT, 'src/templates/base.html'), 'utf8')

const configFiles = readdirSync(join(ROOT, 'src/configs'))
  .filter(f => f.endsWith('.js'))
  .sort()

const configs = await Promise.all(
  configFiles.map(async (f) => {
    const mod = await import(`../src/configs/${f}`)
    return mod.default
  })
)

const animationScripts = {}
for (const style of STYLES) {
  animationScripts[style] = readFileSync(
    join(ROOT, `src/animations/${style}.js`), 'utf8'
  )
}

function applyPlaceholders(html, vars) {
  let out = html
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{{${key}}}`, String(value ?? ''))
  }
  return out
}

function applyConditionals(html, flags) {
  let out = html
  for (const [key, show] of Object.entries(flags)) {
    const re = new RegExp(`<!--\\s*IF:${key}\\s*-->[\\s\\S]*?<!--\\s*ENDIF:${key}\\s*-->`, 'g')
    if (show) {
      out = out.replace(re, (match) =>
        match
          .replace(/<!--\s*IF:[^>]+-->\s*/, '')
          .replace(/\s*<!--\s*ENDIF:[^>]+-->/, '')
      )
    } else {
      out = out.replace(re, '')
    }
  }
  return out
}

function buildHeadlineHtml(config) {
  let html = config.headline.replace(/\n/g, '<br/>')
  if (config.headlineAccent) {
    html = html.replace(
      config.headlineAccent,
      `<span class="accent">${config.headlineAccent}</span>`
    )
  }
  if (config.headlineStrikethrough) {
    html = html.replace(
      config.headlineStrikethrough,
      `<span class="strikethrough">${config.headlineStrikethrough}</span>`
    )
  }
  return html
}

function buildSublineHtml(config) {
  let html = config.subline
  if (config.sublineAccent) {
    html = html.replace(
      config.sublineAccent,
      `<span class="accent">${config.sublineAccent}</span>`
    )
  }
  return html
}

function buildPillsHtml(pills) {
  return pills.map(p => `<div class="pill">${p}</div>`).join('\n        ')
}

let count = 0

for (const config of configs) {
  for (const durationKey of DURATIONS) {
    for (const style of STYLES) {
      const timing = TIMING[durationKey]

      let html = applyConditionals(template, {
        pills: config.pills.length > 0,
        grid: config.showGrid,
      })

      html = applyPlaceholders(html, {
        compositionId: `${config.id}-${style}-${durationKey}`,
        durationSeconds: timing.duration,
        eyebrow: config.eyebrow,
        headlineHtml: buildHeadlineHtml(config),
        sublineHtml: buildSublineHtml(config),
        pillsHtml: buildPillsHtml(config.pills),
        cta: config.cta,
        accentColor: config.accentColor,
        glowColor: config.glowColor,
        timingJson: JSON.stringify(timing),
        configJson: JSON.stringify(config),
        animationScript: animationScripts[style],
      })

      const filename = `${config.id}-${style}-${durationKey}.html`
      writeFileSync(join(ROOT, 'compositions', filename), html, 'utf8')
      count++
    }
  }
}

console.log(`✓ Generated ${count} compositions.`)
