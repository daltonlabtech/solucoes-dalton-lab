# Handoff: Diagnóstico estratégico + plano de correção da LP do Radar

**Data:** 2026-04-21
**Status:** Aguardando decisão do Diego (3 perguntas abertas) + Tasks 1 e 2 prontas para executar

---

## 1. Objetivo

Avaliar o estado real da Operação Ignição (hub + 4 LPs de produtos SaaS para PME) com base em dados do PostHog e código, identificar os maiores gargalos de conversão do Radar (único produto com compra ativa), e definir o que precisa ser corrigido antes de escalar tráfego. O trabalho resultou num plano de implementação com 5 tasks.

---

## 2. Contexto essencial

**Produto:** `soluções.daltonlab.ai` — hub + LPs individuais de 4 produtos SaaS da Dalton Lab para PME brasileiras.

**Stack:**
- Next.js 15 (App Router), TypeScript, Tailwind CSS
- PostHog (analytics + session recording) — projeto "Soluções" (id: 377117) + projeto "Radar" (id: 373956)
- Stripe (checkout nativo, payment link)
- GTM instalado (GTM-PPF26W8Q)
- Deploy: Vercel (presumido) em `solucoes.daltonlab.ai`

**Os 4 produtos:**
| Produto | URL | Status | CTA |
|---|---|---|---|
| Radar | `/radar` | Único produto funcional | Compra Stripe (R$297/mês) |
| SDR WhatsApp | `/sdr` | LP smoke test | Waitlist |
| Gerador de Propostas | `/propostas` | LP smoke test | Waitlist |
| Transcrição + CRM | `/crm` | LP smoke test | Waitlist |

**Estratégia:** Smoke test — validar demanda antes de construir. Os 3 produtos além do Radar são LPs de waitlist; só o Radar está buildado e pode gerar caixa hoje.

**Time:**
- Diego: dev principal
- Marcelo: co-founder (negócio/copy)
- João: gestor de tráfego pago (iniciou ~13/04)
- Rodrigo: vídeos de demo (não iniciado)

**Meta declarada:** 200 vendas em 90 dias → R$204K caixa líquido no trimestre.

---

## 3. O que já foi feito nesta sessão

### Análise estratégica
- Leu e discutiu artigo sobre fases de startups (Sobrevivência = R$0–240k ARR)
- Concluiu: a empresa está em fase de Sobrevivência; o único sinal que importa agora é Radar gerar caixa recorrente

### Análise de dados (PostHog + código)
- Abriu dashboard público do PostHog: `https://us.posthog.com/shared/ziNsJd0WUXOsU7KWUSMaKA2HweiSsg`
- Conectou via MCP do PostHog e rodou queries HogQL direto nos projetos
- Levantou dados dos últimos 7–14 dias (ver seção 4 para números)

### Revisão da LP do Radar
- Usou agent-browser + leitura direta de código para mapear a página completa
- Identificou 2 bugs técnicos e 3 problemas de copy/conversão
- Viu o checkout Stripe (screenshot enviada pelo Diego) — confirmado: fluxo limpo, sem campos extras, não é o problema

### Plano de implementação
- Criado e salvo em `docs/superpowers/plans/2026-04-21-radar-lp-conversion-fixes.md`
- 5 tasks: 2 executáveis imediatamente, 3 aguardam decisão do Diego

---

## 4. Estado atual

### Números reais (PostHog — últimos 7 dias a partir de 18/04)

**Projeto Soluções (hub + LPs):**
| Métrica | Valor |
|---|---|
| Pageviews totais | ~2.074 |
| Visitas únicas /radar | 1.253 |
| Visitas únicas /sdr + /crm + /propostas | 31 (1,5% do total) |
| CTA clicks únicos no /radar | 141 (11,2% de conversão LP→CTA) |
| Waitlist modal aberto | 4 |
| Waitlist signup completo | 1 |

