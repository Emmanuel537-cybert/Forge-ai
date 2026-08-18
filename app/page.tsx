"use client";
import { useState } from "react";
import { 
  Bot, Eye, Code2, Copy, PlusCircle, Check, Loader2, 
  Menu, X, Folder, CreditCard, ChevronRight, User, Sparkles 
} from "lucide-react";
export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [creditsHTG, setCreditsHTG] = useState(250.00); // Kredi nan Goud
  const [costPerPrompt] = useState(10.00); // 10 Goud pa chak jenerasyon
  const [projects, setProjects] = useState([
    { id: '1', title: 'AI Bettina Insight' },
    { id: '2', title: 'FootPro Predictions Hub' },
    { id: '3', title: 'Yon Zanmi Entelijan' },
    { id: '4', title: 'Manno Apple Direct' },
  ])
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
    { role: 'ai', content: "Bonjou Emmanuel! Kisa nou pral kreye jodi a?" }
  ]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(`<div class="p-6 bg-slate-900 text-white rounded-xl shadow-xl">
  <h1 class="text-xl font-bold text-indigo-400 mb-2">forge.ai + Groq AI</h1>
  <p class="text-slate-400 text-sm">Antre yon lide pou AI a kreye kòd an tan reyèl!</p>
</div>`);
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    // Tcheke si gen kont kòb nan kredi goud yo
    if (creditsHTG < costPerPrompt) {
      setMessages([
        ...messages,
        { role: 'ai', content: "⚠️ Kredi Goud ou fini! Tanpri fè yon rechaj ak MonCash/Natcash pou w kontinye kreye." }
      ]);
      return;
    }
    const userText = input;
    const newMessages = [...messages, { role: 'user' as const, content: userText }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    // Koupe kredi an goud
    setCreditsHTG((prev) => prev - costPerPrompt);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText, messages: newMessages }),
      });
      const data = await res.json();
      if (res.ok && (data.code || data.content || data.response || data.text)) {
        const aiResponse = data.code || data.content || data.response || data.text;
        setGeneratedCode(aiResponse);
        setMessages([
          ...newMessages,
          { role: 'ai' as const, content: "Kòd la jenere ak siksè! (-10.00 HTG)" }
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: 'ai' as const, content: data.error || "Mwen jwenn yon ti pwoblèm pou m jenere kòd la." }
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: 'ai' as const, content: "Erè rezo! Tanpri re-eseye." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* 1. SIDEBAR TIP LOVABLE */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 flex flex-col justify-between`}>
        
        {/* Anwo Sidebar */}
        <div className="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-6 h-6 text-indigo-400" />
              <span className="font-bold text-lg text-white">forge.ai</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>
          <button onClick={() => {
            setMessages([{ role: 'ai', content: "Nouvo pwojè kòmanse! Kisa w vle n desine?" }]);
            setGeneratedCode(`<div class="p-6 bg-slate-900 text-white rounded-xl shadow-xl"><h1 class="text-xl font-bold">Nouvo Pwojè</h1></div>`);
          }} className="w-full flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded-xl font-medium text-sm transition">
            <PlusCircle className="w-4 h-4" />
            <span>Créer un projet</span>
          </button>
          {/* Lis Pwojè */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase px-2 mb-2">Mes Projets</p>
            {projects.map((p) => (
              <button key={p.id} className="w-full flex items-center space-x-2 text-left text-sm text-slate-300 hover:bg-slate-800 p-2 rounded-lg transition">
                <Folder className="w-4 h-4 text-indigo-400" />
                <span className="truncate">{p.title}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Anba Sidebar - Solde Goud & Peman */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-900/80">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
              <span>Solde Kredi</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-lg font-bold text-green-400">{creditsHTG.toFixed(2)} HTG</p>
            <p className="text-[10px] text-slate-500">10.00 HTG pa jenerasyon</p>
          </div>
          <button onClick={() => alert("Voye rechaj sou MonCash: +509 36XX-XXXX oswa Natcash. Apre sa kontakte support.")} className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white py-2 px-3 rounded-xl text-xs font-medium transition border border-slate-700">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <span>Rechaje Kredi (MonCash)</span>
          </button>
          <div className="flex items-center space-x-3 pt-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
              E
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-medium text-white truncate">Emmanuel's Workspace</p>
              <p className="text-[10px] text-slate-400">Forfait Free • 1 membre</p>
            </div>
          </div>
        </div>
      </div>
      {/* 2. CHAT & MAIN PANEL */}
      <div className="flex-1 flex flex-col min-w-0">
    
        {/* Header Mobile */}
        <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between md:hidden">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-300">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-white">forge.ai</span>
          <span className="text-xs text-green-400 font-semibold">{creditsHTG.toFixed(0)} HTG</span>
        </div>
        {/* Chat UI */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-full md:w-1/2 flex flex-col border-r border-slate-800 bg-slate-900/30">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center space-x-2 text-indigo-400 text-sm p-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI a ap jenere kòd la...</span>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-900">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Créer une application web qui..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <button onClick={handleSend} disabled={isLoading} className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white disabled:opacity-50">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          {/* Preview Right Panel */}
          <div className="hidden md:flex flex-1 flex-col bg-slate-950">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
              <div className="flex space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button onClick={() => setActiveTab('preview')} className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium ${activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button onClick={() => setActiveTab('code')} className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium ${activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Kòd</span>
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              {activeTab === 'preview' ? (
                <div className="w-full h-full bg-slate-900 rounded-2xl p-4 border border-slate-800" dangerouslySetInnerHTML={{ __html: generatedCode }} />
              ) : (
                <pre className="w-full h-full bg-slate-900 p-4 rounded-2xl text-xs font-mono text-indigo-300 overflow-auto border border-slate-800">
                  {generatedCode}
                </pre>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
