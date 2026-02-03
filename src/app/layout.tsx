import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import "./globals.css";

// تحميل خط المراعي بكافة الأوزان
const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai", // نبقي المتغير لاستخدامات Tailwind
  display: "swap",
});

export const metadata: Metadata = {
  title: "منصة رشيد | مرشدك للتقاضي الإداري",
  description: "الذكاء الاصطناعي في خدمة العدالة الإدارية",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      {/* التعديل الهام هنا:
         استخدمنا almarai.className مباشرة لفرض الخط
         وأضفنا almarai.variable ليتعرف عليه Tailwind
      */}
      <body className={`${almarai.className} ${almarai.variable} antialiased bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}