import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("x-internal-secret");

    if (
      !process.env.INTERNAL_API_SECRET ||
      authHeader !== process.env.INTERNAL_API_SECRET
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { post_id, status } = await request.json().catch(() => ({}));

    if (!post_id) {
      return NextResponse.json(
        { error: "Missing post_id in request body" },
        { status: 400 },
      );
    }

    if (!ObjectId.isValid(post_id)) {
      return NextResponse.json(
        { error: "Invalid post ID format" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const result = await db
      .collection("posts")
      .updateOne(
        { _id: new ObjectId(post_id) },
        { $set: { status: status, updated_at: new Date() } },
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Update post status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
