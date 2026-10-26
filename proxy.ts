import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Runs only for /admin. Refreshes the Supabase session cookie and sends
 * signed-out visitors to the login page early. This is an optimistic check
 * for UX — the authoritative admin check (allowlist + verified email) runs on
 * the server in every admin layout, page, server action and route handler.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isLogin = request.nextUrl.pathname === "/admin/login";

  if (!url || !key) return isLogin ? response : redirectToLogin(request);

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  let signedIn = false;
  try {
    const { data } = await supabase.auth.getUser();
    signedIn = Boolean(data.user);
  } catch {
    signedIn = false;
  }

  if (!signedIn && !isLogin) return redirectToLogin(request);
  return response;
}

function redirectToLogin(request: NextRequest) {
  const login = request.nextUrl.clone();
  login.pathname = "/admin/login";
  login.search = "";
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
