import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return <AdminOverview />;
}
