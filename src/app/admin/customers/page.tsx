import type { Metadata } from "next";
import { AdminCustomersManager } from "@/components/admin/AdminCustomersManager";

export const metadata: Metadata = { title: "Admin · Customers" };

export default function AdminCustomersPage() {
  return <AdminCustomersManager />;
}
