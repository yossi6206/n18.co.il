"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThumbsUp, ThumbsDown, Share2, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Article } from "@/data/articles";

interface ArticleClientProps {
  article: Article;
  recommendedArticles: Article[];
  breadcrumbs: string[];
}

export function ArticleClient({ article, recommendedArticles, breadcrumbs }: ArticleClientProps) {
  // Reaction State
  const [likes, setLikes] = useState(14);
  const [dislikes, setDislikes] = useState(2);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Handle Likes/Dislikes
  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      if (hasDisliked) {
        setDislikes((prev) => prev - 1);
        setHasDisliked(false);
      }
    }
  };

  const handleDislike = () => {
    if (hasDisliked) {
      setDislikes((prev) => prev - 1);
      setHasDisliked(false);
    } else {
      setDislikes((prev) => prev + 1);
      setHasDisliked(true);
      if (hasLiked) {
        setLikes((prev) => prev - 1);
        setHasLiked(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900" dir="rtl">
      {/* N18 Header */}
      <Header />

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-[13px] sm:text-[14px] text-slate-500 font-bold mb-5 select-none">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb}>
              {idx > 0 && <span className="text-slate-300 font-normal mx-0.5">//</span>}
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-slate-700">{crumb}</span>
              ) : (
                <Link href="/" className="hover:text-[#b21c1c] transition-colors">
                  {crumb}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
          
          {/* Right Column: Article Details */}
          <div className="w-full lg:w-2/3 flex flex-col text-right">
            
            {/* Article Image Container */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-lg border border-slate-100">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              {/* Photo credit positioned vertically on the left edge inside the image */}
              <div className="absolute left-3 bottom-5 [writing-mode:vertical-lr] text-white/90 text-[10px] sm:text-[11px] font-bold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-none">
                צילום: שאטרסטוק
              </div>
            </div>

            {/* Article Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-slate-950 leading-[1.15] tracking-tight mt-6 sm:mt-8 mb-4">
              {article.title}
            </h1>

            {/* Author and Metadata Bar */}
            <div className="flex flex-row-reverse items-center justify-between border-t border-slate-100 pt-4 pb-4 mb-2">
              
              {/* Right: Author Profile */}
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                  <img
                    src={article.authorImage || "/politicians_chat.png"}
                    alt={article.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-right">
                  <span className="block text-[15px] font-extrabold text-slate-950 leading-tight">
                    {article.author}
                  </span>
                  <span className="block text-[12px] font-bold text-slate-400 mt-0.5">
                    {article.time}
                  </span>
                </div>
              </div>

              {/* Left: Interactions */}
              <div className="flex items-center gap-4">
                
                {/* Reactions (Likes/Dislikes) */}
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full select-none">
                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 transition-colors ${
                      hasLiked ? "text-green-600 font-extrabold" : "text-slate-500 hover:text-green-600"
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${hasLiked ? "fill-green-600" : ""}`} />
                    <span className="text-xs">{likes}</span>
                  </button>

                  <div className="h-4 w-[1px] bg-slate-200" />

                  {/* Dislike Button */}
                  <button
                    onClick={handleDislike}
                    className={`flex items-center gap-1.5 transition-colors ${
                      hasDisliked ? "text-red-600 font-extrabold" : "text-slate-500 hover:text-red-600"
                    }`}
                  >
                    <ThumbsDown className={`w-4 h-4 ${hasDisliked ? "fill-red-600" : ""}`} />
                    <span className="text-xs">{dislikes}</span>
                  </button>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopiedShare(true);
                    setTimeout(() => setCopiedShare(false), 2000);
                  }}
                  className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500 rounded-full transition-colors relative"
                  title="העתק קישור"
                >
                  <Share2 className="w-4 h-4" />
                  {copiedShare && (
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap animate-fade-in font-bold">
                      הקישור הועתק!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Subtitle / Lead Section */}
            <div className="border-t border-b border-slate-200 py-6 mb-6">
              <p className="text-[17px] sm:text-[19px] font-bold text-slate-800 leading-[1.65] text-right">
                {article.lead || article.description}
              </p>
            </div>

            {/* Article Content Paragraphs */}
            <div className="text-slate-800 text-[18px] sm:text-[19px] leading-[1.8] space-y-6 text-right font-medium">
              {article.paragraphs.map((para, index) => (
                <p key={index} className="indent-0">
                  {para}
                </p>
              ))}
            </div>

          </div>

          {/* Left Column: Recommended Articles Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col text-right">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 sticky top-20">
              <h2 className="text-xl font-black text-slate-950 mb-5 border-b border-slate-200 pb-3 flex items-center gap-2">
                <span className="w-2.5 h-4 bg-[#b21c1c] rounded-sm transform -rotate-6" />
                <span>כתבות נוספות שאולי יעניינו אותך</span>
              </h2>

              <div className="space-y-4">
                {recommendedArticles.map((recommendation) => (
                  <Link
                    href={`/article/${recommendation.id}`}
                    key={recommendation.id}
                    className="flex gap-3 items-center group cursor-pointer border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                  >
                    {/* Recommendation Image */}
                    <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <img
                        src={recommendation.image}
                        alt={recommendation.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {/* Recommendation Title */}
                    <div className="flex flex-col justify-between">
                      <h3 className="text-[14px] font-extrabold text-slate-900 leading-tight group-hover:text-[#b21c1c] transition-colors line-clamp-2">
                        {recommendation.title}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-bold mt-1">
                        {recommendation.time} • {recommendation.author}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
