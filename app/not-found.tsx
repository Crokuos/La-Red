export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#02040a] text-white flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md space-y-4">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500">404</p>
        <h1 className="text-3xl font-black italic">No encontramos esa página</h1>
        <p className="text-sm text-gray-400">Revisá la URL o volvé al inicio.</p>
        <a href="/" className="text-sm text-rose-300 hover:text-white">Ir al inicio</a>
      </div>
    </main>
  );
}
