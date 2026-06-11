import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(readFileSync("./serviceAccount.json", "utf8"));

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// Import articles inline (copy from articles.ts)
const { articles } = await import("../data/articles.js").catch(async () => {
  // fallback: use tsx to load
  return {};
});

// Paste articles array here directly
