"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, FileText, AlertCircle, CheckCircle2, 
  Clock, TrendingUp, Sparkles, ArrowUpRight, FileWarning, 
  X, UploadCloud, Download, Check, Share2, Activity,
  Briefcase, AlertTriangle, PieChart
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// --- بيانات تجريبية (Mock Data) ---
const monthlyData = [
  { name: 'يناير', cases: 2 },
  { name: 'فبراير', cases: 4 },
  { name: 'مارس', cases: 3 },
  { name: 'أبريل', cases: 8 },
  { name: 'مايو', cases: 6 },
  { name: 'يونيو', cases: 10 },
];

const casesList = [
  {
    id: 1,
    title: "تظلم ضد قرار إداري (وزارة التعليم)",
    date: "2024-05-15",
    status: "pending_docs", 
    progress: 65,
    missing: ["قرار الفصل التأديبي", "محضر التحقيق"],
    priority: "high"
  },
  {
    id: 2,
    title: "دعوى تعويض (أمانة الرياض)",
    date: "2024-06-02",
    status: "processing",
    progress: 90,
    missing: [],
    priority: "medium"
  },
  {
    id: 3,
    title: "اعتراض على تقييم أداء وظيفي",
    date: "2024-04-10",
    status: "completed",
    progress: 100,
    missing: [],
    priority: "low"
  }
];

// --- تحسين تصميم الإحصائيات (تدرجات وظلال) ---
const stats = [
  { 
    title: "إجمالي القضايا", 
    value: "12", 
    icon: Briefcase, 
    gradient: "from-blue-500 to-blue-600",
    shadow: "shadow-blue-500/30",
    bgAccent: "bg-blue-500"
  },
  { 
    title: "مكتملة الأركان", 
    value: "8", 
    icon: CheckCircle2, 
    gradient: "from-[#009B72] to-[#007A5A]",
    shadow: "shadow-[#009B72]/30",
    bgAccent: "bg-[#009B72]"
  },
  { 
    title: "تنتظر مستندات", 
    value: "3", 
    icon: AlertTriangle, 
    gradient: "from-amber-400 to-amber-500",
    shadow: "shadow-amber-500/30",
    bgAccent: "bg-amber-500"
  },
  { 
    title: "نسبة النجاح الشكلي", 
    value: "94%", 
    icon: TrendingUp, 
    gradient: "from-purple-500 to-indigo-600",
    shadow: "shadow-purple-500/30",
    bgAccent: "bg-purple-500"
  },
];

