import type { Metadata } from "next";
import { AdminAvatarManager } from "@/components/admin/AdminAvatarManager";

export const metadata: Metadata = { title: "Admin · Avatar" };

export default function AdminAvatarPage() {
  return <AdminAvatarManager />;
}
