# Revisão de Copy — LP Gerador de Propostas

**Data:** 2026-04-10  
**Produto:** Gerador de Propostas (`/propostas`)  
**Objetivo:** Corrigir 6 problemas de conversão identificados na análise analítica

---

## Diagnóstico

### Problemas P1 — Críticos (resolvidos)

| # | Problema | Arquivo | Solução aplicada |
|---|---------|---------|-----------------|
| 1 | Social proof vazia | `page.tsx` | Substituída por seção de validação com 3 quotes de entrevistas |
| 2 | Inconsistência "250/semana" vs "250/mês" | `page.tsx:61+66` | Corrigido para "250/mês numa equipe de 5 vendedores" |
| 3 | CTA genérico "Garantir meu lugar" repetido 4x | `page.tsx`, `PricingWaitlist`, `WaitlistModal` | Trocado por "Quero acesso antecipado →" e "Confirmar minha vaga →" |

### Problemas P2 — Alto impacto (resolvidos)

| # | Problema | Solução aplicada |
|---|---------|-----------------|
| 4 | Stat "4+ empresas" de baixa credibilidade | Trocada por "100% das equipes que entrevistamos montavam proposta no PowerPoint — manualmente" |
| 5 | Subheadline longa e técnica | Reescrita: foco em benefício direto, sem nome do produto |
| 6 | Step titles funcionais sem benefício | "Conecta" → "Puxa do CRM — zero digitação" etc. |

### Pontos mantidos (sem mudança)

- Headline do hero: "Proposta pronta em 1 minuto — direto do seu CRM." ✓
- Título da dor: "41 horas por semana montando proposta não é processo — é desperdício." ✓
- Título da solução: "Do lead aprovado à proposta enviada — sem abrir o PowerPoint." ✓
- Closing da solução: "Sem copiar e colar. Sem erros de digitação. Sem esperar o assistente ter tempo." ✓
- FAQ: mantidos os 5 itens originais, adicionados 2 novos

---

## Arquivos modificados

### `app/propostas/page.tsx`
- Subheadline do hero reescrita
- `ctaLabel="Quero acesso antecipado →"` passado para HeroLP
- Pain: body p1 corrigido (equipe de 5 vendedores, 250/mês)
- Pain: stat 1 corrigida (250/mês com contexto), stat 3 trocada (100%)
- Solution: 3 step titles reescritos orientados a benefício
- Social proof: `<SocialProofPlaceholder />` removido, substituído por seção de validação inline
- Pricing: `ctaLabel="Quero acesso antecipado →"` passado para PricingWaitlist
- FAQ: 2 novas perguntas adicionadas (configuração e planilha)
- CTA mobile fixo: novo texto
- WaitlistModal: `modalTitle` e `ctaLabel` passados como props

### `components/sections/PricingWaitlist.tsx`
- Adicionada prop `ctaLabel?: string` com default `'Garantir meu lugar →'`
- Mudança não-breaking: SDR, CRM e Radar permanecem com texto original

### `components/WaitlistModal.tsx`
- Adicionadas props `modalTitle?: string` e `ctaLabel?: string` com defaults
- Mensagem de sucesso atualizada para criar expectativa positiva
- Mudança não-breaking: outras LPs não afetadas

---

## Checklist de verificação

- [ ] `/propostas`: ler sequência hero → dor → solução → proof → pricing → FAQ
- [ ] Números consistentes: corpo diz "equipe de 5, 250/mês" = stat "250/mês"
- [ ] CTA hero → modal com título "Entrar na lista de espera" e botão "Confirmar minha vaga →"
- [ ] CTA pricing → mesmo modal
- [ ] `/sdr`, `/crm`, `/radar` mantêm "Garantir meu lugar" inalterado
- [ ] Mobile: CTA fixo bottom com "Quero acesso antecipado →"

---

## Próximos passos sugeridos

1. **Social proof real**: Quando tiver os primeiros clientes na lista, substituir os quotes por depoimentos reais com nome e empresa
2. **A/B test CTA**: Testar "Quero acesso antecipado" vs "Garantir meu lugar" via PostHog feature flags
3. **Replicar para outras LPs**: Aplicar a mesma revisão analítica em `/sdr` e `/crm`
