import { Metadata } from "next";
import { getArticleByIdFromDb } from "@/data/articles";
import { EditorClient } from "./EditorClient";

export const metadata: Metadata = {
  title: "עריכת כתבה | מערכת ניהול N18",
  robots: { index: false, follow: false },
};

// Always render fresh data in the editor (no static caching)
export const dynamic = "force-dynamic";

export default async function AdminArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const articleId = parseInt(resolvedParams.id, 10);
  const article = await getArticleByIdFromDb(articleId);

  return (
    <EditorClient
      articleId={articleId}
      initialArticle={article ? JSON.parse(JSON.stringify(article)) : null}
    />
  );
}
