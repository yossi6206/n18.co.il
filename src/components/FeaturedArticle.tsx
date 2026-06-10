import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Article } from "../data/articles";

interface FeaturedArticleProps {
  article: Article;
  badgeText?: string;
}

export function FeaturedArticle({ article, badgeText = "הרפורמה הייתה רק תירוץ" }: FeaturedArticleProps) {
  return (
    <Link href={`/article/${article.id}`} className="flex flex-col lg:flex-row-reverse overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl group cursor-pointer transition-shadow hover:shadow-2xl lg:min-h-[450px]">
      {/* Right Side: Image Column */}
      <div className="w-full lg:w-1/2 relative h-[280px] sm:h-[380px] lg:h-auto">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full lg:absolute lg:inset-0 object-cover block group-hover:scale-[1.01] transition-transform duration-500"
        />
        {/* Dark gradient overlay at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Top Right Badge */}
        {badgeText && (
          <div className="absolute top-4 right-4 flex items-center bg-[#b21c1c] text-white text-[12px] sm:text-[14px] font-black shadow-lg rounded-sm overflow-hidden select-none">
            {/* Chevrons (black background) */}
            <div className="bg-[#111111] px-1.5 py-1.5 flex items-center justify-center">
              <div className="flex -space-x-1.5">
                <ChevronLeft className="w-4.5 h-4.5 text-[#ff2e2e] stroke-[3.5]" />
                <ChevronLeft className="w-4.5 h-4.5 text-[#ff2e2e] stroke-[3.5] -mr-1" />
              </div>
            </div>
            {/* Badge Text */}
            <span className="px-3 py-1">{badgeText}</span>
          </div>
        )}
      </div>

      {/* Left Side: Text Column */}
      <div className="w-full lg:w-1/2 bg-[#011124] p-8 lg:p-12 flex flex-col justify-between text-right">
        <div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-white leading-[1.15] tracking-tight group-hover:text-[#53a8ff] transition-colors duration-150">
            {article.title}
          </h1>
          <p className="mt-6 text-[#bdc5d0] text-[16px] sm:text-[18px] leading-[1.6] font-medium max-w-xl">
            {article.description}
          </p>
        </div>

        <div className="mt-8 lg:mt-auto">
          <span className="text-[#53a8ff] font-bold text-sm sm:text-base tracking-wide">
            {article.author}
          </span>
        </div>
      </div>
    </Link>
  );
}
