import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata: Metadata = { title: "Admin · Announcements" };

export default function AdminAnnouncementsPage() {
  return (
    <AdminPlaceholder
      title="Announcements"
      subtitle="Publish timed banners like free shipping weekends or new collection drops."
    />
  );
}
