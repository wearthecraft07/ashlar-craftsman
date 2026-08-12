import { NextResponse } from "next/server";
import { getAvatarCatalog } from "@/lib/avatar/catalog";

export async function GET() {
  const catalog = await getAvatarCatalog();
  return NextResponse.json(catalog);
}
