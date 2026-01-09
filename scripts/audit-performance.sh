#!/bin/bash
# Script de auditoria de performance

echo "🔍 Iniciando auditoria de performance..."

# Build do projeto
npm run build

# Verificar tamanhos de arquivos
echo ""
echo "📊 Tamanhos de arquivos:"
echo "CSS crítico:"
if [ -f "dist/index.html" ]; then
  grep -o '<style>.*</style>' dist/index.html | wc -c
fi

echo ""
echo "JS essencial:"
if [ -d "dist/js" ]; then
  ls -lh dist/js/*.min.js 2>/dev/null | awk '{print $5, $9}'
fi

echo ""
echo "Imagens:"
if [ -d "dist/assets/images" ]; then
  ls -lh dist/assets/images/*.{webp,avif} 2>/dev/null | awk '{print $5, $9}'
fi

echo ""
echo "✅ Auditoria concluída!"
echo "📝 Execute Lighthouse no Chrome DevTools para métricas completas."
