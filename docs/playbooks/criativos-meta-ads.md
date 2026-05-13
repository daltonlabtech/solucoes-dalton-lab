# Playbook: Criativos Meta Ads

**Última revisão:** 2026-05-13
**Owner:** Gabriel
**Status:** Vivo — revisar a cada lançamento de criativo

---

## 1. Visão geral

Este playbook consolida como a Dalton Lab cria criativos de Meta Ads — estáticos e vídeo. O objetivo é que qualquer pessoa do time consiga reproduzir o pipeline ou criar novos criativos para qualquer produto sem depender do Diego.

Hoje produzimos dois formatos:

- **Estáticos 1080×1080** (Meta Feed) — HTML + CSS puro, screenshot via Playwright
- **Vídeos 1080×1920** (Meta Stories / Reels) — HyperFrames + GSAP, render para MP4

Todos os arquivos vivem em `ads/`. O pipeline de vídeo tem seu próprio subprojeto em `ads/hyperframes/`.

> **Nota:** O handoff `docs/handoff/2026-04-17-meta-ads-criativos.md` menciona `agent-browser` — está **desatualizado**. A stack atual usa Playwright.

---

## 2. Stack e ferramentas

| Ferramenta | Versão | Para quê | Como instalar |
|---|---|---|---|
| Playwright CLI | latest | Screenshot dos estáticos via browser headless | `npm install -g @playwright/cli@latest` |
| HyperFrames | 0.5.3 | Render de HTML+GSAP para MP4 | `cd ads/hyperframes && npm install` |
| GSAP | 3.12.5 | Animações nos templates de vídeo | Carregado via CDN (já está no template) |
| FFmpeg | — | Dependência do HyperFrames | `brew install ffmpeg` |
| ImageMagick | — | Validar dimensões dos PNGs | `brew install imagemagick` |
| Node | ≥ 22 | Pipeline de vídeo (HyperFrames exige ≥ 22) | `nvm install 22 && nvm use 22` |
| Plus Jakarta Sans | — | Fonte de todos os criativos | Carregada via Google Fonts (já nos HTMLs) |

> **Atenção Node version:** o `package.json` raiz declara `engines.node >= 20`, mas o HyperFrames e os scripts de vídeo precisam do Node 22. Em ambiente novo, use `nvm use 22` antes de rodar qualquer coisa em `ads/hyperframes/`.

---

## 3. Pipeline — Estáticos 1080×1080

### 3.1 Estrutura de arquivos

```
ads/
  base.css                  ← CSS compartilhado por todos os ads (não editar por ad)
  ad-01-identidade.html     ← referência canônica
  ad-02-tempo.html
  ad-03-risco.html
  ad-04-whatsapp.html
  ad-05-proposta.html
  ad-01-identidade.png      ← 1080×1080 ✓
  ...
```

### 3.2 Passo a passo

**1. Definir o ângulo de copy**

Cada ad tem 1 ângulo (identidade, tempo perdido, risco, atendimento, proposta). Todos os ads apontam para o mesmo destino — nunca para a LP de um produto isolado quando são ads do hub. Para produto isolado, apontam para a LP desse produto.

**2. Criar `ads/ad-XX-<slug>.html`**

Clone o `ad-01-identidade.html` e edite. Estrutura HTML obrigatória:

```html
<link rel="stylesheet" href="base.css">
<div class="ad">
  <div class="glow-main"></div>       <!-- blur decorativo, cor via --glow-color -->
  <img class="logo" src="../public/logo.png" alt="">
  <div class="content">              <!-- padding-bottom: 210px reserva espaço para os cards -->
    <div class="tag">Eyebrow</div>
    <h1 class="headline">
      Linha 1.<br>
      <span class="grad">Linha com gradiente.</span>
    </h1>
    <div class="divider"></div>
    <p class="subline">Subtítulo aqui.</p>
    <div class="cta-wrap">
      <a class="cta" href="https://solucoes.daltonlab.ai/?utm_source=meta&utm_medium=paid&utm_campaign=<slug>">CTA →</a>
    </div>
  </div>
  <div class="products">             <!-- position: absolute; bottom: 0 -->
    <!-- 4 cards de produto (ver ad-01 como referência) -->
  </div>
</div>
```

**3. Sobreposições por ad (o que muda entre ads)**

Cada HTML sobrepõe no `<style>` inline apenas o que difere do `base.css`:

