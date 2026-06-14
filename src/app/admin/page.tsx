import { Metadata } from "next";
import { getArticlesFromDb } from "@/data/articles";
import { AdminDashboardClient } from "./AdminDashboardClient";

export const metadata: Metadata = {
  title: "מערכת ניהול | N18",
  robots: { index: false, follow: false },
};

// The dashboard must always reflect the latest articles, never a cached build.
export const dynamic = "force-dynamic";

// The featured ("main") article on the homepage is the one with this id.
const FEATURED_ARTICLE_ID = 100;

export default async function AdminDashboardPage() {
  const articles = await getArticlesFromDb();
  const featured = articles.find((art) => art.id === FEATURED_ARTICLE_ID) ?? null;

  return (
    <AdminDashboardClient
      featured={featured ? JSON.parse(JSON.stringify(featured)) : null}
    />
  );
}
