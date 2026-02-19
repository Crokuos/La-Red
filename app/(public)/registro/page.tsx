"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Application,
  createApplication,
  generateVerificationCode,
} from "../../_lib/admissions";

const BARRIOS_POR_DEPTO: Record<string, string[]> = {
  Montevideo: [
    "Pocitos",
    "Punta Carretas",
    "Cordón",
    "Centro",
    "Ciudad Vieja",
    "Carrasco",
    "Carrasco Norte",
    "Malvín",
    "Malvín Norte",
    "Buceo",
    "Parque Rodó",
    "Palermo",
    "Aguada",
    "Prado",
    "Tres Cruces",
    "La Blanqueada",
    "Unión",
    "Cerro",
    "Paso de la Arena",
    "Sayago",
    "Colón",
    "Peñarol",
    "Manga",
    "Casavalle",
    "Piedras Blancas",
    "Maroñas",
    "Parque Batlle",
    "La Teja",
    "Punta de Rieles",
    "Melilla",
  ],
  Canelones: [
    "Ciudad de la Costa",
    "Paso Carrasco",
    "Las Piedras",
    "Pando",
    "Atlántida",
    "Canelones (Ciudad)",
    "Barros Blancos",
    "La Paz",
    "Santa Lucía",
    "Progreso",
    "Salinas",
    "Parque del Plata",
    "Sauce",
    "Tala",
    "San Jacinto",
    "Empalme Olmos",
    "Neptunia",
    "Pinamar",
    "Marindia",
    "Las Toscas",
    "Costa Azul",
  ],
  Maldonado: [
    "Punta del Este",
    "Maldonado (Ciudad)",
    "San Carlos",
    "Piriápolis",
    "Pan de Azúcar",
    "Aiguá",
    "Punta Ballena",
    "La Barra",
    "José Ignacio",
    "Solís",
    "Portezuelo",
    "Manantiales",
  ],
  Colonia: [
    "Colonia del Sacramento",
    "Carmelo",
    "Nueva Helvecia",
    "Juan Lacaze",
    "Tarariras",
    "Rosario",
    "Nueva Palmira",
    "Colonia Valdense",
    "Ombúes de Lavalle",
    "Florencio Sánchez",
  ],
  Salto: ["Salto (Ciudad)", "Termas del Daymán", "Termas del Arapey", "Constitución", "Belén", "San Antonio"],
  Paysandú: ["Paysandú (Ciudad)", "Guichón", "Quebracho", "Lorenzo Geyres", "Piedras Coloradas"],
  "San José": ["San José de Mayo", "Ciudad del Plata", "Libertad", "Rodríguez", "Ecilda Paullier", "Puntas de Valdez"],
  Rivera: ["Rivera (Ciudad)", "Tranqueras", "Vichadero", "Minas de Corrales"],
  Tacuarembó: ["Tacuarembó (Ciudad)", "Paso de los Toros", "San Gregorio de Polanco", "Ansina"],
  Artigas: ["Artigas (Ciudad)", "Bella Unión", "Tomas Gomensoro", "Baltasar Brum"],
  Soriano: ["Mercedes", "Dolores", "Cardona", "Palmitas", "José Enrique Rodó"],
  Rocha: ["Rocha (Ciudad)", "Chuy", "Castillos", "La Paloma", "Punta del Diablo", "Lascano", "Cabo Polonio", "La Pedrera"],
  "Cerro Largo": ["Melo", "Río Branco", "Fraile Muerto", "Isidoro Noblía", "Aceguá"],
  Durazno: ["Durazno (Ciudad)", "Sarandí del Yí", "Villa del Carmen", "Santa Bernardina"],
  Florida: ["Florida (Ciudad)", "Sarandí Grande", "Casupá", "Fray Marcos", "25 de Mayo"],
  Lavalleja: ["Minas", "José Pedro Varela", "Solís de Mataojo", "José Batlle y Ordóñez", "Mariscala"],
  "Río Negro": ["Fray Bentos", "Young", "Nuevo Berlín", "San Javier"],
  Flores: ["Trinidad", "Ismael Cortinas"],
  "Treinta y Tres": ["Treinta y Tres (Ciudad)", "Vergara", "Santa Clara de Olimar", "Cerro Chato"],
};

const LOOKING_FOR = [
  "Conexiones discretas",
  "Experiencias selectivas",
  "Conocer personas afines a mi tribu",
  "Explorar sin etiquetas",
];

