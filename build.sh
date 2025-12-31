#!/bin/bash

# Script de build para gerar a pasta dist

echo "🔨 Iniciando build..."

# Criar diretório dist se não existir
mkdir -p dist

# Copiar arquivos de src para dist
echo "📋 Copiando arquivos..."
cp src/index.html dist/index.html
cp src/style.css dist/style.css

echo ""
echo "✅ Build concluído!"
echo "📂 Os arquivos estão em ./dist/"
echo "🌐 Abra dist/index.html no navegador para visualizar."
