const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccount.json");

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function run() {
  const ref = db.collection("articles").doc("100");
  await ref.update({ image: "/ChatGPT Image Jun 11, 2026, 07_56_08 AM-c.webp" });
  console.log("✅ Updated image for article 100");
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
