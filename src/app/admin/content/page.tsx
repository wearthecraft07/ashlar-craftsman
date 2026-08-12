import type { Metadata } from "next";
import { AdminPlaceholder } from "@/components/admin/AdminPlaceholder";

export const metadata: Metadata = { title: "Admin · Content" };

export default function AdminContentPage() {
  return (
    <AdminPlaceholder
      title="Website content"
      subtitle="Hero, about, footer, and CTA copy will be editable here from the site_content table."
    />
  );
}
