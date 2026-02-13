# 🕸️ LA RED - Conexiones Exclusivas (Uruguay)

**La Red** es una plataforma de networking y conexiones sociales diseñada específicamente para el público uruguayo. Se basa en una estética nocturna, minimalista y de alta gama, con un sistema de verificación estricto mediante gestos.

## 🚀 Estado del Proyecto
Actualmente, el proyecto cuenta con el **Frontend 100% funcional** (maqueta interactiva) desarrollado en **Next.js 14**. Falta la integración de servicios de Backend para persistencia de datos y autenticación real.

---

## 🛠️ Tech Stack
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Iconografía:** Lucide React & Custom SVGs
- **Despliegue recomendado:** Vercel

---

## 📂 Estructura de Rutas (Frontend)
| Ruta | Descripción |
| :--- | :--- |
| `/` | Landing page y acceso (Login/Registro). |
| `/dashboard` | Feed principal con sistema de Likes (Corazones) y Stories. |
| `/mensajes` | Inbox con lista de chats y matches nuevos. |
| `/mensajes/[id]` | Chat individual (Ruta dinámica). |
| `/perfil` | Gestión de usuario, edición de tribus y ubicación (Uruguay). |

---

## ⚙️ Especificaciones para el Backend

### 1. Modelo de Usuario Sugerido
```json
{
  "id": "uuid",
  "nombre": "string",
  "email": "string",
  "depto": "string (Uruguay)",
  "barrio": "string",
  "tribus": ["tribu1", "tribu2"], // Mínimo 1, máximo sin límite
  "foto_perfil": "url",
  "verificado": "boolean",
  "gesto_verificacion_url": "url"
}