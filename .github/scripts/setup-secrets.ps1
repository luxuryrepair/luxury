# Script para configurar GitHub Secrets necesarios para el deploy
# Uso: .\setup-secrets.ps1
# Requiere: GitHub CLI (gh) instalado y autenticado
# Repo: https://github.com/luxuryrepair/luxury

Write-Host "" 
Write-Host "GitHub Secrets - Luxury Repair" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Repositorio: luxuryrepair/luxury" -ForegroundColor Gray
Write-Host ""

# Verificar gh instalado
if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] GitHub CLI (gh) no esta instalado." -ForegroundColor Red
    Write-Host "        Instalar desde: https://cli.github.com/" -ForegroundColor Yellow
    exit 1
}

# Verificar autenticacion
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] No estas autenticado. Ejecuta: gh auth login" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] GitHub CLI autenticado" -ForegroundColor Green
Write-Host ""

# -------------------------------------------------------
# FUNCION HELPER
# -------------------------------------------------------
function Set-GHSecret {
    param([string]$Key, [string]$Prompt, [string]$Default = "", [string]$Hint = "")

    Write-Host "  $Key" -ForegroundColor Cyan
    if ($Hint) { Write-Host "    $Hint" -ForegroundColor Gray }

    if ($Default) {
        $input = Read-Host "    Valor actual detectado (Enter para usar, o escribe nuevo)"
        $value = if ($input) { $input } else { $Default }
    } else {
        $value = Read-Host "    $Prompt"
    }

    if ($value) {
        $value | gh secret set $Key
        if ($LASTEXITCODE -eq 0) {
            Write-Host "    [OK] Configurado" -ForegroundColor Green
        } else {
            Write-Host "    [ERROR] No se pudo configurar" -ForegroundColor Red
        }
    } else {
        Write-Host "    [SKIP] Omitido" -ForegroundColor Gray
    }
    Write-Host ""
}

# -------------------------------------------------------
# 1. SUPABASE (obligatorios)
# -------------------------------------------------------
Write-Host "[1/3] Supabase (obligatorios)" -ForegroundColor Yellow
Write-Host "      La info del negocio viene de la tabla settings de Supabase." -ForegroundColor Gray
Write-Host ""

Set-GHSecret `
    -Key "NEXT_PUBLIC_SUPABASE_URL" `
    -Prompt "URL del proyecto (https://xxxx.supabase.co)" `
    -Hint "Dashboard Supabase -> Settings -> API -> Project URL"

Set-GHSecret `
    -Key "NEXT_PUBLIC_SUPABASE_ANON_KEY" `
    -Prompt "Anon key publica" `
    -Hint "Dashboard Supabase -> Settings -> API -> anon public"

# -------------------------------------------------------
# 2. EMAILJS (opcionales)
# -------------------------------------------------------
Write-Host "[2/3] EmailJS (opcionales - formulario de contacto)" -ForegroundColor Yellow
Write-Host "      Deja vacio si no tienes las credenciales ahora." -ForegroundColor Gray
Write-Host ""

Set-GHSecret `
    -Key "NEXT_PUBLIC_EMAILJS_SERVICE_ID" `
    -Prompt "Service ID de EmailJS (Enter para omitir)"

Set-GHSecret `
    -Key "NEXT_PUBLIC_EMAILJS_TEMPLATE_BUSINESS_ID" `
    -Prompt "Template ID para el negocio (Enter para omitir)"

Set-GHSecret `
    -Key "NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT_ID" `
    -Prompt "Template ID para el cliente (Enter para omitir)"

Set-GHSecret `
    -Key "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY" `
    -Prompt "Public Key de EmailJS (Enter para omitir)"

# -------------------------------------------------------
# 3. GOOGLE MAPS (opcional)
# -------------------------------------------------------
Write-Host "[3/3] Google Maps (opcional)" -ForegroundColor Yellow
Write-Host ""

Set-GHSecret `
    -Key "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" `
    -Prompt "URL embed de Google Maps (Enter para omitir)" `
    -Hint "Google Maps -> Compartir -> Insertar mapa -> valor del atributo src"

# -------------------------------------------------------
# RESUMEN
# -------------------------------------------------------
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "[OK] Configuracion completada." -ForegroundColor Green
Write-Host ""
Write-Host "Verifica los secrets en:" -ForegroundColor White
Write-Host "  https://github.com/luxuryrepair/luxury/settings/secrets/actions" -ForegroundColor Gray
Write-Host ""
Write-Host "Para lanzar el deploy manualmente:" -ForegroundColor White
Write-Host "  gh workflow run deploy.yml" -ForegroundColor Gray
Write-Host ""
Write-Host "Para crear una release:" -ForegroundColor White
Write-Host "  git tag v1.0.0 ; git push origin v1.0.0" -ForegroundColor Gray
Write-Host ""
    
    if ($value) {
        $value | gh secret set $key
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] Configurado" -ForegroundColor Green
        } else {
            Write-Host "  [ERROR] Error al configurar" -ForegroundColor Red
        }
    } else {
        Write-Host "  [SKIP] Omitido (se usaran datos de fallback)" -ForegroundColor Gray
    }
    Write-Host ""
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "[OK] Configuracion de secrets completada" -ForegroundColor Green
Write-Host ""
Write-Host "[NEXT] Proximos pasos:" -ForegroundColor Yellow
Write-Host "  1. Verifica los secrets configurados en:" -ForegroundColor White
Write-Host "     https://github.com/getafeelectronic/miserviciotecnico/settings/secrets/actions" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Forzar un nuevo deploy:" -ForegroundColor White
Write-Host "     git commit --allow-empty -m ""ci: redeploy con secrets configurados""" -ForegroundColor Gray
Write-Host "     git push origin develop" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Verificar el deploy:" -ForegroundColor White
Write-Host "     gh run watch" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. Ver sitio desplegado:" -ForegroundColor White
Write-Host "     https://getafeelectronic.github.io/miserviciotecnico/" -ForegroundColor Gray
Write-Host ""
