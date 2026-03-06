# Backend Chatbot – Implementation Prompt

Give this to the backend team to implement the **AI chatbot** so the Learning Studio frontend can call your API instead of calling Hugging Face directly. This fixes CORS, 500 errors, and keeps the Hugging Face token on the server.

---

## What the frontend needs

- One **authenticated** endpoint: **POST `/chat`** (or **POST `/api/chat`** if your app uses an `/api` prefix).
- The frontend sends the user’s message and (optionally) conversation history; the backend returns the AI reply.

---

## 1. Endpoint

**POST `/chat`**

- **Auth:** Required. Use the same JWT as other protected routes (`Authorization: Bearer <token>`). Reject with **401** if missing or invalid.
- **Request body (JSON):**
  ```json
  {
    "message": "User's message text here",
    "history": []
  }
  ```
  - `message` (string, required): The latest user message.
  - `history` (array, optional): Previous turns for context. Each item can be `{ "role": "user" | "assistant", "content": "..." }`. If you don’t use it, the frontend still sends it (e.g. `[]`); you can ignore it.

- **Success (200):**
  ```json
  {
    "reply": "The AI assistant's reply text here"
  }
  ```
  Alternatively you can use:
  ```json
  {
    "content": "The AI assistant's reply text here"
  }
  ```
  The frontend will accept either `reply` or `content`.

- **Errors:**
  - **401:** Missing or invalid token → `{ "error": { "message": "Unauthorized" } }` or `{ "message": "Unauthorized" }`.
  - **400:** Empty or invalid body → `{ "error": { "message": "Message is required" } }`.
  - **502/503:** Upstream AI service down → `{ "error": { "message": "AI service temporarily unavailable" } }`.
  - **500:** Internal error → `{ "error": { "message": "Something went wrong. Please try again." } }`. Do not expose stack traces.

---

## 2. Backend behaviour (recommended)

- Validate JWT and get `req.user.id` (and optionally `req.user.name`).
- Validate `message` (non-empty string, optional max length e.g. 4000).
- Call your **AI provider** to get a reply. Two common options:

### Option A – Proxy to Hugging Face Space (recommended)

- You have a Hugging Face Space:  
  `https://gowrisankara-qwen-qwen2-5-coder-32b-instruct.hf.space`
- Use a **Hugging Face token** (or Space-specific token) **only on the server** (env var e.g. `HF_TOKEN` or `HUGGINGFACE_TOKEN`).
- Call the Space’s Gradio API from the backend (no CORS in browser):
  1. **POST**  
     `https://gowrisankara-qwen-qwen2-5-coder-32b-instruct.hf.space/call/predict`  
     (or `/call/chat` if the Space uses that)  
     Body: `{ "data": [message] }`  
     Headers: `Content-Type: application/json`, and if needed `Authorization: Bearer <HF_TOKEN>`.
  2. Response contains `event_id`. Then **GET**  
     `https://gowrisankara-qwen-qwen2-5-coder-32b-instruct.hf.space/call/predict/<event_id>`  
     (with same auth if required) until you get the final result (e.g. SSE or JSON with the model output).
  3. Parse the model reply from the response and return it as `reply` (or `content`) in your JSON.

- If the Space returns 500 or timeout, return **502** with a friendly message so the frontend can show “AI service temporarily unavailable”.

### Option B – Another AI API

- Use any HTTP chat API (OpenAI, Anthropic, your own model, etc.).
- Send `message` (and optionally `history`) in the format that API expects.
- Map the API response to `{ "reply": "..." }` (or `{ "content": "..." }`).

---

## 3. CORS and base URL

- **CORS:** Allow the same frontend origin(s) as the rest of your API (e.g. `http://localhost:5173`, production frontend URL), with **credentials: true**.
- **Base URL:** Frontend uses the same base as other endpoints (e.g. `https://learning-managment-platform-backend.onrender.com`). So the full URL the frontend will call is:  
  `https://learning-managment-platform-backend.onrender.com/chat`  
  (or `.../api/chat` if you mount routes under `/api`).

---

## 4. Example implementation sketch (Node/Express)

```js
// chat.routes.ts or similar
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: { message: 'Message is required' } })
    }
    const reply = await chatService.getReply(message.trim()) // your HF proxy or other API
    return res.json({ reply })
  } catch (e) {
    if (e.code === 'UPSTREAM_ERROR') return res.status(502).json({ error: { message: 'AI service temporarily unavailable' } })
    return res.status(500).json({ error: { message: 'Something went wrong. Please try again.' } })
  }
})
```

---

## 5. Checklist for backend

- [ ] **POST `/chat`** (or **POST `/api/chat`**) exists and is protected with the same JWT auth as other routes.
- [ ] Request: accepts JSON with `message` (string) and optional `history` (array).
- [ ] Response: 200 with `{ "reply": "..." }` or `{ "content": "..." }`.
- [ ] Errors: 401 (unauthorized), 400 (bad request), 502/503 (AI unavailable), 500 (generic) with JSON `error.message` or `message`.
- [ ] If using the Hugging Face Space: call it from the server with a server-side HF token; do not expose the token to the frontend.
- [ ] CORS allows the frontend origin with credentials.

Once this is implemented, the frontend will call **POST /chat** first and only fall back to direct Hugging Face (or show “unavailable”) when the backend is not deployed or returns an error.
