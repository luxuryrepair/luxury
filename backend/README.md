# 🐍 Backend Admin - TeleRayo Electrónica

Panel de administración desarrollado con **Flask** para gestionar el contenido del sitio web desde una interfaz web amigable.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación Local](#instalación-local)
- [Configuración](#configuración)
- [Uso](#uso)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)

---

## ✨ Características

### 🔐 Autenticación
- Sistema de login seguro con Flask-Login
- Sesiones protegidas con cookies HTTP-only
- Gestión de usuarios administradores

### 📊 Dashboard
- Estadísticas en tiempo real
- Vista general del contenido
- Accesos rápidos a funciones principales

### 🛠️ Gestión de Servicios (CRUD Completo)
- ✅ Crear nuevos servicios
- ✅ Editar servicios existentes
- ✅ Eliminar servicios
- ✅ Activar/desactivar servicios
- ✅ Marcar servicios como destacados
- ✅ Ordenar servicios por display_order
- ✅ Generación automática de slugs
- ✅ Preview en tiempo real
- ✅ Editor de contenido largo (600-1000 palabras)

### 🌟 Gestión de Reviews
- Ver todas las reseñas
- Eliminar reviews inapropiadas
- Vista de rating con estrellas

### 🔗 Gestión de Redes Sociales
- Administrar enlaces de redes sociales
- Activar/desactivar enlaces
- Cambiar orden de visualización

### 🖼️ Gestión de Imágenes
- Upload de imágenes a Supabase Storage
- Optimización automática (resize + compresión)
- Generación de URLs públicas
- Soporte para JPG, PNG, GIF, WEBP

---

## 🛠️ Tecnologías

- **Flask 3.0** - Framework web
- **Flask-Login** - Autenticación
- **Flask-CORS** - Manejo de CORS
- **Supabase** - Base de datos y storage
- **Pillow** - Procesamiento de imágenes
- **WTForms** - Validación de formularios
- **python-slugify** - Generación de slugs
- **Bootstrap 5** - UI Framework
- **Jinja2** - Template engine

---

## 📦 Requisitos Previos

- **Python 3.9+**
- **pip** (gestor de paquetes)
- **Cuenta en Supabase** (para base de datos y storage)
- **Cuenta en Vercel** (para deployment)

---

## 🚀 Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/getafeelectronic/miserviciotecnico.git
cd miserviciotecnico
git checkout feature/backend-admin
```

### 2. Crear entorno virtual

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias

```bash
cd backend
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
# Obtener las credenciales de Supabase Dashboard
```

### 5. Ejecutar servidor de desarrollo

```bash
# Desde la carpeta backend
python api/index.py
```

El servidor estará disponible en: **http://localhost:5000**

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/`:

```env
# Flask Configuration
SECRET_KEY=tu_clave_secreta_super_segura_aqui
FLASK_ENV=development

# Supabase Configuration
SUPABASE_URL=https://lysejfhxackcmoksclvm.supabase.co
SUPABASE_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_KEY=tu_service_role_key_aqui

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu_password_seguro
```

### Obtener Credenciales de Supabase

1. Ir a **Supabase Dashboard** → Tu Proyecto
2. **Settings** → **API**
3. Copiar:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_KEY`
   - **service_role** → `SUPABASE_SERVICE_KEY` (⚠️ NUNCA exponer públicamente)

### Configurar Supabase Storage

1. En Supabase Dashboard → **Storage**
2. Crear bucket llamado **`images`**
3. Configurar como **público**
4. Políticas de acceso:

```sql
-- Permitir lectura pública
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Permitir upload autenticado (desde backend)
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images');
```

---

## 📖 Uso

### Acceder al Panel

1. Navegar a: **http://localhost:5000**
2. Login con las credenciales configuradas en `.env`
3. Navegar por las diferentes secciones

### Crear un Nuevo Servicio

1. **Dashboard** → **Servicios** → **Nuevo Servicio**
2. Llenar el formulario:
   - **Título**: Nombre del servicio
   - **Descripción corta**: 150 caracteres max
   - **Contenido completo**: 600-1000 palabras
   - **Icono**: Nombre de Lucide Icon
   - **Orden**: Posición en la lista
   - **Destacado**: ✓ para mostrar en Home/Footer
   - **Activo**: ✓ para publicar
3. **Crear Servicio**

El slug se genera automáticamente a partir del título.

### Formatos de Contenido

En el campo de **Contenido Completo**, puedes usar:

- **Párrafos**: Doble salto de línea (`\n\n`)
- **Subtítulos**: Texto entre `**asteriscos**`

Ejemplo:
```
Este es el primer párrafo con información general.

**Características Principales**

Este es el segundo párrafo con las características.

**Beneficios**

Otro párrafo con los beneficios del servicio.
```

### Subir Imágenes

1. **Dashboard** → **Imágenes**
2. **Seleccionar archivo** (JPG, PNG, GIF, WEBP)
3. **Subir**
4. **Copiar URL** generada
5. Usar la URL en el contenido de servicios

---

## 🚀 Despliegue en Vercel

### Opción 1: Deploy desde GitHub (Recomendado)

1. **Push del código a GitHub**:
```bash
git add .
git commit -m "feat: backend admin panel completo"
git push origin feature/backend-admin
```

2. **Conectar con Vercel**:
   - Ir a [Vercel Dashboard](https://vercel.com)
   - **New Project** → Importar desde GitHub
   - Seleccionar repositorio `miserviciotecnico`
   - Configurar:
     - **Framework Preset**: Other
     - **Root Directory**: `.` (raíz)
     - **Build Command**: (dejar vacío)
     - **Output Directory**: (dejar vacío)
   
3. **Configurar Variables de Entorno** en Vercel:
   - **Settings** → **Environment Variables**
   - Agregar todas las variables del `.env`:
     ```
     SECRET_KEY=...
     SUPABASE_URL=...
     SUPABASE_KEY=...
     SUPABASE_SERVICE_KEY=...
     ADMIN_USERNAME=...
     ADMIN_PASSWORD=...
     ```

4. **Deploy**
   - Vercel detectará automáticamente el `vercel.json`
   - El deploy se realizará automáticamente

### Opción 2: Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy a producción
vercel --prod
```

### URL Final

Tu backend estará disponible en:
```
https://tu-proyecto.vercel.app/
https://tu-proyecto.vercel.app/dashboard
```

---

## 📁 Estructura del Proyecto

```
backend/
├── api/
│   └── index.py              # Entry point para Vercel
├── app/
│   ├── __init__.py           # Factory de la app Flask
│   ├── config.py             # Configuración
│   ├── auth.py               # Sistema de autenticación
│   ├── supabase_client.py    # Cliente de Supabase
│   ├── routes/               # Blueprints
│   │   ├── __init__.py
│   │   ├── auth.py           # Rutas de login/logout
│   │   ├── dashboard.py      # Dashboard principal
│   │   ├── services.py       # CRUD de servicios
│   │   ├── reviews.py        # Gestión de reviews
│   │   ├── social_links.py   # Gestión de redes sociales
│   │   └── images.py         # Upload de imágenes
│   └── templates/            # Templates Jinja2
│       ├── base.html         # Template base
│       ├── auth/
│       │   └── login.html
│       ├── dashboard/
│       │   └── index.html
│       ├── services/
│       │   ├── list.html
│       │   ├── create.html
│       │   └── edit.html
│       ├── reviews/
│       │   └── list.html
│       ├── social_links/
│       │   ├── list.html
│       │   └── edit.html
│       └── images/
│           └── list.html
├── .env.example              # Ejemplo de variables
├── requirements.txt          # Dependencias Python
└── README.md                 # Esta documentación
```

---

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET/POST | `/auth/login` | Login de usuario |
| GET | `/auth/logout` | Cerrar sesión |

### Dashboard

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` o `/dashboard` | Dashboard principal con estadísticas |

### Servicios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/services/` | Lista de servicios |
| GET/POST | `/services/create` | Crear nuevo servicio |
| GET/POST | `/services/<id>/edit` | Editar servicio |
| POST | `/services/<id>/delete` | Eliminar servicio |
| POST | `/services/<id>/toggle-active` | Activar/desactivar |
| POST | `/services/<id>/toggle-featured` | Destacar/no destacar |

### Reviews

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/reviews/` | Lista de reviews |
| POST | `/reviews/<id>/delete` | Eliminar review |
| POST | `/reviews/<id>/toggle-active` | Activar/desactivar |

### Redes Sociales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/social-links/` | Lista de enlaces |
| GET/POST | `/social-links/<id>/edit` | Editar enlace |
| POST | `/social-links/<id>/toggle-active` | Activar/desactivar |

### Imágenes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/images/` | Interfaz de upload |
| POST | `/images/upload` | Subir imagen (multipart/form-data) |
| POST | `/images/delete` | Eliminar imagen (JSON) |

---

## 🔒 Seguridad

### Buenas Prácticas Implementadas

✅ **Sesiones seguras**: Cookies HTTP-only, SameSite=Lax
✅ **CORS configurado**: Solo orígenes permitidos
✅ **Validación de inputs**: WTForms para validación
✅ **Service Role Key**: Solo en backend, nunca expuesta
✅ **Optimización de imágenes**: Resize automático para prevenir uploads pesados
✅ **Rate limiting**: (TODO: implementar con Flask-Limiter)

### Recomendaciones para Producción

1. **Cambiar credenciales por defecto**:
   ```env
   SECRET_KEY=genera_una_clave_aleatoria_larga
   ADMIN_PASSWORD=usa_un_password_fuerte
   ```

2. **Usar HTTPS**: Vercel lo provee automáticamente

3. **Configurar dominio  personalizado** en Vercel

4. **Monitoring**: Configurar alerts en Vercel Dashboard

5. **Rate Limiting**: Agregar Flask-Limiter para prevenir ataques

---

## 🐛 Troubleshooting

### Error: "Supabase credentials not found"

**Solución**: Verificar que las variables de entorno estén configuradas correctamente en `.env` (local) o en Vercel Environment Variables (producción).

### Error: "Failed to upload image"

**Solución**:
1. Verificar que el bucket `images` existe en Supabase Storage
2. Verificar que las políticas de acceso están configuradas
3. Verificar que `SUPABASE_SERVICE_KEY` está configurada

### Error: "Invalid login credentials"

**Solución**: Verificar `ADMIN_USERNAME` y `ADMIN_PASSWORD` en `.env`

### El servidor no inicia

**Solución**:
```bash
# Verificar que todas las dependencias están instaladas
pip install -r requirements.txt

# Verificar que estás en el entorno virtual
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate
```

---

## 📝 Próximas Mejoras

- [ ] Agregar sistema de usuarios múltiples
- [ ] Implementar rate limiting
- [ ] Agregar logs de auditoría
- [ ] Dashboard con gráficos y métricas
- [ ] Exportar/importar servicios en JSON
- [ ] Editor WYSIWYG para contenido
- [ ] Galería de imágenes con gestión
- [ ] Preview de servicios antes de guardar
- [ ] Búsqueda y filtros avanzados

---

## 📄 Licencia

MIT License - Ver archivo LICENSE en la raíz del proyecto

---

## 👤 Autor

**TeleRayo Electrónica** - Servicio Técnico en Getafe

- GitHub: [@getafeelectronic](https://github.com/getafeelectronic)
- Web: https://getafeelectronic.github.io/miserviciotecnico/

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

¿Necesitas ayuda? Abre un issue en GitHub o contacta al equipo de desarrollo.