- `accentColor` da `.grad` e da `.tag`
- `font-size` do `.headline` (ads com headline mais curta podem usar 94–100px)
- `showGrid: false` → remover o bloco `.products` (ads de produto isolado)

**4. Renderizar via Playwright**

```bash
# Para um ad
playwright-cli open "file://$(pwd)/ads/ad-01-identidade.html"
playwright-cli resize 1080 1080
playwright-cli screenshot --filename="$(pwd)/ads/ad-01-identidade.png"
playwright-cli close

# Para todos de uma vez (loop)
for slug in ad-01-identidade ad-02-tempo ad-03-risco ad-04-whatsapp ad-05-proposta; do
  playwright-cli open "file://$(pwd)/ads/${slug}.html"
  playwright-cli resize 1080 1080
  playwright-cli screenshot --filename="$(pwd)/ads/${slug}.png"
  playwright-cli close
done
```

**5. Validar dimensões**

```bash
magick identify ads/ad-0*.png
# Todos devem mostrar 1080x1080
```

**6. Upload manual no Meta Ads Manager** — sem automação hoje.

### 3.3 Identidade visual (base.css)

| Propriedade | Valor |
|---|---|
| Background | `#0a1628` |
| Headline | 88px / weight 900 / letter-spacing -2px |
| Gradiente (`.grad`) | `linear-gradient(135deg, #7C3AED, #00FFFF)` clipado em texto |
| Subline | 26px / weight 300 / cor `#94a3b8` |
| Card name | 17px |
| Card desc | 13px / cor `#94a3b8` (contraste 5.3:1 — mínimo aceitável) |
| Padding do `.ad` | 72px |
| Padding-bottom do `.content` | 210px (valor empírico — reserva espaço para os cards) |

**Cards de produto (`.products`):**

| Produto | Cor (`--card-color`) |
|---|---|
| Radar | `#7C3AED` |
| SDR WhatsApp | `#16A34A` |
| Gerador de Propostas | `#2563EB` |
| Transcrição + CRM | `#D97706` |

---

## 4. Pipeline — Vídeo 1080×1920

### 4.1 Arquitetura

```
ads/hyperframes/
  package.json                        ← hyperframes ^0.5.3 (ESM, Node ≥ 22)
  src/
    configs/                          ← 1 arquivo .js por ad (copy, cor, flags)
      ad-01-identidade.js
      ad-02-tempo.js
      ad-03-risco.js
      ad-04-whatsapp.js
      ad-05-proposta.js
    timing.js                         ← timing de entrada de cada elemento por duração
    templates/base.html               ← template com placeholders {{}} + GSAP via CDN
    animations/
      slide-fade.js
      typewriter.js
      cinematic.js
    assets/logo.png
  scripts/
    generate.js                       ← gera 45 HTMLs em compositions/ + espelha para public/ads/
    render-all.js                     ← renderiza HTMLs para MP4 via HyperFrames CLI
  compositions/                       ← gerado pelo generate.js (gitignored)
  output/                             ← MP4s finais (gitignored)
  tests/generate.test.js              ← 8 testes do gerador (Node built-in test runner)
```

### 4.2 Configs dos 5 ads

| Ad | Eyebrow | Headline | Accent | Pills | Grid |
|---|---|---|---|---|---|
| ad-01-identidade | Dalton Lab | "Você toca tudo. / **A gente resolve.**" | `#06b6d4` | — | sim |
| ad-02-tempo | Dalton Lab | "Quantas horas você perdeu essa semana?" | `#7c3aed` | "Proposta no PPT", "Lead sem resposta", "Reunião sem resumo" | sim |
| ad-03-risco | Dalton Lab | "Sua empresa **trava** quando você tira o pé?" | `#ec4899` | — | não |
| ad-04-whatsapp | Varejo · Distribuição | "Lead sem resposta / é venda perdida." | `#06b6d4` | — | não |
| ad-05-proposta | Gerador de Propostas | "Ainda monta proposta / no ~~PowerPoint~~?" | `#06b6d4` | — | não |

**Campos de uma config:**

```js
export default {
  id: 'ad-01-identidade',
  eyebrow: 'Dalton Lab',
  headline: 'Você toca tudo.\nA gente resolve.',
  headlineAccent: 'A gente resolve.',       // envolto em <span class="accent">
  headlineStrikethrough: null,              // envolto em <span class="strikethrough">
  subline: 'Ferramentas de IA para quem não tem equipe para tudo.',
  sublineAccent: null,
  pills: [],                                // array de strings para o ad-02
  cta: 'Ver soluções →',
  accentColor: '#06b6d4',
  glowColor: 'rgba(6, 182, 212, 0.12)',
  showGrid: true,                           // false para ads de produto isolado
}
```

