import Link from "next/link";
import { Article } from "../data/articles";
import { ArticleCard } from "./ArticleCard";

interface CategorySectionProps {
  title: string;
  bulletColor: string;
  moreText: string;
  moreHref?: string;
  articles: Article[];
  hideTopBorder?: boolean;
}

export function CategorySection({
  title,
  bulletColor,
  moreText,
  moreHref = "/",
  articles,
  hideTopBorder = false,
}: CategorySectionProps) {
  return (
    <div id={title} className="mt-16 pt-10 scroll-mt-20">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-8">
        {/* Right Side: Title + Flame Icon */}
        <div className="flex items-center gap-2">
          <h2 className="text-[26px] font-black text-slate-900 leading-none">{title}</h2>
          <span
            className="w-3.5 h-5 rounded-b-full rounded-tl-full transform -rotate-12 inline-block shadow-sm"
            style={{ backgroundColor: bulletColor }}
          />
        </div>

        {/* Left Side: More Link */}
        <Link
          href={moreHref}
          className="flex items-center gap-1 text-slate-500 hover:text-[#b21c1c] text-[15px] font-bold transition-colors duration-150"
        >
          <span>{moreText}</span>
          <span className="text-base font-sans select-none">←</span>
        </Link>
      </div>

      {/* Section Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
