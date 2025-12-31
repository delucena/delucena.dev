#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Diretórios
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

// Criar diretório dist se não existir
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Função para copiar diretório recursivamente
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✓ Copiado: ${path.relative(srcDir, srcPath)}`);
    }
  }
}

// Copiar arquivos principais
const filesToCopy = ['index.html'];

filesToCopy.forEach(file => {
  const srcFile = path.join(srcDir, file);
  const distFile = path.join(distDir, file);
  
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, distFile);
    console.log(`✓ Copiado: ${file}`);
  } else {
    console.warn(`⚠ Arquivo não encontrado: ${file}`);
  }
});

// Copiar diretórios css, js e assets
const dirsToCopy = ['css', 'js', 'assets'];

dirsToCopy.forEach(dir => {
  const srcDirPath = path.join(srcDir, dir);
  const distDirPath = path.join(distDir, dir);
  
  if (fs.existsSync(srcDirPath)) {
    copyDir(srcDirPath, distDirPath);
    console.log(`✓ Copiado diretório: ${dir}/`);
  } else {
    console.warn(`⚠ Diretório não encontrado: ${dir}`);
  }
});

console.log('\n✅ Build concluído! Os arquivos estão em ./dist/');
console.log('📂 Abra dist/index.html no navegador para visualizar.');