### 4.3 Timing de entrada (segundos)

| Elemento | 6s | 10s | 15s |
|---|---|---|---|
| logo | 0.0 | 0.0 | 0.0 |
| eyebrow | 0.4 | 0.6 | 0.8 |
| headline | 0.7 | 1.0 | 1.3 |
| divider / pills | 1.3 | 2.0 | 2.8 |
| subline | 1.5 | 2.2 | 3.2 |
| grid | 2.0 | 3.0 | 4.4 |
| cta | 2.0 | 3.2 | 5.9 |

Fonte: `ads/hyperframes/src/timing.js`

### 4.4 Estilos de animação

| Estilo | Comportamento |
|---|---|
| **slide-fade** | Cada elemento entra com slide + fade; CTA faz scale 0.93→1 e pulsa em loop até o fim |
| **typewriter** | Revelação palavra por palavra (y: 105%→0%, stagger 55ms); `.accent` e `.strikethrough` são unidade atômica |
| **cinematic** | Ken Burns sutil no stage (scale 1.07→1.0); glow fade-in; pulse lento (1.4s de ciclo) |

**Variante usada em produção:** `cinematic 10s` (os 5 MP4s renderizados são deste variant).

### 4.5 Passo a passo para gerar e renderizar

```bash
# 1. Gera 45 HTMLs (5 ads × 3 estilos × 3 durações) + espelha para public/ads/
node ads/hyperframes/scripts/generate.js

# 2. Roda os testes do gerador
node --test ads/hyperframes/tests/generate.test.js

# 3. Revisa visualmente antes de renderizar
npm run dev
# Abrir: http://localhost:3000/preview/ads

# 4. Renderiza o variant validado (substitui <filtro> pelo que quiser)
cd ads/hyperframes
node scripts/render-all.js cinematic-10s   # todos os 5 ads, estilo cinematic, 10s
# Output: output/<adId>/cinematic/10s.mp4

# 5. Para renderizar um ad específico:
node scripts/render-all.js ad-01-identidade-cinematic-10s
```

> **Nota:** o `npm run prebuild` (configurado no `package.json` raiz) roda o `generate.js` automaticamente em todo build do Next.js. Garante que `public/ads/compositions/` está sempre sincronizado.

### 4.6 Preview interno (`/preview/ads`)

Rota do Next.js para revisão visual antes do render MP4:

- **URL local:** `http://localhost:3000/preview/ads`
- **Em produção:** retorna 404 (gated por `VERCEL_ENV === 'production'`)
- Grade: 5 abas (uma por ad) × 3 estilos animados + 1 coluna estática
- Mostra a duração 10s (decisão de UI para reduzir cognição — os outros variants existem mas não aparecem aqui)

---

## 5. Aprendizados consolidados

Cada item: a regra + a razão (para não precisar redescobrir).

- **Sem preço e sem "Em breve" nos cards** — copy gera o clique, a LP converte. Card é âncora de credibilidade, não navegacional.
- **Cards com `position: absolute; bottom: 0`** — tentativas com `flex: 1`, `margin-top: auto` e `margin-bottom: auto` falharam (cards saíam do frame). A solução absoluta é a única que funciona.
- **`padding-bottom: 210px` no `.content` é valor empírico** — funciona para headlines de 1–2 linhas. Headlines de 3 linhas (ex: ad-02) podem sobrepor os cards; testar antes de publicar.
- **Contraste mínimo 5.3:1 em texto secundário** — `card-desc` ficou em `#94a3b8` (corrigido de `#64748b` que dava 3.6:1, abaixo do mínimo).
- **Cor da linha de strikethrough** — usa `text-decoration-color: accentColor`. O texto em si fica em `#64748b` (cinza) com a linha colorida sobre ele — efeito intencional.
- **HyperFrames 0.5.3 — timelines em `window.__timelines` no estado `paused`** — versão anterior causava reinício da animação a cada batch de workers (~4x em 10s), fazendo elementos como subline e CTA não aparecerem. A fix registra cada timeline em `window.__timelines[compositionId]` pausada; o HyperFrames captura de forma determinística.
- **`repeat: -1` no GSAP quebra o render** — substituir por contagem finita: `Math.floor((totalDuration - pulseStart) / pulseCycle) - 1`.
- **typewriter: `.accent` e `.strikethrough` como unidade atômica** — o split word-by-word precisa tratar esses spans como uma palavra única para não quebrar as tags HTML no meio.
- **Logo no HyperFrames: path relativo ao project dir** — o `render-all.js` monta um tmpdir com `src/assets/logo.png` antes de cada render. Não usar path absoluto.
- **Screenshot via Playwright** — `playwright-cli resize 1080 1080` antes do screenshot. Sem ajuste de viewport, a captura usa o tamanho padrão do browser.
- **Padrão de lançamento** — LP + link Stripe + 4 anúncios + 1 semana de teste. Se não performar em 1 semana, descarta e testa outro ângulo. (Ref: `docs/plans/reuniao_23.04.md`)

