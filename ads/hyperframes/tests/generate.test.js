import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '')
const COMPS = join(ROOT, 'compositions')

// Run generate before all tests
execSync('node scripts/generate.js', { cwd: ROOT, stdio: 'inherit' })

test('generates exactly 45 HTML files', () => {
  const files = readdirSync(COMPS).filter(f => f.endsWith('.html'))
  assert.equal(files.length, 45, `Expected 45, got ${files.length}: ${files.join(', ')}`)
})

test('each ad has 9 variants (3 styles × 3 durations)', () => {
  const ads = ['ad-01-identidade', 'ad-02-tempo', 'ad-03-risco', 'ad-04-whatsapp', 'ad-05-proposta']
  const files = readdirSync(COMPS).filter(f => f.endsWith('.html'))
  for (const adId of ads) {
    const count = files.filter(f => f.startsWith(adId)).length
    assert.equal(count, 9, `${adId} should have 9 files, got ${count}`)
  }
})

test('ad-04 contains correct copy', () => {
  const html = readFileSync(join(COMPS, 'ad-04-whatsapp-slide-fade-6s.html'), 'utf8')
  assert.ok(html.includes('Lead sem resposta'), 'missing headline')
  assert.ok(html.includes('Quero isso'), 'missing CTA')
  assert.ok(html.includes('Varejo'), 'missing eyebrow')
})

test('15s variant has correct data-duration', () => {
  const html = readFileSync(join(COMPS, 'ad-01-identidade-cinematic-15s.html'), 'utf8')
  assert.ok(html.includes('data-duration="15"'), 'wrong duration attribute')
})

test('ad-02 contains pills HTML', () => {
  const html = readFileSync(join(COMPS, 'ad-02-tempo-slide-fade-10s.html'), 'utf8')
  assert.ok(html.includes('Proposta no PPT'), 'pill 1 missing')
  assert.ok(html.includes('Lead sem resposta'), 'pill 2 missing')
  assert.ok(html.includes('Reunião sem resumo'), 'pill 3 missing')
})

test('ad-01 contains product grid', () => {
  const html = readFileSync(join(COMPS, 'ad-01-identidade-slide-fade-10s.html'), 'utf8')
  assert.ok(html.includes('id="grid"'), 'grid missing')
})

test('ad-03 does NOT contain product grid', () => {
  const html = readFileSync(join(COMPS, 'ad-03-risco-slide-fade-10s.html'), 'utf8')
  assert.ok(!html.includes('id="grid"'), 'grid should be absent')
})

test('ad-05 contains strikethrough on PowerPoint', () => {
  const html = readFileSync(join(COMPS, 'ad-05-proposta-slide-fade-10s.html'), 'utf8')
  assert.ok(html.includes('class="strikethrough"'), 'strikethrough class missing')
  assert.ok(html.includes('PowerPoint'), 'word missing')
})
