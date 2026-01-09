#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const templatesDir = path.join(__dirname, '../src/templates');

async function checkLayoutShifts() {
  console.log('🔍 Verificando elementos que podem causar CLS...\n');
  
  const issues = [];
  
  // Verificar imagens sem width/height
  const htmlFiles = await glob('**/*.html', { cwd: templatesDir });
  
  htmlFiles.forEach(file => {
    const filePath = path.join(templatesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const imgMatches = [...content.matchAll(/<img[^>]*>/g)];
    
    for (const match of imgMatches) {
      const imgTag = match[0];
      if (!imgTag.includes('width') || !imgTag.includes('height')) {
        issues.push({ file, type: 'img-sem-dimensoes', tag: imgTag.substring(0, 80) + '...' });
      }
    }
    
    // Verificar containers sem min-height
    if (content.includes('class="editor"') && !content.includes('min-height')) {
      issues.push({ file, type: 'container-sem-min-height', element: 'editor' });
    }
  });
  
  if (issues.length > 0) {
    console.log('⚠️  Problemas encontrados:\n');
    issues.forEach(issue => {
      console.log(`  - ${issue.file}: ${issue.type}`);
      if (issue.tag) {
        console.log(`    ${issue.tag}`);
      }
    });
    console.log(`\n📊 Total: ${issues.length} problema(s) encontrado(s)`);
  } else {
    console.log('✅ Nenhum problema encontrado!');
  }
}

checkLayoutShifts().catch(err => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
