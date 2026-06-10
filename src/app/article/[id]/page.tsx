import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getArticleByIdFromDb, getArticlesFromDb } from "@/data/articles";
import { ArticleClient } from "./ArticleClient";

// Dynamic breadcrumb helper
const getBreadcrumbs = (category: string) => {
  switch (category) {
    case "צרכנות":
      return ["ראשי", "כלכלה", "צרכנות"];
    case "כלכלה":
      return ["ראשי", "כלכלה"];
    case "פוליטי":
      return ["ראשי", "חדשות", "פוליטי"];
    case "בטחוני":
      return ["ראשי", "חדשות", "צבא וביטחון"];
    case "ספורט":
      return ["ראשי", "ספורט"];
    default:
      return ["ראשי", "חדשות", category];
  }
};

// Next.js dynamic metadata generation
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const articleId = parseInt(resolvedParams.id, 10);
  const article = await getArticleByIdFromDb(articleId);

  if (!article) {
    return {
      title: "הכתבה לא נמצאה | N18",
      description: "מצטערים, אך נראה כי הכתבה שחיפשת אינה קיימת או שהוסרה.",
    };
  }

  const titleKeywords = article.title.split(/\s+/).filter(word => word.length > 2).slice(0, 5);
  const keywords = [
    article.category,
    article.author,
    "חדשות",
    "n18",
    "חדשות n18",
    "n18 חדשות",
    "כתבה",
    ...titleKeywords
  ];

  return {
    title: `${article.title} | N18`,
    description: article.description || article.lead || "כתבה באתר החדשות N18",
    keywords: keywords,
    openGraph: {
      title: article.title,
      description: article.description || article.lead,
      url: `/article/${article.id}`,
      type: "article",
      images: [
        {
          url: article.image,
          alt: article.title,
        }
      ],
      siteName: "N18",
      locale: "he_IL",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description || article.lead,
      images: [article.image],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const articleId = parseInt(resolvedParams.id, 10);
  const article = await getArticleByIdFromDb(articleId);

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col" dir="rtl">
        <Header />
        <main className="flex-1 max-w-md mx-auto flex flex-col justify-center items-center p-8 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full">
            <span className="text-6xl mb-4 block">🔍</span>
            <h1 className="text-2xl font-black text-slate-900 mb-2">המאמר לא נמצא</h1>
            <p className="text-slate-500 mb-6">מצטערים, אך נראה כי הכתבה שחיפשת אינה קיימת או שהוסרה.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#b21c1c] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#b21c1c]/90 transition-colors shadow-md shadow-red-500/20"
            >
              <ArrowRight className="w-5 h-5" />
              <span>חזרה לדף הבית</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const breadcrumbs = getBreadcrumbs(article.category);
  const allArticles = await getArticlesFromDb();
  const recommendedArticles = allArticles
    .filter((art) => art.id !== article.id)
    .slice(0, 4);

  return (
    <ArticleClient
      article={article}
      recommendedArticles={recommendedArticles}
      breadcrumbs={breadcrumbs}
    />
  );
}
