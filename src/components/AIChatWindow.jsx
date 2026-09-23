"use client";

import { useState } from "react";
import { Bot, Send, User, X } from "lucide-react";

export function AIChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // লোডিং স্টেট
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I am your AI health assistant. How can I help you today?",
      time: "Just now",
    },
  ]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessageTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newUserMessage = {
      id: Date.now(),
      sender: "user",
      text,
      time: userMessageTime,
    };

    // ইউজারের মেসেজ UI-তে যুক্ত করা
    setMessages((currentMessages) => [...currentMessages, newUserMessage]);
    setInput("");
    setLoading(true);

    try {
      // ব্যাকএন্ড এপিআই কল (যেখানে জেমিনি এআই সেটআপ করা আছে)
      // যদি টোকেন ভ্যালিডেশন লাগে তবে headers-এ Authorization টোকেন দিতে পারো
      const response = await fetch("http://localhost:5000/api/ask-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${localStorage.getItem('token')}` // টোকেন লাগলে আনকমেন্ট করো
        },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await response.json();

      const aiMessageTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      if (data.success) {
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: Date.now() + 1,
            sender: "ai",
            text: data.result,
            time: aiMessageTime,
          },
        ]);
      } else {
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: Date.now() + 1,
            sender: "ai",
            text: "Sorry, I am having trouble connecting right now. Please try again later.",
            time: aiMessageTime,
          },
        ]);
      }
    } catch (error) {
      console.error("AI Request Error:", error);
      const errorTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "Oops! Something went wrong on the server.",
          time: errorTime,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col items-end gap-3"
      style={{
        position: "fixed",
        right: "1.75rem",
        bottom: "1.75rem",
        zIndex: 9999,
      }}
    >
      {isOpen && (
        <section
          aria-label="MedChat AI conversation"
          className="flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#021A54] shadow-[0_24px_80px_rgba(2,26,84,0.35)]"
          style={{ height: "min(560px, calc(100vh - 7rem))" }}
        >
          <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-[#FF85BB]/20 p-2 text-[#FF85BB]">
                <Bot size={19} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-white">MedChat AI</h2>
                <p className="text-[11px] text-[#FFCEE3]/80">Online and ready to help</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close MedChat AI"
              className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-2 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ${
                    message.sender === "user"
                      ? "bg-[#FF85BB] text-white"
                      : "bg-white/10 text-[#FF85BB]"
                  }`}
                >
                  {message.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                </span>
                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed sm:text-sm ${
                    message.sender === "user"
                      ? "rounded-tr-none bg-[#FF85BB] text-white"
                      : "rounded-tl-none bg-white/10 text-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <span className="mt-1 block text-right text-[10px] opacity-60">{message.time}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#FF85BB]">
                  <Bot size={14} />
                </span>
                <div className="rounded-2xl rounded-tl-none bg-white/10 px-3.5 py-2.5 text-xs text-slate-300">
                  <p className="animate-pulse">Thinking...</p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-white/10 bg-white/5 p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={loading ? "Please wait..." : "Ask about your care..."}
              disabled={loading}
              aria-label="Message MedChat AI"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-white placeholder-slate-400 focus:border-[#FF85BB] focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading}
              aria-label="Send message"
              className="rounded-xl bg-[#FF85BB] p-2.5 text-white hover:bg-[#ff72ae] disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close MedChat AI" : "Open MedChat AI"}
        aria-expanded={isOpen}
        className="flex h-14 items-center gap-3 rounded-full bg-[#FF85BB] px-5 text-white shadow-[0_12px_35px_rgba(255,133,187,0.45)] hover:bg-[#ff72ae]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
          {isOpen ? <X size={20} /> : <Bot size={21} />}
        </span>
        <span className="text-sm font-bold">{isOpen ? "Close chat" : "Chat with MedChat AI"}</span>
      </button>
    </div>
  );
}