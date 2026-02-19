import { NextResponse, NextRequest } from "next/server";

const SESSION_COOKIE = "la_red_session";
const APPLICATION_INDEX_COOKIE = "la_red_app_idx";

const PUBLIC_PATHS = ["/", "/login", "/registro", "/recuperar", "/activacion-pendiente"];
const PRIVATE_PREFIXES = ["/dashboard", "/mensajes", "/perfil"];

const decodeBase64 = (value: string) => {
  if (typeof atob === "function") return atob(value);
  // Fallback for Node runtime (should not run on edge, but keeps type safety)
  return Buffer.from(value, "base64").toString("utf8");
};

const parseSession = (raw?: string | null) => {
  if (!raw) return null;
  try {
    const decoded = decodeBase64(raw);
    const parsed = JSON.parse(decoded);
    return {
      id: parsed.id as string,
      activated_at: parsed.activated_at as string | null,
      isAdmin: !!parsed.isAdmin,
    };
  } catch (err) {
    console.error("No se pudo parsear cookie de sesión", err);
    return null;
  }
};

const parseAppIndex = (raw?: string | null) => {
  if (!raw) return [] as { token: string | null; status: string }[];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("No se pudo parsear índice", err);
    return [];
  }
};

const isPublicPath = (pathname: string) => PUBLIC_PATHS.includes(pathname);
const isPrivate = (pathname: string) => PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // DEV MODE: unrestricted access
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value || null);
  const isAuthenticated = !!session;

  if (pathname === "/activar") {
    const token = searchParams.get("token");
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const appIndex = parseAppIndex(request.cookies.get(APPLICATION_INDEX_COOKIE)?.value || null);
    const entry = appIndex.find((e) => e.token === token);
    if (!entry) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (entry.status !== "aprobado") {
      return NextResponse.redirect(new URL("/activacion-pendiente", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/admin") {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!session?.activated_at) {
      return NextResponse.redirect(new URL("/activacion-pendiente", request.url));
    }
    if (!session?.isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    if (isAuthenticated && session?.activated_at) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (isAuthenticated && !session?.activated_at) {
      return NextResponse.redirect(new URL("/activacion-pendiente", request.url));
    }
    return NextResponse.next();
  }

  if (isPrivate(pathname)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!session?.activated_at) {
      return NextResponse.redirect(new URL("/activacion-pendiente", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(.*)"],
};
