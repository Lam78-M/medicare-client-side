"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AichatbotPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I am your Medicare AI Assistant. Ask me anything about your health, appointments, or medical guidance.",
      time: "Just now",
    },
  ]);

  const messagesEndRef = useRef(null);

  // নতুন মেসেজ আসলে অটো স্ক্রল নিচে নামানোর জন্য
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg = { id: Date.now(), sender: "user", text, time: userTime };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // ব্যাকএন্ডে তোমার তৈরি করা /api/ask-gemini এন্ডপয়েন্টে কল করা হচ্ছে
      const response = await fetch("http://localhost:5000/api/ask-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${localStorage.getItem('token')}` // টোকেন লাগলে আনকমেন্ট করো
        },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await response.json();
      const aiTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "ai", text: data.result, time: aiTime },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, sender: "ai", text: "Sorry, I couldn't process your request right now.", time: aiTime },
        ]);
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: "Server connection error. Please try again later.", time: "Just now" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#021A54] text-white">
      {/* সাইডবার (ChatGPT বা Gemini স্টাইল) */}
      <aside className="hidden w-64 flex-col border-r border-white/10 bg-[#01123d] p-4 md:flex">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition">
            <ArrowLeft size={18} />
            <span className="text-xs font-semibold">Back to Home</span>
          </Link>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#FFCEE3]/60 mb-2">Recent Chats</div>
          <div className="space-y-1">
            <div className="w-full rounded-xl bg-white/10 px-3 py-2 text-xs text-white font-medium truncate cursor-pointer">
              Health & Medical Guidance
            </div>
          </div>
        </div>

        <button
          onClick={() => setMessages([{ id: 1, sender: "ai", text: "Chat cleared. How can I help you?", time: "Just now" }])}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition"
        >
          <Trash2 size={15} />
          <span>Clear Conversation</span>
        </button>
      </aside>

      {/* মেইন চ্যাট উইন্ডো */}
      <main className="flex flex-1 flex-col h-full overflow-hidden">
        {/* টপ হেডার */}
        <header className="flex items-center justify-between border-b border-white/10 bg-[#021A54]/80 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-[#FF85BB]/20 p-2.5 text-[#FF85BB]">
              <Sparkles size={20} />
            </span>
            <div>
              <h1 className="text-base font-bold text-white">Medicare Advanced AI</h1>
              <p className="text-xs text-[#FFCEE3]/80">Powered by Gemini AI Studio</p>
            </div>
          </div>
        </header>

        {/* চ্যাট মেসেজ লিস্ট */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-3xl mx-auto ${
                msg.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  msg.sender === "user" ? "bg-[#FF85BB] text-white" : "bg-white/10 text-[#FF85BB]"
                }`}
              >
                {msg.sender === "user" ? <User size={16} /> : <Bot size={17} />}
              </span>

              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "rounded-tr-none bg-[#FF85BB] text-white"
                    : "rounded-tl-none bg-white/10 text-slate-100 border border-white/10"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className="mt-1.5 block text-right text-[10px] opacity-60">{msg.time}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3 max-w-3xl mx-auto">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#FF85BB]">
                <Bot size={17} />
              </span>
              <div className="rounded-2xl rounded-tl-none bg-white/10 border border-white/10 px-4 py-3 text-sm text-slate-300">
                <p className="animate-pulse flex items-center gap-2">
                  <Sparkles size={14} className="animate-spin text-[#FF85BB]" /> Thinking and analyzing...
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ইনপুট ফর্ম (বটমে ফিক্সড) */}
        <div className="p-4 md:p-6 bg-[#021A54]">
          <form
            onSubmit={handleSendMessage}
            className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-2 shadow-2xl focus-within:border-[#FF85BB]"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about health, medications, or doctors..."
              disabled={loading}
              className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF85BB] text-white hover:bg-[#ff72ae] transition disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-center text-[11px] text-slate-400 mt-2">
            AI may display inaccurate info. Verify important health insights with professional doctors.
          </p>
        </div>
      </main>
    </div>
  );
}