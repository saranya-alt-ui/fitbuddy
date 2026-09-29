import React, { useState, useEffect, useRef } from "react";
import { Bot, X, Send, Sparkles, User, Minimize2 } from "lucide-react";
import { apiService } from "../../services/api";
import { ChatMessage } from "../../types";

export const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "What workout should I do today?",
    "I missed yesterday's workout.",
    "What can I eat instead of eggs?",
    "How can I improve my consistency?",
    "What should I do on my rest day?",
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Load chat history or add welcoming message
      apiService
        .getChatHistory()
        .then((res) => {
          if (res.data?.history?.length > 0) {
            setMessages(res.data.history);
          } else {
            setMessages([
              {
                id: "welcome",
                role: "assistant",
                message:
                  "Hey there! I'm your FitBuddy AI Coach. How are you feeling today? Ask me anything about your workout, nutrition swaps, or recovery routine!",
                createdAt: new Date().toISOString(),
              },
            ]);
          }
        })
        .catch(() => {
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              message:
                "Hey there! I'm your FitBuddy AI Coach. Ask me anything about your fitness plan, exercise form, or nutrition swaps!",
              createdAt: new Date().toISOString(),
            },
          ]);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      message: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.message,
      }));

      const res = await apiService.chat(text, historyPayload);
      if (res.data?.success) {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          message: res.data.reply,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (error: any) {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        message: "FitBuddy AI is catching its breath. Please try asking again in a moment!",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 lg:bottom-8 right-6 z-40 group flex items-center gap-3 bg-gradient-to-r from-primary to-accent text-white p-3.5 rounded-full shadow-glow-primary hover:scale-105 transition-all duration-300 focus:outline-none"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-secondary animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-secondary" />
          </div>
          <span className="hidden sm:inline-block font-semibold text-sm pr-1">
            FitBuddy AI Coach
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 lg:bottom-8 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[540px] max-h-[80vh] flex flex-col bg-surface/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-background/80 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-glow-primary/40">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  FitBuddy AI
                  <span className="text-[10px] text-secondary font-mono">● LIVE</span>
                </h4>
                <p className="text-[11px] text-muted">24/7 Smart Fitness Guidance</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick prompt suggestions */}
          <div className="px-3 py-2 bg-white/[0.02] border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
            {samplePrompts.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="shrink-0 text-[11px] bg-surface hover:bg-primary/20 hover:text-primary-light text-muted border border-white/5 px-2.5 py-1 rounded-full transition-colors truncate max-w-[200px]"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-md bg-primary/30 border border-primary/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary-light" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 leading-relaxed text-sm ${
                      isUser
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-surface-100 border border-white/5 text-gray-200 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.message}</div>
                  </div>
                  {isUser && (
                    <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-muted" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-6 h-6 rounded-md bg-primary/30 border border-primary/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-primary-light animate-spin" />
                </div>
                <div className="bg-surface-100 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-light animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-background/80 border-t border-white/5 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask FitBuddy AI coach..."
              disabled={isLoading}
              className="flex-1 bg-surface-100 border border-white/10 focus:border-primary rounded-xl px-3.5 py-2 text-sm text-white placeholder-muted focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
