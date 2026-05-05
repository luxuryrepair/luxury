#!/bin/bash

# ==========================================
# Script: Crear Release en GitHub
# ==========================================
# Uso:
#   ./create-release.sh <version> [mensaje]
#
# Ejemplos:
#   ./create-release.sh 0.4.0
#   ./create-release.sh 0.4.0 "Sistema de servicios dinámicos"
#   ./create-release.sh 1.0.0 "Primera release estable"
# ==========================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar argumentos
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Falta versión${NC}"
    echo ""
    echo "Uso: $0 <version> [mensaje]"
    echo ""
    echo "Ejemplos:"
    echo "  $0 0.4.0"
    echo "  $0 0.4.0 'Sistema de servicios dinámicos'"
    echo "  $0 1.0.0 'Primera release estable'"
    echo ""
    exit 1
fi

VERSION=$1
MESSAGE=${2:-"Release v$VERSION"}
TAG="v$VERSION"

# Validar formato de versión (semver)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}❌ Error: Formato de versión inválido${NC}"
    echo ""
    echo "La versión debe seguir Semantic Versioning: X.Y.Z"
    echo "Ejemplos válidos: 0.4.0, 1.0.0, 2.1.3"
    echo ""
    exit 1
fi

echo -e "${BLUE}🚀 Preparando release $TAG${NC}"
echo ""

# Verificar que estamos en main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  Advertencia: No estás en la rama 'main' (actual: $CURRENT_BRANCH)${NC}"
    echo ""
    read -p "¿Deseas continuar de todos modos? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Releases deben crearse desde 'main'. Cambiando...${NC}"
        git checkout main
    fi
fi

# Actualizar main
echo -e "${BLUE}📥 Actualizando rama main...${NC}"
git pull origin main

# Verificar que no hay cambios sin commitear
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ Error: Hay cambios sin commitear${NC}"
    echo ""
    git status --short
    echo ""
    echo "Ejecuta primero:"
    echo "  git add ."
    echo "  git commit -m 'message'"
    echo ""
    exit 1
fi

# Verificar que el tag no existe
if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo -e "${RED}❌ Error: El tag $TAG ya existe${NC}"
    echo ""
    echo "Si quieres recrear el release:"
    echo "  1. Eliminar tag local:  git tag -d $TAG"
    echo "  2. Eliminar tag remoto: git push origin --delete $TAG"
    echo "  3. Eliminar release:    gh release delete $TAG --yes"
    echo "  4. Ejecutar este script nuevamente"
    echo ""
    exit 1
fi

# Verificar que gh CLI está instalado
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ Error: GitHub CLI (gh) no está instalado${NC}"
    echo ""
    echo "Instalar GitHub CLI:"
    echo "  - macOS:  brew install gh"
    echo "  - Linux:  https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
    echo "  - Windows: winget install GitHub.cli"
    echo ""
    exit 1
fi

# Verificar autenticación de gh
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Error: No estás autenticado en GitHub CLI${NC}"
    echo ""
    echo "Ejecuta: gh auth login"
    echo ""
    exit 1
fi

# Confirmar creación del release
echo -e "${YELLOW}📋 Resumen del release:${NC}"
echo "  - Tag: $TAG"
echo "  - Mensaje: $MESSAGE"
echo "  - Rama: $CURRENT_BRANCH"
echo "  - Commits recientes:"
git log --oneline -5 | sed 's/^/    /'
echo ""

read -p "¿Crear este release? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Release cancelado${NC}"
    exit 0
fi

# Crear tag localmente
echo -e "${BLUE}🏷️  Creando tag $TAG...${NC}"
git tag -a "$TAG" -m "$MESSAGE"

# Push del tag (esto dispara el workflow)
echo -e "${BLUE}📤 Pusheando tag a GitHub...${NC}"
git push origin "$TAG"

# Esperar un momento para que GitHub procese el push
echo -e "${BLUE}⏳ Esperando que GitHub Actions procese el workflow...${NC}"
sleep 3

# Verificar que el workflow se está ejecutando
echo -e "${BLUE}🔍 Verificando workflow...${NC}"
WORKFLOW_STATUS=$(gh run list --workflow=release.yml --limit=1 --json status --jq '.[0].status' 2>/dev/null || echo "unknown")

if [ "$WORKFLOW_STATUS" == "in_progress" ] || [ "$WORKFLOW_STATUS" == "queued" ]; then
    echo -e "${GREEN}✅ Workflow de release iniciado correctamente${NC}"
    echo ""
    echo -e "${BLUE}📊 Para ver el progreso:${NC}"
    echo "  gh run list --workflow=release.yml"
    echo "  gh run watch"
    echo ""
    echo -e "${BLUE}🌐 Ver en GitHub:${NC}"
    echo "  https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/actions"
    echo ""
    echo -e "${BLUE}🏷️  El release aparecerá en:${NC}"
    echo "  https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/releases/tag/$TAG"
elif [ "$WORKFLOW_STATUS" == "completed" ]; then
    echo -e "${GREEN}✅ Release creado exitosamente${NC}"
    echo ""
    echo -e "${BLUE}🏷️  Ver release:${NC}"
    echo "  https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/releases/tag/$TAG"
else
    echo -e "${YELLOW}⚠️  No se pudo verificar el estado del workflow${NC}"
    echo "  Estado: $WORKFLOW_STATUS"
    echo ""
    echo "Verifica manualmente en:"
    echo "  https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/actions"
fi

echo ""
echo -e "${GREEN}🎉 Release $TAG iniciado correctamente!${NC}"
echo ""
echo -e "${BLUE}📝 Próximos pasos:${NC}"
echo "  1. Esperar a que el workflow termine (~2-3 minutos)"
echo "  2. Verificar el release en GitHub"
echo "  3. Confirmar que el archivo ZIP está adjunto"
echo "  4. El deploy a producción se hará automáticamente"
echo ""
