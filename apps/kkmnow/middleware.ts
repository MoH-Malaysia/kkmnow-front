import { NextRequest, NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

// Triggers on relevant pages. Authentication to be removed at launch
export const config = {
  // zh-MY / ta-MY: so links to the switched-off languages can be redirected (see below)
  matcher: ["/", "/dashboard/:path*", "/data-catalogue/:path*", "/zh-MY/:path*", "/ta-MY/:path*"],
};

// Languages that only the fiscal and SHA 2011 dashboards offer (see lib/locales.ts). While they are
// switched off in next-i18next.config.js, Next never routes these locales and this check is idle.
const PAGE_LOCALES = ["zh-MY", "ta-MY"];
const PAGE_LOCALE_ROUTE = /\/dashboard\/(fiscal|sha-2011)(\/|$)/;

export async function middleware(request: NextRequest) {
  let response: NextResponse;

  // Other pages don't exist in those languages: send readers to the English page instead.
  // Behind a basePath (dev), nextUrl.pathname can still hold the prefix and the locale, so match
  // the route anywhere in it and drop every locale segment before switching to English.
  const { locale } = request.nextUrl;
  // While the languages are switched off, Next treats /zh-MY/... as an unknown path (404). Send
  // old links to the same page in English instead.
  const offPrefix = new RegExp(`/(${PAGE_LOCALES.join("|")})(?=/|$)`, "g");
  if (!PAGE_LOCALES.includes(locale) && offPrefix.test(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = url.pathname.replace(offPrefix, "") || "/";
    return NextResponse.redirect(url);
  }
  if (PAGE_LOCALES.includes(locale) && !PAGE_LOCALE_ROUTE.test(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = url.pathname.replace(new RegExp(`/${locale}(?=/|$)`, "g"), "") || "/";
    url.locale = "en-GB";
    return NextResponse.redirect(url);
  }
  // Bug: Middleware interferes with getServerSideProps, by returning empty pageProps [https://github.com/vercel/next.js/issues/47516]
  // Fixed by removing the 'x-middleware-prefetch' header
  const headers = new Headers(request.headers);
  const purpose = headers.get("purpose");
  if (purpose && purpose.match(/prefetch/i)) headers.delete("x-middleware-prefetch"); // empty json bugfix (in the browser headers still show, but here it is gone)

  let token = "dummy";
  if (process.env.EDGE_CONFIG) {
    try {
      token = (await get<string>("ROLLING_TOKEN")) || "dummy";
    } catch {
      token = "dummy";
    }
  }

  // Development / Production
  if (["development", "production"].includes(process.env.NEXT_PUBLIC_APP_ENV)) {
    response = NextResponse.next({ request: { headers } });
    response.cookies.set("rolling_token", token || "yikes", { path: "/", maxAge: 60 * 60 });
    return response;
  }

  // Staging
  const basicAuth = request.headers.get("authorization");
  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, password] = atob(authValue).split(":");
    if (user === "admin" && password === process.env.AUTH_TOKEN) {
      response = NextResponse.next({ request: { headers } });
      response.cookies.set("rolling_token", token || "yikes", { path: "/", maxAge: 60 * 60 });
      return response;
    }
  }
  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="Secure Area"` },
  });
}
