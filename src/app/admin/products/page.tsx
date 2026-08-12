import type { Metadata } from "next";
import { AdminProductsManager } from "@/components/admin/AdminProductsManager";

export const metadata: Metadata = { title: "Admin · Products" };

export default function AdminProductsPage() {
  return <AdminProductsManager />;
}
