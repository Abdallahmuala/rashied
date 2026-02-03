"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Scale, ShieldCheck, FileText, Sparkles, BarChart3, ArrowLeft } from "lucide-react";
import { TypeAnimation } from 'react-type-animation';

export default function Home() {
  // --- منطق تفاعل الماوس ---
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <main className="min-h-screen bg-white relative overflow-hidden selection:bg-[#009B72]/20 selection:text-[#009B72]">
      
      {/* ================= خلفية تفاعلية ================= */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 155, 114, 0.06), transparent 40%)`
        }}
      />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-72 h-72 bg-[#009B72]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-[#F9B132]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob [animation-delay:2s]" />
        <div className="absolute bottom-[-10%] left-[10%] w-72 h-72 bg-[#009B72]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob [animation-delay:4s]" />
      </div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      {/* ================================================= */}

      {/* --- النافبار --- */}
      <nav className="relative z-50 mx-auto max-w-7xl px-6 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="شعار منصة رشيد" 
              width={200} 
              height={80} 
              priority 
              className="h-20 w-auto object-contain" 
            />
          </Link>
        </div>
        
        {/* تم حذف زر "دخول المستفيدين" من هنا */}
      </nav>

      {/* --- القسم الرئيسي (Hero Section) --- */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pt-0 pb-24 text-center">
        
        <div className="flex justify-center mb-8 animate-fade-in">
           <Image
             src="/logo.png"
             alt="شعار رشيد الكبير"
             width={350}
             height={150}
             priority
             className="h-32 md:h-40 w-auto object-contain drop-shadow-sm" 
           />
        </div>

        <div className="flex justify-center mb-6">
           <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 backdrop-blur-md px-4 py-1.5 text-sm text-slate-600 font-bold shadow-sm cursor-default hover:bg-white/80 transition-colors">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            <span>الذكاء الاصطناعي لخدمة القضاء الإداري</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.3] mb-6 text-slate-900">
          قضيتك الإدارية، <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00684A] via-[#009B72] to-[#D4941E]">
            <TypeAnimation
              sequence={[
                'مكتملة ومُحكمة.',
                2000,
                'جاهزة للتقديم.',
                2000,
                'خالية من الأخطاء.',
                2000,
                'مكتملة ومُحكمة.',
              ]}
              wrapper="span"
              speed={40}
              repeat={Infinity}
              cursor={true}
              style={{ display: 'inline-block' }}
            />
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-500 mb-12 leading-relaxed font-medium">
          تجنب الرفض الشكلي. رشيد يحلل وقائع دعواك، يجهز قائمة المستندات، وينبهك للأخطاء الإجرائية قبل التوجه للمحكمة.
        </p>

        {/* ======================================================== */}
        {/* المنطقة الجديدة: بطاقات الإجراءات التفاعلية         */}
        {/* ======================================================== */}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl mx-auto">
          
          {/* البطاقة الأولى: ابدأ مع المساعد الإجرائي */}
          <Link 
            href="/chat" 
            className="group relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300 hover:bg-[#009B72] hover:border-[#009B72] hover:shadow-[0_10px_40px_rgba(0,155,114,0.2)] hover:-translate-y-2 cursor-pointer overflow-hidden"
          >
             {/* دائرة الأيقونة */}
             <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-white/20">
               <Sparkles className="w-9 h-9 text-[#009B72] transition-colors duration-300 group-hover:text-white" />
             </div>
             
             {/* النصوص */}
             <h3 className="text-2xl font-bold text-slate-800 mb-2 transition-colors duration-300 group-hover:text-white">
              ابدأ مع المساعد الإجرائي
             </h3>
             <p className="text-sm text-slate-400 font-medium transition-colors duration-300 group-hover:text-green-100">
               تحليل فوري للقضية وتجهيز المتطلبات
             </p>

             {/* أيقونة السهم تظهر عند الهوفر */}
             <div className="absolute bottom-6 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <ArrowLeft className="w-6 h-6 text-white" />
             </div>
          </Link>


          {/* البطاقة الثانية: التقارير والمتابعة (تم ربطها بـ /dashboard) */}
          <Link 
            href="/dashboard"
            className="group relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300 hover:bg-[#009B72] hover:border-[#009B72] hover:shadow-[0_10px_40px_rgba(0,155,114,0.2)] hover:-translate-y-2 cursor-pointer overflow-hidden"
          >
             {/* دائرة الأيقونة */}
             <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-white/20">
               <BarChart3 className="w-9 h-9 text-[#F9B132] transition-colors duration-300 group-hover:text-white" />
             </div>
             
             {/* النصوص */}
             <h3 className="text-2xl font-bold text-slate-800 mb-2 transition-colors duration-300 group-hover:text-white">
               التقارير والمتابعة
             </h3>
             <p className="text-sm text-slate-400 font-medium transition-colors duration-300 group-hover:text-green-100">
               سجل القضايا السابقة والملفات المنجزة
             </p>

              {/* أيقونة السهم تظهر عند الهوفر */}
              <div className="absolute bottom-6 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                <ArrowLeft className="w-6 h-6 text-white" />
             </div>
          </Link>

        </div>
        {/* ======================================================== */}

      </div>

      {/* --- قسم المميزات --- */}
      <section id="features" className="relative z-10 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* كارت 1 */}
            <div className="group relative p-8 rounded-[2rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 rounded-[2rem] pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Scale className="w-7 h-7 text-[#009B72]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">تحليل قانوني فوري</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  بدلاً من البحث اليدوي، يقوم رشيد بربط وقائع قضيتك بالأنظمة واللوائح ذات الصلة فوراً.
                </p>
              </div>
            </div>

            {/* كارت 2 */}
            <div className="group relative p-8 rounded-[2rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">حماية من الرفض</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  قوائم تحقق ذكية تضمن لك اكتمال المتطلبات الشكلية قبل رفع الدعوى.
                </p>
              </div>
            </div>

            {/* كارت 3 */}
            <div className="group relative p-8 rounded-[2rem] bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1">
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-7 h-7 text-slate-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">تجهيز المستندات</h3>
                <p className="text-slate-500 leading-relaxed font-medium">
                  يعرفك بالضبط على المستندات اللازمة لقضيتك ولماذا تحتاجها، لترفع ملفاً مكتملاً.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-slate-400 font-medium relative z-10">
        <p>رشيد © 2024 — مساعد ذكي للتقاضي الإداري</p>
      </footer>
    </main>
  );
}