import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'

const requestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
  model: z.string(),
  maxTokens: z.number().min(1).max(32768),
  systemPrompt: z.string().optional(),
  apiKey: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { messages, model, maxTokens, systemPrompt, apiKey } = parsed.data

    if (!apiKey.startsWith('sk-ant-')) {
      return Response.json(
        { error: 'Invalid API key format. Key must start with sk-ant-' },
        { status: 400 }
      )
    }

    const client = new Anthropic({ apiKey })

    const stream = await client.messages.stream({
      model,
      max_tokens: maxTokens,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages,
    })

    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta') {
              const delta = event.delta as { type: string; text?: string }
              if (delta.type === 'text_delta' && delta.text) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ type: 'text_delta', text: delta.text })}\n\n`
                  )
                )
              }
            }
          }
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'message_stop' })}\n\n`)
          )
          controller.close()
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Stream error'
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', error: message })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return Response.json({ error: message }, { status: 500 })
  }
}