---

## 6. Como adaptar para novo produto

Este é o capítulo principal para quem vai criar criativos do LinkedIn (ou qualquer produto futuro).

### 6.1 Briefing do produto (preencher ANTES de tocar em HTML)

| Campo | Valor | Fonte |
|---|---|---|
| Nome oficial | | LP do produto → título SEO |
| Nome curto | | Hub `app/page.tsx` → lista de produtos |
| Rota Next.js | `/slug` | `app/<slug>/page.tsx` |
| Headline mestra | | Hero da LP |
| Subheadline mestra | | Hero da LP |
| Oferta / preço | | Seção pricing da LP |
| ICP — quem compra | | Inferir da copy da LP + reuniões |
| Dor concreta | | 1 frase tangível (ex: "perde fim de semana escrevendo posts") |
| Prova social disponível | | Depoimentos, números, screenshots do produto |
| Cor primária da LP | `#XXXXXX` | `tailwind.config.ts` ou CSS da LP |
| Accent (detalhe) | `#XXXXXX` | Hero da LP |
| CTA + URL com UTM | | Definir antes de criar o HTML |

> **Se mais de 2 campos ficarem vazios, não crie o criativo ainda.** Volte para o Diego preencher primeiro — criativo sem ICP e sem prova social costuma não converter.

**Exemplo preenchido para LinkedIn:**

| Campo | Valor |
|---|---|
| Nome oficial | Gerador de Posts LinkedIn — Dalton Lab |
| Nome curto | Linkedin Post |
| Rota | `/linkedin` |
| Headline | "Sua marca no LinkedIn. Todos os dias." |
| Subheadline | "O gerador de posts com IA da Dalton Lab cria conteúdo alinhado à voz da sua empresa — pronto para publicar, direto no LinkedIn." |
| Oferta | R$ 99/mês, 100 posts/mês, cancela quando quiser |
| ICP | A definir (dono de PME/profissional liberal que quer presença no LinkedIn mas não tem tempo) |
| Dor | Perde fim de semana escrevendo posts; bloqueio criativo |
| Prova social | **Nenhuma hoje** — zero testimonials, zero números de uso |
| Cor primária | `#2563EB` (azul) |
| Accent | `#F59E0B` (âmbar) |
| CTA | `https://buy.stripe.com/eVq3cv6HsfTl2nJbcZfYY0B` (checkout direto Stripe) |

### 6.2 Definir ângulos de copy (mínimo 4 ads)

Padrão da Dalton:

| Ângulo | Pergunta guia |
|---|---|
| Identidade | "Quem é este produto e por que você precisa?" |
| Dor de tempo | "Quanto tempo você perde hoje sem esta solução?" |
| Risco | "O que acontece se você não tiver isso?" |
| Atendimento / entrega | "Como o produto entrega o resultado na prática?" |
| Proposta / transformação | "Antes × depois — o que muda na sua rotina?" |

Para produto isolado (ex: LinkedIn), todos os ads apontam para a LP do produto (`/linkedin`), não para o hub.

### 6.3 Escolher formatos e dimensões

| Plataforma / posição | Dimensão | Formato |
|---|---|---|
| Meta Feed (imagem) | 1080×1080 | Estático |
| Meta Stories / Reels | 1080×1920 | Vídeo |
| LinkedIn single image | 1200×627 | Estático (novo template necessário) |
| LinkedIn vídeo | 1920×1080 | Vídeo horizontal (novo template necessário) |

> Para LinkedIn, as dimensões são diferentes das Meta. Vai precisar de um `base-linkedin.html` e ajustes no template base do HyperFrames.

### 6.4 Adaptar os estáticos

