import type { Metadata } from "next";
import { AdminAnalytics } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = { title: "Admin · Analytics" };

export default function AdminAnalyticsPage() {
  return <AdminAnalytics />;
}
