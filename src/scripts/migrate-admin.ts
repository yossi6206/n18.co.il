import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { articles } from "../data/articles";
import serviceAccount from "../../serviceAccount.json";

initializeApp({
  credential: cert(serviceAccount as any),
});

const db = getFirestore();

async function runMigration() {
  console.log(`Starting migration of ${articles.length} articles...`);

  for (const article of articles) {
    try {
      const docRef = db.collection("articles").doc(String(article.id));
      await docRef.set({
        ...article,
        likes: article.id % 2 === 0 ? 12 : 14,
        dislikes: article.id % 2 === 0 ? 3 : 2,
      });
      console.log(`✅ Migrated article ID: ${article.id} - ${article.title.slice(0, 40)}`);
    } catch (error) {
      console.error(`❌ Error migrating article ID ${article.id}:`, error);
    }
  }

  console.log("✅ Migration complete!");
  process.exit(0);
}

runMigration();
