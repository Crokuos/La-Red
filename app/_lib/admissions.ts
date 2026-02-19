type Gender = "hombre" | "mujer";
type Status = "pendiente" | "aprobado" | "rechazado";

export type Application = {
  id: string;
  email: string;
  age_range: string;
  gender: Gender;
  department: string;
  zone: string;
  hide_from_same_zone: boolean;
  looking_for: string;
  values: string[];
  social_style: string;
  description: string;
  verification_code: string;
  selfie_url: string;
  status: Status;
  activation_token: string | null;
  token_expires_at: string | null;
  activated_at: string | null;
  created_at: string;
};

export type User = {
  id: string;
  application_id: string;
  alias: string;
  email: string;
  password_hash: string;
  real_name?: string | null;
  created_at: string;
  activated_at: string;
  isAdmin?: boolean;
};

const STORAGE_KEYS = {
  applications: "la_red_applications",
  users: "la_red_users",
  session: "la_red_session",
};

const SESSION_COOKIE = "la_red_session";
const APPLICATION_INDEX_COOKIE = "la_red_app_idx";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const load = <T,>(key: string): T[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`No se pudo leer ${key}`, err);
    return [];
  }
};

const save = (key: string, value: unknown) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};

const setCookie = (name: string, value: string, maxAgeDays = 30) => {
  if (typeof document === "undefined") return;
  const maxAge = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};

const readCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
};

const setSessionCookie = (payload: Partial<User>) => {
  const minimal = {
    id: payload.id,
    isAdmin: payload.isAdmin || false,
    activated_at: payload.activated_at || null,
  };
  try {
    const value = btoa(JSON.stringify(minimal));
    setCookie(SESSION_COOKIE, value);
  } catch (err) {
    console.error("No se pudo guardar cookie de sesión", err);
  }
};

type ApplicationIndexEntry = {
  id: string;
  token: string | null;
  status: Status;
  token_expires_at: string | null;
  activated_at: string | null;
};

const readApplicationIndexCookie = (): ApplicationIndexEntry[] => {
  const raw = readCookie(APPLICATION_INDEX_COOKIE);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("No se pudo leer índice de aplicaciones", err);
    return [];
  }
};

const writeApplicationIndexCookie = (entries: ApplicationIndexEntry[]) => {
  try {
    setCookie(APPLICATION_INDEX_COOKIE, JSON.stringify(entries));
  } catch (err) {
    console.error("No se pudo guardar índice de aplicaciones", err);
  }
};

const randomId = () => {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 10);
};

const generateSecureToken = () => {
  if (typeof crypto !== "undefined" && (crypto as any).randomUUID) {
    return (crypto as any).randomUUID();
  }
  const pool = "abcdef0123456789";
  return Array.from({ length: 64 }, () => pool[Math.floor(Math.random() * pool.length)]).join("");
};

export const generateVerificationCode = () => {
  const pool = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  const length = Math.random() > 0.5 ? 5 : 6;
  return Array.from({ length }, () => pool[Math.floor(Math.random() * pool.length)]).join("");
};

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export const hashPassword = async (password: string) => {
  try {
    const data = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return toHex(digest);
  } catch (err) {
    console.error("No se pudo hashear la contraseña", err);
    return btoa(password);
  }
};

let bcryptLoader: Promise<any> | null = null;
const getBcrypt = async () => {
  if (!bcryptLoader) {
    bcryptLoader = import("bcryptjs").catch((err) => {
      console.warn("bcryptjs no disponible, usando hash fallback", err);
      return null;
    });
  }
  return bcryptLoader;
};

export const createApplication = async (
  input: Omit<
    Application,
    "id" | "status" | "activation_token" | "token_expires_at" | "activated_at" | "created_at" | "selfie_url" | "verification_code"
  > & {
    selfie_url: string;
    verification_code: string;
  }
): Promise<Application> => {
  const applications = load<Application>(STORAGE_KEYS.applications);
  const users = load<User>(STORAGE_KEYS.users);

  const emailTaken =
    applications.some((a) => a.email.toLowerCase() === input.email.toLowerCase()) ||
    users.some((u) => u.email.toLowerCase() === input.email.toLowerCase());
  if (emailTaken) {
    throw new Error("Ya existe una solicitud o usuario con ese email.");
  }

  if (!input.values || input.values.length === 0 || input.values.length > 2) {
    throw new Error("Seleccioná hasta dos valores.");
  }

  const application: Application = {
    ...input,
    id: randomId(),
    status: "pendiente",
    activation_token: null,
    token_expires_at: null,
    activated_at: null,
    created_at: new Date().toISOString(),
  };

  const next = [...applications, application];
  save(STORAGE_KEYS.applications, next);
  const index = readApplicationIndexCookie();
  index.push({
    id: application.id,
    token: application.activation_token,
    status: application.status,
    token_expires_at: application.token_expires_at,
    activated_at: application.activated_at,
  });
  writeApplicationIndexCookie(index);
  return application;
};

export const listPendingApplications = (): Application[] => {
  return load<Application>(STORAGE_KEYS.applications).filter((a) => a.status === "pendiente");
};

