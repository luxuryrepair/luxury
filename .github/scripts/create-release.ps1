# ==========================================
# Script: Crear Release en GitHub (PowerShell)
# ==========================================
# Uso:
#   .\create-release.ps1 -Version <version> [-Message <mensaje>]
#
# Ejemplos:
#   .\create-release.ps1 -Version 0.4.0
#   .\create-release.ps1 -Version 0.4.0 -Message "Sistema de servicios dinámicos"
#   .\create-release.ps1 -Version 1.0.0 -Message "Primera release estable"
# ==========================================

param(
    [Parameter(Mandatory=$true)]
    [string]$Version,
    
    [Parameter(Mandatory=$false)]
    [string]$Message = ""
)

$ErrorActionPreference = "Stop"

# Validar formato de versión (semver)
if ($Version -notmatch '^\d+\.\d+\.\d+$') {
    Write-Host "❌ Error: Formato de versión inválido" -ForegroundColor Red
    Write-Host ""
    Write-Host "La versión debe seguir Semantic Versioning: X.Y.Z"
    Write-Host "Ejemplos válidos: 0.4.0, 1.0.0, 2.1.3"
    Write-Host ""
    exit 1
}

$Tag = "v$Version"
if ([string]::IsNullOrEmpty($Message)) {
    $Message = "Release v$Version"
}

Write-Host "🚀 Preparando release $Tag" -ForegroundColor Blue
Write-Host ""

# Verificar que estamos en main
$CurrentBranch = git branch --show-current
if ($CurrentBranch -ne "main") {
    Write-Host "⚠️  Advertencia: No estás en la rama 'main' (actual: $CurrentBranch)" -ForegroundColor Yellow
    Write-Host ""
    $Continue = Read-Host "¿Deseas continuar de todos modos? (y/N)"
    if ($Continue -ne "y" -and $Continue -ne "Y") {
        Write-Host "❌ Releases deben crearse desde 'main'. Cambiando..." -ForegroundColor Red
        git checkout main
    }
}

# Actualizar main
Write-Host "📥 Actualizando rama main..." -ForegroundColor Blue
git pull origin main

# Verificar que no hay cambios sin commitear
$Status = git status --porcelain
if ($Status) {
    Write-Host "❌ Error: Hay cambios sin commitear" -ForegroundColor Red
    Write-Host ""
    git status --short
    Write-Host ""
    Write-Host "Ejecuta primero:"
    Write-Host "  git add ."
    Write-Host "  git commit -m 'message'"
    Write-Host ""
    exit 1
}

# Verificar que el tag no existe
$TagExists = git tag -l $Tag
if ($TagExists) {
    Write-Host "❌ Error: El tag $Tag ya existe" -ForegroundColor Red
    Write-Host ""
    Write-Host "Si quieres recrear el release:"
    Write-Host "  1. Eliminar tag local:  git tag -d $Tag"
    Write-Host "  2. Eliminar tag remoto: git push origin --delete $Tag"
    Write-Host "  3. Eliminar release:    gh release delete $Tag --yes"
    Write-Host "  4. Ejecutar este script nuevamente"
    Write-Host ""
    exit 1
}

# Verificar que gh CLI está instalado
try {
    $null = gh --version
} catch {
    Write-Host "❌ Error: GitHub CLI (gh) no está instalado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Instalar GitHub CLI:"
    Write-Host "  winget install GitHub.cli"
    Write-Host ""
    Write-Host "O descargar desde: https://cli.github.com"
    Write-Host ""
    exit 1
}

# Verificar autenticación de gh
try {
    $null = gh auth status 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "No autenticado"
    }
} catch {
    Write-Host "❌ Error: No estás autenticado en GitHub CLI" -ForegroundColor Red
    Write-Host ""
    Write-Host "Ejecuta: gh auth login"
    Write-Host ""
    exit 1
}

# Confirmar creación del release
Write-Host "📋 Resumen del release:" -ForegroundColor Yellow
Write-Host "  - Tag: $Tag"
Write-Host "  - Mensaje: $Message"
Write-Host "  - Rama: $CurrentBranch"
Write-Host "  - Commits recientes:"
git log --oneline -5 | ForEach-Object { Write-Host "    $_" }
Write-Host ""

$Confirm = Read-Host "¿Crear este release? (y/N)"
if ($Confirm -ne "y" -and $Confirm -ne "Y") {
    Write-Host "❌ Release cancelado" -ForegroundColor Red
    exit 0
}

# Crear tag localmente
Write-Host "🏷️  Creando tag $Tag..." -ForegroundColor Blue
git tag -a $Tag -m $Message

# Push del tag (esto dispara el workflow)
Write-Host "📤 Pusheando tag a GitHub..." -ForegroundColor Blue
git push origin $Tag

# Esperar un momento para que GitHub procese el push
Write-Host "⏳ Esperando que GitHub Actions procese el workflow..." -ForegroundColor Blue
Start-Sleep -Seconds 3

# Verificar que el workflow se está ejecutando
Write-Host "🔍 Verificando workflow..." -ForegroundColor Blue
try {
    $WorkflowStatus = gh run list --workflow=release.yml --limit=1 --json status --jq '.[0].status' 2>$null
    
    if ($WorkflowStatus -eq "in_progress" -or $WorkflowStatus -eq "queued") {
        Write-Host "✅ Workflow de release iniciado correctamente" -ForegroundColor Green
        Write-Host ""
        Write-Host "📊 Para ver el progreso:" -ForegroundColor Blue
        Write-Host "  gh run list --workflow=release.yml"
        Write-Host "  gh run watch"
        Write-Host ""
        $RepoInfo = gh repo view --json nameWithOwner -q .nameWithOwner
        Write-Host "🌐 Ver en GitHub:" -ForegroundColor Blue
        Write-Host "  https://github.com/$RepoInfo/actions"
        Write-Host ""
        Write-Host "🏷️  El release aparecerá en:" -ForegroundColor Blue
        Write-Host "  https://github.com/$RepoInfo/releases/tag/$Tag"
    } elseif ($WorkflowStatus -eq "completed") {
        Write-Host "✅ Release creado exitosamente" -ForegroundColor Green
        Write-Host ""
        $RepoInfo = gh repo view --json nameWithOwner -q .nameWithOwner
        Write-Host "🏷️  Ver release:" -ForegroundColor Blue
        Write-Host "  https://github.com/$RepoInfo/releases/tag/$Tag"
    } else {
        Write-Host "⚠️  No se pudo verificar el estado del workflow" -ForegroundColor Yellow
        Write-Host "  Estado: $WorkflowStatus"
        Write-Host ""
        $RepoInfo = gh repo view --json nameWithOwner -q .nameWithOwner
        Write-Host "Verifica manualmente en:"
        Write-Host "  https://github.com/$RepoInfo/actions"
    }
} catch {
    Write-Host "⚠️  No se pudo verificar el estado del workflow" -ForegroundColor Yellow
    Write-Host ""
    $RepoInfo = gh repo view --json nameWithOwner -q .nameWithOwner
    Write-Host "Verifica manualmente en:"
    Write-Host "  https://github.com/$RepoInfo/actions"
}

Write-Host ""
Write-Host "🎉 Release $Tag iniciado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Blue
Write-Host "  1. Esperar a que el workflow termine (~2-3 minutos)"
Write-Host "  2. Verificar el release en GitHub"
Write-Host "  3. Confirmar que el archivo ZIP está adjunto"
Write-Host "  4. El deploy a producción se hará automáticamente"
Write-Host ""
