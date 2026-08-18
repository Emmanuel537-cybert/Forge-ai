"use client";
import { useState } from "react";
import {
  Bot, Eye, Code2, Copy, PlusCircle, Check, Loader2,
  Menu, X, Folder, CreditCard, ChevronRight, User, Sparkles
} from "lucide-react";
export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [creditsHTG, setCreditsHTG] = useState(250.00);
  const [costPerPrompt] = useState(10.00);
  const [projects, setProjects] = useState([
    { id: '1', title: 'AI Bettina Insight' },
    { id: '2', title: 'FootPro Predictions Hub' },
    { id: '3', title: 'Yon Zanmi Entelijan' },
    { id: '4', title: 'Manno Apple Direct' },
  ])
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([
    { role: 'ai', content: "Bonjou Emmanuel! Kisa nou pral kreye jodi a?" }
  ]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(`<div class="p-6 text-center">
  <h1 class="text-xl font-bold text-indigo-400 mb-2">forge.ai Builder</h1>
  <p class="text-slate-400 text-sm">Antre yon lide pou AI a kreye kòd la pou ou.</p>
</div>`);
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (creditsHTG < costPerPrompt) {
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: "⚠️ Kredi Goud ou fini! Tanpri rechaje kont ou pou w ka kontinye." }
      ]);
      return;
    }
    const userText = input;
    setInput("");

    // Mete mesaj itilizatè a nan chat la
    const updatedMessages = [
      ...messages,
      { role: 'user', content: userText }
    ];
    setMessages(updatedMessages);
    setIsLoading(true);
    try {
      // Rezo repons sot nan route API nou an
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
        const aiResponse = data.text || data.choices?.[0]?.message?.content || "Mwen pa jwenn yon repons.";
      
        // Deduireredi goud yo
        setCreditsHTG(prev => prev - costPerPrompt);
    
        // Afiche vre repons AI a nan chat la
        setMessages(prev => [
          ...prev,
          { role: 'ai', content: aiResponse }
        ]);

        // Si repons lan gen kòd HTML/JSX, mete l nan preview a
        if (aiResponse.includes("<") && aiResponse.includes(">")) {
          setGeneratedCode(aiResponse);
        }
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'ai', content: ` Erè: ${data.error || 'Gen yon pwoblèm ki rive.'}` }
        ]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: " Erè nan koneksyon an. Tanpri eseye ankò." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col justify-between`}>
        <div>
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-500" />
              <span className="font-bold text-lg tracking-wide text-white">forge.ai</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-3">
            <button onClick={() => { setMessages([{ role: 'ai', content: "Bonjou Emmanuel! Kisa nou pral kreye jodi a?" }]); setGeneratedCode(""); }} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              <PlusCircle className="w-4 h-4" />
              Nouvèl Aplikasyon
            </button>
          </div>
          <div className="px-3 py-2">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Pwojè yo</div>
            <div className="space-y-1">
              {projects.map((p) => (
                <button key={p.id} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors text-left truncate">
                  <Folder className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{p.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Credit Display */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-lg border border-slate-700/50 mb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-slate-300">Balans Kredi</span>
            </div>
            <span className="text-sm font-bold text-emerald-400">{creditsHTG.toFixed(2)} HTG</span>
          </div>
          <div className="flex items-center gap-2 px-2 text-xs text-slate-400">
            <User className="w-4 h-4" />
            <span className="truncate">Emmanuel Sino</span>
          </div>
        </div>
      </aside>
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Chat Section */}
        <section className="flex-1 flex flex-col border-r border-slate-800 h-full">
          <header className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/30">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-400 hover:text-white">
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="font-semibold text-sm md:text-base text-slate-200">Asistan AI</h1>
            </div>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/20 font-medium">
              -10.00 HTG / Mesaj
            </span>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-800 border border-slate-700/60 text-slate-200 rounded-bl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700/60 text-slate-300 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Forge-AI ap reflechi...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-900/40">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Créer une application web qui..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-3 rounded-xl transition-colors flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Workspace/Preview Section */}
        <section className="flex-1 flex flex-col h-full bg-slate-900/20 hidden md:flex">
          <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/30">
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Apasou / Aperçu
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Kòd
              </button>
            </div>

            {activeTab === 'code' && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedCode);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-md transition-colors border border-slate-700/50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Kopye!' : 'Kopye kòd'}
              </button>
            )}
          </header>

          <div className="flex-1 p-4 overflow-auto">
            {activeTab === 'preview' ? (
              <div className="w-full h-full bg-slate-900 rounded-xl border border-slate-800 p-4 text-slate-200 overflow-auto" dangerouslySetInnerHTML={{ __html: generatedCode }} />
            ) : (
              <pre className="w-full h-full bg-slate-950 rounded-xl border border-slate-800 p-4 text-xs font-mono text-emerald-400 overflow-auto">
                <code>{generatedCode}</code>
              </pre>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
