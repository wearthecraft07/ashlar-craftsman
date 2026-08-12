import type { Metadata } from "next";
import { AdminCategoriesManager } from "@/components/admin/AdminCategoriesManager";

export const metadata: Metadata = { title: "Admin · Categories" };

export default function AdminCategoriesPage() {
  return <AdminCategoriesManager />;
}
