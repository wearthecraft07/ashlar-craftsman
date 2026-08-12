import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata: Metadata = { title: "Admin · Avatar" };

export default function AdminAvatarPage() {
  return (
    <AdminPlaceholder
      title="Avatar Studio items"
      subtitle="Manage layered avatar categories and assets from the database. Built-in SVG options remain available; uploaded image layers can be added without code changes."
    />
  );
}
