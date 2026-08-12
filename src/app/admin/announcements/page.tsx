import type { Metadata } from "next";
import { AdminAnnouncementsManager } from "@/components/admin/AdminAnnouncementsManager";

export const metadata: Metadata = { title: "Admin · Announcements" };

export default function AdminAnnouncementsPage() {
  return <AdminAnnouncementsManager />;
}
