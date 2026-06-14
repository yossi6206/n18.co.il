"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  Save,
  Plus,
  Trash2,
  ArrowRight,
  Eye,
  LogOut,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
  GripVertical,
} from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { Article } from "@/data/articles";

// Only this account may access the editor. Mirrors the Firestore security rule
// (allow write: request.auth.token.email == "yossi6206@gmail.com").
const ADMIN_EMAIL = "yossi6206@gmail.com";

type AccessState = "checking" | "anonymous" | "forbidden" | "authorized";

// Form-shape mirror of Article with everything as editable strings/arrays.
interface ArticleForm {
  title: string;
  description: string;
  lead: string;
  image: string;
  authorImage: string;
  time: string;
  author: string;
  category: string;
  categoryColor: string;
  badgeText: string;
  paragraphs: string[];
  commentsCount: string;
  likes: string;
  dislikes: string;
}

const CATEGORY_PRESETS = [
  { name: "בטחוני", color: "#EE8F00" },
  { name: "פוליטי", color: "#D20000" },
  { name: "כלכלה", color: "#FFE604" },
  { name: "ספורט", color: "#6422F1" },
  { name: "צרכנות", color: "#DA168B" },
  { name: "טכנולוגיה", color: "#00B0FF" },
];

function articleToForm(article: Article | null): ArticleForm {
  return {
    title: article?.title ?? "",
    description: article?.description ?? "",
    lead: article?.lead ?? "",
    image: article?.image ?? "",
    authorImage: article?.authorImage ?? "",
    time: article?.time ?? "",
    author: article?.author ?? "",
    category: article?.category ?? "",
    categoryColor: article?.categoryColor ?? "#b21c1c",
    badgeText: article?.badgeText ?? "",
    paragraphs: article?.paragraphs?.length ? [...article.paragraphs] : [""],
    commentsCount: article?.commentsCount != null ? String(article.commentsCount) : "",
    likes: article?.likes != null ? String(article.likes) : "",
    dislikes: article?.dislikes != null ? String(article.dislikes) : "",
  };
}

interface EditorClientProps {
  articleId: number;
  initialArticle: Article | null;
}

