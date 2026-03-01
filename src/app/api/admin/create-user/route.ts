import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/firebase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (role !== "hospital_staff" && role !== "first_responder") {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // 🔐 Verify caller is Admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const adminDoc = await adminDb
      .collection("hospital_administrators")
      .doc(decodedToken.uid)
      .get();

    if (!adminDoc.exists) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 🔥 Create Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    const uid = userRecord.uid;

    // 🔥 Create role collection document
    await adminDb.collection(role).doc(uid).set({
      uid,
      name,
      email,
      createdAt: new Date(),
    });

    // 🔥 Create IAM record
    await adminDb.collection("users").doc(uid).set({
      uid,
      role,
      name,
      email,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}