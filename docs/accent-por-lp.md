# Accent color por LP — discussão em aberto

**Contexto:** Conversa de 10 abr 2026 durante revisão da LP do SDR WhatsApp.

---

## A questão

Faz sentido a Home ter o laranja Dalton Lab como destaque e cada LP ter um accent próprio?

## Conclusão preliminar: sim, mas com regra clara

O risco de cor por LP é **fragmentar a marca** — cada produto parecer de uma empresa diferente. A solução é separar por função:

| Elemento | Regra |
|---|---|
| CTAs, botões, links, foco, logo | **Sempre laranja `#F97316`** — sinal de ação da Dalton Lab |
| Glow do hero, badge, dividers, ícones do produto | **Accent por produto** — diferencia sem fragmentar |

## Mapeamento proposto

| Produto | Accent secundário | Justificativa |
|---|---|---|
| SDR WhatsApp | `#25D366` (verde) | Cor nativa do WhatsApp — comunica antes de ler |
| Gerador de Propostas | `#3B82F6` (azul) | Associação com documentos, profissional |
| Transcrição + CRM | `#8B5CF6` (roxo) | Associação com áudio, IA |
| Radar | `#D97706` (âmbar) | Já é a segunda cor da Dalton Lab |

## O que muda por LP

- Cor do glow do hero (`bg-gradient-glow` no globals)
- Cor da borda e fundo do badge (ex: `badge-sdr`, `badge-propostas`)
- Cor dos dividers decorativos (`divider-glow`)
- Cor dos ícones/números dos steps na SolutionSection
- Cor do `border-t` nos stat cards da PainSection

## O que NÃO muda

- Cor do botão primário (`bg-dalton-cyan` = laranja)
- Cor do foco/ring de acessibilidade
- Cor dos links e hovers
- Logo e navbar

## Como implementar

A forma mais limpa é via CSS custom property por página — sem criar variantes de componente.

No `layout.tsx` de cada LP (ou no `page.tsx` com um wrapper):

```tsx
// app/sdr/page.tsx
<div style={{ '--lp-accent': '#25D366' } as React.CSSProperties}>
  ...
</div>
```

No globals.css, trocar as referências decorativas de `dalton-cyan` por `var(--lp-accent)`:

```css
.divider-glow {
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--lp-accent) 30%, transparent), transparent);
}
```

Componentes como `Badge`, os números dos steps e os stat cards podem consumir `var(--lp-accent)` diretamente.

## Status

- [ ] Aprovação do conceito (cor por elemento, não por componente inteiro)
- [ ] Validar paleta — especialmente o verde do SDR em contexto dark
- [ ] Implementar token `--lp-accent` no globals.css
- [ ] Atualizar componentes decorativos para consumir o token
- [ ] Aplicar por página: SDR → Propostas → CRM → Radar
