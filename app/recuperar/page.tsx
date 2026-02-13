"use client";
import { useState } from "react";
import Link from "next/link";

export default function Recuperar() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleRecuperar = () => {
    // Aquí iría la lógica de backend
    setEnviado(true);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        
        {!enviado ? (
          <>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Recuperar Acceso</h2>
            <p className="text-gray-500 mb-8 text-center text-sm px-4">
              Ingresá tu mail y te enviaremos una clave temporal de acceso.
            </p>

            <input 
              type="email" 
              placeholder="tu@email.com" 
              className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl mb-6 focus:border-red-accent outline-none text-center transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />

            <button 
              onClick={handleRecuperar}
              disabled={!email.includes("@")}
              className="w-full bg-white text-black font-bold py-4 rounded-full active:scale-95 transition-all disabled:opacity-20 cursor-pointer shadow-lg"
            >
              ENVIAR CLAVE
            </button>
          </>
        ) : (
          <div className="text-center animate-in zoom-in-90 duration-500">
            <div className="bg-red-accent/20 text-red-accent w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </div>
            <h2 className="text-3xl font-black italic uppercase mb-2">Mail Enviado</h2>
            <p className="text-gray-500 text-sm mb-10 px-6">
              Revisá tu bandeja de entrada (y spam). Si sos miembro activo, recibirás las instrucciones en minutos.
            </p>
          </div>
        )}

        <Link href="/login" className="mt-8 text-gray-500 text-sm hover:text-white transition-colors cursor-pointer flex items-center gap-2">
          <span>←</span> Volver al login
        </Link>
      </div>
    </main>
  );
}