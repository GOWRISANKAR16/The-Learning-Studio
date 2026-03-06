import { useState, useRef, useEffect } from 'react'
import { getChatReply } from '../../lib/apiClient'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

type ChatPanelProps = {
  userName: string
  onClose: () => void
}

export function ChatPanel({ userName, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayName = userName.trim() ? userName.toUpperCase() : 'THERE'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleNewChat = () => {
    setMessages([])
    setInput('')
    inputRef.current?.focus()
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const reply = await sendToAssistant(text, messages)
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sorry, I couldn’t reach the assistant right now. Please try again.'
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: message,
          createdAt: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const hasMessages = messages.length > 0

  return (
    <div className="relative flex h-full flex-col bg-white">
      {/* Top bar: title, History, New Chat, Close – Learning Studio theme */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3">
        <span className="text-sm font-semibold text-sky-700">AI Assistant</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200"
            title="History"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            History
          </button>
          <button
            type="button"
            onClick={handleNewChat}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200"
            title="New chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Chat
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main content: welcome or messages */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {!hasMessages ? (
          <div className="flex flex-col items-center justify-center pt-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-sky-700">
              Welcome {displayName}!
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Hey buddy! Need any assistance or up for a chat?
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-500">
                  <span className="inline-flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-slate-200 p-3">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Start your chat with AI..."
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50 disabled:hover:bg-sky-600"
            aria-label="Send"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  )
}

const HF_SPACE_BASE = 'https://gowrisankara-qwen-qwen2-5-coder-32b-instruct.hf.space'

const API_PREFIXES = ['', '/gradio_api']

async function sendToAssistant(
  userMessage: string,
  previousMessages: ChatMessage[],
): Promise<string> {
  const history = previousMessages.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  let backendError: Error | null = null
  try {
    return await getChatReply(userMessage, history)
  } catch (err) {
    backendError = err as Error
  }

  const hfResult = await sendToAssistantHF(userMessage)
  const isHfError =
    hfResult.includes('temporarily unavailable') || hfResult.includes('having trouble')
  if (isHfError && backendError) throw backendError
  return hfResult
}

async function sendToAssistantHF(userMessage: string): Promise<string> {
  const endpointsToTry = ['chat', 'predict']
  let lastServerError = false
  for (const prefix of API_PREFIXES) {
    const base = `${HF_SPACE_BASE}${prefix}`
    for (const apiName of endpointsToTry) {
      for (const chatWithHistory of apiName === 'chat' ? [false, true] : [false]) {
        try {
          const payload =
            apiName === 'chat' && chatWithHistory
              ? { data: [userMessage, []] }
              : { data: [userMessage] }
          const postRes = await fetch(`${base}/call/${apiName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
          if (!postRes.ok) {
            if (postRes.status >= 500) lastServerError = true
            continue
          }
          let postData: { event_id?: string }
          try {
            postData = await postRes.json()
          } catch {
            continue
          }
          const eventId = postData?.event_id
          if (!eventId || typeof eventId !== 'string') continue

          const result = await pollForResult(base, apiName, eventId)
          return result
        } catch {
          continue
        }
      }
    }
  }
  if (lastServerError) {
    return 'The assistant service is having trouble right now. Please try again in a moment.'
  }
  return 'The AI assistant is temporarily unavailable. Try again later.'
}

async function pollForResult(baseUrl: string, apiName: string, eventId: string): Promise<string> {
  const maxAttempts = 60
  const intervalMs = 1500
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(`${baseUrl}/call/${apiName}/${eventId}`, {
        headers: { Accept: 'text/event-stream' },
      })
      if (!res.ok) continue
      const text = await res.text()
      const extracted = extractResultFromResponse(text)
      if (extracted) return extracted
    } catch {
      // ignore
    }
    await new Promise((r) => setTimeout(r, intervalMs))
  }
  throw new Error('Timeout')
}

function extractResultFromResponse(text: string): string | null {
  const dataLine = text.split('\n').find((line) => line.startsWith('data:'))
  if (!dataLine) return null
  const jsonStr = dataLine.replace(/^data:\s*/, '').trim()
  if (!jsonStr) return null
  try {
    const parsed = JSON.parse(jsonStr) as unknown
    const arr = Array.isArray(parsed) ? parsed : [parsed]
    const last = arr.length > 0 ? arr[arr.length - 1] : null
    if (typeof last === 'string') return last
    if (last && typeof last === 'object' && last !== null && 'content' in last && typeof (last as { content: unknown }).content === 'string') {
      return (last as { content: string }).content
    }
    if (arr.length > 0 && typeof arr[0] === 'string') return arr[0] as string
  } catch {
    // ignore
  }
  return null
}
