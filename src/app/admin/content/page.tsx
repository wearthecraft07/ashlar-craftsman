import type { Metadata } from "next";
import { AdminContentManager } from "@/components/admin/AdminContentManager";

export const metadata: Metadata = { title: "Admin · Content" };

export default function AdminContentPage() {
  return <AdminContentManager />;
}
