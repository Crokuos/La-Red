import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type SessionUser = {
  id: string;
  activated_at: string | null;
  isAdmin: boolean;
};

type ApplicationIndexEntry = { id: string; token: string | null; status: "pendiente" | "aprobado" | "rechazado" };

const SESSION_COOKIE = "la_red_session";
const APPLICATION_INDEX_COOKIE = "la_red_app_idx";
const isDev = process.env.NODE_ENV === "development";

// DEV MODE: unrestricted access
const devUser: SessionUser = { id: "dev-user", activated_at: new Date().toISOString(), isAdmin: true };

const parseSession = (raw?: string | null): SessionUser | null => {
  if (!raw) return null;
  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    const parsed = JSON.parse(decoded);
    return {
      id: parsed.id,
      activated_at: parsed.activated_at || null,
      isAdmin: !!parsed.isAdmin,
    };
  } catch (err) {
    console.error("No se pudo parsear la cookie de sesión", err);
    return null;
  }
};

const parseAppIndex = (raw?: string | null): ApplicationIndexEntry[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("No se pudo parsear índice de aplicaciones", err);
    return [];
  }
};

export const getSessionUserServer = async (): Promise<SessionUser | null> => {
  if (isDev) return devUser;
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  return parseSession(raw);
};

export const getApplicationIndex = async (): Promise<ApplicationIndexEntry[]> => {
  const store = await cookies();
  const raw = store.get(APPLICATION_INDEX_COOKIE)?.value;
  return parseAppIndex(raw);
};

export const requireAuth = async (): Promise<SessionUser> => {
  const user = await getSessionUserServer();
  if (!user) redirect("/login");
  return user;
};

export const requireActivatedUser = async (): Promise<SessionUser> => {
  const user = await requireAuth();
  if (!user.activated_at) {
    redirect("/activacion-pendiente");
  }
  return user;
};

export const requireAdmin = async (): Promise<SessionUser> => {
  const user = await requireActivatedUser();
  if (!user.isAdmin) {
    redirect("/");
  }
  return user;
};

export const findApplicationByToken = async (token: string | null): Promise<ApplicationIndexEntry | null> => {
  if (!token) return null;
  const index = await getApplicationIndex();
  return index.find((entry) => entry.token === token) || null;
};
