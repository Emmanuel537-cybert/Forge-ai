"use client";

import { useState } from "react";
import { Send, Bot, Eye, Code2, Copy, PlusCircle, Check, Loader2, Smartphone, Monitor } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Mwen pare! Mwen konekte ak Groq AI. Kisa w vle m kreye?" }
  ]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(`<div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800 text-center">
  <h1 className="text-xl font-bold text-indigo-400 mb-2">forge.ai + Groq AI</h1>
  <p className="text-slate-400 text-sm">Tape yon lide pou AI a kreye vrè kòd an tan reyèl!</p>
</div>`);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input;
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText }),
      });

      const data = await res.json();
      if (data.code) {
        setGeneratedCode(data.code);
        setMessages([...newMessages, { role: 'ai', content: `Men kòd mwen jenere pou "${userText}"!` }]);
      } else {
        setMessages([...newMessages, { role: 'ai', content: "Mwen jwenn yon ti pwoblèm pou m jenere kòd la." }]);
      }
    } catch (e) {
      setMessages([...newMessages, { role: 'ai', content: "Ere nan koneksyon ak sèvè a." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNewProject = () => {
    setMessages([{ role: 'ai', content: "Nouvo pwojè kòmanse! Kisa w vle m kreye?" }]);
    setGeneratedCode(`<div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800 text-center">
  <h1 className="text-xl font-bold text-indigo-400 mb-2">Nouvo Pwojè</h1>
  <p className="text-slate-400 text-sm">Eksplike m sa w vle kreye...</p>
</div>`);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-800 flex flex-col h-screen">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-400">forge.ai</h1>
          <button onClick={handleNewProject} title="Nouvo Pwojè" className="text-slate-400 hover:text-white transition-colors">
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'ai' && <Bot className="w-6 h-6 text-indigo-400 flex-shrink-0" />}
              <div className={`p-3 rounded-lg text-sm max-w-[85%] ${m.role === 'user' ? 'bg-indigo-600' : 'bg-slate-900 border border-slate-800'}`}>{m.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 items-center text-indigo-400 text-sm p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Groq AI ap ekri kòd la...</span>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex gap-2">
            <input 
              className="flex-1 bg-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-indigo-500" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ekri sa w vle AI a kreye..." 
            />
            <button onClick={handleSend} disabled={isLoading} className="bg-indigo-600 p-2 rounded-lg hover:bg-indigo-500 disabled:opacity-50">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Preview/Code Section */}
      <div className="flex-1 flex flex-col">
        <div className="flex p-4 border-b border-slate-800 justify-between items-center bg-slate-900/50">
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('preview')} className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${activeTab === 'preview' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}><Eye className="w-4 h-4"/> Preview</button>
            <button onClick={() => setActiveTab('code')} className={`flex items-center gap-2 px-3 py-1 rounded text-sm ${activeTab === 'code' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}><Code2 className="w-4 h-4"/> Kòd</button>
          </div>

          {activeTab === 'preview' && (
            <div className="flex bg-slate-800 rounded p-1 gap-1">
              <button onClick={() => setViewMode('desktop')} className={`p-1 rounded ${viewMode === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}><Monitor className="w-4 h-4"/></button>
              <button onClick={() => setViewMode('mobile')} className={`p-1 rounded ${viewMode === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}><Smartphone className="w-4 h-4"/></button>
            </div>
          )}

          {activeTab === 'code' && (
            <button onClick={handleCopy} className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors text-indigo-300">
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Kopye!" : "Kopye Kòd"}
            </button>
          )}
        </div>

        <div className="flex-1 p-8 text-slate-300 font-mono text-sm overflow-auto flex items-center justify-center bg-slate-950/80">
           {activeTab === 'preview' ? (
             <div className={`transition-all duration-300 ${viewMode === 'mobile' ? 'w-[360px] h-[640px] border-4 border-slate-700 rounded-3xl p-4 bg-slate-900 overflow-y-auto shadow-2xl' : 'w-full max-w-2xl'}`} dangerouslySetInnerHTML={{ __html: generatedCode }} />
           ) : (
             <pre className="w-full h-full bg-slate-900 p-4 rounded-xl border border-slate-800 overflow-x-auto whitespace-pre-wrap text-emerald-400">{generatedCode}</pre>
           )}
        </div>
      </div>
    </div>
  );
}
