const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccount.json");

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function run() {
  const ref = db.collection("articles").doc("100");
  await ref.update({ image: "/iran_trump_conflict_new.webp" });
  console.log("✅ Updated image for article 100");
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
