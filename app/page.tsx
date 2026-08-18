"use client";
import { useState } from "react";
import { Sparkles, Menu, X, Plus, Mic, ArrowUpRight, CreditCard, User, ChevronDown } from "lucide-react";

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
    <div className="min-h-screen w-full bg-[#0b0f17] text-white font-sans flex flex-col justify-between relative overflow-hidden">
      {/* Background Gradient Style */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0b0f17] to-orange-600/70" />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-4 md:px-8">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2.5 bg-slate-800/40 rounded-full border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-300" />
        </button>

        {/* Logo ak Non Aplikasyon pa w la */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">forge.ai</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700/60">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">{creditsHTG.toFixed(2)} HTG</span>
        </div>
      </header>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex">
          <div className="w-72 bg-[#0d1117] h-full p-4 flex flex-col justify-between border-r border-slate-800">
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

      {/* Main Container */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-2xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="w-full flex flex-col items-center">
            {/* Top Tag Pill */}
            <div className="mb-6 inline-flex items-center gap-2 bg-[#121824]/90 border border-slate-700/60 rounded-full px-4 py-1.5 text-xs text-slate-300 shadow-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <span>Konekte tout zouti w yo</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-white tracking-tight">
              Ann kreye yon bagay, Emmanuel
            </h1>

            {/* Input Box */}
            <div className="w-full bg-[#161c28]/95 rounded-2xl border border-slate-700/60 p-4 shadow-2xl backdrop-blur-md">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Kreye yon aplikasyon web ki..."
                rows={2}
                className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800/80">
                <button type="button" className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors">
                  <Plus className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <button type="button" className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>

                  <div className="flex items-center bg-[#2d3748] hover:bg-[#3a475c] text-slate-200 rounded-xl overflow-hidden transition-colors border border-slate-600/40">
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="px-3.5 py-1.5 font-medium text-xs disabled:opacity-50"
                    >
                      Kreye
                    </button>
                    <div className="w-[1px] h-4 bg-slate-600/60" />
                    <button type="button" className="px-2 py-1.5 text-slate-300">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Output */
          <div className="w-full space-y-4 my-auto">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#161c28] border border-slate-700 text-slate-100'
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
                className="text-xs bg-slate-800 border border-slate-700 px-4 py-2 rounded-full text-slate-300"
              >
                + Nouvo pwojè
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-20 p-4 text-center text-xs text-slate-500">
        forge.ai — Powered by OpenRouter
      </footer>
    </div>
  );
}
