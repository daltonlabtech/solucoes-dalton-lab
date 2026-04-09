// app/api/waitlist/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface WaitlistPayload {
  nome: string
  whatsapp: string
  empresa: string
  price_answer: 'sim' | 'conversa' | 'nao'
  product: string
}

export async function POST(req: NextRequest) {
  let body: WaitlistPayload

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { nome, whatsapp, empresa, price_answer, product } = body

  if (!nome || !whatsapp || !empresa || !product) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 422 })
  }

  const apiUrl = process.env.WAITLIST_API_URL
  const apiKey = process.env.WAITLIST_API_KEY

  if (!apiUrl) {
    // Em dev sem configuração, simula sucesso
    console.log('[waitlist] Lead recebido (sem DB configurado):', { nome, whatsapp, empresa, price_answer, product })
    return NextResponse.json({ ok: true, message: 'Lead registrado (modo dev)' })
  }

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      nome,
      whatsapp,
      empresa,
      price_answer,
      product,
      created_at: new Date().toISOString(),
      source: 'solucoes.daltonlab.ai',
    }),
  })

  if (!res.ok) {
    console.error('[waitlist] Erro ao salvar lead:', res.status, await res.text())
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
