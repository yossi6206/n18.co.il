"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Chrome,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  User,
  ShieldCheck
} from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

type FormMode = "login" | "register" | "forgot";

function getHebrewError(code: string): string {
  switch (code) {
    case "auth/user-not-found":
    case "auth/invalid-credential":
      return "כתובת האימייל או הסיסמה שגויים";
    case "auth/wrong-password":
      return "הסיסמה שגויה";
    case "auth/email-already-in-use":
      return "כתובת האימייל כבר רשומה במערכת";
    case "auth/weak-password":
      return "הסיסמה חלשה מדי – יש להשתמש לפחות ב-6 תווים";
    case "auth/invalid-email":
      return "כתובת האימייל אינה תקינה";
    case "auth/too-many-requests":
      return "יותר מדי ניסיונות התחברות. אנא המתן מעט ונסה שוב";
    case "auth/network-request-failed":
      return "בעיית חיבור לרשת. בדוק את החיבור לאינטרנט";
    case "auth/popup-closed-by-user":
      return "החלון נסגר לפני השלמת ההתחברות";
    case "auth/operation-not-allowed":
      return "הרשמה באימייל וסיסמה אינה מופעלת. יש להפעיל אותה ב-Firebase Console";
    case "auth/admin-restricted-operation":
      return "ההרשמה מוגבלת. בדוק את הגדרות ההרשמה ב-Firebase Console";
    case "auth/api-key-not-valid.-please-pass-a-valid-api-key.":
    case "auth/invalid-api-key":
      return "מפתח ה-API של Firebase אינו תקין. בדוק את הגדרות הסביבה";
    default:
      return "אירעה שגיאה. אנא נסה שנית";
  }
}

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<FormMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // If the user is already authenticated, skip the login form and go to admin.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/admin");
    });
    return () => unsubscribe();
  }, [router]);

  const validateForm = (): boolean => {
    setError(null);

    if (mode === "register" && !name.trim()) {
      setError("אנא הזן שם מלא");
      return false;
    }

    if (!email.trim()) {
      setError("אנא הזן כתובת אימייל");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("אנא הזן כתובת אימייל תקינה");
      return false;
    }

    if (mode !== "forgot") {
      if (!password) {
        setError("אנא הזן סיסמה");
        return false;
      }
      if (password.length < 6) {
        setError("הסיסמה חייבת להכיל לפחות 6 תווים");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/admin");
      } else if (mode === "register") {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) {
          await updateProfile(credential.user, { displayName: name.trim() });
        }
        setSuccess("ההרשמה בוצעה בהצלחה! מעביר אותך למערכת...");
        setTimeout(() => router.push("/admin"), 1500);
      } else if (mode === "forgot") {
        await sendPasswordResetEmail(auth, email);
        setSuccess("נשלח קישור לאיפוס הסיסמה לכתובת האימייל שהזנת.");
      }
    } catch (err: any) {
      console.error("Auth error:", err?.code, err?.message, err);
      setError(getHebrewError(err?.code || "") + (err?.code ? ` (${err.code})` : ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/admin");
    } catch (err: any) {
      console.error("Google Auth error:", err?.code, err?.message, err);
      setError(getHebrewError(err?.code || "") + (err?.code ? ` (${err.code})` : ""));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-950 font-sans text-slate-100 selection:bg-red-500 selection:text-white">
      {/* Dynamic Background Graphics */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none animate-pulse duration-10000" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none animate-pulse duration-7000" />
      <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] rounded-full bg-emerald-600/5 blur-[100px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{ maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)" }}
      />

      <div className="w-full max-w-md p-6 relative z-10">
        {/* Branding Area */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group transition-all duration-300">
            <span className="text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-blue-600 drop-shadow-[0_2px_10px_rgba(239,68,68,0.2)]">
              N18
            </span>
            <span className="h-6 w-[2px] bg-slate-800 group-hover:bg-slate-700 transition-colors" />
            <span className="text-sm font-medium tracking-wide text-slate-400 group-hover:text-slate-300 transition-colors">
              מערכת ניהול
            </span>
          </Link>
          <p className="text-xs text-slate-500 mt-2">
            {mode === "login" && "התחברות מאובטחת לפורטל החדשות והתוכן"}
            {mode === "register" && "יצירת חשבון חדש במערכת"}
            {mode === "forgot" && "שחזור גישה לחשבון המשתמש"}
          </p>
        </div>

        {/* Main Form Card */}
        <div className="relative group/card rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-8 shadow-2xl transition-all duration-500 hover:border-slate-700/60 hover:shadow-red-950/5">
          {/* Subtle top light effect */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              {mode === "login" && "כניסה למערכת"}
              {mode === "register" && "הרשמה למערכת"}
              {mode === "forgot" && "איפוס סיסמה"}
            </h1>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-950/50 border border-red-800/40 text-red-200 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/40 text-emerald-200 text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name (Registration only) */}
              {mode === "register" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 block mr-1">
                    שם מלא
                  </label>
                  <div className="relative">
                    <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 transition-colors peer-focus:text-red-500" />
                    <input
                      type="text"
                      placeholder="ישראל ישראלי"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-4 pr-11 py-3 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/30 transition-all text-sm"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block mr-1">
                  כתובת אימייל
                </label>
                <div className="relative">
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-4 pr-11 py-3 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/30 transition-all text-sm text-left"
                    dir="ltr"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input (Login & Register) */}
              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-semibold text-slate-400">
                      סיסמה
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => { setMode("forgot"); setError(null); setSuccess(null); }}
                        className="text-xs text-slate-500 hover:text-red-400 transition-colors focus:outline-none"
                      >
                        שכחת סיסמה?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-11 py-3 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/30 transition-all text-sm text-left"
                      dir="ltr"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                      title={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Remember Me (Login only) */}
            {mode === "login" && (
              <div className="flex items-center px-1">
                <label className="relative flex items-center cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only peer"
                    disabled={isLoading}
                  />
                  <div className="w-4.5 h-4.5 bg-slate-950 border border-slate-800 rounded-md peer-checked:bg-red-500 peer-checked:border-red-500 flex items-center justify-center transition-all peer-focus:ring-2 peer-focus:ring-red-500/30">
                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:group-hover:opacity-100 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="mr-2.5 text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                    זכור אותי במכשיר זה
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group/btn overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white py-3 px-4 text-sm font-semibold shadow-lg hover:shadow-red-500/20 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <div className="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none" />
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>מעבד...</span>
                </div>
              ) : (
                <span>
                  {mode === "login" && "התחברות"}
                  {mode === "register" && "הרשמה למערכת"}
                  {mode === "forgot" && "שלח קישור לאיפוס"}
                </span>
              )}
            </button>

            {/* Social Authentication / Divider (Login & Register only) */}
            {mode !== "forgot" && (
              <>
                <div className="relative my-6 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800/80"></div>
                  </div>
                  <span className="relative px-3 bg-[#0d1527] text-[10px] uppercase font-bold tracking-wider text-slate-500">
                    או באמצעות
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-slate-300 hover:text-slate-200 transition-all active:scale-[0.99] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    <Chrome className="w-4 h-4 text-red-500" />
                    <span>כניסה עם Google</span>
                  </button>
                </div>
              </>
            )}

            {/* Footer Navigation */}
            <div className="pt-2 text-center text-xs">
              {mode === "login" && (
                <p className="text-slate-400">
                  אין לך חשבון?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("register"); setError(null); setSuccess(null); }}
                    className="text-red-400 hover:text-red-300 font-semibold focus:outline-none transition-colors"
                  >
                    הרשם עכשיו
                  </button>
                </p>
              )}
              {mode === "register" && (
                <p className="text-slate-400">
                  כבר יש לך חשבון?{" "}
                  <button
                    type="button"
                    onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
                    className="text-red-400 hover:text-red-300 font-semibold focus:outline-none transition-colors"
                  >
                    התחבר כאן
                  </button>
                </p>
              )}
              {mode === "forgot" && (
                <button
                  type="button"
                  onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
                  className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-200 font-medium transition-colors focus:outline-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>חזרה לדף ההתחברות</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Security / Compliance Note */}
        <div className="flex items-center justify-center gap-1.5 mt-6 text-[10px] text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>חיבור מוצפן ומאובטח SSL 256-bit</span>
        </div>
      </div>
    </div>
  );
}
