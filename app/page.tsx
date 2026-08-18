"use client";
import { useState } from "react";
import {
  Sparkles, Menu, X, Plus, Mic, ArrowUpRight, Folder, CreditCard, User
} from "lucide-react";
export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [creditsHTG, setCreditsHTG] = useState(250.00);
  const [costPerPrompt] = useState(10.00);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (creditsHTG < costPerPrompt) {
      alert("⚠️ Kredi Goud ou fini! Tanpri rechaje kont ou.");
      return;
    }
    const userText = input;
    setInput("");
    const updatedMessages = [...messages, { role: 'user', content: userText }];
    setMessages(updatedMessages);
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            content: m.content
          }))
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const aiResponse = data.text || data.choices?.[0]?.message?.content || "Mwen pa jwenn repons.";
        setCreditsHTG(prev => prev - costPerPrompt);
        setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      } else {
        alert(data.error || "Gen yon erè ki rive.");
      }
    } catch (err) {
      alert("Erè nan koneksyon an.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white font-sans overflow-x-hidden flex flex-col justify-between">
      {/* Background Gradient Style Lovable */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-950 via-slate-900 to-orange-600/80 opacity-90" />
      {/* Header / Top Navigation */}
      <header className="relative z-10 flex items-center justify-between p-4 md:px-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-slate-800/60 rounded-full border border-slate-700/50 hover:bg-slate-700/60 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-200" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-pink-500 fill-pink-500" />
          <span className="font-bold text-xl tracking-tight text-white">forge.ai</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700/50">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">{creditsHTG.toFixed(2)} HTG</span>
        </div>
      </header>

      {/* Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex">
          <div className="w-72 bg-slate-900 h-full p-4 flex flex-col justify-between border-r border-slate-800">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-lg text-white">Meni Pwojè</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={() => { setMessages([]); setIsSidebarOpen(false); }}
                className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 px-4 rounded-xl font-medium mb-4"
              >
                <Plus className="w-4 h-4" />
                Nouvèl Aplikasyon
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-4 border-t border-slate-800">
              <User className="w-4 h-4" />
              <span>Emmanuel Sino</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content / Center Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-3xl mx-auto w-full">
        {messages.length === 0 ? (
          <>
            {/* Top Pill Integration */}
            <div className="mb-6 inline-flex items-center gap-2 bg-slate-900/90 border border-slate-700/60 rounded-full px-4 py-1.5 text-xs text-slate-300 shadow-lg">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Connectez tous vos outils</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-semibold text-center mb-8 tracking-tight text-white">
              Créons quelque chose, Emmanuel
            </h1>

            {/* Lovable Input Box */}
            <div className="w-full bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/70 p-4 shadow-2xl">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Créer une application web qui..."
                rows={2}
                className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="bg-slate-100 hover:bg-white text-slate-950 px-4 py-1.5 rounded-xl font-medium text-sm flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <span>Créer</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Chat Stream Output */
          <div className="w-full space-y-4 my-auto">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900/90 border border-slate-700 text-slate-100 backdrop-blur-md'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-center text-xs text-slate-300 animate-pulse">
                Forge-AI ap travay sou pwojè w la...
              </div>
            )}
            <div className="pt-4 flex justify-center">
              <button 
                onClick={() => setMessages([])} 
                className="text-xs bg-slate-800/80 hover:bg-slate-800 border border-slate-700 px-4 py-2 rounded-full text-slate-300"
              >
                + Kòmanse yon nouvo kreyasyon
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Space */}
      <footer className="relative z-10 p-4 text-center text-xs text-slate-400">
        forge.ai — Powered by OpenRouter
      </footer>
    </div>
  );
}
