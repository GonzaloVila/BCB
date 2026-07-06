# BCB Multielectro

Sitio web de catálogo y consulta de electrodomésticos. Los clientes navegan el catálogo con filtros y consultan disponibilidad directamente por WhatsApp. Incluye un panel de administración para gestionar productos sin intervención técnica.

## Stack

- **Frontend**: React 19 + Vite 6
- **Estilos**: Tailwind CSS v4
- **Routing**: React Router v6
- **Estado global**: Zustand
- **Backend**: Supabase (PostgreSQL + Storage + Auth)
- **Iconos**: Lucide React
- **Notificaciones**: react-hot-toast

---

## Puesta en marcha local

### 1. Clonar e instalar

```bash
git clone <url-del-repo>
cd bcb-multielectro
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env
```

Completá `.env` con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_WHATSAPP_NUMBER=5491100000000
VITE_STORE_NAME=BCB Multielectro
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

---

## Configuración de Supabase

### Crear el proyecto

1. Creá una cuenta en [supabase.com](https://supabase.com) y un nuevo proyecto.
2. Copiá la **Project URL** y la **anon public key** desde *Settings → API*.

### Crear las tablas

1. Abrí el **SQL Editor** en el dashboard de Supabase.
2. Pegá y ejecutá el contenido de [`supabase/schema.sql`](./supabase/schema.sql).
3. Esto crea: `categories`, `products`, `product_images` con sus índices, triggers y políticas RLS. También inserta las categorías iniciales.

### Configurar Storage

1. En Supabase, ir a **Storage → New bucket**.
2. Nombre: `product-images`, marcar como **Public**.
3. En **Policies** del bucket, agregar:
   - `SELECT` para `anon` (lectura pública de imágenes)
   - `INSERT / UPDATE / DELETE` para `authenticated` (solo el admin puede subir/eliminar)

### Crear el usuario administrador

1. Ir a **Authentication → Users → Invite user** (o Add user).
2. Ingresar el email y contraseña del admin.
3. Ese email y contraseña se usan en `/admin/login`.

> **No hay registro público.** Solo el usuario creado manualmente en Supabase puede acceder al panel.

---

## Deploy en Vercel o Netlify

### Vercel

```bash
npm i -g vercel
vercel --prod
```

Agregá las variables de entorno en *Vercel → Settings → Environment Variables*.

### Netlify

```bash
npm run build
# Subí la carpeta dist/ al dashboard de Netlify
# o conectá el repo con deploy automático
```

Agregá las variables de entorno en *Netlify → Site settings → Environment variables*.

---

## Estructura del proyecto

```
src/
├── assets/               Archivos estáticos
├── components/
│   ├── layout/           Header, Footer, WhatsAppButton, Layout
│   ├── products/         ProductCard, ProductGrid, ProductSkeleton
│   ├── filters/          SearchBar, FilterPanel
│   └── admin/            PrivateRoute, ImageUploader, AdminProductForm, AdminProductList
├── pages/
│   ├── HomePage.jsx
│   ├── CatalogPage.jsx
│   ├── ProductDetailPage.jsx
│   └── admin/
│       ├── AdminLoginPage.jsx
│       └── AdminDashboardPage.jsx
├── hooks/
│   ├── useCategories.js
│   ├── useProducts.js    (useProducts, useProduct, useAllBrands)
│   └── useAdmin.js       (useAuth, useProductAdmin, useAdminProducts, useAdminCategories)
├── lib/
│   ├── supabaseClient.js
│   └── constants.js      (helpers: formatPrice, buildWhatsAppUrl, etc.)
├── store/
│   └── useStore.js       Zustand: auth + filtros de catálogo
├── App.jsx               Routing con lazy loading
└── index.css             Tailwind @theme + estilos base
supabase/
└── schema.sql            Script SQL completo
```

---

## Decisiones de arquitectura

| Decisión | Criterio |
|----------|----------|
| **Zustand** para estado global | Simpler que Redux, más explícito que Context para múltiples slices de estado |
| **CSS variables via `@theme`** (Tailwind v4) | Permite usar `bg-primary`, `text-accent`, etc. sin configuración extra |
| **Galería de imágenes custom** | Evita la dependencia de react-image-gallery y permite ajustar el diseño exacto |
| **Lazy loading por rutas** | Reduce el bundle inicial; las páginas admin solo se cargan si el usuario navega allí |
| **RLS en Supabase** | La seguridad se aplica a nivel de base de datos, no solo en el frontend |
| **`product_images` tabla separada** | Permite múltiples imágenes por producto con orden y portada sin arrays en JSON |

---

## URLs de la app

| Ruta | Descripción |
|------|-------------|
| `/` | Página de inicio con hero, categorías y destacados |
| `/catalogo` | Catálogo completo con filtros |
| `/producto/:id` | Detalle de producto |
| `/admin/login` | Login del administrador |
| `/admin/dashboard` | Panel de gestión de productos y categorías |
