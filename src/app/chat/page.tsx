"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import { 
  ArrowRight, Paperclip, ArrowUp, X, FileText, 
  Image as ImageIcon, Loader2, Bot, User, CheckCircle2, 
  ShieldCheck, FilePlus, BarChart3, ScanLine, FileCheck
} from "lucide-react";

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string | React.ReactNode; 
  files?: File[];
  timestamp: Date;
};

export default function ChatPage() {
  const router = useRouter(); 
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [isTyping, setIsTyping] = useState(false); 
  const [isAnalyzing, setIsAnalyzing] = useState(false); 
  const [isSaving, setIsSaving] = useState(false); 
  const [step, setStep] = useState(0); 

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isAnalyzing]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleAddToDashboard = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      const successMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: (
          <div className="flex items-center gap-2 text-[#009B72] font-bold">
            <CheckCircle2 className="w-5 h-5" />
            تم إرسال القضية والمستندات إلى لوحة التحكم بنجاح! جاري نقلك...
          </div>
        ),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, successMsg]);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }, 1500);
  };

  // --- منطق الردود المحدث (تم تعديل الترتيب لحل المشكلة) ---
  const generateResponse = (userInput: string) => {
    const text = userInput.trim().toLowerCase();

    // 1. السلام عليكم (الأولوية للترحيب)
    if (text.includes("السلام") || text.includes("مرحبا") || text.includes("هلا")) {
      setStep(1);
      return "وعليكم السلام ورحمة الله، أهلاً بك في منصة رشيد. كيف يمكنني خدمتك اليوم في قضيتك الإدارية؟";
    }

    // 2. [تعديل هام] التحقق من الخطوة 2 أولاً:
    // إذا كان المستخدم قد سُئل عن التفاصيل (step 2) وكتب أي شيء، ننتقل للخطوة 3 فوراً
    // هذا يمنع الروبوت من تكرار السؤال حتى لو كتب المستخدم كلمات مفتاحية مثل "مدرسة" أو "وظيفة"
    if (step === 2 && text.length > 2) {
      setStep(3);
      return (
        <div className="space-y-4 w-full">
          <p>حسناً، بناءً على التفاصيل التي ذكرتها، قضيتك تبدو مكتملة الأركان مبدئياً. للبدء في الإجراءات النظامية، أحتاج منك المستندات التالية:</p>
          
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm w-full max-w-md mx-auto mt-2">
            <div className="bg-[#009B72] p-4 flex items-center gap-2 text-white">
              <ShieldCheck className="w-6 h-6 text-[#F9B132]" />
              <h3 className="font-bold text-lg">تقرير التوصيات الذكي</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" /> المتطلبات الأساسية:
                </h4>
                <ul className="text-xs text-slate-600 space-y-2 mr-5 list-disc">
                  <li>صورة القرار الإداري محل التظلم.</li>
                  <li>إثبات تاريخ التبليغ بالقرار.</li>
                  <li>الهوية الوطنية.</li>
                </ul>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-colors group"
                >
                  <FilePlus className="w-4 h-4 text-slate-400 group-hover:text-[#009B72]" />
                  إرفاق مستند جديد
                </button>
                <button 
                  onClick={handleAddToDashboard}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#009B72] hover:bg-[#007A5A] text-white font-bold text-xs shadow-md shadow-green-900/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري المعالجة...</> : <><BarChart3 className="w-4 h-4" /> إضافة للتقارير والمتابعة</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 3. اكتشاف نوع القضية (يأتي بعد التحقق من الخطوة السابقة)
    if (
        text.includes("تظلم") || text.includes("قضية") || 
        text.includes("مدرسة") || text.includes("جامعة") || 
        text.includes("فصل") || text.includes("وظيفة") || 
        text.includes("تعليم") || text.includes("جهة") ||
        text.includes("راتب") || text.includes("تقييم")
       ) {
      setStep(2);
      return "حسناً، فهمت أن لديك تظلم إداري. فلنبدأ فوراً في تحليل الدعوى وتحديد المتطلبات النظامية. هل يمكنك تزويدي بمزيد من التفاصيل حول وقائع الدعوى وتاريخ القرار؟";
    }

    // 4. رد افتراضي
    return "أنا هنا لمساعدتك في صياغة وتجهيز الدعاوى الإدارية. يمكنك شرح مشكلتك وسأقوم بتحليلها.";
  };

  const handleSend = async () => {
    if (!input.trim() && files.length === 0) return;

    const hasFiles = files.length > 0;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input || (hasFiles ? "تم إرفاق المستندات" : ""),
      files: [...files],
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const userInput = input;
    setInput("");
    setFiles([]); 

    // سيناريو رفع الملفات
    if (hasFiles) {
      setIsAnalyzing(true); 
      setTimeout(() => {
        setIsAnalyzing(false);
        const successMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: (
            <div className="space-y-4 w-full">
              <div className="flex items-center gap-2 text-slate-700">
                <FileCheck className="w-5 h-5 text-[#009B72]" />
                <p>تم تحليل المستندات ومطابقتها بالأنظمة بنجاح.</p>
              </div>
              <div className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-sm w-full max-w-sm mt-2">
                <div className="bg-green-50 p-3 border-b border-green-100">
                  <h3 className="font-bold text-[#009B72] text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    تمت إضافة المستند
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    تم ربط المستندات بملف القضية. يمكنك الآن متابعة التقرير الفني وحالة الدعوى عبر لوحة التحكم.
                  </p>
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#009B72] hover:bg-[#007A5A] text-white font-bold text-xs shadow-md shadow-green-900/10 transition-all hover:scale-[1.02]"
                  >
                    <BarChart3 className="w-4 h-4" />
                    الذهاب للتقارير والمتابعة
                  </button>
                </div>
              </div>
            </div>
          ),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, successMsg]);
      }, 3000); 

    } else {
      // الرد النصي
      setIsTyping(true); 
      setTimeout(() => {
        setIsTyping(false);
        const responseContent = generateResponse(userInput);
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }, 1500); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="flex flex-col h-screen bg-slate-50 font-sans selection:bg-[#009B72]/20 selection:text-[#009B72] overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 pointer-events-none" />
      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-20 shadow-sm h-[90px]">
        <div className="flex items-center gap-6">
          <Link href="/" className="p-3 hover:bg-slate-100 rounded-full transition-colors border border-transparent hover:border-slate-200">
            <ArrowRight className="w-6 h-6 text-slate-600" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-32">
               <Image src="/logo.png" alt="شعار رشيد" fill className="object-contain object-right" />
            </div>
            <div className="h-8 w-px bg-slate-300 hidden sm:block"></div>
            <div className="flex flex-col justify-center">
              <span className="text-xl font-bold text-slate-800 tracking-tight">المساعد الإجرائي</span>
              <span className="text-xs text-[#009B72] font-bold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#009B72] animate-pulse" />
                متصل الآن
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-8 z-10 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-center mb-2">
              <Bot className="w-12 h-12 text-[#009B72]" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">مرحباً بك في رشيد</h2>
            <p className="text-slate-500 max-w-lg text-lg leading-relaxed">
              أنا مساعدك الذكي للقضاء الإداري. ابدأ بـ "السلام عليكم" لنبدأ المحادثة.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[90%] md:max-w-[80%] gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-[#009B72] text-white' : 'bg-white border border-slate-200 text-[#009B72]'
              }`}>
                {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
              </div>
              <div className={`flex flex-col gap-2 w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-5 rounded-2xl shadow-sm text-base leading-relaxed w-auto inline-block ${
                  msg.role === 'user' 
                    ? 'bg-[#009B72] text-white rounded-tl-none' 
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tr-none w-full'
                }`}>
                  {msg.content}
                </div>
                {msg.files && msg.files.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {msg.files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200 p-2.5 rounded-lg text-xs text-slate-600 shadow-sm">
                        <FileText className="w-4 h-4 text-[#F9B132]" />
                        <span className="max-w-[150px] truncate font-medium">{file.name}</span>
                      </div>
                    ))}
                  </div>
                )}
                <span className="text-[11px] text-slate-400 px-1 opacity-80 font-medium">
                  {msg.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isAnalyzing && (
          <div className="flex justify-start w-full animate-fade-in">
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#009B72]">
                <Bot className="w-6 h-6" />
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#009B72] to-[#F9B132] rounded-2xl blur opacity-30 animate-pulse"></div>
                <div className="relative bg-white border border-slate-100 px-6 py-5 rounded-2xl rounded-tr-none shadow-sm flex items-center gap-4">
                  <div className="relative">
                     <ScanLine className="w-6 h-6 text-[#009B72] animate-pulse" />
                     <div className="absolute inset-0 bg-[#009B72]/20 blur-lg rounded-full animate-ping"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-sm">جاري تحليل المستندات ومطابقتها بالأنظمة...</span>
                    <span className="text-xs text-slate-500">يرجى الانتظار قليلاً</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isTyping && (
          <div className="flex justify-start w-full animate-fade-in">
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#009B72]">
                <Bot className="w-6 h-6" />
              </div>
              <div className="bg-white border border-slate-100 px-5 py-4 rounded-2xl rounded-tr-none shadow-sm flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-5 z-20">
        <div className="max-w-4xl mx-auto relative">
          {files.length > 0 && (
            <div className="flex gap-3 mb-4 overflow-x-auto pb-2 custom-scrollbar">
              {files.map((file, idx) => (
                <div key={idx} className="relative group flex items-center gap-3 bg-slate-50 border border-slate-200 pl-3 pr-8 py-2.5 rounded-2xl min-w-[180px]">
                  <div className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm">
                    {file.type.startsWith('image/') ? <ImageIcon className="w-5 h-5 text-purple-500" /> : <FileText className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-slate-700 truncate w-28">{file.name}</span>
                    <span className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(0)} KB</span>
                  </div>
                  <button onClick={() => removeFile(idx)} className="absolute top-1.5 left-1.5 p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-[2rem] p-2.5 shadow-sm focus-within:ring-2 focus-within:ring-[#009B72]/20 focus-within:border-[#009B72] transition-all">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
            <button onClick={() => fileInputRef.current?.click()} className="p-3.5 text-slate-400 hover:text-[#009B72] hover:bg-green-50 rounded-full transition-all" title="إرفاق مستند">
              <Paperclip className="w-6 h-6 -rotate-45" />
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 resize-none max-h-32 py-3.5 text-base font-medium custom-scrollbar leading-relaxed"
              rows={1}
              style={{ minHeight: '52px' }}
            />

            <button 
              onClick={handleSend}
              disabled={!input.trim() && files.length === 0}
              className={`p-3.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                input.trim() || files.length > 0 ? 'bg-[#009B72] text-white shadow-lg hover:bg-[#007A5A] hover:scale-105 transform translate-y-0' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isTyping || isAnalyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowUp className="w-6 h-6" />}
            </button>
          </div>
          
          <p className="text-center text-xs text-slate-400 mt-3 font-medium">
             رشيد مساعدك الذكي الإجرائي
          </p>
        </div>
      </div>
    </main>
  );
}