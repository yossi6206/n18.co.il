import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

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

async function fixImagePaths() {
  const snapshot = await getDocs(collection(db, "articles"));
  let updated = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const updates = {};

    if (data.image && data.image.endsWith(".png")) {
      updates.image = data.image.replace(".png", ".webp");
    }
    if (data.authorImage && data.authorImage.endsWith(".png")) {
      updates.authorImage = data.authorImage.replace(".png", ".webp");
    }

    if (Object.keys(updates).length > 0) {
      await updateDoc(doc(db, "articles", docSnap.id), updates);
      console.log(`Updated article ${docSnap.id}:`, updates);
      updated++;
    }
  }

  console.log(`Done. Updated ${updated} articles.`);
  process.exit(0);
}

fixImagePaths().catch(e => { console.error(e); process.exit(1); });
