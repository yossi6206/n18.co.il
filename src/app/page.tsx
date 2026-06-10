"use client";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { articles } from "../data/articles";
import { ArticleCard } from "../components/ArticleCard";
import { FeaturedArticle } from "../components/FeaturedArticle";
import { CategorySection } from "../components/CategorySection";

export default function Home() {
  const featuredArticle = articles.find((art) => art.id === 100);
  
  // Filter articles for various sections
  const gridArticles = articles.filter((art) => art.id !== 100).slice(0, 8);
  const securityArticles = articles.filter((art) => art.category === "בטחוני").slice(0, 4);
  const politicalArticles = articles.filter((art) => art.category === "פוליטי" && art.id !== 100).slice(0, 4);
  const economyArticles = articles.filter((art) => art.category === "כלכלה").slice(0, 4);
  const sportsArticles = articles.filter((art) => art.category === "ספורט").slice(0, 4);
  const techArticles = articles.filter((art) => art.category === "טכנולוגיה").slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-slate-900" dir="rtl">
      {/* Header component */}
      <Header />

      {/* Hero Section */}
      <main className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        {featuredArticle && <FeaturedArticle article={featuredArticle} badgeText="ארדואן מזהיר" />}

        {/* Card Grid Section */}
        <div className="mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
            {gridArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Category Section: בטחוני */}
        <CategorySection
          title="בטחוני"
          bulletColor="#EE8F00"
          moreText="עוד בטחוני"
          articles={securityArticles}
        />

        {/* Category Section: פוליטי */}
        <CategorySection
          title="פוליטי"
          bulletColor="#D20000"
          moreText="עוד פוליטי"
          articles={politicalArticles}
        />

        {/* Category Section: כלכלה */}
        <CategorySection
          title="כלכלה"
          bulletColor="#FFE604"
          moreText="עוד כלכלה"
          articles={economyArticles}
        />

        {/* Category Section: ספורט */}
        <CategorySection
          title="ספורט"
          bulletColor="#6422F1"
          moreText="עוד ספורט"
          articles={sportsArticles}
        />

        {/* Category Section: טכנולוגיה */}
        <CategorySection
          title="טכנולוגיה"
          bulletColor="#00B0FF"
          moreText="עוד טכנולוגיה"
          articles={techArticles}
        />
      </main>
      <Footer />
    </div>
  );
}
