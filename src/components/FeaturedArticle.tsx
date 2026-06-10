import Link from "next/link";
import { Clock, MessageSquare } from "lucide-react";
import { Article } from "../data/articles";

interface FeaturedArticleProps {
  article: Article;
  badgeText?: string;
}

export function FeaturedArticle({ article, badgeText = "הרפורמה הייתה רק תירוץ" }: FeaturedArticleProps) {
  // Check if article indicates it has a video
  const hasVideo = article.title.includes("צפו") || article.title.includes("וידאו") || article.id === 100;

  return (
    <Link href={`/article/${article.id}`} className="flex flex-col lg:grid lg:grid-cols-[9fr_11fr] w-full gap-6 lg:gap-10 group cursor-pointer transition-all duration-300">
      {/* Left Side: Image Column (on desktop) */}
      <div className="w-full lg:w-full lg:order-2 relative aspect-[16/9.5] sm:aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100 shadow-md">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover object-top block group-hover:scale-[1.015] transition-transform duration-500"
          fetchPriority="high"
        />
        
        {/* Play Icon Overlay */}
        {hasVideo && (
          <div className="absolute top-4 left-4 z-10 flex items-center justify-center w-11 h-11 rounded-full border border-white bg-black/20 backdrop-blur-xs text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
            <svg className="w-4.5 h-4.5 fill-current translate-x-[-1px]" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Right Side: Text Column (on desktop) */}
      <div className="w-full lg:w-full lg:order-1 flex flex-col justify-between text-right py-1 lg:h-full">
        <div className="flex flex-col items-start gap-4 lg:gap-5">
          {/* Top Right Badge */}
          {badgeText && (
            <div className="bg-[#b21c1c] text-white text-xs sm:text-[13px] lg:text-[14px] font-black px-3 py-1 lg:px-3.5 lg:py-1.5 rounded shadow-xs tracking-wide select-none">
              {badgeText}
            </div>
          )}

          {/* Headline */}
          <h1 className="text-2.5xl sm:text-3xl lg:text-[42px] font-black text-slate-950 leading-[1.2] lg:leading-[1.15] tracking-tight group-hover:text-[#b21c1c] transition-colors duration-150 mt-1">
            {article.title}
          </h1>

          {/* Description */}
          <p className="text-slate-700 text-sm sm:text-base lg:text-[18px] leading-[1.55] lg:leading-[1.6] font-medium mt-1">
            {article.description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 lg:mt-auto flex items-center gap-1.5 text-xs sm:text-[13px] text-slate-500 font-extrabold pt-4">
          <span className="hover:text-slate-700 transition-colors">{article.author}</span>
          <span className="text-slate-300 select-none">|</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="font-sans font-medium">{article.time}</span>
          </span>
          {article.commentsCount !== undefined && (
            <>
              <span className="text-slate-300 select-none">|</span>
              <span className="flex items-center gap-1 font-sans font-medium">
                <span>{article.commentsCount}</span>
                <MessageSquare className="w-4 h-4 text-slate-400 fill-slate-50/5" />
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
