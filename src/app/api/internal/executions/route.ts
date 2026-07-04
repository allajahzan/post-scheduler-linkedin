import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const secret = request.headers.get("x-internal-secret");
    if (
      !process.env.INTERNAL_API_SECRET ||
      secret !== process.env.INTERNAL_API_SECRET
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { execution_id, user_id, post_id } = await request.json();

    if (!execution_id) {
      return NextResponse.json(
        { error: "execution_id required" },
        { status: 400 },
      );
    }

    const db = await getDb();

    // Upsert - safe to call multiple times
    await db.collection("executions").updateOne(
      { execution_id },
      {
        $set: {
          execution_id,
          user_id,
          post_id,
          created_at: new Date(),
        },
      },
      { upsert: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Internal executions POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
