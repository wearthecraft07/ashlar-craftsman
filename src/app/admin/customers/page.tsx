import type { Metadata } from "next";
import { AdminCustomers } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Admin · Customers" };

export default function AdminCustomersPage() {
  return <AdminCustomers />;
}
