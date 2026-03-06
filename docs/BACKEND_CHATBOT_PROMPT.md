# Backend: Add POST /chat for AI Assistant (copy this to your backend team)

The Learning Studio frontend calls **POST /chat** on your API for the in-app AI Assistant. Follow this document exactly so the frontend works without changes.

---

## 1. What the frontend does (do not change the frontend)

- Sends **POST** to: `{API_BASE_URL}/chat` (then if 404, tries `{API_BASE_URL}/api/chat`).
- **Headers:** `Content-Type: application/json`, `Authorization: Bearer <access_token>` (same JWT as `/courses/:id/lessons`, etc.).
- **Body:** `{ "message": "<user text>", "history": [ { "role": "user"|"assistant", "content": "..." }, ... ] }`
- Expects **200** with JSON that has a **string reply** in one of these keys (first found wins):  
  `reply`, `content`, `message`, `response`, `text`, `result`, `output`  
  or inside `data.reply`, `data.content`, etc.
- On **401**: show “Unauthorized” / session expired.  
- On **400/502/503/500**: show `error.message` or `message` from your JSON (frontend shows it in the chat).

**Your backend must:** Implement **POST /chat** at the **same base URL** as your other routes (e.g. `https://learning-managment-platform-backend.onrender.com/chat`), with **same JWT auth** as other protected routes.

---

## 2. Contract: request and response

### Request

- **Method:** POST  
- **Path:** `/chat` (or `/api/chat` if you mount under `/api`; frontend tries both).
- **Headers:**  
  - `Content-Type: application/json`  
  - `Authorization: Bearer <access_token>` (required; same JWT as `/auth/me`, progress, etc.)  
  - Cookie for refresh (frontend sends `credentials: 'include'`).
- **Body (JSON):**
  ```json
  {
    "message": "What is React?",
    "history": [
      { "role": "user", "content": "Hi" },
      { "role": "assistant", "content": "Hello! How can I help?" }
    ]
  }
  ```
  - `message` (string, required): current user message.  
  - `history` (array, optional): previous turns. You can ignore it and only use `message` for the AI call.

### Success response (200)

Return **exactly** one of these (frontend accepts any of these keys):

```json
{ "reply": "React is a JavaScript library for building user interfaces..." }
```

or

```json
{ "content": "React is a JavaScript library for building user interfaces..." }
```

Other keys the frontend also accepts: `message`, `response`, `text`, `result`, `output`. Prefer **`reply`** or **`content`** for clarity.

### Error responses (must be JSON)

- **401 Unauthorized** (missing or invalid token):
  ```json
  { "error": { "message": "Unauthorized" } }
  ```
  or `{ "message": "Unauthorized" }`

- **400 Bad Request** (e.g. missing or invalid body):
  ```json
  { "error": { "message": "Message is required" } }
  ```

- **502 / 503** (AI service down or timeout):
  ```json
  { "error": { "message": "AI service temporarily unavailable" } }
  ```

- **500 Internal Server Error**:
  ```json
  { "error": { "message": "Something went wrong. Please try again." } }
  ```
  Do **not** expose stack traces or internal details in the response.

---

## 3. Implementation options

### Option A – Proxy to Hugging Face Space (recommended)

Use this Space from the **server only** (never from the browser):

- **Space URL:** `https://gowrisankara-qwen-qwen2-5-coder-32b-instruct.hf.space`

**Step 1 – Get event_id**

- **POST**  
  `https://gowrisankara-qwen-qwen2-5-coder-32b-instruct.hf.space/call/predict`  
  (if that returns 404, try `/gradio_api/call/predict` with base  
  `https://gowrisankara-qwen-qwen2-5-coder-32b-instruct.hf.space/gradio_api`)
- **Headers:** `Content-Type: application/json`. If the Space requires auth, add `Authorization: Bearer <HF_TOKEN>` (store token in env, e.g. `HF_TOKEN`).
- **Body:** `{ "data": [ "<user message>" ] }`  
  Example: `{ "data": [ "What is React?" ] }`
- **Response:** JSON with `event_id`, e.g. `{ "event_id": "abc123" }`.

**Step 2 – Get the result**

- **GET**  
  `https://gowrisankara-qwen-qwen2-5-coder-32b-instruct.hf.space/call/predict/<event_id>`  
  (same base/path as in Step 1; add auth if needed).