**Projeto Radar (app):**
| Métrica | Valor (30 dias) |
|---|---|
| `checkout_completed` | 3 eventos, mas 2 são testes da equipe |
| Compra real | **1** (dia 16/04) |
| `login_completed` | ~133 eventos (usuários existentes ativos) |
| Pico: 61 logins em 14/04 | Origem desconhecida (pode ser teste) |

**Conversão real do funil:**
- 1.253 visitantes → 141 clicaram no CTA (11,2%) → **1 compra real** (~0,7%)
- O spike de 1.315 views em 17/04 é a campanha de tráfego escalonando

### Bugs identificados no código

**Bug 1 — Propriedade do evento com nome errado** (`lib/posthog.ts:25`)
```typescript
// ATUAL (errado):
posthog.capture('cta_clicked', { plan: 'radar', location });

// CORRETO:
posthog.capture('cta_clicked', { plan: 'radar', cta_location });
```
O dashboard e as queries usam `cta_location`, mas o evento captura `location`. A propriedade existe no PostHog mas nunca é encontrada corretamente.

**Bug 2 — Footer CTA sem rastreamento** (`app/radar/page.tsx:46-52`)
O CTA no final da página é um `<a>` puro, sem `onClick` e sem `trackCtaClick`. Clicks aparecem apenas como `$autocapture`, fora do funil de conversão.

### Problemas de copy/conversão identificados

**Problema 3 — "Uso interno Dalton Lab"** (`LandingProof.tsx:53`)
O before/after usa a própria equipe como "prova social". Visitante frio lê como autodeclaração, não como testemunho.

**Problema 4 — Sem garantia na seção de preço** (`LandingPricing.tsx`)
Há "Cancelamento a qualquer momento" mas nenhuma garantia explícita (ex: 7 dias de reembolso). Para tráfego frio com R$297/mês, isso aumenta a percepção de risco.

**Problema 5 — ICP da tag pode estar desalinhado**
Tag no hero: `"Radar · Analytics para criadores de conteúdo"`
Se João está rodando anúncios para donos de PME, pode haver desalinhamento entre o que o anúncio promete e o que a página entrega.

### O que está funcionando
- LP tem design profissional e estrutura sólida
- CTR de CTA de 11,2% é saudável para tráfego frio
- Produto tem usuários ativos reais (logins regulares no app)
- Checkout Stripe está limpo — não é o gargalo

---

## 5. Próximos passos

Ordem de prioridade:

1. **[Diego decide]** Responder as 3 perguntas abertas (seção 6)
2. **[Executar agora — sem bloqueio]** Task 1 do plano: corrigir nome da propriedade em `lib/posthog.ts`
3. **[Executar agora — sem bloqueio]** Task 2 do plano: adicionar `trackCtaClick` no footer CTA (criar `LandingFooterCTA.tsx`)
4. **[Após decisão do Diego]** Task 3: substituir "Uso interno Dalton Lab" por depoimento real
5. **[Após decisão do Diego]** Task 4: adicionar garantia de 7 dias na seção de preço
6. **[Após decisão do Diego]** Task 5: atualizar tag de ICP
7. **[Paralelamente]** Confirmar com João quais criativos estão no ar e para qual URL estão apontando (hub vs /radar)
8. **[Próxima semana]** Rever números após correções para ver se a conversão melhorou

---

## 6. Perguntas em aberto

### P1 — Depoimento real (desbloqueia Task 3)
Diego precisa fornecer:
- Nome completo ou nome + sobrenome
- @ do Instagram da pessoa
- Uma frase curta (1-2 linhas) descrevendo o resultado que viu com o Radar

*Quem perguntar: o 1 cliente pagante real (comprou em 16/04), ou alguém dos testes/amigos que tenha visto resultado real.*

### P2 — Garantia de 7 dias (desbloqueia Task 4)
A pergunta é operacional: se um cliente pedir reembolso nos primeiros 7 dias, a Dalton Lab devolve sem questionamento?

*Se sim: adicionar o texto na LP. Se não: pensar em alternativa (ex: "30 minutos com nosso time se não ver valor").*

