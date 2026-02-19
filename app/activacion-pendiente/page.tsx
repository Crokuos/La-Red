export default function ActivacionPendiente() {
  return (
    <main className="min-h-screen bg-[#05070f] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-black italic">Tu cuenta aún no está activada</h1>
        <p className="text-sm text-gray-300">
          Esperá la aprobación o revisá tu email para el enlace de activación. Si recibiste un token, usalo en la página de
          activación.
        </p>
      </div>
    </main>
  );
}
