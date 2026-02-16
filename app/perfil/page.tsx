"use client";
import React, { useState, useRef } from "react";
import { MessageCircle, Share2, MapPin, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";

// Catálogo de tribus
const TRIBUS_LIST = [
  "Metaleros", "Techneros", "Gym Rats", "Góticas/os", "Alt/Indie", "Sport", "Daddies/Mommies", "Elegante",
  "Skaters", "Hip-hop/Rap", "K-popers", "Gamers", "Artistas", "Hippie-Chic", "Rave Culture", "Aesthetic",
  "Trapperos", "Otakus", "Old School", "Fit-Style"
];

// Catálogo de departamentos y barrios (UY)
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

interface ProfileData {
  name: string;
  barrio: string;
  depto: string;
  bio: string;
  tribes: string[];
  avatar: string;
}

const UserProfile: React.FC = () => {
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData>({
    name: "TU NOMBRE",
    barrio: "Pocitos",
    depto: "Montevideo",
    bio: "Digital Nomad & Night Owl 🌙. Buscando conexiones reales sin drama.",
    tribes: ["Alt/Indie", "Gamers", "Sport"],
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<ProfileData>(profile);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleOpenEdit = () => {
    setEditForm(profile);
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (!editForm.tribes.length) {
      alert("Selecciona al menos 1 tribu (máximo 5).");
      return;
    }
    if (!editForm.depto || !editForm.barrio) {
      alert("Selecciona un departamento y barrio válidos.");
      return;
    }
    setProfile(editForm);
    setIsEditModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDeptoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDepto = e.target.value;
    const firstBarrio = GEOGRAFIA_UY[newDepto]?.[0] ?? "";
    setEditForm(prev => ({ ...prev, depto: newDepto, barrio: firstBarrio }));
  };

  const handleBarrioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditForm(prev => ({ ...prev, barrio: e.target.value }));
  };

  const toggleTribu = (tribu: string) => {
    setEditForm(prev => {
      const already = prev.tribes.includes(tribu);
      if (already) {
        const updated = prev.tribes.filter(t => t !== tribu);
        return { ...prev, tribes: updated.length ? updated : [tribu] };
      }
      if (prev.tribes.length >= 5) return prev;
      return { ...prev, tribes: [...prev.tribes, tribu] };
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setEditForm(prev => ({ ...prev, avatar: url }));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de ${profile.name}`,
          text: "Echa un vistazo a mi perfil.",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error al compartir:", error);
      }
    } else {
      alert("Link copiado al portapapeles (Simulación)");
    }
  };

  return (
    <div className="flex justify-center min-h-screen text-slate-200 font-sans px-4 pb-24">
      <div className="w-full max-w-md bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl relative flex flex-col min-h-screen rounded-3xl">
        <div className="p-6 pb-4">
          <div className="flex flex-col items-center">
            <div className="relative mb-4 group">
              <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-rose-500 to-indigo-600 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-[#0f172a]"
                />
              </div>
            </div>

            <div className="text-center w-full">
              <h1 className="text-2xl font-bold italic tracking-wider text-white">{profile.name}</h1>
              <div className="flex items-center justify-center gap-1 text-sm text-gray-400 mt-1">
                <MapPin size={14} />
                <span>{profile.barrio}, {profile.depto}</span>
              </div>
              <p className="text-gray-300 mt-3 text-sm leading-relaxed px-4">{profile.bio}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4 px-2">
                {profile.tribes.map((tribe, index) => (
                  <span key={index} className="bg-slate-800 text-indigo-300 text-xs px-3 py-1 rounded-full border border-slate-700">
                    {tribe}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3 w-full mt-6 px-2">
              <button
                onClick={handleOpenEdit}
                className="flex-1 bg-[#1e293b] hover:bg-[#334155] text-white py-2.5 rounded-lg text-sm font-semibold transition border border-gray-700 flex items-center justify-center gap-2"
              >
                <Edit3 size={16} /> EDITAR PERFIL
              </button>
              <button
                onClick={handleShare}
                className="flex-1 border border-gray-600 hover:border-gray-400 text-white py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
              >
                <Share2 size={16} /> COMPARTIR
              </button>
            </div>
          </div>
        </div>

  <div className="pb-28" />
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#1e293b] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-700 animate-in fade-in zoom-in duration-200">
              <h2 className="text-xl font-bold text-white mb-4">Editar Perfil</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Foto de perfil</label>
                  <div className="flex items-center gap-3 mt-2">
                    <img
                      src={editForm.avatar}
                      alt="preview avatar"
                      className="w-14 h-14 rounded-full object-cover border border-gray-700"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="px-3 py-2 rounded-lg bg-[#0f172a] border border-gray-700 text-sm text-white hover:border-indigo-400"
                      >
                        Cambiar foto
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full bg-[#0f172a] text-white p-3 rounded-lg border border-gray-700 focus:border-indigo-500 outline-none mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Depto</label>
                    <select
                      name="depto"
                      value={editForm.depto}
                      onChange={handleDeptoChange}
                      className="w-full bg-[#0f172a] text-white p-3 rounded-lg border border-gray-700 outline-none mt-1"
                    >
                      {Object.keys(GEOGRAFIA_UY).map(depto => (
                        <option key={depto} value={depto}>{depto}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Barrio</label>
                    <select
                      name="barrio"
                      value={editForm.barrio}
                      onChange={handleBarrioChange}
                      className="w-full bg-[#0f172a] text-white p-3 rounded-lg border border-gray-700 outline-none mt-1"
                    >
                      {(GEOGRAFIA_UY[editForm.depto] ?? []).map(barrio => (
                        <option key={barrio} value={barrio}>{barrio}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Descripción</label>
                  <textarea
                    rows={3}
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    className="w-full bg-[#0f172a] text-white p-3 rounded-lg border border-gray-700 outline-none resize-none mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Tribus (elige 1 a 5)</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {TRIBUS_LIST.map(tribu => {
                      const active = editForm.tribes.includes(tribu);
                      const disabled = !active && editForm.tribes.length >= 5;
                      return (
                        <button
                          type="button"
                          key={tribu}
                          onClick={() => !disabled && toggleTribu(tribu)}
                          className={`px-3 py-1 rounded-full border text-sm transition ${active ? "bg-indigo-600 border-indigo-400 text-white" : "bg-[#0f172a] border-gray-700 text-gray-300 hover:border-indigo-400"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {tribu}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">Selecciona al menos 1 y máximo 5.</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 text-gray-400 font-bold hover:text-white transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-indigo-600 py-3 rounded-lg text-white font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserProfile;
