"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// --- ESPACIO PARA TUS BARRIOS ---
const BARRIOS_POR_DEPTO: Record<string, string[]> = {
  "Montevideo": [
    "Pocitos", "Punta Carretas", "Cordón", "Centro", "Ciudad Vieja", "Carrasco", "Carrasco Norte", "Malvín", "Malvín Norte", "Buceo", "Parque Rodó", "Palermo", "Aguada", "Prado", "Tres Cruces", "La Blanqueada", "Unión", "Cerro", "Paso de la Arena", "Sayago", "Colón", "Peñarol", "Manga", "Casavalle", "Piedras Blancas", "Maroñas", "Parque Batlle", "La Teja", "Punta de Rieles", "Melilla"
  ],
  "Canelones": [
    "Ciudad de la Costa", "Paso Carrasco", "Las Piedras", "Pando", "Atlántida", "Canelones (Ciudad)", "Barros Blancos", "La Paz", "Santa Lucía", "Progreso", "Salinas", "Parque del Plata", "Sauce", "Tala", "San Jacinto", "Empalme Olmos", "Neptunia", "Pinamar", "Marindia", "Las Toscas", "Costa Azul"
  ],
  "Maldonado": [
    "Punta del Este", "Maldonado (Ciudad)", "San Carlos", "Piriápolis", "Pan de Azúcar", "Aiguá", "Punta Ballena", "La Barra", "José Ignacio", "Solís", "Portezuelo", "Manantiales"
  ],
  "Colonia": [
    "Colonia del Sacramento", "Carmelo", "Nueva Helvecia", "Juan Lacaze", "Tarariras", "Rosario", "Nueva Palmira", "Colonia Valdense", "Ombúes de Lavalle", "Florencio Sánchez"
  ],
  "Salto": ["Salto (Ciudad)", "Termas del Daymán", "Termas del Arapey", "Constitución", "Belén", "San Antonio"],
  "Paysandú": ["Paysandú (Ciudad)", "Guichón", "Quebracho", "Lorenzo Geyres", "Piedras Coloradas"],
  "San José": ["San José de Mayo", "Ciudad del Plata", "Libertad", "Rodríguez", "Ecilda Paullier", "Puntas de Valdez"],
  "Rivera": ["Rivera (Ciudad)", "Tranqueras", "Vichadero", "Minas de Corrales"],
  "Tacuarembó": ["Tacuarembó (Ciudad)", "Paso de los Toros", "San Gregorio de Polanco", "Ansina"],
  "Artigas": ["Artigas (Ciudad)", "Bella Unión", "Tomas Gomensoro", "Baltasar Brum"],
  "Soriano": ["Mercedes", "Dolores", "Cardona", "Palmitas", "José Enrique Rodó"],
  "Rocha": ["Rocha (Ciudad)", "Chuy", "Castillos", "La Paloma", "Punta del Diablo", "Lascano", "Cabo Polonio", "La Pedrera"],
  "Cerro Largo": ["Melo", "Río Branco", "Fraile Muerto", "Isidoro Noblía", "Aceguá"],
  "Durazno": ["Durazno (Ciudad)", "Sarandí del Yí", "Villa del Carmen", "Santa Bernardina"],
  "Florida": ["Florida (Ciudad)", "Sarandí Grande", "Casupá", "Fray Marcos", "25 de Mayo"],
  "Lavalleja": ["Minas", "José Pedro Varela", "Solís de Mataojo", "José Batlle y Ordóñez", "Mariscala"],
  "Río Negro": ["Fray Bentos", "Young", "Nuevo Berlín", "San Javier"],
  "Flores": ["Trinidad", "Ismael Cortinas"],
  "Treinta y Tres": ["Treinta y Tres (Ciudad)", "Vergara", "Santa Clara de Olimar", "Cerro Chato"]
};


const TRIBUS_DISPONIBLES = [
  "Metaleros", "Techneros", "Gym Rats", "Góticas/os", "Alt/Indie", "Sport", "Daddies/Mommies", "Elegante", 
  "Skaters", "Hip-hop/Rap", "K-popers", "Gamers", "Artistas", "Hippie-Chic", "Rave Culture", "Aesthetic", 
  "Trapperos", "Otakus", "Viejas Escuelas", "Fit-Style"
];

