"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Search, Menu, X } from "lucide-react";
import { articles } from "../data/articles";



function numberToGematria(num: number): string {
  if (num <= 0 || num >= 1000) return "";
  
  const letters: { [key: number]: string } = {
    400: 'ת', 300: 'ש', 200: 'ר', 100: 'ק',
    90: 'צ', 80: 'פ', 70: 'ע', 60: 'ס', 50: 'נ', 40: 'מ', 30: 'ל', 20: 'כ', 10: 'י',
    9: 'ט', 8: 'ח', 7: 'ז', 6: 'ו', 5: 'ה', 4: 'ד', 3: 'ג', 2: 'ב', 1: 'א'
  };
  
  let result = "";
  let temp = num;
  
  if (temp === 15) return "טו";
  if (temp === 16) return "טז";
  
  const keys = Object.keys(letters).map(Number).sort((a, b) => b - a);
  for (const key of keys) {
    while (temp >= key) {
      result += letters[key];
      temp -= key;
    }
  }
  
  if (result.length === 1) {
    return result + "׳";
  } else if (result.length > 1) {
    return result.slice(0, -1) + "״" + result.slice(-1);
  }
  return result;
}

function getHebrewDateString(): string {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    });
    
    const parts = formatter.formatToParts(date);
    let weekday = "";
    let dayStr = "";
    let month = "";
    let yearStr = "";
    
    for (const part of parts) {
      if (part.type === 'weekday') weekday = part.value;
      if (part.type === 'day') dayStr = part.value;
      if (part.type === 'month') month = part.value;
      if (part.type === 'year') yearStr = part.value;
    }
    
    const dayNum = parseInt(dayStr, 10);
    const dayGematria = !isNaN(dayNum) ? numberToGematria(dayNum) : dayStr;
    
    let yearGematria = yearStr;
    const yearNum = parseInt(yearStr.replace(/\D/g, ""), 10);
    if (!isNaN(yearNum)) {
      const yearMod = yearNum % 1000;
      yearGematria = numberToGematria(yearMod);
    }
    
    let displayWeekday = weekday;
    if (displayWeekday.startsWith("יום ")) {
      displayWeekday = displayWeekday.substring(4);
    }
    
    return `${displayWeekday}, ${dayGematria} ${month} ${yearGematria}`;
  } catch (e) {
    return "שלישי, כ״ד בסיוון תשפ״ו";
  }
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hebrewDate, setHebrewDate] = useState("שלישי, כ״ד בסיוון תשפ״ו");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openSearch = () => {
    setIsSearchOpen(true);
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    dialogRef.current?.close();
    setSearchQuery("");
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInside = (
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width
      );
      if (!isInside) {
        closeSearch();
      }
    };

    dialog.addEventListener("click", handleBackdropClick);
    return () => {
      dialog.removeEventListener("click", handleBackdropClick);
    };
  }, []);

  const filteredArticles = searchQuery.trim()
    ? articles.filter((art) => {
        const query = searchQuery.toLowerCase();
        return (
          art.title.toLowerCase().includes(query) ||
          art.description.toLowerCase().includes(query) ||
          (art.lead && art.lead.toLowerCase().includes(query)) ||
          art.paragraphs.some((p) => p.toLowerCase().includes(query)) ||
          art.category.toLowerCase().includes(query) ||
          art.author.toLowerCase().includes(query)
        );
      })
    : articles.slice(0, 5);

  useEffect(() => {
    setHebrewDate(getHebrewDateString());
  }, []);

  const navLinks = [
    { name: "בטחוני", href: "/#בטחוני" },
    { name: "פוליטי", href: "/#פוליטי" },
    { name: "כלכלה", href: "/#כלכלה" },
    { name: "ספורט", href: "/#ספורט" },
    { name: "טכנולוגיה", href: "/#טכנולוגיה" }
  ];

  return (
    <header className="w-full bg-[#b21c1c] h-14 shadow-md sticky top-0 z-50 select-none" dir="rtl">
      <div className="max-w-[1400px] h-full mx-auto flex items-center justify-between px-4 sm:px-6">

        {/* Right Side: Logo + Vertical Divider + Nav Links */}
        <div className="flex items-center gap-4 lg:gap-6">

          {/* N18 Logo */}
          <Link href="/" dir="ltr" className="flex items-center text-white font-sans font-bold text-3xl tracking-tighter leading-none hover:opacity-90 transition-opacity cursor-pointer">
            <span className="text-4xl font-extrabold">N</span>
            <span className="text-3xl font-black">18</span>
          </Link>

          {/* Light-blue vertical line separator */}
          <div className="h-8 w-[3px] bg-[#a9c9eb]/80 rounded-full" />

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[15px] font-bold text-white hover:text-white/80 transition-colors duration-150 whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* "עוד" (More) dropdown pill button */}
          <button className="hidden sm:flex items-center gap-1 border border-white/40 hover:bg-white/10 rounded-full px-3 py-1 text-white text-xs lg:text-sm font-bold transition-all duration-150 cursor-pointer">
            <ChevronDown className="w-4 h-4" />
            <span>עוד</span>
          </button>
        </div>

        {/* Left Side: Search + Date + LIVE */}
        <div className="flex items-center gap-4 lg:gap-5">

          {/* Search Icon */}
          <button
            onClick={openSearch}
            className="text-white hover:text-white/80 transition-colors cursor-pointer p-1"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Hebrew Date */}
          <div className="text-xs lg:text-sm font-bold text-white/90 hidden md:block whitespace-nowrap">
            {hebrewDate}
          </div>

          {/* LIVE Indicator Button */}
          <div className="flex items-center gap-1.5 border border-white/30 rounded-full px-3 py-1 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer select-none">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <span className="text-xs font-black text-white tracking-wider">LIVE</span>
          </div>

          {/* Mobile Menu Toggle (Hamburger) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden text-white hover:text-white/80 transition-colors cursor-pointer p-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#b21c1c] border-t border-white/10 px-4 py-3 space-y-2 shadow-inner animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block text-white/95 hover:text-white font-bold text-sm py-2 px-3 hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button className="flex w-full items-center justify-between border border-white/40 hover:bg-white/10 rounded-lg px-3 py-2 text-white text-sm font-bold transition-all duration-150 cursor-pointer">
            <span>עוד קטגוריות</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Modal Dialog */}
      <dialog
        ref={dialogRef}
        onClose={closeSearch}
        className="w-[90%] max-w-2xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-0 overflow-hidden border border-slate-100 outline-none backdrop:bg-black/50 backdrop:backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100" dir="rtl">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="חפש כתבות, כותרות או נושאים..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-base font-semibold text-slate-800 placeholder-slate-400 bg-transparent outline-none border-none ring-0 focus:ring-0 focus:outline-none"
              autoFocus
            />
          </div>
          <button
            onClick={closeSearch}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-4" dir="rtl">
          {filteredArticles.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
                {searchQuery ? `תוצאות חיפוש (${filteredArticles.length})` : "כתבות מומלצות"}
              </h3>
              <div className="divide-y divide-slate-100">
                {filteredArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.id}`}
                    onClick={closeSearch}
                    className="flex gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all duration-150 group"
                  >
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-16 h-16 object-cover rounded-lg shadow-sm border border-slate-100"
                      />
                    )}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-black px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: article.categoryColor }}
                        >
                          {article.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{article.time}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-[#b21c1c] transition-colors line-clamp-1">
                        {article.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {article.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Search className="w-12 h-12 stroke-[1.5] mb-3 text-slate-300" />
              <p className="text-base font-bold text-slate-600">לא נמצאו כתבות</p>
              <p className="text-xs text-slate-400 mt-1">נסה לחפש מילות מפתח אחרות</p>
            </div>
          )}
        </div>
      </dialog>
    </header>
  );
}
