#!/bin/bash

echo "🔨 Iniciando build..."

mkdir -p dist

echo "📋 Copiando arquivos..."
cp src/index.html dist/index.html
cp src/style.css dist/style.css

echo ""
echo "✅ Build concluído!"
echo "📂 Os arquivos estão em ./dist/"
echo "🌐 Abra dist/index.html no navegador para visualizar."
