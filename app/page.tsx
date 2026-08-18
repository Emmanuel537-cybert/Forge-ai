"use client";
import { useState } from "react";
import { Send, Bot, Eye, Code2, Copy, PlusCircle, Check, Loader2 } from "lucide-react";
export default function Home() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
    { role: 'ai', content: "Mwen pare! Mwen konekte ak Groq AI. Kisa w vle m kreye?" }
  ]);
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(`<div class="p-6 bg-slate-900 text-white rounded-xl shadow-xl">
  <h1 class="text-xl font-bold text-indigo-400 mb-2">forge.ai + Groq AI</h1>
  <p class="text-slate-400 text-sm">Tape yon lide pou AI a kreye vrè kòd an tan reyèl!</p>
</div>`);
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input;
    const newMessages = [...messages, { role: 'user' as const, content: userText }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
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
          { role: 'ai' as const, content: "Kòd la jenere ak siksè! Ou ka wè l an tan reyèl nan fenèt preview a." }
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
        { role: 'ai' as const, content: "Erè rezo! Tanpri re-eseye ankò." }
      ]);
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
    setMessages([{ role: 'ai', content: "Nouvo pwojè kòmanse! Kisa w vle n kreye kounye a?" }]);
    setGeneratedCode(`<div class="p-6 bg-slate-900 text-white rounded-xl shadow-xl">
  <h1 class="text-xl font-bold text-indigo-400 mb-2">Nouvo Pwojè</h1>
  <p class="text-slate-400 text-sm">Eksplike m sa w vle m desine pou ou anba a.</p>
</div>`);
    setInput("");
  };
  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar / Chat Panel */}
      <div className="w-full md:w-1/3 flex flex-col border-r border-slate-800 bg-slate-900/50">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
          <div className="flex items-center space-x-2">
            <Bot className="w-6 h-6 text-indigo-400" />
            <span className="font-bold text-lg text-indigo-400">forge.ai</span>
          </div>
          <button onClick={handleNewProject} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>
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
              placeholder="Ekri sa w vle AI a kreye..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button onClick={handleSend} disabled={isLoading} className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white disabled:opacity-50">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {/* Preview Panel */}
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
          {activeTab === 'code' && (
            <button onClick={handleCopy} className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg">
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopye!' : 'Kopye Kòd'}</span>
            </button>
          )}
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
  );
}
