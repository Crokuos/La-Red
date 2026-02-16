"use client";
import { usePathname } from "next/navigation";

export default function Loading() {
  const pathname = usePathname();
  const isProfile = pathname?.startsWith("/perfil");
  const isAuth = pathname?.startsWith("/login") || pathname?.startsWith("/registro") || pathname?.startsWith("/recuperar");
  const placeholders = [1, 2, 3];

  if (isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <span className="text-2xl font-black tracking-[0.3em]">LA RED</span>
          <div className="h-1 w-16 bg-rose-500 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white max-w-md mx-auto px-5 py-6 space-y-8">
      {isProfile && (
        <section className="animate-pulse space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="h-28 w-28 rounded-full bg-gray-800" />
            <div className="h-4 w-32 rounded-full bg-gray-800" />
            <div className="h-3 w-48 max-w-full rounded-full bg-gray-800" />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {[1, 2, 3, 4].map((pill) => (
              <span
                key={pill}
                className="h-7 w-20 rounded-full bg-gray-800 animate-pulse"
              />
            ))}
          </div>
          <div className="h-[1px] w-full bg-gray-900" />
        </section>
      )}

      <section className="space-y-8">
        {placeholders.map((item) => (
          <div key={item} className="space-y-4">
            <div className="flex items-center gap-3 animate-pulse">
              <div className="h-12 w-12 rounded-full bg-gray-800" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-28 rounded-full bg-gray-800" />
                <div className="h-2 w-16 rounded-full bg-gray-900" />
              </div>
            </div>
            <div className="aspect-[4/5] w-full rounded-3xl bg-gray-800 animate-pulse" />
            <div className="space-y-2 animate-pulse">
              <div className="h-3 w-5/6 rounded-full bg-gray-800" />
              <div className="h-3 w-2/3 rounded-full bg-gray-800" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}