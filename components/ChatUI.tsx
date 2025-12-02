import { useState, useRef, useEffect } from "react";

export default function ChatUI() {
  const [msgs, setMsgs] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  async function send() {
    if (!input.trim()) return;

    setLoading(true);

    const resp = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await resp.json();

    if (data.history) setMsgs(data.history);

    setInput("");
    setLoading(false);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "20px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 10
      }}
    >
      <h1>Local Chat AI (DeepSeek)</h1>
      <div
        style={{
          height: 420,
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: 10,
          borderRadius: 8
        }}
      >
        {msgs.map((m) => (
          <div key={m.id} style={{ marginBottom: 15 }}>
            <b>{m.role}</b>
            <div
              style={{
                background: m.role === "user" ? "#fff" : "#e9f0ff",
                padding: 10,
                borderRadius: 8,
                marginTop: 5
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div style={{ display: "flex", marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ketik pesan..."
          style={{
            flex: 1,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8
          }}
        />
        <button
          disabled={loading}
          onClick={send}
          style={{ marginLeft: 10, padding: "10px 15px" }}
        >
          {loading ? "..." : "Kirim"}
        </button>
      </div>
    </div>
  );
}