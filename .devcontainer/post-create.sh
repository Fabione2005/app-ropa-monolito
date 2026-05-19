#!/usr/bin/env bash
# ─────────────────────────────────────────────────────
#  post-create.sh
#  Se ejecuta UNA sola vez al crear el Codespace.
#  Instala Claude Code y prepara el entorno de desarrollo.
# ─────────────────────────────────────────────────────
set -e

echo "▶ [1/4] Instalando Claude Code..."
npm install -g @anthropic-ai/claude-code

echo "▶ [2/4] Verificando versiones..."
java -version
mvn -version
node -v
claude --version

echo "▶ [3/4] Descargando dependencias Maven (warm-up cache)..."
# Solo si existe pom.xml en la raíz del workspace
if [ -f "/workspace/pom.xml" ]; then
  cd /workspace
  mvn dependency:go-offline -q
  echo "   ✓ Dependencias Maven descargadas"
else
  echo "   ⚠ No se encontró pom.xml — saltando warm-up de Maven"
fi

echo "▶ [4/4] Configurando Git (si no está configurado)..."
git config --global core.autocrlf input
git config --global pull.rebase false

echo ""
echo "✅ Codespace listo para FRI APP"
echo "   → Ejecuta: mvn spring-boot:run"
echo "   → O usa el panel de Spring Boot en VS Code"
echo "   → Claude Code: claude"
