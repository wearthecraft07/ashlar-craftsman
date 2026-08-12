import type { Metadata } from "next";
import { AdminOverviewLive } from "@/components/admin/AdminOverviewLive";

export const metadata: Metadata = { title: "Admin" };

export default function AdminPage() {
  return <AdminOverviewLive />;
}
