import Link from "next/link";
import { Article } from "../data/articles";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/article/${article.id}`}
      className="flex flex-col group cursor-pointer text-right w-full"
    >
      {/* Card Image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />
        {/* Category Tag */}
        <div
          className="absolute bottom-0 right-0 h-9 pr-4 pl-7 flex items-center justify-center rounded-l-full font-sans font-bold text-[14px] shadow-sm select-none z-10"
          style={{
            backgroundColor: article.categoryColor,
            color: article.categoryColor === "#FFE604" ? "#0f172a" : "#ffffff",
          }}
        >
          {article.category}
        </div>
      </div>

      {/* Card Content */}
      <div className="pt-2.5 pb-4 flex flex-col justify-start">
        <div>
          <h3 className="text-[18px] font-black text-slate-950 leading-[1.25] group-hover:text-[#b21c1c] transition-colors duration-150">
            {article.title}
          </h3>
          <p className="mt-1.5 text-slate-600 text-[14px] leading-[1.4] line-clamp-2">
            {article.description}
          </p>
        </div>

        <div className="mt-3 text-[11px] text-slate-400 font-extrabold flex items-center gap-1">
          <span>{article.time}</span>
          <span className="mx-0.5">|</span>
          <span>{article.author}</span>
        </div>
      </div>
    </Link>
  );
}
