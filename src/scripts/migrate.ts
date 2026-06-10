import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { articles } from "../data/articles";

const firebaseConfig = {
  apiKey: "AIzaSyBl-J6v0-5eZ-wPj1i3f49fL38Y4h7z2k0",
  authDomain: "n18-news-fb240.firebaseapp.com",
  projectId: "n18-news-fb240",
  storageBucket: "n18-news-fb240.firebasestorage.app",
  messagingSenderId: "107693246830",
  appId: "1:107693246830:web:486a41f6448378627cbca9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function runMigration() {
  console.log(`Starting migration of ${articles.length} articles...`);
  
  for (const article of articles) {
    try {
      const docRef = doc(db, "articles", String(article.id));
      await setDoc(docRef, {
        ...article,
        likes: article.id % 2 === 0 ? 12 : 14,
        dislikes: article.id % 2 === 0 ? 3 : 2,
      });
      console.log(`Successfully migrated article ID: ${article.id}`);
    } catch (error) {
      console.error(`Error migrating article ID ${article.id}:`, error);
    }
  }
  
  console.log("Migration complete!");
  process.exit(0);
}

runMigration();
