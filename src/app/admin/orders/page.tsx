import type { Metadata } from "next";
import { AdminOrders } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Admin · Orders" };

export default function AdminOrdersPage() {
  return <AdminOrders />;
}