export const updateApplicationStatus = (id: string, status: Status): Application | null => {
  const applications = load<Application>(STORAGE_KEYS.applications);
  const idx = applications.findIndex((a) => a.id === id);
  if (idx === -1) return null;

  let activation_token = applications[idx].activation_token;
  let token_expires_at = applications[idx].token_expires_at;
  let activated_at = applications[idx].activated_at;

  if (status === "aprobado") {
    activation_token = generateSecureToken();
    token_expires_at = new Date(Date.now() + TOKEN_TTL_MS).toISOString();
    activated_at = null;
  } else {
    activation_token = null;
    token_expires_at = null;
  }

  applications[idx] = {
    ...applications[idx],
    status,
    activation_token,
    token_expires_at,
    activated_at,
  };
  save(STORAGE_KEYS.applications, applications);
  const index = readApplicationIndexCookie().map((entry) =>
    entry.id === id ? { ...entry, status, token: activation_token, token_expires_at, activated_at } : entry
  );
  writeApplicationIndexCookie(index);
  return applications[idx];
};

export const getApplicationByToken = (token: string | null): Application | null => {
  if (!token) return null;
  const applications = load<Application>(STORAGE_KEYS.applications);
  const match = applications.find((a) => a.activation_token === token);
  if (!match) return null;
  if (match.status !== "aprobado") return null;
  if (match.activated_at) return null;
  if (!match.token_expires_at || new Date(match.token_expires_at).getTime() <= Date.now()) return null;
  return match;
};

export const createUserFromApplication = async (params: {
  token: string;
  alias: string;
  password: string;
  real_name?: string;
}): Promise<User> => {
  const applications = load<Application>(STORAGE_KEYS.applications);
  const users = load<User>(STORAGE_KEYS.users);
  const application = applications.find((a) => a.activation_token === params.token);
  if (!application) throw new Error("Token inválido o expirado");
  if (application.status !== "aprobado") throw new Error("Token inválido o expirado");
  if (application.activated_at) throw new Error("Token inválido o expirado");
  if (!application.token_expires_at || new Date(application.token_expires_at).getTime() <= Date.now()) {
    throw new Error("Token inválido o expirado");
  }
  const alreadyLinked = users.some((u) => u.application_id === application.id);
  if (alreadyLinked) throw new Error("Token inválido o expirado");

  const aliasTaken = users.some((u) => u.alias.toLowerCase() === params.alias.toLowerCase());
  if (aliasTaken) throw new Error("Alias en uso");

  let password_hash: string;
  try {
    const bcrypt = await getBcrypt();
    if (bcrypt?.hash) {
      password_hash = await bcrypt.hash(params.password, 10);
    } else {
      password_hash = await hashPassword(params.password);
    }
  } catch (err) {
    password_hash = await hashPassword(params.password);
  }

  const nowIso = new Date().toISOString();
  const user: User = {
    id: randomId(),
    application_id: application.id,
    alias: params.alias,
    email: application.email,
    password_hash,
    real_name: params.real_name || null,
    created_at: nowIso,
    activated_at: nowIso,
    isAdmin: false,
  };

  const nextUsers = [...users, user];
  save(STORAGE_KEYS.users, nextUsers);

  const updatedApplications = applications.map((a) =>
    a.id === application.id ? { ...a, activation_token: null, token_expires_at: null, activated_at: nowIso } : a
  );
  save(STORAGE_KEYS.applications, updatedApplications);

  const index: ApplicationIndexEntry[] = readApplicationIndexCookie().map((entry) =>
    entry.id === application.id
      ? { ...entry, token: null, status: "aprobado" as Status, token_expires_at: null, activated_at: nowIso }
      : entry
  );
  writeApplicationIndexCookie(index);

  save(STORAGE_KEYS.session, user);
  setSessionCookie(user);
  return user;
};

export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  const users = load<User>(STORAGE_KEYS.users);
  const target = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!target) throw new Error("No existe usuario con ese email");
  try {
    const bcrypt = await getBcrypt();
    if (bcrypt?.compare && target.password_hash.startsWith("$2")) {
      const ok = await bcrypt.compare(password, target.password_hash);
      if (!ok) throw new Error("Contraseña incorrecta");
    } else {
      const hash = await hashPassword(password);
      if (hash !== target.password_hash) throw new Error("Contraseña incorrecta");
    }
  } catch (err) {
    const hash = await hashPassword(password);
    if (hash !== target.password_hash) throw new Error("Contraseña incorrecta");
  }
  save(STORAGE_KEYS.session, target);
  setSessionCookie(target);
  return target;
};

export const getSessionUser = (): User | null => {
  try {
    const cookieRaw = readCookie(SESSION_COOKIE);
    if (cookieRaw) {
      const parsed = JSON.parse(atob(cookieRaw)) as Partial<User>;
      return {
        id: parsed.id || "",
        application_id: "",
        alias: "",
        email: "",
        password_hash: "",
        created_at: "",
        real_name: null,
        activated_at: parsed.activated_at || "",
        isAdmin: parsed.isAdmin || false,
      } as User;
    }
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEYS.session);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch (err) {
    console.error("No se pudo leer la sesión", err);
    return null;
  }
};

export const logout = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.session);
  deleteCookie(SESSION_COOKIE);
};

export const getPendingCount = () => listPendingApplications().length;

export const getApprovedGenderCounts = () => {
  const apps = load<Application>(STORAGE_KEYS.applications);
  return apps.reduce(
    (acc, app) => {
      if (app.status === "aprobado") {
        if (app.gender === "hombre") acc.hombres += 1;
        if (app.gender === "mujer") acc.mujeres += 1;
      }
      return acc;
    },
    { hombres: 0, mujeres: 0 }
  );
};
