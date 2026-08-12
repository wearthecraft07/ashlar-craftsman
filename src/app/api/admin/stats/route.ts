import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

const PAID_STATUSES = [
  "paid",
  "processing",
  "ready",
  "shipped",
  "delivered",
];

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ mode: "demo", stats: null });
  }

  const [
    { data: orders },
    { data: products },
    { data: customers },
    { count: customerCount },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id, email, total, status, created_at, items")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("products")
      .select("id, name, inventory, low_stock_threshold, status, best_seller"),
    supabase
      .from("profiles")
      .select("id, email, full_name, created_at, disabled, role")
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "customer"),
  ]);

  const allOrders = orders ?? [];
  const allProducts = products ?? [];

  const sales = allOrders
    .filter((order) => PAID_STATUSES.includes(order.status))
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const pending = allOrders.filter((o) => o.status === "pending").length;
  const completed = allOrders.filter((o) =>
    ["delivered", "shipped"].includes(o.status),
  ).length;
  const lowStock = allProducts.filter(
    (p) =>
      p.status !== "archived" &&
      Number(p.inventory) <= Number(p.low_stock_threshold ?? 5),
  );

  return NextResponse.json({
    mode: "database",
    stats: {
      sales,
      orders: allOrders.length,
      pendingOrders: pending,
      completedOrders: completed,
      customers: customerCount ?? customers?.length ?? 0,
      products: allProducts.length,
      lowStockCount: lowStock.length,
      inventoryUnits: allProducts.reduce(
        (sum, p) => sum + Number(p.inventory || 0),
        0,
      ),
      recentOrders: allOrders.slice(0, 8),
      recentCustomers: customers ?? [],
      lowStockProducts: lowStock.slice(0, 8),
      topProducts: allProducts
        .filter((p) => p.best_seller)
        .slice(0, 8),
    },
  });
}
