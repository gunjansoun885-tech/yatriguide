"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, ChevronDown, MessageCircle, Send, Sparkles, X } from "lucide-react";

const INITIAL_MESSAGE = {
  id: "welcome",
  role: "assistant",
  content: "👋 Hi! Welcome to Yatriguide.\nI can help you with Uttarakhand travel, destinations, routes, travel passes, registration, emergency information and more.",
};

const QUICK_QUESTIONS = [
  "🏔️ Best places to visit",
  "🚗 Travel routes",
  "🛏️ Hotels & stays",
  "🎫 Travel Registration",
  "📍 Uttarakhand destinations",
  "🚨 Emergency numbers",
];

const ERROR_MESSAGE = "Sorry, I'm having trouble connecting right now. Please try again in a moment.";

export default function TravelAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messageSequence = useRef(0);

  useEffect(() => {
    let restoreTimer;
    try {
      const saved = window.sessionStorage.getItem("yatriguide-assistant-chat");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          restoreTimer = window.setTimeout(() => setMessages(parsed), 0);
        }
      }
    } catch {}
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem("yatriguide-assistant-chat", JSON.stringify(messages.slice(-30)));
    } catch {}
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (question = input) => {
    const content = question.trim();
    if (!content || isLoading) return;

    messageSequence.current += 1;
    const messageId = messageSequence.current;
    const userMessage = { id: `${messageId}-user`, role: "user", content };
    const history = messages.filter((message) => message.id !== "welcome").slice(-12);
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || ERROR_MESSAGE);
      setMessages((current) => [
        ...current,
        { id: `${messageId}-assistant`, role: "assistant", content: data.answer || ERROR_MESSAGE },
      ]);
    } catch {
      setMessages((current) => [...current, { id: `${messageId}-error`, role: "assistant", content: ERROR_MESSAGE }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  return (
    <div className="fixed bottom-5 right-4 z-[80] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6" aria-live="polite">
      {isOpen && (
        <section
          className="flex h-[min(620px,calc(100vh-112px))] w-[min(calc(100vw-2rem),390px)] flex-col overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-2xl shadow-stone-950/20"
          aria-label="Yatriguide Assistant chat"
        >
          <header className="flex shrink-0 items-center justify-between bg-gradient-to-br from-orange-600 to-amber-500 px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 shadow-inner" aria-hidden="true">
                <Bot className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold leading-tight">Yatriguide Assistant</h2>
                <p className="mt-0.5 text-xs font-medium text-orange-100">Ask me anything about Uttarakhand</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="rounded-full p-2 text-white/80 transition hover:bg-white/15 hover:text-white" aria-label="Close Yatriguide Assistant">
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-stone-50/90 px-3 py-4 sm:px-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-5 ${message.role === "user" ? "rounded-br-md bg-orange-600 text-white" : "rounded-bl-md border border-orange-100 bg-white text-stone-700 shadow-sm"}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="mt-2 grid grid-cols-2 gap-2" aria-label="Quick questions">
                {QUICK_QUESTIONS.map((question) => (
                  <button key={question} type="button" disabled={isLoading} onClick={() => sendMessage(question)} className="rounded-xl border border-orange-100 bg-white px-2.5 py-2 text-left text-xs font-semibold leading-4 text-stone-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60">
                    {question}
                  </button>
                ))}
              </div>
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-orange-100 bg-white px-4 py-3 shadow-sm" aria-label="Assistant is typing">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400 [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400 [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex shrink-0 items-center gap-2 border-t border-stone-200 bg-white p-3">
            <label htmlFor="yatriguide-assistant-input" className="sr-only">Ask your travel question</label>
            <input ref={inputRef} id="yatriguide-assistant-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask your travel question..." maxLength={600} disabled={isLoading} className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:opacity-60" />
            <button type="submit" disabled={!input.trim() || isLoading} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-stone-300" aria-label="Send travel question">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      <button type="button" onClick={() => setIsOpen((current) => !current)} className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-xl shadow-orange-900/25 transition hover:scale-105 hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200" aria-label={isOpen ? "Close Yatriguide Assistant" : "Open Yatriguide Assistant"} aria-expanded={isOpen}>
        <span className="absolute inset-0 rounded-full bg-orange-400/30 opacity-0 transition group-hover:opacity-100 group-hover:animate-ping" aria-hidden="true" />
        {isOpen ? <ChevronDown className="relative h-6 w-6" /> : <MessageCircle className="relative h-6 w-6" />}
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-amber-400" aria-hidden="true"><Sparkles className="h-3 w-3 text-orange-950" /></span>
      </button>
    </div>
  );
}