const VALUES = [
  "Discreción",
  "Honestidad directa",
  "Buena presencia",
  "Seguridad",
  "Afinidad mental",
  "Claridad en las intenciones",
];

const SOCIAL_STYLES = [
  "Reservado/a y observador/a",
  "Selectivo/a pero sociable",
  "Seguro/a y dominante",
  "Espontáneo/a",
  "Prefiero mantener perfil bajo",
];

type FormState = {
  email: string;
  age_range: string;
  gender: "hombre" | "mujer" | "";
  department: string;
  zone: string;
  hide_from_same_zone: boolean;
  looking_for: string;
  values: string[];
  social_style: string;
  description: string;
  commitments: {
    confidentiality: boolean;
    respect: boolean;
    honesty: boolean;
  };
  selfie_url: string;
  verification_code: string;
};

const initialState: FormState = {
  email: "",
  age_range: "",
  gender: "",
  department: "",
  zone: "",
  hide_from_same_zone: false,
  looking_for: "",
  values: [],
  social_style: "",
  description: "",
  commitments: {
    confidentiality: false,
    respect: false,
    honesty: false,
  },
  selfie_url: "",
  verification_code: "",
};

const ProgressDots = ({ step }: { step: number }) => (
  <div className="w-full max-w-md flex gap-2 mb-10 mt-6">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
          step >= i
            ? "bg-rose-500 shadow-[0_0_14px_rgba(244,63,94,0.7)]"
            : "bg-gray-800"
        }`}
      />
    ))}
  </div>
);

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 shadow-[0_15px_50px_rgba(0,0,0,0.4)]">
    <p className="text-sm text-gray-400 mb-3 uppercase tracking-[0.18em]">{title}</p>
    {children}
  </div>
);

export default function Registro() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedApplication, setSubmittedApplication] = useState<Application | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [form, setForm] = useState<FormState>(initialState);

  const barrios = useMemo(() => (form.department ? BARRIOS_POR_DEPTO[form.department] || [] : []), [form.department]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, zone: "" }));
  }, [form.department]);

  useEffect(() => {
    if (step === 4 && !form.verification_code) {
      setForm((prev) => ({ ...prev, verification_code: generateVerificationCode() }));
    }
  }, [step, form.verification_code]);

  const handleValues = (value: string) => {
    setForm((prev) => {
      const exists = prev.values.includes(value);
      if (exists) return { ...prev, values: prev.values.filter((v) => v !== value) };
      if (prev.values.length >= 2) return prev;
      return { ...prev, values: [...prev.values, value] };
    });
  };

  const handleSelfie = (file: File) => {
    const isImage = file.type
      ? file.type.startsWith("image/")
      : /\.(jpe?g|png)$/i.test(file.name);
    if (!isImage) {
      setError("Solo se permiten imágenes (jpg o png)");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === "string" ? reader.result : "";
      setPreview(url);
      setForm((prev) => ({ ...prev, selfie_url: url }));
    };
    reader.readAsDataURL(file);
  };

  const isStep1Valid =
    form.email.includes("@") &&
    !!form.age_range &&
    !!form.gender &&
    !!form.department &&
    !!form.zone;

  const isStep2Valid =
    !!form.looking_for &&
    form.values.length > 0 &&
    form.values.length <= 2 &&
    !!form.social_style;

  const isStep3Valid =
    form.commitments.confidentiality &&
    form.commitments.respect &&
    form.commitments.honesty;

  const isStep4Valid =
    form.description.trim().length > 0 &&
    form.description.length <= 120 &&
    !!form.selfie_url;

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const resetForm = () => {
    setForm(initialState);
    setPreview("");
    setError(null);
    setStep(1);
  };

  const submit = async () => {
    if (!isStep4Valid) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload: Parameters<typeof createApplication>[0] = {
        email: form.email.trim(),
        age_range: form.age_range,
        gender: form.gender as "hombre" | "mujer",
        department: form.department,
        zone: form.zone,
        hide_from_same_zone: form.hide_from_same_zone,
        looking_for: form.looking_for,
        values: form.values,
        social_style: form.social_style,
        description: form.description.trim(),
        verification_code: form.verification_code,
        selfie_url: form.selfie_url,
      };

      const created = await createApplication(payload);
      setSubmittedApplication(created);
      setStep(5);
    } catch (err: any) {
      setError(err?.message || "No se pudo enviar la solicitud");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedApplication) {
    return (
      <main className="min-h-screen bg-[#04060e] text-white flex flex-col items-center p-6 overflow-x-hidden">
        <div className="w-full max-w-md text-center space-y-8 mt-16">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center shadow-[0_0_60px_rgba(244,63,94,0.35)] animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mb-3">Solicitud recibida</p>
            <h1 className="text-4xl font-black italic leading-tight">
              El acceso es limitado y cada perfil es evaluado cuidadosamente.
            </h1>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-3 text-left">
            <p className="text-sm text-gray-300">
              Código verificado: <span className="font-semibold text-white">{submittedApplication.verification_code}</span>
            </p>
            <p className="text-sm text-gray-300">
              Te enviaremos un token de activación si tu perfil es aprobado.
            </p>
            <p className="text-xs text-gray-500">Email: {submittedApplication.email}</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/">
              <button className="w-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold py-4 rounded-full uppercase tracking-[0.2em]">
                Volver al inicio
              </button>
            </Link>
            <button
              className="text-gray-500 text-sm underline hover:text-white"
              onClick={resetForm}
            >
              Enviar otra solicitud
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#04060e] text-white flex flex-col items-center p-6 overflow-x-hidden">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6 mt-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500">Admisión</p>
            <h1 className="text-3xl font-black italic tracking-tight">Fase 1 — Solicitud</h1>
          </div>
          <Link href="/" className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-white">Salir</Link>
        </div>

        <ProgressDots step={step} />

        {error && (
          <div className="mb-4 text-sm text-red-200 bg-red-500/10 border border-red-500/30 rounded-2xl p-3">
            {error}
          </div>
        )}

        {/* Paso 1 */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <SectionCard title="Datos básicos">
              <div className="space-y-4">
                <input
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm placeholder-gray-500 focus:border-rose-500 outline-none"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {["18-22", "23-27", "28-35", "36+"].map((range) => (
                    <label key={range} className={`flex items-center gap-2 p-3 rounded-2xl border cursor-pointer transition-colors ${
                      form.age_range === range ? "border-rose-500 bg-rose-500/10" : "border-white/10 bg-black/30"
                    }`}>
                      <input
                        type="radio"
                        name="age_range"
                        checked={form.age_range === range}
                        onChange={() => setForm({ ...form, age_range: range })}
                      />
                      <span>{range}</span>
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {["hombre", "mujer"].map((g) => (
                    <label key={g} className={`flex items-center gap-2 p-3 rounded-2xl border cursor-pointer transition-colors ${
                      form.gender === g ? "border-rose-500 bg-rose-500/10" : "border-white/10 bg-black/30"
                    }`}>
                      <input
                        type="radio"
                        name="gender"
                        checked={form.gender === g}
                        onChange={() => setForm({ ...form, gender: g as "hombre" | "mujer" })}
                      />
                      <span className="capitalize">{g}</span>
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <select
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 focus:border-rose-500 outline-none"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                  >
                    <option value="">Departamento</option>
                    {Object.keys(BARRIOS_POR_DEPTO).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <select
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 focus:border-rose-500 outline-none disabled:opacity-40"
                    value={form.zone}
                    onChange={(e) => setForm({ ...form, zone: e.target.value })}
                    disabled={!form.department}
                  >
                    <option value="">Barrio / Localidad</option>
                    {barrios.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center gap-3 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={form.hide_from_same_zone}
                      onChange={(e) => setForm({ ...form, hide_from_same_zone: e.target.checked })}
                    />
                    <span>Quiero ocultar mi perfil a las personas de mi barrio</span>
                  </label>
                </div>
              </div>
            </SectionCard>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">Fase 1/2</span>
              <button
                disabled={!isStep1Valid}
                onClick={nextStep}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 text-black font-bold uppercase tracking-[0.2em] disabled:opacity-30"
              >
                Seguir
              </button>
            </div>
          </div>
        )}

        {/* Paso 2 */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <SectionCard title="Perfil">
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-300 mb-2 font-semibold">¿Qué estás buscando?</p>
                  <div className="space-y-2">
                    {LOOKING_FOR.map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-colors ${
                          form.looking_for === opt ? "border-rose-500 bg-rose-500/10" : "border-white/10 bg-black/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="looking_for"
                          checked={form.looking_for === opt}
                          onChange={() => setForm({ ...form, looking_for: opt })}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-gray-300 mb-2 font-semibold">¿Qué valorás más? (máx. 2)</p>
                  <div className="grid grid-cols-1 gap-2">
                    {VALUES.map((opt) => {
                      const checked = form.values.includes(opt);
                      const limitReached = form.values.length >= 2 && !checked;
                      return (
                        <label
                          key={opt}
                          className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-colors ${
                            checked ? "border-rose-500 bg-rose-500/10" : "border-white/10 bg-black/30"
                          } ${limitReached ? "opacity-50" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={limitReached}
                            onChange={() => handleValues(opt)}
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-gray-300 mb-2 font-semibold">En entornos sociales sos más bien...</p>
                  <div className="space-y-2">
                    {SOCIAL_STYLES.map((opt) => (
                      <label
                        key={opt}
                        className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-colors ${
                          form.social_style === opt ? "border-rose-500 bg-rose-500/10" : "border-white/10 bg-black/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="social_style"
                          checked={form.social_style === opt}
                          onChange={() => setForm({ ...form, social_style: opt })}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
            <div className="flex justify-between items-center">
              <button onClick={prevStep} className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-white">
                Volver
              </button>
              <button
                disabled={!isStep2Valid}
                onClick={nextStep}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 text-black font-bold uppercase tracking-[0.2em] disabled:opacity-30"
              >
                Seguir
              </button>
            </div>
          </div>
        )}

        {/* Paso 3 */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <SectionCard title="Compromiso">
              <div className="space-y-3 text-sm text-gray-200">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.commitments.confidentiality}
                    onChange={(e) => setForm({ ...form, commitments: { ...form.commitments, confidentiality: e.target.checked } })}
                  />
                  <span>Acepto respetar la confidencialidad de los miembros</span>
                </label>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.commitments.respect}
                    onChange={(e) => setForm({ ...form, commitments: { ...form.commitments, respect: e.target.checked } })}
                  />
                  <span>Entiendo que cualquier falta de respeto implica expulsión</span>
                </label>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.commitments.honesty}
                    onChange={(e) => setForm({ ...form, commitments: { ...form.commitments, honesty: e.target.checked } })}
                  />
                  <span>Me comprometo a mantener interacciones claras y honestas</span>
                </label>
              </div>
            </SectionCard>
            <div className="flex justify-between items-center">
              <button onClick={prevStep} className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-white">
                Volver
              </button>
              <button
                disabled={!isStep3Valid}
                onClick={nextStep}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 text-black font-bold uppercase tracking-[0.2em] disabled:opacity-30"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Paso 4 */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <SectionCard title="Presentación y verificación">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span>Descripción corta (máx. 120)</span>
                    <span className={form.description.length > 120 ? "text-red-300" : ""}>{form.description.length}/120</span>
                  </div>
                  <textarea
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm placeholder-gray-500 focus:border-rose-500 outline-none resize-none min-h-[90px]"
                    maxLength={140}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value.slice(0, 120) })}
                    placeholder="Quién sos y qué te mueve."
                  />
                </div>

                <div className="bg-black/60 border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Código para tu selfie</p>
                    <p className="text-3xl font-black tracking-[0.12em] text-white">{form.verification_code}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">5-6 caracteres</span>
                </div>

                <div className="text-sm text-gray-300 space-y-2">
                  <p className="font-semibold">Subí una selfie sosteniendo un papel donde se vea claramente este código.</p>
                  <p className="text-gray-500">Formatos permitidos: jpg o png. No se enviará si no subís la imagen.</p>
                </div>

                <label className="block w-full">
                  <div className={`w-full min-h-[220px] rounded-3xl border-2 border-dashed ${
                    form.selfie_url ? "border-rose-500/60 bg-rose-500/5" : "border-white/10 bg-black/40"
                  } flex items-center justify-center overflow-hidden relative`}> 
                    {preview ? (
                      <img src={preview} alt="Selfie" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-6 text-gray-400">
                        <p className="text-lg font-bold mb-2">Cargar selfie</p>
                        <p className="text-xs text-gray-500">Tocá para abrir cámara o galería</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      capture="user"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleSelfie(file);
                      }}
                    />
                  </div>
                </label>
              </div>
            </SectionCard>
            <div className="flex justify-between items-center">
              <button onClick={prevStep} className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-white">
                Volver
              </button>
              <button
                disabled={!isStep4Valid || submitting}
                onClick={submit}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 text-black font-bold uppercase tracking-[0.2em] disabled:opacity-30"
              >
                {submitting ? "Enviando..." : "Solicitar acceso"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
