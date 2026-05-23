import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que NO requieren sesión
const PUBLIC_PATHS = ["/", "/login", "/register", "/onboarding"];

// Prefijos de rutas protegidas — todo lo demás requiere sesión
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/chat",
  "/pronunciation",
  "/vocabulary",
  "/challenge",
  "/verbs",
  "/game",
  "/profile",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Siempre dejar pasar assets y rutas de Next.js
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Si es ruta pública, dejar pasar siempre
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Solo proteger rutas explícitamente privadas
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) {
    return NextResponse.next();
  }

  // Verificar sesión
  const session = request.cookies.get("sf_session");
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
