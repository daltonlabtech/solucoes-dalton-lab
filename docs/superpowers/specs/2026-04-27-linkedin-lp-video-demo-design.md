# LinkedIn LP — Vídeo Demo Section — Design Spec

**Data:** 2026-04-27
**Escopo:** Substituir a seção "Como funciona" (3 steps em texto) por uma seção com vídeo demo de 18s da LP do Gerador de Posts LinkedIn, e reposicionar essa seção logo após o hero.

---

## Visão Geral

A LP `/linkedin` hoje explica o produto via 3 bullets numerados em texto na seção `LandingHowItWorks`. Vamos trocar isso por um vídeo demo (screen recording de 18s, sem áudio essencial) que mostra o produto na prática. A seção também sobe na ordem da LP — logo após o hero —, antecipando a prova visual antes dos benefícios escritos.

O vídeo é self-hosted no `/public/`, comprimido com ffmpeg pra ~3-6MB (de 45MB originais), e exibido com `<video autoplay muted loop playsInline>` pra zero fricção em todos os browsers.

---

## Arquitetura

### Estrutura de seções (antes vs depois)

**Antes:**
```
Hero → Benefits → HowItWorks (3 steps) → Pricing → FAQ → CTA final
```

**Depois:**
```
Hero → VideoDemo (vídeo 18s) → Benefits → Pricing → FAQ → CTA final
```

`LandingHowItWorks.tsx` é deletado — substituído pelo novo `LandingVideoDemo.tsx`.

### Componente novo: `LandingVideoDemo`

Reaproveita o "shell" visual do HowItWorks atual:
- Mesmo padding (`py-20 px-6`)
- Mesmo background (`#F8FAFC`)
- Mesmo eyebrow style (`text-xs font-semibold tracking-[0.2em] uppercase text-[#94A3B8]`)

Conteúdo:
- Eyebrow: `COMO FUNCIONA`
- (sem subtítulo nem descrição — só o eyebrow)
- Container do vídeo: `max-w-4xl` centralizado, aspect-ratio do vídeo original, `rounded-2xl`, `shadow-2xl`, `overflow-hidden`

```
┌───────────────────────────────────────────┐
│  COMO FUNCIONA                            │
│                                           │
│         ╭─────────────────────╮           │
│         │                     │           │
│         │  [vídeo 18s loop]   │           │
│         │  rounded-2xl        │           │
│         │  shadow-2xl         │           │
│         │                     │           │
│         ╰─────────────────────╯           │
└───────────────────────────────────────────┘
                  fundo #F8FAFC
```

### Tag `<video>`

```tsx
<video
  src="/videos/linkedin-demo.mp4"
  poster="/videos/linkedin-demo-poster.jpg"
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  className="w-full h-auto"
/>
```

Atributos críticos:
- `muted` — obrigatório pra autoplay funcionar (todos os browsers)
- `playsInline` — iOS Safari, sem isso o vídeo abre em fullscreen
- `preload="metadata"` — baixa só os metadados de início, vídeo em si só quando entra no viewport
- `poster` — primeiro frame extraído como JPG (~30KB), aparece enquanto carrega

### Acessibilidade — `prefers-reduced-motion`

Usuários com `prefers-reduced-motion: reduce` não devem ver o autoplay. Approach único: detectar via `matchMedia` em `useEffect`, e se reduzido, renderizar `<img src={poster}>` no lugar do `<video>` (sem botão de play — quem optou por reduzir movimento provavelmente também não quer interagir com vídeo).

```tsx
const [reduceMotion, setReduceMotion] = useState(false);
useEffect(() => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  setReduceMotion(mq.matches);
}, []);

return reduceMotion
  ? <img src="/videos/linkedin-demo-poster.jpg" alt="..." />
  : <video ... />;
```

---

## Pipeline de Vídeo

### Compressão (rodada uma vez, antes do commit)

```bash
ffmpeg -i <input.mp4> \
  -c:v libx264 -crf 28 -preset slow \
  -vf "scale=1280:-2" \
  -an \
  -movflags +faststart \
  -pix_fmt yuv420p \
  public/videos/linkedin-demo.mp4
```

Parâmetros:
- `-crf 28` — qualidade enxuta apropriada pra screen recording (default é 23, 28 é mais comprimido sem perda visual perceptível em UI)
- `-vf "scale=1280:-2"` — cap de largura em 1280px (`-2` mantém aspect ratio e múltiplo de 2 que H.264 exige)
- `-an` — remove faixa de áudio (a "musiquinha" não é essencial; economiza bytes e elimina necessidade de unmute)
- `-movflags +faststart` — move moov atom pro início do arquivo, vídeo começa a tocar antes de terminar de baixar
- `-pix_fmt yuv420p` — compatibilidade com Safari iOS (sem isso, alguns vídeos não tocam)
- `-preset slow` — encoding mais lento mas arquivo final menor (rodado offline, ok)

