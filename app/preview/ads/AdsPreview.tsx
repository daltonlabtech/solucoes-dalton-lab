'use client'

import { useEffect, useState } from 'react'

const ADS = [
  { id: 'ad-01-identidade', label: 'Identidade', accentColor: '#06b6d4' },
  { id: 'ad-02-tempo',      label: 'Tempo',       accentColor: '#7c3aed' },
  { id: 'ad-03-risco',      label: 'Risco',        accentColor: '#ec4899' },
  { id: 'ad-04-whatsapp',   label: 'WhatsApp',     accentColor: '#06b6d4' },
  { id: 'ad-05-proposta',   label: 'Proposta',     accentColor: '#06b6d4' },
]

const STYLES     = ['slide-fade', 'typewriter', 'cinematic'] as const
const STYLE_LABELS: Record<typeof STYLES[number], string> = {
  'slide-fade': 'Slide Fade',
  'typewriter': 'Typewriter',
  'cinematic':  'Cinematic',
}
const DURATIONS  = ['10s'] as const

const SCALE       = 0.185
const CELL_W      = Math.round(1080 * SCALE)
const CELL_H      = Math.round(1920 * SCALE)
const GAP         = 12
const MODAL_SCALE = 0.4
const MODAL_W     = Math.round(1080 * MODAL_SCALE)
const MODAL_H     = Math.round(1920 * MODAL_SCALE)

type Preview = { label: string; style: string; dur: string | null; src: string }

const cell: React.CSSProperties = {
  overflow: 'hidden',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.07)',
  background: '#060e1c',
  flexShrink: 0,
  cursor: 'pointer',
}

const frameStyle: React.CSSProperties = {
  width: 1080,
  height: 1920,
  transform: `scale(${SCALE})`,
  transformOrigin: 'top left',
  border: 'none',
  display: 'block',
  pointerEvents: 'none',
}

const colLabel: React.CSSProperties = {
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#334155',
}

export default function AdsPreview() {
  const [active, setActive]   = useState(ADS[0])
  const [preview, setPreview] = useState<Preview | null>(null)

  useEffect(() => {
    if (!preview) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPreview(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [preview])

  return (
    <div style={{ padding: '36px 48px', minWidth: 'max-content' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>Dalton Lab</span>
        <span style={{ color: '#1e293b' }}>·</span>
        <span style={{ fontSize: 14, color: '#475569', fontWeight: 600 }}>Ad Preview</span>
        <span style={{
          marginLeft: 'auto',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#f59e0b',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 5, padding: '3px 10px',
        }}>
          Staging
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {ADS.map(ad => {
          const on = active.id === ad.id
          return (
            <button key={ad.id} onClick={() => setActive(ad)} style={{
              padding: '8px 18px', borderRadius: 8, cursor: 'pointer', outline: 'none',
              fontSize: 13, fontWeight: 700, transition: 'all 0.15s',
              border: on ? `1px solid ${ad.accentColor}55` : '1px solid rgba(255,255,255,0.07)',
              background: on ? `${ad.accentColor}15` : 'rgba(255,255,255,0.03)',
              color: on ? '#fff' : '#475569',
            }}>
              {ad.label}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: GAP, alignItems: 'flex-start' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: GAP, paddingTop: 28, width: 36 }}>
          {DURATIONS.map(dur => (
            <div key={dur} style={{ height: CELL_H, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: '#334155' }}>{dur}</span>
            </div>
          ))}
        </div>

        {STYLES.map(style => (
          <div key={style} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
            <div style={colLabel}>{STYLE_LABELS[style]}</div>
            {DURATIONS.map(dur => (
              <div
                key={dur}
                style={{ ...cell, width: CELL_W, height: CELL_H }}
                onClick={() => setPreview({
                  label: active.label,
                  style: STYLE_LABELS[style],
                  dur,
                  src: `/ads/compositions/${active.id}-${style}-${dur}.html`,
                })}
              >
                <iframe
                  src={`/ads/compositions/${active.id}-${style}-${dur}.html`}
                  style={frameStyle}
                  title={`${active.id} ${style} ${dur}`}
                />
              </div>
            ))}
          </div>
        ))}

        <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
          <div style={colLabel}>Estático</div>
          {DURATIONS.map(dur => (
            <div
              key={dur}
              style={{ ...cell, width: CELL_W, height: CELL_H }}
              onClick={() => setPreview({
                label: active.label,
                style: 'Estático',
                dur: null,
                src: `/ads/static/${active.id}.html`,
              })}
            >
              <iframe
                src={`/ads/static/${active.id}.html`}
                style={frameStyle}
                title={`${active.id} estático`}
              />
            </div>
          ))}
        </div>

      </div>

      {preview && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setPreview(null)}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{preview.label}</span>
              <span style={{ fontSize: 13, color: '#475569' }}>{preview.style}</span>
              {preview.dur && <span style={{ fontSize: 13, color: '#475569' }}>{preview.dur}</span>}
              <button
                onClick={() => setPreview(null)}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: '2px 6px' }}
              >
                ×
              </button>
            </div>
            <div style={{ overflow: 'hidden', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', width: MODAL_W, height: MODAL_H }}>
              <iframe
                src={preview.src}
                style={{ width: 1080, height: 1920, transform: `scale(${MODAL_SCALE})`, transformOrigin: 'top left', border: 'none', display: 'block' }}
                title={`${preview.label} ${preview.style}${preview.dur ? ` ${preview.dur}` : ''}`}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
