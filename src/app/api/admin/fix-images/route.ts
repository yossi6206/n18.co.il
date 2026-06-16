import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.secret !== "fix-png-2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const snapshot = await getDocs(collection(db, "articles"));
    const updated: string[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const updates: Record<string, string> = {};

      if (data.image?.endsWith(".png")) {
        updates.image = data.image.replace(".png", ".webp");
      }
      if (data.authorImage?.endsWith(".png")) {
        updates.authorImage = data.authorImage.replace(".png", ".webp");
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(doc(db, "articles", docSnap.id), updates);
        updated.push(`${docSnap.id}: ${JSON.stringify(updates)}`);
      }
    }

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
