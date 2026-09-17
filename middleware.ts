import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "miiccof_site_access";
const PASSWORD = process.env.SITE_ACCESS_PASSWORD?.trim();

function loginPage(returnTo: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>MIICCOF — Private Site</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f3d2e;
      color: #fff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .card {
      width: 100%;
      max-width: 420px;
      padding: 2rem;
      border-radius: 1rem;
      background: rgba(255,255,255,0.1);
      text-align: center;
      backdrop-filter: blur(8px);
    }
    h1 { margin: 0 0 0.5rem; font-size: 1.5rem; }
    p { margin: 0 0 1.5rem; opacity: 0.85; font-size: 0.95rem; }
    input {
      width: 100%;
      padding: 0.85rem 1rem;
      border: 1px solid rgba(255,255,255,0.25);
      border-radius: 0.5rem;
      background: rgba(255,255,255,0.1);
      color: #fff;
      font-size: 1rem;
      margin-bottom: 0.75rem;
    }
    input::placeholder { color: rgba(255,255,255,0.55); }
    button {
      width: 100%;
      padding: 0.85rem 1rem;
      border: none;
      border-radius: 0.5rem;
      background: #d4af37;
      color: #0f3d2e;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }
    .error { color: #ff9e9e; margin-bottom: 0.75rem; font-size: 0.9rem; }
  </style>
</head>
<body>
  <div class="card">
    <h1>MIICCOF</h1>
    <p>This site is private. Please enter the access password to continue.</p>
    <form method="post" action="/site-access">
      <input type="hidden" name="returnTo" value="${returnTo.replace(/"/g, "&quot;")}" />
      <input type="password" name="password" placeholder="Enter access password" required autofocus />
      <button type="submit">Access Site</button>
    </form>
  </div>
</body>
</html>`;
}

export function middleware(request: NextRequest) {
  if (!PASSWORD) return NextResponse.next();

  const pathname = request.nextUrl.pathname;

  // Allow static assets and the login form handler itself.
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Handle password submission.
  if (pathname === "/site-access" && request.method === "POST") {
    return request
      .text()
      .then((body) => {
        const params = new URLSearchParams(body);
        const password = params.get("password")?.trim();
        const returnTo = params.get("returnTo") || "/";

        if (password !== PASSWORD) {
          return new NextResponse(
            loginPage(returnTo).replace(
              "</form>",
              '<div class="error">Incorrect password. Please try again.</div></form>'
            ),
            { status: 401, headers: { "content-type": "text/html" } }
          );
        }

        const response = NextResponse.redirect(new URL(returnTo, request.url));
        response.cookies.set(ACCESS_COOKIE, PASSWORD, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });
        return response;
      })
      .catch(() => NextResponse.next());
  }

  const accessCookie = request.cookies.get(ACCESS_COOKIE);
  if (accessCookie?.value === PASSWORD) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/site-access";
  url.search = "";
  return new NextResponse(loginPage(pathname + (request.nextUrl.search || "")), {
    status: 401,
    headers: { "content-type": "text/html" },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
