import type { NextApiRequest, NextApiResponse } from 'next';
import { saveMessage, getMessages } from '../../../lib/db';
import { randomUUID } from 'crypto';

const API_KEY = process.env.DEEPSEEK_API_KEY!;
const API_URL = "https://api.deepseek.com/v1/chat/completions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ ok: false, error: "Method not allowed" });

  const { message } = req.body;

  if (!message)
    return res.status(400).json({ ok: false, error: "Message is required" });

  // Simpan pesan user
  saveMessage({
    id: randomUUID(),
    role: "user",
    content: message,
    created_at: Date.now(),
  });

  const historyRaw = getMessages(50);
  const history = historyRaw.map(m => ({ role: m.role, content: m.content }));

  try {
    // REQUEST KE API DEEPSEEK
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer sk-8394e8e92afd40a6b2aae17c45075e65}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: history,
        temperature: 0.7
      })
    });

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content || "(no reply)";

    // Simpan jawaban AI
    saveMessage({
      id: randomUUID(),
      role: "assistant",
      content: reply,
      created_at: Date.now(),
    });

    res.json({
      ok: true,
      reply,
      history: getMessages(200)
    });

  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}