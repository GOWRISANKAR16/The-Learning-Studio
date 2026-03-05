import { useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { useAuthStore } from '../store/authStore'
import { useMessagesStore } from '../store/messagesStore'

export function MessagesPage() {
  const auth = useAuthStore()
  const messagesStore = useMessagesStore()
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  if (!auth.user) {
    return (
      <AppShell>
        <div className="rounded-xl bg-white p-6 text-sm text-slate-600 shadow-sm">
          Please sign in to view messages.
        </div>
      </AppShell>
    )
  }

  const threads = messagesStore.getThreadsForUser(auth.user!.id)
  const activeThread =
    threads.find((t) => t.id === activeThreadId) ?? threads[0] ?? null

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId)
    messagesStore.markThreadRead({ userId: auth.user!.id, threadId })
  }

  const handleSend = () => {
    if (!activeThread || !draft.trim()) return
    messagesStore.sendMessage({
      userId: auth.user!.id,
      threadId: activeThread.id,
      text: draft,
    })
    setDraft('')
  }

  return (
    <AppShell>
      <div className="flex gap-4">
        <aside className="hidden w-64 flex-shrink-0 rounded-xl bg-white p-3 shadow-sm md:block">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">
            Conversations
          </h2>
          <div className="space-y-1 text-sm">
            {threads.length === 0 && (
              <p className="text-xs text-slate-500">
                No conversations yet. Start learning a course and send a
                question from there.
              </p>
            )}
            {threads.map((thread) => {
              const unreadCount = thread.messages.filter(
                (m) => !m.isRead && m.from === 'instructor',
              ).length
              const isActive =
                activeThread?.id === thread.id || (!activeThread && threads[0]?.id === thread.id)
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => handleSelectThread(thread.id)}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left ${
                    isActive ? 'bg-sky-50 text-sky-800' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="line-clamp-1 text-xs font-medium">
                    {thread.courseTitle}
                  </span>
                  {unreadCount > 0 && (
                    <span className="ml-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-sky-600 px-1 text-[10px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </aside>

        <section className="flex min-h-[320px] flex-1 flex-col rounded-xl bg-white shadow-sm">
          {!activeThread && threads.length === 0 && (
            <div className="flex flex-1 items-center justify-center p-6 text-sm text-slate-500">
              Select a course and start a conversation from its page to see
              messages here.
            </div>
          )}

          {activeThread && (
            <>
              <header className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-900">
                Messages · {activeThread.courseTitle}
              </header>
              <div className="flex-1 space-y-2 overflow-y-auto px-4 py-3 text-sm">
                {activeThread.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.from === 'student' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-3 py-2 ${
                        msg.from === 'student'
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <footer className="border-t border-slate-100 px-3 py-2">
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600"
                    placeholder="Type your message…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    className="rounded-md bg-sky-700 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-800"
                  >
                    Send
                  </button>
                </div>
              </footer>
            </>
          )}
        </section>
      </div>
    </AppShell>
  )
}

