#!/bin/bash
# Script para configurar GitHub Secrets necesarios para el deploy
# Uso: ./setup-secrets.sh
# Requiere: GitHub CLI (gh) instalado y autenticado
# Repo: https://github.com/luxuryrepair/luxury

set -e

echo ""
echo -e "\033[36mGitHub Secrets - Luxury Repair\033[0m"
echo "================================================="
echo -e "\033[90mRepositorio: luxuryrepair/luxury\033[0m"
echo ""

# Verificar gh instalado
if ! command -v gh &> /dev/null; then
    echo -e "\033[31m[ERROR] GitHub CLI (gh) no esta instalado.\033[0m"
    echo -e "        Instalar desde: https://cli.github.com/"
    exit 1
fi

# Verificar autenticacion
if ! gh auth status &> /dev/null; then
    echo -e "\033[31m[ERROR] No estas autenticado. Ejecuta: gh auth login\033[0m"
    exit 1
fi
echo -e "\033[32m[OK] GitHub CLI autenticado\033[0m"
echo ""

# -------------------------------------------------------
# FUNCION HELPER
# -------------------------------------------------------
set_secret() {
    local key="$1"
    local prompt="$2"
    local hint="$3"

    echo -e "  \033[36m$key\033[0m"
    [ -n "$hint" ] && echo -e "    \033[90m$hint\033[0m"
    read -r -p "    $prompt: " value

    if [ -n "$value" ]; then
        echo "$value" | gh secret set "$key"
        if [ $? -eq 0 ]; then
            echo -e "    \033[32m[OK] Configurado\033[0m"
        else
            echo -e "    \033[31m[ERROR] No se pudo configurar\033[0m"
        fi
    else
        echo -e "    \033[90m[SKIP] Omitido\033[0m"
    fi
    echo ""
}

# -------------------------------------------------------
# 1. SUPABASE (obligatorios)
# -------------------------------------------------------
echo -e "\033[33m[1/3] Supabase (obligatorios)\033[0m"
echo -e "      \033[90mLa info del negocio viene de la tabla settings de Supabase.\033[0m"
echo ""

set_secret \
    "NEXT_PUBLIC_SUPABASE_URL" \
    "URL del proyecto (https://xxxx.supabase.co)" \
    "Dashboard Supabase -> Settings -> API -> Project URL"

set_secret \
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" \
    "Anon key publica" \
    "Dashboard Supabase -> Settings -> API -> anon public"

# -------------------------------------------------------
# 2. EMAILJS (opcionales)
# -------------------------------------------------------
echo -e "\033[33m[2/3] EmailJS (opcionales - formulario de contacto)\033[0m"
echo -e "      \033[90mDeja vacio si no tienes las credenciales ahora.\033[0m"
echo ""

set_secret "NEXT_PUBLIC_EMAILJS_SERVICE_ID"           "Service ID de EmailJS (Enter para omitir)"
set_secret "NEXT_PUBLIC_EMAILJS_TEMPLATE_BUSINESS_ID" "Template ID para el negocio (Enter para omitir)"
set_secret "NEXT_PUBLIC_EMAILJS_TEMPLATE_CLIENT_ID"   "Template ID para el cliente (Enter para omitir)"
set_secret "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY"           "Public Key de EmailJS (Enter para omitir)"

# -------------------------------------------------------
# 3. GOOGLE MAPS (opcional)
# -------------------------------------------------------
echo -e "\033[33m[3/3] Google Maps (opcional)\033[0m"
echo ""

set_secret \
    "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" \
    "URL embed de Google Maps (Enter para omitir)" \
    "Google Maps -> Compartir -> Insertar mapa -> valor del atributo src"

# -------------------------------------------------------
# RESUMEN
# -------------------------------------------------------
echo "================================================="
echo -e "\033[32m[OK] Configuracion completada.\033[0m"
echo ""
echo "Verifica los secrets en:"
echo -e "  \033[90mhttps://github.com/luxuryrepair/luxury/settings/secrets/actions\033[0m"
echo ""
echo "Para lanzar el deploy manualmente:"
echo -e "  \033[90mgh workflow run deploy.yml\033[0m"
echo ""
echo "Para crear una release:"
echo -e "  \033[90mgit tag v1.0.0 && git push origin v1.0.0\033[0m"
echo ""
echo ""
