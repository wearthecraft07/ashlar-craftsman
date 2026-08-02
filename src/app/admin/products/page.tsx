import type { Metadata } from "next";
import { AdminProducts } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Admin · Products" };

export default function AdminProductsPage() {
  return <AdminProducts />;
}
