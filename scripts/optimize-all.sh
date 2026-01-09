#!/bin/bash
# Script de otimização completa

echo "🚀 Iniciando otimizações..."

# 1. Limpar build anterior
npm run clean

# 2. Otimizar imagens
echo ""
echo "📸 Otimizando imagens..."
if [ -f "scripts/optimize-images.js" ]; then
  node scripts/optimize-images.js
else
  echo "⚠️  Script de otimização de imagens não encontrado"
fi

# 3. Build otimizado
echo ""
echo "🔨 Executando build..."
npm run build

# 4. Verificar resultados
echo ""
echo "✅ Build concluído!"
echo "📊 Verifique os arquivos em dist/"
echo "🧪 Teste com: npm run serve"
