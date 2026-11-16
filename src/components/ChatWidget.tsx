
import { useState, useRef, useEffect } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = "https://fastweb96-bot.nivosite.workers.dev/chat";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "سلام! 👋 به FastWeb96 خوش آمدید. برای طراحی سایت چه کمکی از من برمی‌آید؟",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  async function sendMessage() {
    const text = message.trim();

    if (!text || loading) return;

    const history = messages.slice(-10);
    setMessages((previous) => [
      ...previous,
      { role: "user", content: text },
    ]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "خطا در دریافت پاسخ");
      }

      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: "متأسفانه ارتباط برقرار نشد. لطفاً دوباره تلاش کنید.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      dir="rtl"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 9999,
        fontFamily: "inherit",
      }}
    >
      {open && (
        <div
          style={{
            width: "min(360px, calc(100vw - 40px))",
            height: 460,
            maxHeight: "70vh",
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 8px 35px rgba(0,0,0,.2)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            marginBottom: 12,
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              background: "#123b68",
              color: "#fff",
              padding: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <strong>دستیار هوشمند FastWeb96</strong>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: 0,
                color: "#fff",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 12,
              background: "#f8fafc",
            }}
          >
            {messages.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    item.role === "user" ? "flex-start" : "flex-end",
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    maxWidth: "85%",
                    padding: "10px 13px",
                    borderRadius: 14,
                    background:
                      item.role === "user" ? "#dbeafe" : "#fff",
                    color: "#1f2937",
                    lineHeight: 1.8,
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  {item.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ color: "#64748b", padding: 8 }}>
                در حال نوشتن پاسخ...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
            style={{
              display: "flex",
              gap: 8,
              padding: 10,
              borderTop: "1px solid #e5e7eb",
              background: "#fff",
            }}
          >
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="پیام خود را بنویسید..."
              disabled={loading}
              style={{
                flex: 1,
                minWidth: 0,
                padding: 11,
                border: "1px solid #d1d5db",
                borderRadius: 10,
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={loading || !message.trim()}
              style={{
                background: "#123b68",
                color: "#fff",
                border: 0,
                borderRadius: 10,
                padding: "0 16px",
                cursor: "pointer",
              }}
            >
              ارسال
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((previous) => !previous)}
        style={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: 0,
          background: "#123b68",
          color: "#fff",
          fontSize: 27,
          cursor: "pointer",
          boxShadow: "0 4px 15px rgba(0,0,0,.25)",
        }}
        aria-label="گفتگو با دستیار هوشمند"
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}
