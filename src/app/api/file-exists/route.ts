import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filePath = path.join(
    process.cwd(),
    "public",
    url.searchParams.get("file") || "",
  );

  try {
    await fs.access(filePath);
    return NextResponse.json({ exists: true });
  } catch {
    return NextResponse.json({ exists: false });
  }
}