### P3 — ICP da tag no hero (desbloqueia Task 5)
Escolher uma das opções:
- **A:** Manter "Analytics para criadores de conteúdo"
- **B:** "Analytics para o seu Instagram" (mais neutro)
- **C:** "Pare de postar no escuro" (foca na dor)

*Depende de quem o João está mirando nos anúncios — confirmar com ele antes de decidir.*

### P4 — (Investigação, não bloqueante) O que causou o spike de 61 logins em 14/04?
Pode ser um teste interno, pode ser uma ação que gerou engajamento. Vale entender se é replicável.

### P5 — Status real das campanhas
Confirmar com o João:
- Os 5 criativos estáticos estão no ar?
- Estão apontando para o hub (`solucoes.daltonlab.ai`) ou direto para `/radar`?
- Qual o investimento diário atual?

---

## 7. Artefatos relevantes

**Plano de implementação:**
```
docs/superpowers/plans/2026-04-21-radar-lp-conversion-fixes.md
```

**Arquivos do código a modificar:**
```
lib/posthog.ts                                    ← Bug 1 (propriedade)
app/radar/page.tsx                                ← Bug 2 (footer CTA)
components/landing/radar/LandingProof.tsx         ← Problema 3 (depoimento)
components/landing/radar/LandingPricing.tsx       ← Problema 4 (garantia)
components/landing/radar/LandingHero.tsx          ← Problema 5 (ICP tag)
```
*Novo arquivo a criar: `components/landing/radar/LandingFooterCTA.tsx`*

**Dashboard PostHog público:**
```
https://us.posthog.com/shared/ziNsJd0WUXOsU7KWUSMaKA2HweiSsg
```

**PostHog projetos (via MCP):**
- Soluções: project id `377117`
- Radar (app): project id `373956`

**Checkout Stripe atual:**
```
buy.stripe.com/4gM8wPfdYbD59QbepbfYY0z?prefilled_promo_code=DALTON
```
*(não commitar — pegar de `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` no env)*

**Eventos PostHog relevantes (projeto Soluções):**
```
$pageview, cta_clicked, waitlist_modal_opened, waitlist_signup, waitlist_modal_abandoned
```

**Eventos PostHog relevantes (projeto Radar/app):**
```
checkout_completed, login_completed, account_connected, cta_clicked
```

**Comando para checar todas as chamadas de trackCtaClick:**
```bash
grep -rn "trackCtaClick" --include="*.tsx" --include="*.ts" .
```

---

## 8. Instruções para a próxima sessão

**Tom:** Direto e estratégico. Diego é co-founder técnico, sabe o que quer, não precisa de explicações longas. Falar em português.

**O que fazer primeiro:** Perguntar se Diego já tem respostas para as 3 perguntas abertas (P1, P2, P3). Se sim, executar todas as 5 tasks do plano. Se não, executar só as Tasks 1 e 2 (bugs técnicos, sem bloqueio).

**Armadilhas a evitar:**

1. **Não tratar os 3 outros produtos como prioridade agora.** SDR, Propostas e CRM têm ~31 visitas combinadas em 7 dias — qualquer otimização neles é prematura. O foco é o Radar.

2. **Não confundir dados de teste com dados de produto.** Checkouts de 09/04 e 13/04 são testes da equipe. A única venda real é a de 16/04. Logins antes de 15/04 também são majoritariamente internos.

3. **Não sugerir refatorações além do escopo.** As correções são cirúrgicas. Não propor reestruturação de componentes, mudança de stack ou outras melhorias não discutidas.

4. **Não inventar números.** A meta de 200 vendas em 90 dias requer ~15x o volume atual OU ~15x melhor conversão. Não sugar-coat isso — Diego já sabe e prefere ter o mapa honesto.

5. **Se o plano já foi executado parcialmente**, verificar quais tasks têm checkbox marcado antes de propor ações.

6. **Branch atual:** `feat/posthog-product-pageview` — há modificações não commitadas em `app/page.tsx`. Verificar status do git antes de criar novos commits.