- Poll every 1–2 seconds until you get a “complete” result (or timeout after e.g. 60–90 seconds).
- The response may be **Server-Sent Events (SSE)**. Look for a line starting with `data:`; the value is JSON. The model reply is often the last string in that JSON array, or an object with a `content` string.
- Parse the reply text from the response.

**Step 3 – Return to frontend**

- Respond with **200** and body `{ "reply": "<parsed reply text>" }` (or `{ "content": "..." }`).
- If the Space returns 500 or timeout, respond with **502** and `{ "error": { "message": "AI service temporarily unavailable" } }`.

**Optional:** Get a Hugging Face token from https://huggingface.co/settings/tokens and set it in your server env as `HF_TOKEN`; use it in the requests above if the Space requires it.

### Option B – Use another AI API

- Call OpenAI, Anthropic, or any HTTP chat API from your server.
- Send `message` (and optionally `history`) in the format that API expects.
- Map the API’s response to a single string and return `{ "reply": "..." }` or `{ "content": "..." }`.

---

## 4. Example code (Node.js + Express)

Assume you have `authMiddleware` that sets `req.user` from the JWT (same as for `/courses/:id/lessons`).

```javascript
// POST /chat – add this route (e.g. in your app or a chat router)
app.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: { message: 'Message is required' } })
    }

    // Option A: call your Hugging Face proxy helper
    const reply = await getReplyFromHuggingFace(message.trim())

    return res.json({ reply })
  } catch (err) {
    if (err.code === 'UPSTREAM_ERROR' || err.message?.includes('timeout')) {
      return res.status(502).json({ error: { message: 'AI service temporarily unavailable' } })
    }
    console.error('Chat error', err)
    return res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } })
  }
})

async function getReplyFromHuggingFace(userMessage) {
  const base = 'https://gowrisankara-qwen-qwen2-5-coder-32b-instruct.hf.space'
  const token = process.env.HF_TOKEN // optional

  const postRes = await fetch(`${base}/call/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ data: [userMessage] }),
  })
  if (!postRes.ok) throw Object.assign(new Error('Upstream error'), { code: 'UPSTREAM_ERROR' })

  const postData = await postRes.json()
  const eventId = postData?.event_id
  if (!eventId) throw new Error('No event_id')

  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1500))
    const getRes = await fetch(`${base}/call/predict/${eventId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!getRes.ok) continue
    const text = await getRes.text()
    const dataMatch = text.match(/^data:\s*(\[.*\])\s*$/m)
    if (dataMatch) {
      try {
        const arr = JSON.parse(dataMatch[1])
        const last = Array.isArray(arr) ? arr[arr.length - 1] : arr
        if (typeof last === 'string') return last
        if (last && typeof last === 'object' && last.content) return String(last.content)
      } catch (_) {}
    }
  }
  throw new Error('Timeout')
}
```

---

## 5. CORS and URL

- **CORS:** Allow your frontend origin (e.g. `http://localhost:5173`, `https://your-app.vercel.app`) and use **credentials: true** (same as for `/auth/login` and `/courses`).
- **URL:** The frontend uses your existing API base URL **without** `/api` by default. Example:  
  `https://learning-managment-platform-backend.onrender.com/chat`  
  So **POST /chat** must be registered on the same app that serves `/auth`, `/courses`, etc.

---

## 6. How to test (without the frontend)

With your server running and a valid JWT:

```bash
curl -X POST https://learning-managment-platform-backend.onrender.com/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"message":"Hello","history":[]}'
```

Expected: **200** and body like `{"reply":"Hello! How can I help?"}` or `{"content":"..."}`.

If you get **404**, the route is not registered. If you get **401**, the token is missing or invalid. If you get **500**, check server logs and ensure error responses use the JSON shape above.

---

## 7. Checklist for backend

- [ ] **POST /chat** is implemented on the same app as `/auth` and `/courses` (path is `/chat` or `/api/chat`).
- [ ] Route is protected with the **same JWT middleware** as other protected routes.
- [ ] Request: read `message` (required) and `history` (optional) from `req.body`.
- [ ] Response: **200** with `{ "reply": "<string>" }` or `{ "content": "<string>" }`.
- [ ] Errors: **401**, **400**, **502/503**, **500** with JSON `{ "error": { "message": "..." } }` or `{ "message": "..." }`.
- [ ] If using the Hugging Face Space: call it **only from the server**; store HF token in env; do not expose it to the frontend.
- [ ] CORS allows the frontend origin with credentials.

Once this is done, the Learning Studio frontend will work with the AI Assistant without any frontend changes.
