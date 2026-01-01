#!/usr/bin/env node

/**
 * Script para otimizar imagens
 * Converte imagens PNG para WebP e cria versões otimizadas
 * 
 * Requer: sharp (npm install sharp) ou imagemagick/cwebp instalado
 */

const fs = require('fs');
const path = require('path');

const srcImagesDir = path.join(__dirname, '../src/assets/images');
const distImagesDir = path.join(__dirname, '../dist/assets/images');

// Criar diretório de destino se não existir
if (!fs.existsSync(distImagesDir)) {
  fs.mkdirSync(distImagesDir, { recursive: true });
}

// Verificar se sharp está disponível
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn('⚠ Sharp não está instalado. Instale com: npm install sharp');
  console.warn('⚠ Pulando otimização de imagens. Copiando arquivos originais...');
}

function optimizeImage(inputPath, outputPath, format = 'webp') {
  if (!sharp) {
    // Fallback: apenas copiar
    fs.copyFileSync(inputPath, outputPath.replace('.webp', '.png'));
    return false;
  }
  
  try {
    const image = sharp(inputPath);
    
    if (format === 'webp') {
      image.webp({ quality: 85, effort: 6 })
        .toFile(outputPath)
        .then(() => {
          console.log(`✓ Otimizado: ${path.basename(outputPath)}`);
        })
        .catch(err => {
          console.error(`✗ Erro ao otimizar ${inputPath}:`, err.message);
        });
    } else if (format === 'png') {
      image.png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath)
        .then(() => {
          console.log(`✓ Otimizado: ${path.basename(outputPath)}`);
        })
        .catch(err => {
          console.error(`✗ Erro ao otimizar ${inputPath}:`, err.message);
        });
    }
    
    return true;
  } catch (err) {
    console.error(`✗ Erro ao processar ${inputPath}:`, err.message);
    return false;
  }
}

// Processar imagens
if (fs.existsSync(srcImagesDir)) {
  const images = fs.readdirSync(srcImagesDir);
  
  images.forEach(imageFile => {
    if (imageFile.endsWith('.png')) {
      const inputPath = path.join(srcImagesDir, imageFile);
      const baseName = path.basename(imageFile, '.png');
      
      // Criar WebP
      const webpPath = path.join(distImagesDir, `${baseName}.webp`);
      optimizeImage(inputPath, webpPath, 'webp');
      
      // Criar PNG otimizado como fallback
      const pngPath = path.join(distImagesDir, imageFile);
      optimizeImage(inputPath, pngPath, 'png');
    } else {
      // Copiar outros formatos
      const srcPath = path.join(srcImagesDir, imageFile);
      const destPath = path.join(distImagesDir, imageFile);
      fs.copyFileSync(srcPath, destPath);
      console.log(`✓ Copiado: ${imageFile}`);
    }
  });
  
  console.log('\n✅ Otimização de imagens concluída!');
} else {
  console.warn('⚠ Diretório de imagens não encontrado:', srcImagesDir);
}
