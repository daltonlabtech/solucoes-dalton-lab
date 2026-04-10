// components/sections/WhatsAppProof.tsx
// Mock genérico (qualquer PME se reconhece) + dados reais atribuídos

const messages = [
  { from: 'lead', text: 'Oi, vocês ainda têm vaga essa semana?', time: '22:47' },
  { from: 'sdr', text: 'Oi! Temos sim 👋\nQual serviço você tem interesse?', time: '22:47' },
  { from: 'lead', text: 'Queria o pacote mensal.\nQuanto fica?', time: '22:48' },
  {
    from: 'sdr',
    text: 'O pacote mensal inclui tudo que você precisa pra começar. Vou chamar a Ana — ela confirma os detalhes e os horários disponíveis.',
    time: '22:48',
  },
]

const stats = [
  { value: '< 1 seg', label: 'Tempo mediano de resposta do SDR' },
  { value: '23,6%', label: 'Das conversas acontecem fora do horário comercial' },
  { value: '693', label: 'Conversas atendidas em 2,5 meses — sem um vendedor envolvido' },
]

export function WhatsAppProof() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="divider-glow mb-16" />

        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
            Funciona enquanto você dorme.
          </h2>
          <p className="text-dalton-gray-light text-lg">
            Às 22h47, um lead chegou. Nenhum vendedor estava online.
            O SDR respondeu em menos de 1 segundo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 items-start">

          {/* WhatsApp mock */}
          <div
            className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{ background: '#0b141a' }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center gap-3 border-b border-white/5"
              style={{ background: '#1f2c34' }}
            >
              <div className="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-orange-400">SD</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">SDR WhatsApp</p>
                <p className="text-[#25d366] text-xs">online agora</p>
              </div>
            </div>

            {/* Chat area */}
            <div className="p-4 flex flex-col gap-2" style={{ background: '#0b141a' }}>

              {/* Timestamp centralizado */}
              <div className="flex justify-center mb-1">
                <span
                  className="text-[#8696a0] text-[10px] px-3 py-1 rounded-full"
                  style={{ background: '#1f2c34' }}
                >
                  Hoje, 22:47
                </span>
              </div>

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === 'sdr' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[78%] ${
                      msg.from === 'sdr' ? 'rounded-tr-none' : 'rounded-tl-none'
                    }`}
                    style={{ background: msg.from === 'sdr' ? '#005c4b' : '#202c33' }}
                  >
                    <p className="text-white text-sm whitespace-pre-line leading-snug">{msg.text}</p>
                    <p className="text-[#8696a0] text-[10px] text-right mt-1">
                      {msg.time}{msg.from === 'sdr' ? ' ✓✓' : ''}
                    </p>
                  </div>
                </div>
              ))}

              {/* Handoff */}
              <div
                className="mt-2 rounded-lg px-4 py-3 border border-green-500/20"
                style={{ background: 'rgba(37, 211, 102, 0.07)' }}
              >
                <p className="text-green-400 text-xs font-semibold mb-1">🔔 Ana recebeu o lead</p>
                <p className="text-[#8696a0] text-xs leading-snug">
                  Quer pacote mensal, perguntou sobre preço. Pronto para agendar.
                </p>
              </div>
            </div>
          </div>

          {/* Stats + atribuição */}
          <div className="flex flex-col gap-4">
            {stats.map((s, i) => (
              <div key={i} className="glass-card p-6">
                <p className="text-3xl md:text-4xl font-black gradient-text mb-1">{s.value}</p>
                <p className="text-dalton-gray-light text-sm leading-snug">{s.label}</p>
              </div>
            ))}

            <p className="text-dalton-gray-mid text-xs text-center pt-2 leading-relaxed">
              Dados reais coletados em produção.<br />
              Consultoria financeira para brasileiros no exterior — jan–abr 2026.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
