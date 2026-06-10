"use client";

import Link from "next/link";
import { ArrowUp, Youtube, Instagram, Facebook, Mail, Phone, Info } from "lucide-react";

// Telegram Custom SVG Icon
const TelegramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.944 0C5.344 0 0 5.344 0 11.944c0 5.622 3.88 10.35 9.125 11.637.28.05.38-.12.38-.27v-.95c-3.322.72-4.022-1.6-4.022-1.6-.543-1.38-1.33-1.75-1.33-1.75-1.084-.74.083-.73.083-.73 1.205.08 1.838 1.24 1.838 1.24 1.07 1.83 2.809 1.3 3.495.99.107-.77.418-1.3.76-1.6-2.656-.3-5.447-1.33-5.447-5.91 0-1.3.465-2.38 1.235-3.22-.135-.3-.54-1.52.115-3.17 0 0 1-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.3-1.55 3.3-1.23 3.3-1.23.655 1.65.25 2.87.13 3.17.77.84 1.235 1.92 1.235 3.22 0 4.59-2.796 5.61-5.46 5.9.43.37.815 1.1.815 2.22v3.29c0 .15.1.325.385.27C20.125 22.29 24 17.56 24 11.944 24 5.344 18.656 0 11.944 0z" className="hidden" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.52-.46-.01-1.33-.26-1.98-.48-.8-.26-1.43-.4-1.37-.85.03-.23.35-.47.96-.72 3.76-1.63 6.27-2.71 7.54-3.23 3.58-1.48 4.32-1.74 4.81-1.75.11 0 .35.03.5.16.13.1.17.24.18.34.02.1.04.53.02.9z"/>
  </svg>
);

