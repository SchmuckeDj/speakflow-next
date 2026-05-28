import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/", "/login", "/register", "/onboarding"];

const PROTECTED_PREFIXES = [
  "/dashboard", "/chat", "/pronunciation", "/vocabulary",
  "/challenge", "/verbs", "/game", "/profile",
];

// La secret key del JWT de Django es HMAC-SHA256
// simplejwt usa la SECRET_KEY de Django como secret
const SECRET = new TextEncoder().encode(
  process.env.DJANGO_SECRET_KEY ?? "django-insecure-change-this-in-production"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dejar pasar assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Rutas públicas
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Solo verificar rutas protegidas
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // Intentar verificar JWT real
  const token = request.cookies.get("sf_token")?.value
    ?? request.headers.get("authorization")?.replace("Bearer ", "");

  if (token) {
    try {
      await jwtVerify(token, SECRET, { algorithms: ["HS256"] });
      return NextResponse.next();
    } catch {
      // Token inválido — caer al fallback de cookie
    }
  }

  // Fallback: cookie sf_session (compatibilidad hacia atrás)
  const session = request.cookies.get("sf_session");
  if (session) return NextResponse.next();

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
