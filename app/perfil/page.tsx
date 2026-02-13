"use client";
import { useState, useRef } from "react";
import Link from "next/link";

// BASE DE DATOS GEOGRÁFICA DE URUGUAY
const GEOGRAFIA_UY: Record<string, string[]> = {
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

// LAS 20 TRIBUS URBANAS
const TRIBUS_DISPONIBLES = [
  "Metaleros", "Techneros", "Gym Rats", "Góticas/os", "Alt/Indie", "Sport", "Daddies/Mommies", "Elegante", 
  "Skaters", "Hip-hop/Rap", "K-popers", "Gamers", "Artistas", "Hippie-Chic", "Rave Culture", "Aesthetic", 
  "Trapperos", "Otakus", "Viejas Escuelas", "Fit-Style"
];

export default function Perfil() {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [user, setUser] = useState({
    nombre: "Juan Pérez",
    depto: "Montevideo",
    barrio: "Pocitos",
    tribus: ["Metaleros", "Techneros", "Aesthetic"],
    fotoGesto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&q=80"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "depto") {
      // Si cambia el depto, reseteamos el barrio al primero de la nueva lista
      setUser(prev => ({ ...prev, depto: value, barrio: GEOGRAFIA_UY[value][0] }));
    } else {
      setUser(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUser(prev => ({ ...prev, fotoGesto: URL.createObjectURL(file) }));
  };

  const toggleTribu = (tribu: string) => {
    if (!isEditing) return;
    setUser(prev => {
      if (prev.tribus.includes(tribu)) {
        return prev.tribus.length > 1 
          ? { ...prev, tribus: prev.tribus.filter(t => t !== tribu) }
          : prev;
      }
      return { ...prev, tribus: [...prev.tribus, tribu] };
    });
  };

  const guardarCambios = () => {
    if (!user.nombre.trim()) return alert("El nombre es obligatorio");
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-black text-white pb-32 max-w-md mx-auto border-x border-gray-900 relative">
      
      {/* HEADER */}
      <header className="p-6 flex justify-between items-center border-b border-gray-900 sticky top-0 bg-black/95 backdrop-blur-md z-50">
        <Link href="/dashboard" className="text-gray-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <h1 className="text-lg font-black uppercase tracking-[0.3em] italic">Mi Perfil</h1>
        <button 
          onClick={isEditing ? guardarCambios : () => setIsEditing(true)}
          className={`text-[10px] font-black px-4 py-1.5 rounded-full border transition-all ${isEditing ? "bg-green-600 border-green-600 shadow-[0_0_15px_green]" : "bg-red-accent/10 border-red-accent/20 text-red-accent"}`}
        >
          {isEditing ? "CONFIRMAR" : "EDITAR"}
        </button>
      </header>

      <div className="p-8 flex flex-col items-center">
        
        {/* FOTO */}
        <div className="relative mb-6 cursor-pointer" onClick={() => isEditing && fileInputRef.current?.click()}>
            <div className={`w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 p-1 transition-all ${isEditing ? "border-green-500 scale-105" : "border-red-accent shadow-[0_0_20px_rgba(255,0,0,0.2)]"}`}>
                <img src={user.fotoGesto} className="w-full h-full object-cover rounded-[2.2rem]" alt="" />
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>

        {/* NOMBRE */}
        {isEditing ? (
          <input name="nombre" value={user.nombre} onChange={handleInputChange} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-xl font-black italic uppercase text-center w-full mb-8 focus:border-green-500 outline-none" />
        ) : (
          <h2 className="text-2xl font-black italic uppercase mb-8">{user.nombre}</h2>
        )}

        {/* UBICACIÓN */}
        <div className="w-full space-y-4">
            <div className={`p-5 rounded-[2.5rem] border ${isEditing ? "border-green-500/50 bg-gray-900" : "border-gray-800 bg-gray-900/40"}`}>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3">Ubicación Actual</p>
                {isEditing ? (
                  <div className="space-y-3">
                    <select name="depto" value={user.depto} onChange={handleInputChange} className="w-full bg-black border border-gray-700 rounded-xl p-3 text-xs font-bold text-white uppercase tracking-tighter">
                      {Object.keys(GEOGRAFIA_UY).sort().map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select name="barrio" value={user.barrio} onChange={handleInputChange} className="w-full bg-black border border-gray-700 rounded-xl p-3 text-xs font-bold text-white uppercase tracking-tighter">
                      {GEOGRAFIA_UY[user.depto].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                ) : (
                  <p className="text-white font-bold italic uppercase tracking-tighter">{user.barrio}, {user.depto}</p>
                )}
            </div>

            {/* TRIBUS SELECCIONABLES */}
            <div className={`p-5 rounded-[2.5rem] border ${isEditing ? "border-green-500/50 bg-gray-900" : "border-gray-800 bg-gray-900/40"}`}>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Mis Tribus</p>
                  {isEditing && <span className="text-[8px] text-green-500 font-black uppercase tracking-widest">Mínimo 1</span>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {(isEditing ? TRIBUS_DISPONIBLES : user.tribus).map(t => {
                      const activa = user.tribus.includes(t);
                      return (
                        <button 
                          key={t}
                          onClick={() => toggleTribu(t)}
                          className={`text-[8px] px-3 py-2 rounded-xl font-black uppercase transition-all border ${
                            activa ? "bg-red-accent text-white border-red-accent" : "bg-white/5 text-gray-600 border-white/5"
                          }`}
                        >
                          {t} {isEditing && activa && "✕"}
                        </button>
                      );
                    })}
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}