"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  Pencil,
  Eye,
  LogOut,
  ShieldAlert,
  Loader2,
  Star,
  ImageIcon,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Article } from "@/data/articles";

// Only this account may access the dashboard. Mirrors the editor's gate and the
// Firestore security rule (allow write: request.auth.token.email == ADMIN_EMAIL).
const ADMIN_EMAIL = "yossi6206@gmail.com";

type AccessState = "checking" | "anonymous" | "forbidden" | "authorized";

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-4 text-center px-6"
      dir="rtl"
    >
      {children}
    </div>
  );
}

export function AdminDashboardClient({ featured }: { featured: Article | null }) {
  const [access, setAccess] = useState<AccessState>("checking");
  const [userEmail, setUserEmail] = useState<string>("");
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);
  const [migrating, setMigrating] = useState(false);

  async function fixImagePaths() {
    setMigrating(true);
    setMigrationStatus(null);
    try {
      const snapshot = await getDocs(collection(db, "articles"));
      let updated = 0;
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const updates: Record<string, string> = {};
        if (data.image?.endsWith(".png")) updates.image = data.image.replace(".png", ".webp");
        if (data.authorImage?.endsWith(".png")) updates.authorImage = data.authorImage.replace(".png", ".webp");
        if (Object.keys(updates).length > 0) {
          await updateDoc(doc(db, "articles", docSnap.id), updates);
          updated++;
        }
      }
      setMigrationStatus(`הצלחה! עודכנו ${updated} כתבות.`);
    } catch (e) {
      setMigrationStatus(`שגיאה: ${String(e)}`);
    } finally {
      setMigrating(false);
    }
  }

  // Auth gate: only the admin account is allowed in.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (!user) {
        setAccess("anonymous");
        setUserEmail("");
      } else if ((user.email ?? "").toLowerCase() === ADMIN_EMAIL) {
        setAccess("authorized");
        setUserEmail(user.email ?? "");
      } else {
        setAccess("forbidden");
        setUserEmail(user.email ?? "");
      }
    });
    return () => unsubscribe();
  }, []);

  // ---- Access states -------------------------------------------------------

  if (access === "checking") {
    return (
      <Centered>
        <Loader2 className="w-10 h-10 text-[#b21c1c] animate-spin" />
        <p className="text-slate-500 font-bold">בודק הרשאות גישה...</p>
      </Centered>
    );
  }

  if (access === "anonymous") {
    return (
      <Centered>
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-[#b21c1c]" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">נדרשת התחברות</h1>
        <p className="text-slate-500 font-medium max-w-sm">
          עליך להתחבר עם חשבון המנהל כדי לגשת למערכת הניהול.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-[#b21c1c] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#b21c1c]/90 transition-colors shadow-md shadow-red-500/20"
        >
          מעבר להתחברות
        </Link>
      </Centered>
    );
  }

  if (access === "forbidden") {
    return (
      <Centered>
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8 text-[#b21c1c]" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">אין הרשאת גישה</h1>
        <p className="text-slate-500 font-medium max-w-sm">
          החשבון <span className="font-bold text-slate-700">{userEmail}</span> אינו מורשה לגשת
          למערכת הניהול. אזור זה מיועד למנהל המערכת בלבד.
        </p>
        <button
          onClick={() => signOut(auth)}
          className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          התנתק והתחבר בחשבון אחר
        </button>
      </Centered>
    );
  }

  // ---- Authorized dashboard ------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900" dir="rtl">
      {/* Admin top bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/" dir="ltr" className="flex items-center font-bold text-2xl tracking-tighter leading-none">
              <span className="text-3xl font-extrabold">N</span>
              <span className="text-2xl font-black text-[#ff5a5a]">18</span>
            </Link>
            <span className="h-6 w-px bg-white/20" />
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight truncate">מערכת ניהול</p>
              <p className="text-[11px] text-white/50 leading-tight truncate">{userEmail}</p>
            </div>
          </div>

          <button
            onClick={() => signOut(auth)}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
            title="התנתק"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">התנתק</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-32">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">ניהול תוכן האתר</h1>
        <p className="text-slate-500 font-medium mb-8">
          בחר כתבה לעריכה. בהמשך יתווספו כאן כל הכתבות לפי קטגוריות.
        </p>

        {/* Featured / main article */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-wide">הכתבה הראשית</h2>
          </div>

          {featured ? (
            <article className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col sm:flex-row">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full sm:w-56 h-44 sm:h-auto object-cover bg-slate-100 shrink-0"
              />
              <div className="p-5 flex flex-col gap-3 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[11px] font-black text-white px-2 py-0.5 rounded"
                    style={{ backgroundColor: featured.categoryColor }}
                  >
                    {featured.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold">מזהה #{featured.id}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-snug line-clamp-3">
                  {featured.title}
                </h3>
                <div className="mt-auto flex items-center gap-2 pt-2">
                  <Link
                    href={`/admin/article/${featured.id}`}
                    className="inline-flex items-center gap-1.5 bg-[#b21c1c] text-white text-sm font-bold py-2.5 px-4 rounded-xl hover:bg-[#b21c1c]/90 transition-colors shadow-md shadow-red-500/20"
                  >
                    <Pencil className="w-4 h-4" />
                    עריכה
                  </Link>
                  <Link
                    href={`/article/${featured.id}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-sm font-bold py-2.5 px-4 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    צפייה באתר
                  </Link>
                </div>
              </div>
            </article>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-500 font-medium">
              לא נמצאה כתבה ראשית.
            </div>
          )}
        </section>

        {/* One-time image migration tool */}
        <section className="mt-10">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <h2 className="text-sm font-black text-slate-700">תיקון נתיבי תמונות (PNG → WebP)</h2>
              </div>
              <p className="text-xs text-slate-500">
                מעדכן את כל שדות image ו-authorImage ב-Firestore מ-.png ל-.webp
              </p>
              {migrationStatus && (
                <p className={`mt-2 text-xs font-bold ${migrationStatus.startsWith("שגיאה") ? "text-red-600" : "text-green-600"}`}>
                  {migrationStatus}
                </p>
              )}
            </div>
            <button
              onClick={fixImagePaths}
              disabled={migrating}
              className="inline-flex items-center gap-2 bg-slate-800 text-white text-sm font-bold py-2.5 px-4 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {migrating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              {migrating ? "מעדכן..." : "הרץ תיקון"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