export default function Registro() {
  const [step, setStep] = useState(1);
  const [fotoSubida, setFotoSubida] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    depto: "",
    barrio: "",
    tribus: [] as string[],
  });

  // Animación: Cada vez que el step cambia, el contenido "reaparece"
  const [animating, setAnimating] = useState(false);

  const nextStep = () => {
    setAnimating(true);
    setTimeout(() => {
      setStep(step + 1);
      setAnimating(false);
    }, 200); // Pequeño delay para que la transición sea fluida
  };

  useEffect(() => {
    setFormData(prev => ({ ...prev, barrio: "" }));
  }, [formData.depto]);

  const isStep1Disabled = !formData.email.includes("@") || formData.password.length < 6;
  const isStep2Disabled = !formData.depto || !formData.barrio;
  const isStep3Disabled = formData.tribus.length === 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFotoSubida(true);
    }
  };

  // Clase de animación reutilizable
  const stepAnimation = animating 
    ? "opacity-0 translate-y-4" 
    : "opacity-100 translate-y-0 transition-all duration-500 ease-out";

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-6 overflow-x-hidden">
      
      {/* Barra de Progreso Superior */}
      {step < 5 && (
        <div className="w-full max-w-md flex gap-2 mb-12 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-700 ${step >= i ? "bg-red-accent shadow-[0_0_10px_rgba(139,92,246,0.5)]" : "bg-gray-800"}`} />
          ))}
        </div>
      )}

      <div className={`w-full max-w-sm flex flex-col items-center ${stepAnimation}`}>
        
        {/* PASO 1: ACCESO */}
        {step === 1 && (
          <div className="w-full flex flex-col items-center">
            <h2 className="text-3xl font-black mb-2 text-center italic uppercase tracking-tighter">Acceso</h2>
            <p className="text-gray-500 mb-8 text-center text-sm">Configurá tu cuenta exclusiva.</p>
            <div className="w-full space-y-4">
                <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl focus:border-red-accent outline-none text-center transition-colors"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <input 
                    type="password" 
                    placeholder="Contraseña (mín. 6)" 
                    className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl focus:border-red-accent outline-none text-center transition-colors"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
            </div>
            <button onClick={nextStep} disabled={isStep1Disabled} className="w-full bg-white text-black font-bold py-4 rounded-full mt-8 disabled:opacity-20 cursor-pointer active:scale-95 transition-all">CONTINUAR</button>
          </div>
        )}

        {/* PASO 2: UBICACIÓN */}
        {step === 2 && (
          <div className="w-full flex flex-col items-center">
            <h2 className="text-3xl font-black mb-2 text-center italic uppercase tracking-tighter">Ubicación</h2>
            <p className="text-gray-500 mb-8 text-center text-sm">¿En qué parte de Uruguay estás?</p>
            
            <select 
              className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl mb-4 outline-none appearance-none cursor-pointer focus:border-red-accent"
              onChange={(e) => setFormData({...formData, depto: e.target.value})}
              value={formData.depto}
            >
              <option value="">Seleccioná Departamento...</option>
              {Object.keys(BARRIOS_POR_DEPTO).map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select 
              disabled={!formData.depto}
              className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl mb-4 outline-none appearance-none disabled:opacity-20 cursor-pointer focus:border-red-accent"
              onChange={(e) => setFormData({...formData, barrio: e.target.value})}
              value={formData.barrio}
            >
              <option value="">Elegí tu Barrio/Localidad...</option>
              {formData.depto && BARRIOS_POR_DEPTO[formData.depto].map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            <button onClick={nextStep} disabled={isStep2Disabled} className="w-full bg-white text-black font-bold py-4 rounded-full mt-4 disabled:opacity-20 cursor-pointer active:scale-95 transition-all">CONTINUAR</button>
          </div>
        )}

        {/* PASO 3: TRIBUS (Con las 20 tribus) */}
        {step === 3 && (
          <div className="w-full flex flex-col items-center">
            <h2 className="text-3xl font-black mb-2 text-center italic uppercase tracking-tighter text-red-accent">Tu Vibra</h2>
            <p className="text-gray-500 mb-6 text-center text-sm">Elegí tus estilos (Scroll para ver más).</p>
            
            <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto w-full pr-1 custom-scrollbar">
              {TRIBUS_DISPONIBLES.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    const exists = formData.tribus.includes(t);
                    setFormData({...formData, tribus: exists ? formData.tribus.filter(i => i !== t) : [...formData.tribus, t]});
                  }}
                  className={`p-4 rounded-2xl border-2 text-[13px] font-medium transition-all active:scale-95 ${formData.tribus.includes(t) ? "border-red-accent bg-red-accent/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)]" : "border-gray-900 text-gray-500 bg-gray-950"}`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <button onClick={nextStep} disabled={isStep3Disabled} className="w-full bg-white text-black font-bold py-4 rounded-full mt-8 disabled:opacity-20 cursor-pointer shadow-lg active:scale-95 transition-all">CONTINUAR</button>
          </div>
        )}

        {/* PASO 4: VERIFICACIÓN */}
        {step === 4 && (
          <div className="w-full text-center flex flex-col items-center">
            <h2 className="text-3xl font-black mb-2 italic uppercase tracking-tighter underline decoration-red-accent">Verificación</h2>
            <p className="text-gray-500 mb-6 text-sm px-4 leading-tight">Selfie <span className="text-white font-bold">guiñando un ojo y tocándote la nariz</span> para probar que sos real.</p>
            
            {!fotoSubida ? (
              <div className="w-full aspect-square bg-gray-900 rounded-[2.5rem] border-2 border-dashed border-gray-700 flex flex-col items-center justify-center mb-6 relative hover:border-red-accent group transition-colors">
                <div className="bg-gray-800 p-4 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                </div>
                <span className="text-gray-600 font-bold text-xs uppercase tracking-widest">Abrir cámara</span>
                <input type="file" accept="image/*" capture="user" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            ) : (
              <div className="w-full aspect-square bg-red-accent/10 rounded-[2.5rem] border-2 border-red-accent flex flex-col items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                <div className="bg-red-accent text-white p-4 rounded-full mb-4 animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <span className="text-white font-black text-lg italic uppercase">¡Listo!</span>
                <button onClick={() => setFotoSubida(false)} className="mt-4 text-[10px] text-gray-500 underline uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Cambiar imagen</button>
              </div>
            )}

            <button onClick={nextStep} disabled={!fotoSubida} className="w-full bg-red-accent text-white font-bold py-4 rounded-full shadow-[0_0_30px_rgba(139,92,246,0.4)] disabled:opacity-20 cursor-pointer active:scale-95 transition-all">FINALIZAR SOLICITUD</button>
          </div>
        )}

        {/* PASO 5: ÉXITO FINAL */}
        {step === 5 && (
          <div className="w-full text-center flex flex-col items-center py-10">
            <div className="w-24 h-24 bg-gradient-to-tr from-red-accent to-purple-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(139,92,246,0.6)] animate-pulse">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
            </div>
            <h2 className="text-4xl font-black mb-4 italic uppercase tracking-tighter leading-none">Solicitud <br/> Recibida</h2>
            <p className="text-gray-400 mb-12 text-sm px-6 leading-relaxed">Los administradores están verificando tu gesto de forma manual para asegurar la exclusividad de <span className="text-white font-bold">La Red</span>.</p>
            
            <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 mb-10 w-full">
               <p className="text-red-accent text-[11px] font-bold uppercase tracking-widest animate-pulse">Revisión en curso...</p>
            </div>

            <Link href="/" className="w-full">
              <button className="w-full border border-gray-800 text-gray-600 py-4 rounded-full hover:text-white hover:border-white transition-all cursor-pointer font-bold text-sm">VOLVER AL INICIO</button>
            </Link>
          </div>
        )}

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}