# A/B Testing — Design Spec

**Data:** 2026-04-13  
**Escopo:** Sistema de A/B testing para as 5 LPs (Hub + Radar, CRM, Propostas, SDR)

---

## Visão Geral

Infraestrutura de A/B testing que permite ao time de negócio criar e validar variantes de landing pages sem comprometer performance. O split de tráfego acontece no servidor (sem flash de conteúdo), e o PostHog mantém seu papel nativo de análise e dashboard de experimentos.

---

## Arquitetura

### Decisão de Variante — Middleware (server-side)

O Next.js middleware intercepta requests das LPs com experimento ativo e sorteia a variante (50/50) via cookie. A decisão acontece no Edge, antes da renderização, eliminando qualquer flash de conteúdo.

```
Request → middleware.ts → sorteia variante → seta cookie → rewrite para página correta
```

Fluxo detalhado:
1. Request chega para `/radar`
2. Middleware verifica se `radar` está em `ACTIVE_EXPERIMENTS`
3. Se sim: lê cookie existente ou sorteia nova variante (50/50)
4. Seta cookie `ab_variant_radar` com valor `control` ou `test`
5. Renderiza a página correta server-side (sem rewrite de URL visível)

### PostHog — Bootstrap + Análise

O PostHog é inicializado com a variante já resolvida via `bootstrap`, eliminando o request `/decide` que normalmente acontece na inicialização. Isso:
- Remove uma round-trip de rede na inicialização do PostHog
- Mantém o dashboard nativo de Experiments funcionando
- Preserva cálculo automático de significância estatística

```ts
posthog.init(POSTHOG_KEY, {
  bootstrap: {
    featureFlags: { [flagKey]: variant } // lido do cookie server-side
  }
})
```

### Config Central de Experimentos

```ts
// lib/experiments.ts
export const ACTIVE_EXPERIMENTS: Record<string, boolean> = {
  hub: false,
  radar: false,
  crm: false,
  propostas: false,
  sdr: false,
}
```

Ligar/desligar um experimento = mudar `false` para `true` + deploy. Sem dashboard externo, sem variável de ambiente separada.

---

## Estrutura de Arquivos

```
app/
  page.tsx                    ← Hub variante A (não muda)
  variant-b/
    page.tsx                  ← Hub variante B (criada quando houver teste)
  radar/
    page.tsx                  ← Radar variante A
    variant-b/
      page.tsx                ← Radar variante B
  crm/
    page.tsx
    variant-b/
      page.tsx
  propostas/
    page.tsx
    variant-b/
      page.tsx
  sdr/
    page.tsx
    variant-b/
      page.tsx

lib/
  experiments.ts              ← config central (quais testes estão ativos)
  posthog.ts                  ← atualizado para aceitar variant no bootstrap

middleware.ts                 ← lógica de split (atualizado)
```

A pasta `variant-b/` só existe quando há um teste em andamento para aquela LP. Quando não há teste, a LP funciona exatamente como hoje — zero overhead.

---

## Fluxo de Trabalho — Criar um Novo Teste

1. Time de negócio entrega spec da variante B (doc ou conversa com Claude Code)
2. Criar `app/[lp]/variant-b/page.tsx` com a nova LP
3. **Rodar Lighthouse na variante B** — score deve ser ≥ score da variante A (mínimo 80, meta 90)
4. Mudar `[lp]: true` em `lib/experiments.ts`
5. No PostHog: criar Experiment com flag key `[lp]-lp-test`, variantes `control` e `test`
6. Deploy
7. Monitorar no dashboard do PostHog (conversões por variante, significância estatística)

### Encerrar um Teste

1. Identificar variante vencedora no PostHog
2. Substituir `app/[lp]/page.tsx` pelo conteúdo da variante vencedora
3. Apagar `app/[lp]/variant-b/`
4. Mudar `[lp]: false` em `lib/experiments.ts`
5. Arquivar o Experiment no PostHog
6. Deploy

---

## Regra de Performance

**Toda variante B deve passar por Lighthouse antes de ir para produção.**

- Score mínimo: igual ou superior à variante A da mesma LP
- Baseline atual: 80 (meta: 90)
- Checar especialmente: imagens sem otimização, fontes extras, JS desnecessário

Se a variante B cair abaixo da variante A, o teste não sobe. Performance degradada contamina os resultados — não é possível saber se a variante perdeu por copy ou por lentidão.

---

## Componentes a Implementar

| Componente | Arquivo | Descrição |
|---|---|---|
| Config de experimentos | `lib/experiments.ts` | Map com flags ativas por LP |
| Middleware de split | `middleware.ts` | Sorteia variante, seta cookie, passa para PostHog bootstrap |
| PostHog bootstrap | `lib/posthog.ts` | Aceita `variant` como parâmetro no init |
| PostHogProvider update | `components/PostHogProvider.tsx` | Lê cookie server-side, passa variant para bootstrap |

---

## O que NÃO muda

- URLs públicas (sem `/variant-b` visível para o usuário)
- Tracking existente (`cta_clicked`, `waitlist_submitted`, etc.)
- Estrutura de componentes das LPs atuais
- Pipeline de deploy

---

## Responsabilidades

| Quem | O quê |
|---|---|
| Diego | Criar experimento no PostHog, ativar flag em `experiments.ts` |
| Time de negócio | Criar/especificar variante B |
| Ambos (com Claude Code) | Implementar variante B a partir da spec |
