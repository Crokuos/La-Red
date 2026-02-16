"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, UserRound } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Inicio", Icon: Home },
  { href: "/mensajes", label: "Mensajes", Icon: MessageCircle },
  { href: "/perfil", label: "Perfil", Icon: UserRound },
];

const hiddenPrefixes = ["/login", "/registro", "/recuperar"];

export default function BottomNav() {
  const pathname = usePathname();
  const isRoot = pathname === "/";
  const hide = isRoot || hiddenPrefixes.some((prefix) => pathname?.startsWith(prefix));
  if (hide) return null;

  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[94vw] max-w-md px-4 py-3 rounded-3xl bg-slate-950/85 backdrop-blur-2xl border border-white/5 shadow-[0_10px_50px_rgba(0,0,0,0.6)] overflow-hidden z-50">
      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-transparent to-indigo-500/10 pointer-events-none" />
      <div className="absolute inset-x-10 -top-10 h-10 bg-white/5 blur-3xl rounded-full pointer-events-none" />
      <div className="relative flex items-center justify-between gap-2">
        {links.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1"
              aria-label={label}
            >
              <div
                className={`group relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 border ${
                  active
                    ? "text-rose-300 border-rose-500/50 bg-white/10 shadow-[0_10px_35px_rgba(244,63,94,0.25)] scale-[1.03]"
                    : "text-gray-500 border-transparent hover:text-gray-100 hover:bg-white/5 hover:border-white/10"
                }`}
              >
                <Icon
                  strokeWidth={active ? 2.8 : 2.2}
                  className={`transition-transform duration-200 ${active ? "-translate-y-0.5" : "group-hover:-translate-y-0.5"}`}
                />
                <span className="text-[10px] font-semibold tracking-wide uppercase">
                  {label}
                </span>
                {active && (
                  <span
                    className="absolute -bottom-1 w-10 h-1 rounded-full bg-rose-500/80 shadow-[0_0_14px_rgba(244,63,94,0.9)] animate-pulse"
                    aria-hidden
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
