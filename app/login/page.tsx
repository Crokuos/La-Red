"use client";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isButtonDisabled = !email.includes("@") || password.length < 6;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      
      <div className="w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        
        <h1 className="text-4xl font-black italic tracking-tighter mb-2 italic">LA RED</h1>
        <p className="text-gray-500 mb-10 uppercase text-xs tracking-[0.2em] font-bold">Acceso a Miembros</p>

        <div className="w-full space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl focus:border-red-accent outline-none transition-all text-center"
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl focus:border-red-accent outline-none transition-all text-center"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

  <button 
    disabled={isButtonDisabled}
    className="w-full bg-white text-black font-bold py-4 rounded-full mt-8 cursor-pointer hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed"
  >
    ENTRAR
  </button>

  <Link href="/recuperar">
    <button className="text-gray-500 text-sm hover:text-white transition-colors cursor-pointer">
      Olvidé mi contraseña
    </button>
  </Link>
    
  <Link href="/registro">
    <span className="text-red-accent text-sm font-bold hover:underline cursor-pointer">
      No tengo acceso, solicitar ahora
    </span>
  </Link>
</div>

      <footer className="absolute bottom-8">
        <Link href="/">
          <span className="text-gray-600 text-xs uppercase tracking-widest hover:text-gray-400 transition-colors">← Volver</span>
        </Link>
      </footer>
    </main>
  );
}