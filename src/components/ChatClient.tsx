"use client";

import { useState } from "react";
import type { RashidResult } from "@/lib/types";
import { 
  Send, AlertTriangle, CheckCircle2, FileText, 
  ArrowRightCircle, Info, Sparkles, Loader2 
} from "lucide-react";
import { clsx } from "clsx";

export default function ChatClient() {
  const [caseText, setCaseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RashidResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function analyze() {
    if (!caseText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const r = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseText }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "حدث خطأ ما");
      setResult(data.result);
    } catch (e: any) {
      setError(e?.message || "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
      
      {/* 1. قسم الإدخال (اليمين) */}
      <div className={clsx(
        "flex flex-col transition-all duration-500 ease-in-out",
        result ? "lg:w-1/3" : "lg:w-full lg:max-w-3xl lg:mx-auto"
      )}>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col h-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rashid-green to-rashid-gold" />
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-rashid-dark flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-rashid-gold" />
              اشرح قضيتك
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              اكتب التفاصيل بحرية. مثال: "صدر قرار بفصلي من وظيفتي الحكومية بتاريخ..."
            </p>
          </div>

          <textarea
            value={caseText}
            onChange={(e) => setCaseText(e.target.value)}
            className="flex-1 w-full resize-none bg-slate-50 rounded-2xl border-0 p-5 text-lg outline-none focus:ring-2 focus:ring-rashid-green/20 placeholder:text-slate-400 transition-all"
            placeholder="ابدأ بالكتابة هنا..."
          />

          <div className="mt-6">
            <button
              onClick={analyze}
              disabled={loading || caseText.trim().length < 10}
              className="w-full h-14 bg-rashid-dark text-white rounded-xl font-bold text-lg hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-rashid-dark/20 hover:shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جارٍ التحليل الذكي...
                </>
              ) : (
                <>
                  تحليل وتشخيص
                  <Send className="w-5 h-5 -rotate-90" />
                </>
              )}
            </button>
            {error && <p className="mt-3 text-red-500 text-sm text-center">{error}</p>}
          </div>
        </div>
      </div>

      {/* 2. قسم المخرجات (اليسار) - يظهر عند وجود نتيجة */}
      {result && (
        <div className="lg:w-2/3 animate-fade-in flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar pb-10">
          
          {/* بطاقة ملخص الحالة */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-rashid-green/20 shadow-sm relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-rashid-green/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">نوع القضية</h3>
              <p className="text-xl font-bold text-rashid-green">{result.case_type}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-rashid-gold/20 shadow-sm relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-rashid-gold/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">المسار المقترح</h3>
              <p className="text-xl font-bold text-rashid-gold">{result.track}</p>
            </div>
          </div>

          {/* قائمة التحقق (Checklist) */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-rashid-green" />
              <h3 className="font-bold text-lg">قائمة التحقق الإجرائية</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {result.checklist.map((item, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-colors flex gap-4">
                  <div className="mt-1 h-5 w-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0">
                    <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{item.item}</p>
                    {item.notes && <p className="text-sm text-slate-500 mt-1">{item.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* التنبيهات الذكية */}
          {result.warnings.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-lg">تنبيهات ومخاطر محتملة</h3>
              </div>
              <div className="p-4 grid gap-3">
                {result.warnings.map((w, i) => (
                  <div key={i} className={clsx(
                    "p-4 rounded-xl border-r-4 flex flex-col gap-1",
                    w.severity === 'high' ? "bg-red-50 border-red-500 text-red-900" :
                    w.severity === 'medium' ? "bg-amber-50 border-amber-500 text-amber-900" :
                    "bg-blue-50 border-blue-500 text-blue-900"
                  )}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{w.title}</span>
                      <span className="text-[10px] uppercase tracking-widest font-bold opacity-70">{w.severity}</span>
                    </div>
                    <p className="text-sm opacity-90">{w.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* المستندات والخطوات */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* المستندات */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-rashid-dark">
                <FileText className="w-5 h-5 text-slate-400" />
                المستندات المطلوبة
              </h3>
              <ul className="space-y-3">
                {result.required_documents.map((d, i) => (
                  <li key={i} className="text-sm bg-slate-50 p-3 rounded-lg text-slate-700 border border-slate-100">
                    <span className="font-bold block text-slate-900 mb-1">{d.name}</span>
                    {d.why}
                  </li>
                ))}
              </ul>
            </div>

            {/* الخطوات التالية */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-rashid-dark">
                <ArrowRightCircle className="w-5 h-5 text-slate-400" />
                الخطوات التالية
              </h3>
              <ol className="relative border-r border-slate-200 mr-2 space-y-6">
                {result.next_steps.map((s, i) => (
                  <li key={i} className="mr-4">
                    <span className="absolute -mr-[21px] flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 ring-4 ring-white">
                      <span className="h-2 w-2 rounded-full bg-rashid-green"></span>
                    </span>
                    <p className="text-sm text-slate-600 leading-snug">{s}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <p className="text-xs text-center text-slate-400 mt-4 mb-2">
            {result.disclaimer}
          </p>
        </div>
      )}
    </div>
  );
}