import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const path = request.nextUrl.pathname;
  const isAdminPath = path.startsWith("/admin");
  const isAdminLogin = path === "/admin/login";
  const configured = Boolean(url && key && !url.includes("your_supabase"));

  if (!configured) {
    // Without Supabase, keep storefront usable but lock admin behind login page.
    if (isAdminPath && !isAdminLogin) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("next", path);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  const supabase = createServerClient(url!, key!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminPath && !isAdminLogin) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("next", path);
      return NextResponse.redirect(loginUrl);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_admin, disabled")
      .eq("id", user.id)
      .maybeSingle();

    const bootstrapEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
    const isBootstrap = Boolean(
      user.email && bootstrapEmails.includes(user.email.toLowerCase()),
    );

    const allowed =
      !profile?.disabled &&
      (profile?.role === "admin" ||
        profile?.role === "super_admin" ||
        profile?.is_admin === true ||
        isBootstrap);

    if (!allowed) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("error", "forbidden");
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAdminLogin && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_admin, disabled")
      .eq("id", user.id)
      .maybeSingle();

    const bootstrapEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
    const isBootstrap = Boolean(
      user.email && bootstrapEmails.includes(user.email.toLowerCase()),
    );
    const allowed =
      !profile?.disabled &&
      (profile?.role === "admin" ||
        profile?.role === "super_admin" ||
        profile?.is_admin === true ||
        isBootstrap);

    if (allowed) {
      const next = request.nextUrl.searchParams.get("next") || "/admin";
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
