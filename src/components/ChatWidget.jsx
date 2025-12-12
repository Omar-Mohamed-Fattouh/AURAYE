// src/components/ChatWidget.jsx
import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ---- GEMINI SETUP ----
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error(
    "[Gemini] Missing VITE_GEMINI_API_KEY. Add it to your .env file in the project root."
  );
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const INITIAL_MESSAGES = [
  {
    id: "welcome-1",
    role: "assistant",
    content:
      "Hi 👋 I’m your smart eyewear assistant. Ask me anything about frames, lenses, AR try-on, or your order.",
  },
];

export default function ChatWidget({ projectContext = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const text = input.trim();
    setInput("");

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const aiReply = await callGemini({
        messages: updatedMessages,
        projectContext,
      });

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: aiReply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("[Gemini] Error while generating reply:", err);

      let friendlyError =
        "Sorry, I couldn’t reach the AI service right now. Please try again in a moment.";

      if (!apiKey) {
        friendlyError =
          "Gemini API key is not configured on this website. Please ask the admin to set VITE_GEMINI_API_KEY.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: friendlyError,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating circular button */}
      <button
        type="button"
        onClick={handleToggle}
        className="
          fixed bottom-5 right-5 z-50
          h-14 w-14 rounded-full
          bg-gradient-to-tr from-black via-black/60 to-black/30
          border border-white/10
          shadow-xl shadow-black/40
          flex items-center justify-center
          hover:scale-105 hover:shadow-2xl
          transition-transform transition-shadow
        "
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className="
            fixed bottom-24 right-4 z-50
            w-[320px] sm:w-[380px]
            rounded-3xl
            bg-black/80
            backdrop-blur-xl
            border border-white/10
            shadow-2xl shadow-black/60
            flex flex-col
            overflow-hidden
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-black via-black/80 to-slate-700">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight text-white">
                  AR Eyewear Assistant
                </span>
                <span className="text-[11px] text-slate-300">
                  Powered by Gemini · Online
                </span>
              </div>
            </div>
            <button
              onClick={handleToggle}
              className="p-1 rounded-full hover:bg-white/10 transition"
            >
              <X className="h-4 w-4 text-slate-100" />
            </button>
          </div>

          {/* Messages */}
          <div className="px-3 py-3 space-y-3 max-h-[55vh] overflow-y-auto text-sm hide-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 leading-relaxed text-[13px] ${
                    msg.role === "user"
                      ? "bg-white text-slate-900 rounded-br-sm"
                      : "bg-slate-800/90 text-slate-50 border border-white/5 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[60%] rounded-2xl px-3 py-2 bg-slate-800/70 text-slate-300 text-[11px] animate-pulse">
                  Typing…
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-white/10 p-2">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-900/80 border border-white/10 px-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your eyewear or order..."
                className="
                  flex-1 bg-transparent border-none outline-none
                  text-xs sm:text-sm text-slate-50
                  placeholder:text-slate-500 py-2
                "
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="
                  p-2 rounded-full
                  disabled:opacity-40 disabled:cursor-not-allowed
                  hover:bg-white hover:text-black
                  transition
                  flex items-center justify-center
                "
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

/**
 * Call Gemini API
 */
async function callGemini({ messages, projectContext }) {
  if (!genAI) {
    throw new Error("Gemini client not initialized – missing API key?");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const historyText = messages
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const lastUserMessage =
    messages.filter((m) => m.role === "user").slice(-1)[0]?.content || "";

  const contextText = projectContext?.trim()
    ? projectContext.trim()
    : "No extra project context was provided.";

  const prompt = `
You are an AI assistant for an AR-powered eyewear e-commerce website.

Project documentation:

""" 
${contextText}
"""

Always use this documentation first when answering questions about the project.

If the answer isn't there, you can use general knowledge, but stay relevant
to eyewear, AR try-on, orders, and customer support.

Conversation so far:
${historyText}

Now answer this user message clearly and helpfully:
"${lastUserMessage}"
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text || "I’m here to help! Could you say that in another way?";
}