// X (formerly Twitter) Custom SVG Icon
const XIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#011124] text-slate-300 pt-16 pb-8 border-t-4 border-[#b21c1c] relative select-none mt-20" dir="rtl">
      {/* Background elegant pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Section: Logo, Slogan and Social Links */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-10 border-b border-slate-800/80 gap-6">
          <div className="text-center md:text-right">
            {/* N18 Brand Logo */}
            <Link href="/" className="inline-flex items-center text-white font-sans font-bold text-4xl tracking-tighter leading-none hover:opacity-90 transition-opacity">
              <div dir="ltr" className="flex items-center">
                <span className="text-5xl font-extrabold text-white">N</span>
                <span className="text-4xl font-black text-white">18</span>
              </div>
              <span className="h-6 w-[2px] bg-[#b21c1c] mx-3 rounded-full" />
              <span className="text-lg font-bold text-slate-300 tracking-normal font-sans">אתר החדשות של ישראל</span>
            </Link>
            <p className="mt-3 text-slate-400 text-sm max-w-md">
              כל העדכונים המרכזיים, הפרשנויות, תוכניות האקטואליה והדיווחים הבלעדיים מסביב לשעון מערוץ N18.
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">עקבו אחרינו</span>
            <div className="flex items-center gap-3">
              <a href="https://t.me/" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#229ED9] hover:border-[#229ED9] transition-all duration-300 hover:scale-107 shadow-md">
                <TelegramIcon className="w-[18px] h-[18px]" />
              </a>
              <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#FF0000] hover:border-[#FF0000] transition-all duration-300 hover:scale-107 shadow-md">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-black hover:border-black transition-all duration-300 hover:scale-107 shadow-md">
                <XIcon className="w-4 h-4" />
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:border-transparent transition-all duration-300 hover:scale-107 shadow-md">
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] transition-all duration-300 hover:scale-107 shadow-md">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Middle Section: Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-right">
          
          {/* Column 1: News categories */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-base font-extrabold mb-2 relative after:content-[''] after:absolute after:bottom-[-6px] after:right-0 after:w-8 after:h-0.5 after:bg-[#b21c1c] pb-1.5">
              חדשות ועדכונים
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link href="/" className="hover:text-white hover:pr-1.5 transition-all duration-200 block text-slate-400 font-medium">צבא וביטחון</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:pr-1.5 transition-all duration-200 block text-slate-400 font-medium">פוליטי ומדיני</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:pr-1.5 transition-all duration-200 block text-slate-400 font-medium">בעולם</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:pr-1.5 transition-all duration-200 block text-slate-400 font-medium">משפט ופלילים</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:pr-1.5 transition-all duration-200 block text-slate-400 font-medium">דעות ובלוגים</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Show programs */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-base font-extrabold mb-2 relative after:content-[''] after:absolute after:bottom-[-6px] after:right-0 after:w-8 after:h-0.5 after:bg-[#b21c1c] pb-1.5">
              תוכניות ערוץ N18
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link href="/" className="hover:text-white hover:pr-1.5 transition-all duration-200 block text-slate-400 font-medium">הפטריוטים</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:pr-1.5 transition-all duration-200 block text-slate-400 font-medium">מהדורת החדשות המרכזית</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:pr-1.5 transition-all duration-200 block text-slate-400 font-medium">שבע עם שרון גל</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:pr-1.5 transition-all duration-200 block text-slate-400 font-medium">אולפן חמישי</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:pr-1.5 transition-all duration-200 block text-slate-400 font-medium">שש עם מגי טביבי</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Site Services */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-base font-extrabold mb-2 relative after:content-[''] after:absolute after:bottom-[-6px] after:right-0 after:w-8 after:h-0.5 after:bg-[#b21c1c] pb-1.5">
              מידע ושירותים
            </h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <Link href="/" className="hover:text-white hover:pr-1.5 transition-all duration-200 block text-slate-400 font-medium">צרו קשר</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:pr-1.5 transition-all duration-200 block text-slate-400 font-medium">פרסמו אצלנו</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:pr-1.5 transition-all duration-200 block text-slate-400 font-medium">לוח שידורים</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:pr-1.5 transition-all duration-200 block text-slate-400 font-medium">תנאי שימוש</Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white hover:pr-1.5 transition-all duration-200 block text-slate-400 font-medium">מדיניות פרטיות</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: App download */}
          <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
            <h4 className="text-white text-base font-extrabold mb-2 relative after:content-[''] after:absolute after:bottom-[-6px] after:right-0 after:w-8 after:h-0.5 after:bg-[#b21c1c] pb-1.5">
              אפליקציית N18
            </h4>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-1.5">
              הורידו עכשיו את אפליקציית N18 לנייד ותיהנו מעדכונים שוטפים, שידורים חיים והתראות בזמן אמת.
            </p>
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 max-w-[170px] sm:max-w-none md:max-w-[170px]">
              
              {/* App Store Badge */}
              <a href="https://apps.apple.com/" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-2 bg-black border border-slate-800 rounded-lg px-3.5 py-1.5 text-white hover:bg-slate-900 transition-colors duration-200">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.1.08.35.12.5.12.87 0 1.95-.57 2.32-1.45z"/>
                </svg>
                <div className="flex flex-col text-right font-sans">
                  <span className="text-[9px] text-slate-400 font-bold leading-none select-none">Download on the</span>
                  <span className="text-[14px] font-extrabold leading-tight -mt-0.5 whitespace-nowrap">App Store</span>
                </div>
              </a>

              {/* Google Play Badge */}
              <a href="https://play.google.com/" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 bg-black border border-slate-800 rounded-lg px-3.5 py-1.5 text-white hover:bg-slate-900 transition-colors duration-200">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 3.004c-.167 0-.326.042-.468.125l10.282 10.28 2.502-2.5-12.022-6.878A.954.954 0 005 3.004zM3.47 3.66a.936.936 0 00-.22.617v15.446c0 .236.082.449.22.617L13.28 12.03 3.47 3.661zm13.136 8.656l2.5 2.5.016-.01A.957.957 0 0020 14c0-.28-.124-.543-.342-.667l-3.052-1.745zM5 20.996c.106 0 .211-.023.308-.078l12.022-6.879-2.502-2.502L4.532 20.817c.142.083.301.125.468.125z"/>
                </svg>
                <div className="flex flex-col text-right font-sans">
                  <span className="text-[9px] text-slate-400 font-bold leading-none select-none">GET IT ON</span>
                  <span className="text-[14px] font-extrabold leading-tight -mt-0.5 whitespace-nowrap">Google Play</span>
                </div>
              </a>

            </div>
          </div>

        </div>

        {/* Bottom Strip: Divider, Copyright & Student Project Disclaimer */}
        <div className="border-t border-slate-800/80 pt-8 mt-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-semibold gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center md:text-right">
            <span>כל הזכויות שמורות ל-N18 © {new Date().getFullYear()}</span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-[#b21c1c]/90">
              <Info className="w-3.5 h-3.5" />
              <span>האתר פותח לצרכי לימודים והדגמה בלבד</span>
            </div>
          </div>

          {/* Back to Top Button */}
          <button 
            onClick={handleScrollToTop}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 hover:text-white text-slate-400 px-4 py-2 rounded-full transition-all duration-300 shadow-lg cursor-pointer hover:shadow-xl font-bold"
            title="חזרה לראש העמוד"
          >
            <span>חזרה ללמעלה</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </div>
    </footer>
  );
}
