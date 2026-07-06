import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  ArrowRight, 
  BookOpen, 
  Lightbulb, 
  ShieldAlert 
} from "lucide-react";
import { Event } from "../types";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AICopilotProps {
  events: Event[];
  activeEventId: string;
}

export default function AICopilot({ events, activeEventId }: AICopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou o **PLAY+COGNITIVE AI**, seu assistente estratégico de operações. Posso ajudar você a planejar seu evento, criar estratégias de venda de ingressos, redigir briefings de patrocinadores, emitir regras de segurança ou simular cenários operacionais. Como posso ajudar hoje?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeEvent = events.find(e => e.id === activeEventId);

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          eventContext: activeEvent ? {
            name: activeEvent.name,
            category: activeEvent.category,
            venue: activeEvent.venue,
            date: activeEvent.date,
            capacity: activeEvent.capacity,
            description: activeEvent.description
          } : null
        })
      });

      const json = await res.json();
      if (json.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: json.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Houve uma oscilação na resposta do meu sistema cognitivo. Poderia tentar novamente?" }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: "Não consegui estabelecer comunicação com o servidor PLAY+COGNITIVE. Verifique suas credenciais de API." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickSuggestions = [
    { text: "Estratégia para esgotar ingressos VIP", icon: Lightbulb },
    { text: "Briefing de segurança contra intempéries", icon: ShieldAlert },
    { text: "Idéias para ativação de patrocinadores", icon: BookOpen }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[600px] flex flex-col justify-between" id="ai-copilot-view">
      
      {/* Copilot Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/10">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-display">PLAY+COGNITIVE AI Copilot</h3>
            <p className="text-[11px] text-slate-400">Contextualizado ao evento: <strong className="text-cyan-400">{activeEvent?.name}</strong></p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-purple-400 font-semibold bg-purple-950 border border-purple-500/15 px-2 py-0.5 rounded uppercase">Modelo Ativo</span>
      </div>

      {/* Messages Thread box */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin">
        {messages.map((msg, i) => {
          const isAI = msg.role === 'assistant';
          return (
            <div 
              key={i} 
              className={`flex gap-3 max-w-3xl ${isAI ? '' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar indicator */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                isAI 
                  ? 'bg-slate-950 border-slate-800 text-cyan-400' 
                  : 'bg-gradient-to-tr from-cyan-600 to-indigo-600 border-cyan-500 text-white'
              }`}>
                {isAI ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
              </div>

              {/* Msg bubble card */}
              <div className={`rounded-2xl p-4 text-xs leading-relaxed space-y-2 border ${
                isAI 
                  ? 'bg-slate-950 border-slate-850/80 text-slate-300' 
                  : 'bg-slate-900 border-indigo-500/20 text-slate-200'
              }`}>
                <div className="prose prose-invert prose-xs text-xs">
                  {/* Clean custom markdown bold text parser for UI */}
                  {msg.content.split('\n').map((line, lidx) => {
                    // Simple parser for **bold text**
                    const parts = line.split('**');
                    return (
                      <p key={lidx} className="mb-1 leading-relaxed">
                        {parts.map((part, pidx) => {
                          if (pidx % 2 === 1) {
                            return <strong key={pidx} className="text-cyan-400 font-bold">{part}</strong>;
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-2xl">
            <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-850 text-cyan-400 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex items-center gap-2">
              <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
              <span className="text-xs text-slate-400 font-mono">Processando inteligência cognitiva...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips and Send Form */}
      <div className="space-y-4 shrink-0">
        
        {/* Suggestion chips */}
        {messages.length === 1 && (
          <div className="flex flex-col sm:flex-row gap-2" id="copilot-chips">
            {quickSuggestions.map((suggestion, idx) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(suggestion.text)}
                  className="flex-1 text-left bg-slate-950 hover:bg-slate-950/60 border border-slate-800 hover:border-slate-700 p-2.5 rounded-xl text-[11px] text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Icon className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{suggestion.text}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 ml-auto shrink-0" />
                </button>
              );
            })}
          </div>
        )}

        {/* Input box */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="relative"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Pergunte ao Co-piloto (Ex: Como organizar o credenciamento de ciclistas?)"
            className="w-full bg-slate-950 text-slate-200 pl-4 pr-12 py-3 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            style={{ minHeight: '44px' }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || loading}
            className="absolute right-2 top-2 p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-all disabled:opacity-30 cursor-pointer"
            style={{ minHeight: '36px', minWidth: '36px' }}
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
