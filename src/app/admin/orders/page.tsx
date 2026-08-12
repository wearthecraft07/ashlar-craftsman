import type { Metadata } from "next";
import { AdminOrdersManager } from "@/components/admin/AdminOrdersManager";

export const metadata: Metadata = { title: "Admin · Orders" };

export default function AdminOrdersPage() {
  return <AdminOrdersManager />;
}
