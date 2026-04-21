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

// Generate viewer.html
const STYLE_LABELS = { 'slide-fade': 'Slide Fade', 'typewriter': 'Typewriter', 'cinematic': 'Cinematic' }
const DUR_LABELS   = { '6s': '6s', '10s': '10s', '15s': '15s' }

const adSections = configs.map(config => {
  const cards = DURATIONS.flatMap(dur =>
    STYLES.map(style => ({
      label: `${STYLE_LABELS[style]} · ${DUR_LABELS[dur]}`,
      file: `compositions/${config.id}-${style}-${dur}.html`,
    }))
  )
  return { config, cards }
})

const viewerHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>Dalton Lab — Ads Viewer</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0a1628;color:#e2e8f0;font-family:'Plus Jakarta Sans',sans-serif;padding:48px 40px;min-height:100vh}
    h1{font-size:22px;font-weight:800;letter-spacing:.04em;color:#fff;margin-bottom:8px}
    .subtitle{font-size:13px;color:#475569;margin-bottom:48px}
    .ad-section{margin-bottom:40px}
    .ad-header{display:flex;align-items:baseline;gap:12px;margin-bottom:12px}
    .ad-id{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#475569}
    .ad-headline{font-size:15px;font-weight:700;color:#cbd5e1}
    .chips{display:flex;flex-wrap:wrap;gap:8px}
    .chip{
      display:inline-flex;align-items:center;gap:6px;
      background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
      border-radius:8px;padding:7px 14px;font-size:12px;font-weight:600;
      color:#94a3b8;cursor:pointer;text-decoration:none;transition:all .15s;
    }
    .chip:hover{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.18);color:#fff}
    .chip .dot{width:6px;height:6px;border-radius:50%;background:var(--accent);flex-shrink:0}
    hr{border:none;border-top:1px solid rgba(255,255,255,.06);margin-bottom:40px}
  </style>
</head>
<body>
  <h1>Dalton Lab — Ads Viewer</h1>
  <p class="subtitle">45 compositions · 5 ads × 3 estilos × 3 durações</p>
${adSections.map(({ config, cards }) => `
  <div class="ad-section">
    <div class="ad-header">
      <span class="ad-id">${config.id}</span>
      <span class="ad-headline">${config.headline.replace(/\n/g, ' ')}</span>
    </div>
    <div class="chips">
      ${cards.map(c => `<a class="chip" href="${c.file}" target="_blank" style="--accent:${config.accentColor}"><span class="dot"></span>${c.label}</a>`).join('\n      ')}
    </div>
  </div>
  <hr/>`).join('')}
</body>
</html>`

writeFileSync(join(ROOT, 'viewer.html'), viewerHtml, 'utf8')
console.log('✓ Generated viewer.html')