1. Clone `ads/ad-01-identidade.html` → `ads/ad-XX-<produto>-<angulo>.html`
2. Ajuste a paleta: mude `--accent`, `--glow-color` para as cores do produto
3. Substitua copy: `.tag`, `.headline`, `.subline`, `.cta-wrap`
4. Decida se `.products` (grid de 4 cards) fica ou sai:
   - **Produto isolado** → remova o bloco `.products` inteiro + remova o `padding-bottom` do `.content`
   - **Hub** → mantenha
5. Renderize e valide (ver seção 3.2)

### 6.5 Adaptar os vídeos

1. Crie `ads/hyperframes/src/configs/ad-XX-<produto>-<angulo>.js`:
   ```js
   export default {
     id: 'ad-06-linkedin-identidade',
     eyebrow: 'Dalton Lab',
     headline: 'Sua marca no LinkedIn.\nTodos os dias.',
     headlineAccent: 'Todos os dias.',
     headlineStrikethrough: null,
     subline: 'Conteúdo alinhado à voz da sua empresa. Pronto para publicar.',
     sublineAccent: null,
     pills: [],
     cta: 'Criar conta →',
     accentColor: '#2563EB',
     glowColor: 'rgba(37, 99, 235, 0.12)',
     showGrid: false,
   }
   ```
2. Rode `node ads/hyperframes/scripts/generate.js` — gera 9 variantes automaticamente (3 estilos × 3 durações) para o novo ad
3. Revise no `/preview/ads` localmente
4. Renderize o variant validado:
   ```bash
   cd ads/hyperframes
   node scripts/render-all.js cinematic-10s
   ```

### 6.6 Validação antes de publicar

```bash
# Dimensões dos PNGs
magick identify ads/ad-0*.png
# Todos devem ser PNG 1080x1080

# Testes do gerador
node --test ads/hyperframes/tests/generate.test.js
# 8 testes devem passar

# Contraste: abrir o PNG e confirmar manualmente que card-desc é legível
# Regra: mínimo 5.3:1 (use https://webaim.org/resources/contrastchecker/)
```

### 6.7 Anti-checklist (o que NÃO fazer)

- **Não coloque preço nos cards** — copy gera o clique, a LP converte
- **Não deixe `<a>` sem `href`** — os templates hoje têm CTAs sem `href` real. Adicione a URL + UTM antes de subir
- **Não renderize todos os 45 variants antes de revisar** — escolha 1 estilo + duração no `/preview/ads`, valide, e renderize só ele
- **Não publique sem ICP definido** — criativo sem persona clara gasta budget sem retorno

---

## 7. Pendências conhecidas

- **CTAs sem `href` + UTM** — `ads/hyperframes/src/templates/base.html:264` tem o `<a>` sem `href`. Patch necessário antes de qualquer campanha nova.
- **MP4s achatados em `output/`** — os 5 MP4s atuais estão diretamente em `ads/hyperframes/output/` sem a subpasta `<adId>/cinematic/`. Foram movidos manualmente. O `render-all.js` cria `output/<adId>/cinematic/10s.mp4`.
- **Conflito de Node version** — raiz pede `>=20`, HyperFrames precisa `>=22`. Em CI/CD vai falhar se a imagem usar Node 20.
- **Estáticos não são config-driven** — cada HTML é editado à mão. Oportunidade futura: unificar com o mesmo modelo de configs do vídeo.
- **`ads/README.md` inexistente** — criar como doc curto apontando para este playbook.

---

## 8. Apêndice — arquivos canônicos

| Para quê | Arquivo |
|---|---|
| Estático de referência | `ads/ad-01-identidade.html` |
| CSS compartilhado | `ads/base.css` |
| Config de vídeo de referência | `ads/hyperframes/src/configs/ad-01-identidade.js` |
| Template base do vídeo | `ads/hyperframes/src/templates/base.html` |
| Timing por duração | `ads/hyperframes/src/timing.js` |
| Gerador de HTMLs | `ads/hyperframes/scripts/generate.js` |
| Render para MP4 | `ads/hyperframes/scripts/render-all.js` |
| Testes | `ads/hyperframes/tests/generate.test.js` |
| Preview no Next.js | `app/preview/ads/AdsPreview.tsx` |
| Handoff original (estáticos) | `docs/handoff/2026-04-17-meta-ads-criativos.md` |
| Plano original (vídeos) | `docs/superpowers/plans/2026-04-21-hyperframes-ads.md` |