export function EditorClient({ articleId, initialArticle }: EditorClientProps) {
  const [access, setAccess] = useState<AccessState>("checking");
  const [userEmail, setUserEmail] = useState<string>("");

  const [form, setForm] = useState<ArticleForm>(() => articleToForm(initialArticle));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const updateField = <K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess(null);
    setError(null);
  };

  const updateParagraph = (index: number, value: string) => {
    setForm((prev) => {
      const paragraphs = [...prev.paragraphs];
      paragraphs[index] = value;
      return { ...prev, paragraphs };
    });
    setSuccess(null);
  };

  const addParagraph = () => {
    setForm((prev) => ({ ...prev, paragraphs: [...prev.paragraphs, ""] }));
  };

  const removeParagraph = (index: number) => {
    setForm((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, i) => i !== index),
    }));
  };

  const moveParagraph = (index: number, direction: -1 | 1) => {
    setForm((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.paragraphs.length) return prev;
      const paragraphs = [...prev.paragraphs];
      [paragraphs[index], paragraphs[target]] = [paragraphs[target], paragraphs[index]];
      return { ...prev, paragraphs };
    });
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    if (!form.title.trim()) {
      setError("יש להזין כותרת לכתבה");
      return;
    }

    const cleanParagraphs = form.paragraphs.map((p) => p.trim()).filter((p) => p.length > 0);
    if (cleanParagraphs.length === 0) {
      setError("יש להזין לפחות פסקה אחת לגוף הכתבה");
      return;
    }

    // Build the Article payload. Optional numeric/text fields are omitted when empty.
    const payload: Article = {
      id: articleId,
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      time: form.time.trim(),
      author: form.author.trim(),
      category: form.category.trim(),
      categoryColor: form.categoryColor.trim() || "#b21c1c",
      paragraphs: cleanParagraphs,
    };
    if (form.lead.trim()) payload.lead = form.lead.trim();
    if (form.authorImage.trim()) payload.authorImage = form.authorImage.trim();
    if (form.badgeText.trim()) payload.badgeText = form.badgeText.trim();
    if (form.commentsCount.trim() !== "") payload.commentsCount = Number(form.commentsCount);
    if (form.likes.trim() !== "") payload.likes = Number(form.likes);
    if (form.dislikes.trim() !== "") payload.dislikes = Number(form.dislikes);

    setIsSaving(true);
    try {
      await setDoc(doc(db, "articles", String(articleId)), payload, { merge: true });
      setSuccess("הכתבה נשמרה בהצלחה ופורסמה באתר.");
    } catch (err) {
      console.error("Failed to save article:", err);
      setError("שמירת הכתבה נכשלה. ודא שאתה מחובר כמנהל ונסה שוב.");
    } finally {
      setIsSaving(false);
    }
  };

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
          עליך להתחבר עם חשבון המנהל כדי לערוך את הכתבה.
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
          החשבון <span className="font-bold text-slate-700">{userEmail}</span> אינו מורשה לערוך
          כתבות. אזור זה מיועד למנהל המערכת בלבד.
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

  // ---- Authorized editor ---------------------------------------------------

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
              <p className="text-sm font-bold leading-tight truncate">עריכת כתבה ראשית</p>
              <p className="text-[11px] text-white/50 leading-tight">מזהה כתבה #{articleId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/article/${articleId}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              title="צפה בכתבה באתר"
            >
              <Eye className="w-4 h-4" />
              תצוגה
            </Link>
            <button
              onClick={() => signOut(auth)}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
              title="התנתק"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">התנתק</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-32">
        {/* Logged-in admin banner */}
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mb-6">
          <CheckCircle2 className="w-4 h-4" />
          מחובר כמנהל: {userEmail}
        </div>

        {/* Main details card */}
        <Section title="פרטי הכתבה">
          <Field label="כותרת" required>
            <textarea
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              rows={2}
              className={inputClass}
              placeholder="כותרת הכתבה הראשית"
            />
          </Field>

          <Field label="תקציר (description) – מוצג בכרטיסיות ובמנועי חיפוש">
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              className={inputClass}
              placeholder="תקציר קצר של הכתבה"
            />
          </Field>

          <Field label="פתיח (lead) – הפסקה המודגשת בראש הכתבה">
            <textarea
              value={form.lead}
              onChange={(e) => updateField("lead", e.target.value)}
              rows={4}
              className={inputClass}
              placeholder="פתיח הכתבה. אם ריק, יוצג התקציר במקום."
            />
          </Field>
        </Section>

        {/* Media card */}
        <Section title="תמונות">
          <Field label="תמונה ראשית (נתיב או כתובת URL)">
            <div className="flex items-center gap-3">
              <input
                value={form.image}
                onChange={(e) => updateField("image", e.target.value)}
                className={inputClass}
                dir="ltr"
                placeholder="/ai_price_war.webp"
              />
              <ImagePreview src={form.image} />
            </div>
          </Field>

          <Field label="תמונת כותב/מקור (authorImage)">
            <div className="flex items-center gap-3">
              <input
                value={form.authorImage}
                onChange={(e) => updateField("authorImage", e.target.value)}
                className={inputClass}
                dir="ltr"
                placeholder="/iran_us_conflict.png"
              />
              <ImagePreview src={form.authorImage} />
            </div>
          </Field>
        </Section>

        {/* Meta card */}
        <Section title="מאפיינים">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
            <Field label="כותב">
              <input
                value={form.author}
                onChange={(e) => updateField("author", e.target.value)}
                className={inputClass}
                placeholder="מערכת N18"
              />
            </Field>

            <Field label="זמן פרסום (טקסט חופשי)">
              <input
                value={form.time}
                onChange={(e) => updateField("time", e.target.value)}
                className={inputClass}
                placeholder="לפני דקה"
              />
            </Field>

            <Field label="קטגוריה">
              <input
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                className={inputClass}
                placeholder="בטחוני"
                list="category-presets"
              />
              <datalist id="category-presets">
                {CATEGORY_PRESETS.map((c) => (
                  <option key={c.name} value={c.name} />
                ))}
              </datalist>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {CATEGORY_PRESETS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => {
                      updateField("category", c.name);
                      updateField("categoryColor", c.color);
                    }}
                    className="text-[11px] font-bold px-2 py-1 rounded-md text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: c.color }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="צבע קטגוריה">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(form.categoryColor) ? form.categoryColor : "#b21c1c"}
                  onChange={(e) => updateField("categoryColor", e.target.value)}
                  className="w-12 h-11 rounded-lg border border-slate-200 cursor-pointer bg-white p-1"
                />
                <input
                  value={form.categoryColor}
                  onChange={(e) => updateField("categoryColor", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                  placeholder="#EE8F00"
                />
              </div>
            </Field>

            <Field label='תווית מבזק (badgeText, למשל "מבזק")'>
              <input
                value={form.badgeText}
                onChange={(e) => updateField("badgeText", e.target.value)}
                className={inputClass}
                placeholder="מבזק"
              />
            </Field>

            <Field label="מספר תגובות">
              <input
                type="number"
                value={form.commentsCount}
                onChange={(e) => updateField("commentsCount", e.target.value)}
                className={inputClass}
                dir="ltr"
                placeholder="24"
              />
            </Field>

            <Field label="לייקים">
              <input
                type="number"
                value={form.likes}
                onChange={(e) => updateField("likes", e.target.value)}
                className={inputClass}
                dir="ltr"
                placeholder="14"
              />
            </Field>

            <Field label="דיסלייקים">
              <input
                type="number"
                value={form.dislikes}
                onChange={(e) => updateField("dislikes", e.target.value)}
                className={inputClass}
                dir="ltr"
                placeholder="2"
              />
            </Field>
          </div>
        </Section>

        {/* Body paragraphs */}
        <Section
          title="גוף הכתבה"
          action={
            <button
              type="button"
              onClick={addParagraph}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#b21c1c] hover:text-[#b21c1c]/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              הוסף פסקה
            </button>
          }
        >
          <div className="space-y-4">
            {form.paragraphs.map((para, index) => (
              <div key={index} className="group relative">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-400">פסקה {index + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveParagraph(index, -1)}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="הזז למעלה"
                    >
                      <GripVertical className="w-4 h-4 rotate-90" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeParagraph(index)}
                      disabled={form.paragraphs.length === 1}
                      className="p-1 text-slate-400 hover:text-[#b21c1c] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="מחק פסקה"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <textarea
                  value={para}
                  onChange={(e) => updateParagraph(index, e.target.value)}
                  rows={4}
                  className={inputClass}
                  placeholder={`תוכן פסקה ${index + 1}...`}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* Feedback messages */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold mb-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold mb-4">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            {success}
          </div>
        )}
      </main>

      {/* Sticky save bar */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה לאתר
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-[#b21c1c] text-white font-bold py-2.5 px-7 rounded-xl hover:bg-[#b21c1c]/90 active:scale-[0.98] transition-all shadow-md shadow-red-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                שומר...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                שמור ופרסם
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Small presentational helpers ------------------------------------------

const inputClass =
  "w-full px-3.5 py-2.5 bg-white rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#b21c1c] focus:ring-2 focus:ring-[#b21c1c]/15 transition-all text-[15px] leading-relaxed resize-y";

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-slate-100 flex flex-col items-center justify-center text-center gap-4 p-6"
      dir="rtl"
    >
      {children}
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <span className="w-2 h-5 bg-[#b21c1c] rounded-sm" />
          {title}
        </h2>
        {action}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[13px] font-bold text-slate-600 mb-1.5">
        {label}
        {required && <span className="text-[#b21c1c] mr-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function ImagePreview({ src }: { src: string }) {
  if (!src.trim()) {
    return (
      <div className="w-12 h-12 shrink-0 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-300">
        <ImageIcon className="w-5 h-5" />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="תצוגה מקדימה"
      className="w-12 h-12 shrink-0 rounded-lg object-cover border border-slate-200 bg-slate-50"
    />
  );
}