**Tamanho esperado:** 3-6 MB (de 45 MB originais).

### Extração do poster

```bash
ffmpeg -i public/videos/linkedin-demo.mp4 \
  -vf "select=eq(n\,0)" \
  -frames:v 1 \
  -q:v 2 \
  public/videos/linkedin-demo-poster.jpg
```

Pega o primeiro frame, salva como JPG qualidade 2 (escala 2-31, menor = melhor). Tamanho esperado: 20-50 KB.

### Por que não YouTube embed

- Iframe ~500KB+ de JS, requests pra múltiplos domínios terceiros
- Sem loop seamless (tem fade pro próximo vídeo / branding YouTube)
- Branded UI no end screen
- Tracking Google em LP que faz tracking próprio via PostHog

### Por que não Cloudflare Stream

- Custo recorrente (~$1/1000min stored + delivery) sem ganho real pra um vídeo de 18s/5MB
- Adaptive bitrate seria útil pra vídeos longos; em 18s não compensa a complexidade
- Pode ser migrado depois se a LP escalar e bandwidth virar gargalo

---

## Estrutura de Arquivos

```
app/linkedin/
  page.tsx                              ← editado (reordena seções, troca import)

components/landing/linkedin/
  LandingHero.tsx                       ← intocado
  LandingBenefits.tsx                   ← intocado
  LandingHowItWorks.tsx                 ← APAGADO
  LandingVideoDemo.tsx                  ← NOVO
  LandingPricing.tsx                    ← intocado
  LandingFAQ.tsx                        ← intocado

public/videos/                          ← NOVA pasta
  linkedin-demo.mp4                     ← NOVO (~3-6MB)
  linkedin-demo-poster.jpg              ← NOVO (~20-50KB)
```

---

## Performance

Targets pra LP `/linkedin`:
- LCP < 2.5s em 4G mobile — LCP da LP é o headline do hero (texto), não o vídeo. Vídeo só baixa depois que LCP rende.
- Sem flash de conteúdo: `poster` aparece instantâneo enquanto o vídeo baixa
- Vídeo final ≤ 8MB (target: 3-6MB)

Comportamento de carregamento esperado:
- `preload="metadata"`: browser baixa só metadados (~poucos KB) na carga da página
- Como `autoplay` está ligado, o vídeo começa a baixar logo que o elemento `<video>` é montado e visível — não há `IntersectionObserver` lazy load explícito no MVP. Se virar problema de performance, adicionar lazy load num PR seguinte.

Verificar pós-deploy:
- Lighthouse score >= score atual da LP (manter o critério da regra de A/B testing existente)
- DevTools Network em throttle 4G: hero rende sem esperar vídeo

---

## O que NÃO muda

- Hero (`LandingHero`) — copy, layout, CTA, gradiente, tudo intocado
- Benefits, Pricing, FAQ — conteúdo idêntico
- CTA final inline em `app/linkedin/page.tsx`
- Tracking existente (PostHog `cta_clicked`)
- Pipeline de A/B testing (a seção do vídeo pode virar variante depois se quiser)

---

## Riscos e Mitigações

| Risco | Mitigação |
|---|---|
| Vídeo comprimido ainda fica > 10MB | Aumentar CRF pra 30, reduzir scale pra 1024px |
| Autoplay bloqueado no iOS Safari | `playsInline` + `muted` cobre — testar manualmente em iPhone real após deploy |
| Vídeo causa CLS (layout shift) | Container com `aspect-ratio` CSS fixo (ratio é determinado após processar o vídeo — `ffprobe` lê width/height do MP4 final e a ratio é hardcoded no componente) |
| `prefers-reduced-motion` ignorado | Implementar fallback explícito (não confiar só em CSS) |
| Bundle do Vercel cresce com vídeo em `/public/` | 3-6MB é aceitável; se virar problema, migrar pra Cloudflare Stream |

---

## Critérios de Aceite

1. Acessar `/linkedin` em desktop e mobile, vídeo toca em loop sem som automaticamente
2. Ordem das seções é Hero → Vídeo → Benefits → Pricing → FAQ → CTA
3. Hero permanece visualmente idêntico ao atual
4. `LandingHowItWorks.tsx` não existe mais no repo
5. Vídeo final em `/public/videos/linkedin-demo.mp4` pesa ≤ 8MB
6. Lighthouse score da LP `/linkedin` >= score atual (baseline antes da mudança)
7. Em iPhone real (Safari iOS), vídeo toca inline sem abrir fullscreen
