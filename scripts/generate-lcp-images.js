#!/usr/bin/env node

/**
 * Script para gerar versões responsivas da imagem LCP (profile.png)
 * Cria versões em 480w, 768w, 1200w nos formatos WebP e AVIF
 */

const fs = require('fs');
const path = require('path');

const srcImagePath = path.join(__dirname, '../src/assets/images/profile.png');
const imagesDir = path.join(__dirname, '../src/assets/images');

// Verificar se sharp está disponível
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ Erro: sharp não está instalado.');
  console.error('   Instale com: npm install --save-dev sharp');
  process.exit(1);
}

// Tamanhos responsivos
const sizes = [480, 768, 1200];

async function generateResponsiveImages() {
  if (!fs.existsSync(srcImagePath)) {
    console.error(`❌ Imagem não encontrada: ${srcImagePath}`);
    process.exit(1);
  }

  console.log('🖼️  Gerando versões responsivas da imagem LCP...\n');

  try {
    const image = sharp(srcImagePath);
    const metadata = await image.metadata();
    
    console.log(`📐 Dimensões originais: ${metadata.width}x${metadata.height}\n`);

    // Gerar versões em cada tamanho
    for (const width of sizes) {
      // Calcular altura proporcional (mantendo aspect ratio)
      const height = Math.round((width * metadata.height) / metadata.width);

      console.log(`📦 Gerando ${width}w (${width}x${height})...`);

      // WebP
      const webpPath = path.join(imagesDir, `profile-${width}w.webp`);
      await image
        .clone()
        .resize(width, height, { fit: 'contain' })
        .webp({ quality: 85, effort: 6 })
        .toFile(webpPath);
      console.log(`   ✓ ${path.basename(webpPath)}`);

      // AVIF
      const avifPath = path.join(imagesDir, `profile-${width}w.avif`);
      await image
        .clone()
        .resize(width, height, { fit: 'contain' })
        .avif({ quality: 80, effort: 4 })
        .toFile(avifPath);
      console.log(`   ✓ ${path.basename(avifPath)}`);
    }

    // Gerar também versão original em AVIF (fallback)
    const avifOriginalPath = path.join(imagesDir, 'profile.avif');
    await image
      .clone()
      .avif({ quality: 80, effort: 4 })
      .toFile(avifOriginalPath);
    console.log(`\n✓ ${path.basename(avifOriginalPath)} (versão original)`);

    console.log('\n✅ Todas as versões responsivas foram geradas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao gerar imagens:', error.message);
    process.exit(1);
  }
}

generateResponsiveImages();
