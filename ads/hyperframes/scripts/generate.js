import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync } from 'node:fs'
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

const SCALE = 0.25
const PW = Math.round(1080 * SCALE)
const PH = Math.round(1920 * SCALE)

const viewerHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <title>Dalton Lab — Ads Viewer</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#0a1628;color:#e2e8f0;font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh}
    .layout{display:grid;grid-template-columns:1fr ${PW + 32}px;gap:0;min-height:100vh}

    /* left: ad list */
    .list{padding:48px 40px;overflow-y:auto}
    h1{font-size:22px;font-weight:800;letter-spacing:.04em;color:#fff;margin-bottom:6px}
    .subtitle{font-size:13px;color:#475569;margin-bottom:48px}
    .ad-section{margin-bottom:36px}
    .ad-header{display:flex;align-items:baseline;gap:12px;margin-bottom:10px}
    .ad-id{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#334155}
    .ad-headline{font-size:14px;font-weight:700;color:#94a3b8}
    .chips{display:flex;flex-wrap:wrap;gap:7px}
    .chip{
      display:inline-flex;align-items:center;gap:6px;
      background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);
      border-radius:8px;padding:6px 13px;font-size:12px;font-weight:600;
      color:#64748b;cursor:pointer;text-decoration:none;transition:all .15s;user-select:none;
    }
    .chip:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.14);color:#cbd5e1}
    .chip.active{background:color-mix(in srgb,var(--accent) 14%,transparent);border-color:color-mix(in srgb,var(--accent) 50%,transparent);color:#fff}
    .chip .dot{width:6px;height:6px;border-radius:50%;background:var(--accent);flex-shrink:0}
    hr{border:none;border-top:1px solid rgba(255,255,255,.05);margin-bottom:36px}

    /* right: sticky preview */
    .sidebar{
      border-left:1px solid rgba(255,255,255,.06);
      padding:48px 16px;
      position:sticky;top:0;height:100vh;
      display:flex;flex-direction:column;align-items:center;gap:16px;
    }
    .preview-shell{
      width:${PW}px;height:${PH}px;
      border-radius:12px;overflow:hidden;
      background:#060e1c;
      border:1px solid rgba(255,255,255,.08);
      position:relative;flex-shrink:0;
    }
    .preview-shell iframe{
      width:1080px;height:1920px;
      transform:scale(${SCALE});transform-origin:top left;
      border:none;display:block;
    }
    .empty-state{
      position:absolute;inset:0;display:flex;flex-direction:column;
      align-items:center;justify-content:center;gap:8px;
      color:#1e293b;font-size:13px;font-weight:600;text-align:center;
    }
    .empty-icon{font-size:28px;opacity:.4}
    .preview-label{font-size:11px;color:#334155;font-weight:600;letter-spacing:.08em;text-align:center;line-height:1.6}
  </style>
</head>
<body>
  <div class="layout">
    <div class="list">
      <h1>Dalton Lab — Ads Viewer</h1>
      <p class="subtitle">45 compositions · 5 ads × 3 estilos × 3 durações</p>
${adSections.map(({ config, cards }) => `
      <div class="ad-section">
        <div class="ad-header">
          <span class="ad-id">${config.id}</span>
          <span class="ad-headline">${config.headline.replace(/\n/g, ' ')}</span>
        </div>
        <div class="chips">
          ${cards.map(c => `<span class="chip" onclick="preview(this,'${c.file}','${c.label}')" style="--accent:${config.accentColor}"><span class="dot"></span>${c.label}</span>`).join('\n          ')}
        </div>
      </div>
      <hr/>`).join('')}
    </div>

    <div class="sidebar">
      <div class="preview-shell" id="shell">
        <div class="empty-state" id="empty">
          <span class="empty-icon">▶</span>
          Selecione um ad
        </div>
        <iframe id="frame" style="display:none"></iframe>
      </div>
      <div class="preview-label" id="label"></div>
    </div>
  </div>

  <script>
    function preview(chip, file, label) {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'))
      chip.classList.add('active')
      const frame = document.getElementById('frame')
      frame.src = file
      frame.style.display = 'block'
      document.getElementById('empty').style.display = 'none'
      document.getElementById('label').textContent = label
    }
  </script>
</body>
</html>`

writeFileSync(join(ROOT, 'viewer.html'), viewerHtml, 'utf8')
console.log('✓ Generated viewer.html')

// Mirror to public/ads/ for Next.js /preview/ads route
const PUBLIC_COMPS  = join(ROOT, '../../public/ads/compositions')
const PUBLIC_STATIC = join(ROOT, '../../public/ads/static')
mkdirSync(PUBLIC_COMPS,  { recursive: true })
mkdirSync(PUBLIC_STATIC, { recursive: true })

for (const config of configs) {
  for (const durationKey of DURATIONS) {
    for (const style of STYLES) {
      const filename = `${config.id}-${style}-${durationKey}.html`
      const src = readFileSync(join(ROOT, 'compositions', filename), 'utf8')
      const out = src.replaceAll('src="../src/assets/logo.png"', 'src="/logo.png"')
      if (out === src) throw new Error(`${filename}: logo path replacement not found`)
      writeFileSync(join(PUBLIC_COMPS, filename), out, 'utf8')
    }
  }
}

const STATIC_SRC  = join(ROOT, '../../ads')
const staticHtmls = readdirSync(STATIC_SRC).filter(f => f.endsWith('.html') && f.startsWith('ad-'))
for (const f of staticHtmls) {
  const src = readFileSync(join(STATIC_SRC, f), 'utf8')
  const out = src
    .replaceAll('href="base.css"',          'href="/ads/static/base.css"')
    .replaceAll('src="../public/logo.png"', 'src="/logo.png"')
  if (out === src) throw new Error(`${f}: expected path replacements not found — check source HTML`)
  writeFileSync(join(PUBLIC_STATIC, f), out, 'utf8')
}
copyFileSync(join(STATIC_SRC, 'base.css'), join(PUBLIC_STATIC, 'base.css'))
console.log('✓ Mirrored to public/ads/')