export default function DashboardPage() {
  const [activeModal, setActiveModal] = useState<'upload' | 'report' | 'download' | null>(null);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const handleUploadSimulate = () => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setActiveModal(null);
          triggerToast("تم رفع المستندات بنجاح وإرسالها للتحليل");
        }, 800);
      }
    }, 300);
  };

  const handleDownloadSimulate = () => {
    setActiveModal(null);
    triggerToast("جاري تحميل ملف القضية بصيغة PDF...");
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-[#009B72]/20 selection:text-[#009B72] pb-10">
      
      {/* الخلفية */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-40 pointer-events-none" />
      
      {/* الهيدر */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-[80px] flex items-center justify-between">
          <div className="flex items-center gap-4">
             <Link href="/" className="p-2 hover:bg-slate-50 rounded-full transition-colors">
               <ArrowRight className="w-5 h-5 text-slate-500" />
             </Link>
             <div className="relative h-10 w-24">
               <Image src="/logo.png" alt="شعار رشيد" fill className="object-contain object-right" />
             </div>
             <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
             <span className="text-sm font-bold text-slate-600 hidden sm:block">لوحة التحكم</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#009B72]/10 rounded-full border border-[#009B72]/20">
              <div className="w-8 h-8 rounded-full bg-[#009B72] text-white flex items-center justify-center text-xs font-bold">A</div>
              <span className="text-sm font-bold text-[#009B72] hidden md:block">أحمد (مستفيد)</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        
        {/* --- 1. قسم الإحصائيات العلوية (التصميم الجديد) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="relative bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
              
              {/* زخرفة خلفية ناعمة */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-[0.04] rounded-bl-[100px] pointer-events-none transition-transform duration-500 group-hover:scale-125`} />

              <div className="flex justify-between items-start mb-4">
                {/* الأيقونة داخل مربع متدرج */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg ${stat.shadow} group-hover:rotate-6 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                
                {i === 3 && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                    <TrendingUp className="w-3 h-3" /> +2.5%
                  </span>
                )}
              </div>

              <div className="relative z-10">
                <p className="text-3xl font-extrabold text-slate-800 mb-1">{stat.value}</p>
                <h3 className="text-sm font-bold text-slate-400 group-hover:text-slate-600 transition-colors">{stat.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* --- 2. العمود الأيمن (القضايا) --- */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-6 h-6 text-[#009B72]" />
                متابعة القضايا النشطة
              </h2>
              <Link href="/chat" className="text-sm font-bold text-[#009B72] hover:underline flex items-center gap-1">
                بدء قضية جديدة <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid gap-4">
              {casesList.map((c) => (
                <div key={c.id} className="group relative bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-[#009B72]/30 transition-all duration-300">
                  <div className={`absolute right-0 top-6 bottom-6 w-1 rounded-l-full ${
                    c.status === 'pending_docs' ? 'bg-[#F9B132]' : 
                    c.status === 'completed' ? 'bg-[#009B72]' : 'bg-blue-500'
                  }`} />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#009B72] transition-colors">{c.title}</h3>
                        {c.priority === 'high' && (
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-100">عاجل</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> تاريخ الإنشاء: {c.date}
                      </p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold border self-start md:self-center ${
                      c.status === 'pending_docs' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      c.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' :
                      'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {c.status === 'pending_docs' ? 'بانتظار مستندات' :
                       c.status === 'completed' ? 'مكتملة وجاهزة' : 'جاري التحليل'}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">اكتمال الملف</span>
                      <span className="font-bold text-slate-700">{c.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${c.status === 'pending_docs' ? 'bg-[#F9B132]' : 'bg-[#009B72]'}`} style={{ width: `${c.progress}%` }} />
                    </div>
                  </div>

                  {c.missing.length > 0 && (
                    <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 animate-pulse-slow">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-bold text-red-700">مستندات مفقودة (مطلوب إجراء):</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {c.missing.map((doc, idx) => (
                          <span key={idx} className="bg-white px-3 py-1 rounded-lg text-xs font-medium text-red-600 border border-red-100 shadow-sm">{doc}</span>
                        ))}
                      </div>
                      <div className="mt-3 text-right">
                        <button 
                          onClick={() => { setSelectedCase(c); setActiveModal('upload'); }}
                          className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors shadow-sm shadow-red-200"
                        >
                          رفع المستندات الآن
                        </button>
                      </div>
                    </div>
                  )}

                  {c.status === 'completed' && (
                    <div className="flex justify-end mt-4">
                      <button 
                        onClick={() => { setSelectedCase(c); setActiveModal('download'); }}
                        className="text-sm font-bold text-white bg-[#009B72] hover:bg-[#007A5A] px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-green-900/10 flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        تحميل ملف القضية
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" /> النشاط القضائي (آخر 6 أشهر)
              </h3>
              <div className="h-[300px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#009B72" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#009B72" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} />
                    <Area type="monotone" dataKey="cases" stroke="#009B72" strokeWidth={3} fillOpacity={1} fill="url(#colorCases)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* --- 3. العمود الأيسر (التوصيات) --- */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#009B72] to-[#007A5A] rounded-3xl p-6 text-white shadow-xl shadow-green-900/20 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-[#F9B132] animate-pulse" />
                  <h3 className="text-lg font-bold">توصيات رشيد الذكية</h3>
                </div>
                <p className="text-green-50 text-sm leading-relaxed mb-6 opacity-90">
                  بناءً على تحليلاتنا، لاحظنا أن 60% من التأخير سببه نقص "محاضر التحقيق". ننصحك بتجهيزها دائماً.
                </p>
                <button 
                  onClick={() => setActiveModal('report')}
                  className="w-full bg-white text-[#009B72] font-bold py-3 rounded-xl hover:bg-green-50 transition-colors shadow-sm hover:shadow-lg transform active:scale-95 duration-200"
                >
                  عرض التقرير التفصيلي
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 mb-4">مستندات جاهزة للتحميل</h3>
              <ul className="space-y-3">
                {["نموذج صحيفة دعوى إدارية", "قائمة المستندات المطلوبة للتظلم", "لائحة المرافعات الشرعية"].map((item, i) => (
                  <li 
                    key={i} 
                    onClick={() => triggerToast(`تم تحميل "${item}" بنجاح`)}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group cursor-pointer border border-transparent hover:border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-[#009B72]" />
                      </div>
                      <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{item}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#009B72] -rotate-45" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50 rounded-3xl p-5 border border-amber-100">
              <div className="flex items-start gap-3">
                 <AlertCircle className="w-5 h-5 text-[#F9B132] mt-0.5" />
                 <div>
                   <h4 className="font-bold text-amber-900 text-sm">تنبيه نظامي جديد</h4>
                   <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                     صدر تعميم جديد بخصوص مدد التظلم في القضايا الوظيفية.
                   </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- النوافذ المنبثقة (Modals) --- */}
      
      {/* 1. Upload Modal */}
      {activeModal === 'upload' && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <UploadCloud className="w-6 h-6 text-red-500" />
                رفع النواقص
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            
            <p className="text-sm text-slate-500 mb-4">يجب إرفاق المستندات التالية لاستكمال القضية: <span className="font-bold text-slate-800">{selectedCase.title}</span></p>
            
            <div className="space-y-3 mb-6">
              {selectedCase.missing.map((doc: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                  <FileWarning className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-bold text-red-700">{doc}</span>
                </div>
              ))}
            </div>

            <div 
              onClick={handleUploadSimulate}
              className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#009B72] hover:bg-green-50 transition-colors group"
            >
              {isUploading ? (
                <div className="w-full">
                  <div className="flex justify-between text-xs mb-2 font-bold text-[#009B72]">
                    <span>جاري الرفع...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#009B72] transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-[#009B72] mb-2 transition-colors" />
                  <p className="text-sm font-bold text-slate-600">اضغط لرفع الملفات</p>
                  <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Report Modal */}
      {activeModal === 'report' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="bg-[#009B72] p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-[#F9B132]" />
                <h3 className="text-xl font-bold">تقرير الذكاء الاصطناعي</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-white/20 rounded-full text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mb-6">
                <h4 className="font-bold text-amber-900 mb-2">ملخص التحليل:</h4>
                <p className="text-sm text-amber-800 leading-relaxed">
                  بناءً على تحليل 12 قضية سابقة، نسبة نجاحك الشكلي ممتازة (94%). ومع ذلك، هناك تأخير متكرر في مرحلة "جمع الأدلة" يستغرق متوسط 5 أيام إضافية.
                </p>
              </div>

              <h4 className="font-bold text-slate-800 mb-4">نقاط التحسين المقترحة:</h4>
              <div className="space-y-4">
                {[
                  { title: "أتمتة النماذج", desc: "استخدم النماذج الجاهزة في المنصة لتقليل وقت الصياغة.", icon: FileText },
                  { title: "التذكير المبكر", desc: "فعل التنبيهات قبل انتهاء المهل بـ 3 أيام.", icon: Clock },
                  { title: "مراجعة اللوائح", desc: "اطلع على التحديثات الأخيرة في نظام المرافعات.", icon: CheckCircle2 },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-[#009B72]/30 hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-[#009B72]">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">{item.title}</h5>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-200 transition-colors">إغلاق</button>
              <button className="px-5 py-2 rounded-xl bg-[#009B72] text-white font-bold hover:bg-[#007A5A] transition-colors flex items-center gap-2">
                <Share2 className="w-4 h-4" /> مشاركة التقرير
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Download Modal */}
      {activeModal === 'download' && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center scale-100 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-[#009B72]" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">ملف القضية جاهز!</h3>
            <p className="text-slate-500 text-sm mb-8">
              تم تجميع كافة المستندات واللوائح الخاصة بقضية <br/>
              <span className="font-bold text-slate-800">"{selectedCase.title}"</span>
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={handleDownloadSimulate}
                className="w-full bg-[#009B72] text-white font-bold py-3.5 rounded-xl hover:bg-[#007A5A] transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                تحميل الملف (PDF)
              </button>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-full text-slate-400 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#009B72]" />
          <span className="text-sm font-bold">{showToast}</span>
        </div>
      )}

    </main>
  );
}