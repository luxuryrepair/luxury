# Scripts de Configuración

Este directorio contiene scripts para facilitar la configuración del proyecto.

## 📝 Scripts Disponibles

### 🔐 setup-secrets.ps1 / setup-secrets.sh

Configura automáticamente los **GitHub Secrets** necesarios para el deploy.

**Requisitos:**
- GitHub CLI (`gh`) instalado y autenticado
- Permisos de administrador en el repositorio

**Uso en Windows (PowerShell):**
```powershell
cd .github/scripts
.\setup-secrets.ps1
```

**Uso en Linux/Mac (Bash):**
```bash
cd .github/scripts
chmod +x setup-secrets.sh
./setup-secrets.sh
```

**¿Qué hace el script?**

1. ✅ Verifica que GitHub CLI esté instalado y autenticado
2. 📋 Configura secrets obligatorios (información del negocio):
   - `VITE_BUSINESS_EMAIL`
   - `VITE_BUSINESS_PHONE`
   - `VITE_BUSINESS_ADDRESS`
   - `VITE_BUSINESS_HOURS`
   - `VITE_BUSINESS_COORDINATES_LAT`
   - `VITE_BUSINESS_COORDINATES_LNG`

3. 🔑 Configura secrets opcionales (APIs):
   - `VITE_EMAILJS_SERVICE_ID` (EmailJS - formulario de contacto)
   - `VITE_EMAILJS_TEMPLATE_BUSINESS_ID` (EmailJS - plantilla al negocio)
   - `VITE_EMAILJS_TEMPLATE_CLIENT_ID` (EmailJS - plantilla de confirmación al cliente)
   - `VITE_EMAILJS_TEMPLATE_ID` (EmailJS - plantilla legacy, compatibilidad)
   - `VITE_EMAILJS_PUBLIC_KEY` (EmailJS - clave pública)
   - `VITE_GOOGLE_MAPS_API_KEY` (Google Maps - mapa interactivo)

4. 📝 Te da instrucciones para:
   - Verificar que los secrets se configuraron correctamente
   - Forzar un nuevo deploy con los secrets
   - Ver el sitio desplegado

**Valores por defecto:**

El script incluye valores por defecto para la información del negocio. Si necesitas cambiarlos:

- **Interactivamente**: El script te preguntará por cada valor
- **Manualmente**: Ve a [Settings → Secrets → Actions](https://github.com/getafeelectronic/miserviciotecnico/settings/secrets/actions)

**Secrets opcionales:**

Si no configuras los secrets de EmailJS o Google Maps, el sitio funcionará en **modo demo**:
- ✉️ **Sin EmailJS**: El formulario mostrará un mensaje simulado
- 🗺️ **Sin Google Maps**: El mapa no mostrará marker interactivo

**Después de ejecutar el script:**

1. Verifica que los secrets se configuraron:
   ```bash
   gh secret list
   ```

2. Forzar un nuevo deploy:
   ```bash
   git commit --allow-empty -m "ci: redeploy con secrets configurados"
   git push origin develop
   ```

3. Ver el estado del deploy:
   ```bash
   gh run watch
   ```

4. Ver el sitio en vivo:
   ```
   https://getafeelectronic.github.io/miserviciotecnico/
   ```

---

## 🆘 Solución de Problemas

### Error: `gh: command not found`

**Solución**: Instala GitHub CLI:
- **Windows**: `winget install --id GitHub.cli`
- **Mac**: `brew install gh`
- **Linux**: [Instrucciones oficiales](https://github.com/cli/cli/blob/trunk/docs/install_linux.md)

### Error: `not authenticated`

**Solución**: Autentica GitHub CLI:
```bash
gh auth login
```

Sigue las instrucciones en pantalla.

### El workflow falla después de configurar secrets

**Posibles causas:**

1. **Valores incorrectos**: Verifica que los valores sean correctos
   ```bash
   gh secret list  # Ver qué secrets están configurados
   ```

2. **Caracteres especiales**: Si un valor tiene caracteres especiales, escápalo:
   ```bash
   echo 'valor con "comillas" y $especial' | gh secret set NOMBRE_SECRET
   ```

3. **Secrets no se actualizan**: GitHub puede tardar ~30 segundos en actualizar
   - Espera 1 minuto y vuelve a hacer push

### El sitio se deploya pero no se ven los datos

**Diagnóstico:**

1. Ve a Actions → Deploy to GitHub Pages → último run
2. En el step "Validar secrets configurados", verás:
   - ✅ Secrets configurados correctamente
   - ❌ Secrets faltantes (el workflow fallará)
   - ⚠️ Secrets opcionales no configurados (continúa en modo demo)

3. Si faltan secrets obligatorios, configúralos y haz push

---

## 📖 Más Información

Ver la guía completa de deploy: [doc/DEPLOY-GITHUB-PAGES.md](../../doc/DEPLOY-GITHUB-PAGES.md)
