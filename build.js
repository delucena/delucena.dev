#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');
const templatesDir = path.join(srcDir, 'templates');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

function generateHash(content) {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).substring(0, 8);
}

function consolidateCSS(cssContent, cssDir, processedFiles = new Set()) {
  return cssContent.replace(/@import\s+url\(['"]?([^'"]+)['"]?\)\s*;?/g, (match, importPath) => {
    const normalizedPath = importPath.replace(/^\.\//, '');
    const fullPath = path.join(cssDir, normalizedPath);
    
    if (processedFiles.has(fullPath)) {
      console.warn(`⚠ Aviso: @import circular detectado para ${normalizedPath}`);
      return '';
    }
    
    if (fs.existsSync(fullPath)) {
      processedFiles.add(fullPath);
      const importedContent = fs.readFileSync(fullPath, 'utf8');
      const consolidated = consolidateCSS(importedContent, cssDir, processedFiles);
      processedFiles.delete(fullPath);
      return consolidated;
    } else {
      console.warn(`⚠ Arquivo CSS não encontrado: ${fullPath}`);
      return '';
    }
  });
}

function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/;\s*}/g, '}')
    .replace(/\s*{\s*/g, '{')
    .replace(/;\s*/g, ';')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*,\s*/g, ',')
    .trim();
}

function minifyJS(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .trim();
}

function copyDir(src, dest, minify = false) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, minify);
    } else {
      if (minify && (entry.name.endsWith('.css') || entry.name.endsWith('.js'))) {
        const content = fs.readFileSync(srcPath, 'utf8');
        fs.copyFileSync(srcPath, destPath);
        console.log(`✓ Copiado: ${path.relative(srcDir, srcPath)}`);
        
        const minified = entry.name.endsWith('.css') ? minifyCSS(content) : minifyJS(content);
        const minFileName = entry.name.replace(/\.(css|js)$/, '.min.$1');
        const minDestPath = path.join(dest, minFileName);
        fs.writeFileSync(minDestPath, minified, 'utf8');
        console.log(`✓ Minificado: ${path.relative(srcDir, srcPath)} -> ${minFileName}`);
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✓ Copiado: ${path.relative(srcDir, srcPath)}`);
      }
    }
  }
}

function readTemplate(templatePath) {
  const fullPath = path.join(templatesDir, templatePath);
  if (fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath, 'utf8');
  }
  console.warn(`⚠ Template não encontrado: ${templatePath}`);
  return '';
}

function buildIndexHtml() {
  const baseHtml = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');
  let html = baseHtml;
  
  html = html.replace('<!-- TEMPLATE: navigation.html -->', readTemplate('navigation.html'));
  html = html.replace('<!-- TEMPLATE: editor-header.html -->', readTemplate('editor-header.html'));
  html = html.replace('<!-- TEMPLATE: sections/index-section.html -->', readTemplate('sections/index-section.html'));
  html = html.replace('<!-- TEMPLATE: sections/experience-section.html -->', readTemplate('sections/experience-section.html'));
  html = html.replace('<!-- TEMPLATE: sections/skills-section.html -->', readTemplate('sections/skills-section.html'));
  html = html.replace('<!-- TEMPLATE: sections/contact-section.html -->', readTemplate('sections/contact-section.html'));
  html = html.replace('<!-- TEMPLATE: sections/readme-section.html -->', readTemplate('sections/readme-section.html'));
  
  let terminalHtml = readTemplate('terminal/terminal.html');
  terminalHtml = terminalHtml.replace('<!-- TEMPLATE: terminal-header.html -->', readTemplate('terminal/terminal-header.html'));
  terminalHtml = terminalHtml.replace('<!-- TEMPLATE: terminal-tabs/problems-tab.html -->', readTemplate('terminal/terminal-tabs/problems-tab.html'));
  terminalHtml = terminalHtml.replace('<!-- TEMPLATE: terminal-tabs/output-tab.html -->', readTemplate('terminal/terminal-tabs/output-tab.html'));
  terminalHtml = terminalHtml.replace('<!-- TEMPLATE: terminal-tabs/terminal-tab.html -->', readTemplate('terminal/terminal-tabs/terminal-tab.html'));
  terminalHtml = terminalHtml.replace('<!-- TEMPLATE: terminal-tabs/debug-tab.html -->', readTemplate('terminal/terminal-tabs/debug-tab.html'));
  terminalHtml = terminalHtml.replace('<!-- TEMPLATE: terminal-tabs/ports-tab.html -->', readTemplate('terminal/terminal-tabs/ports-tab.html'));
  html = html.replace('<!-- TEMPLATE: terminal.html -->', terminalHtml);
  
  html = html.replace('<!-- TEMPLATE: footer.html -->', readTemplate('footer.html'));
  
  const distIndexPath = path.join(distDir, 'index.html');
  fs.writeFileSync(distIndexPath, html, 'utf8');
  console.log('✓ Montado: index.html (a partir de templates)');
}

const indexPath = path.join(srcDir, 'index.html');

if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  if (indexContent.includes('<!-- TEMPLATE:')) {
    buildIndexHtml();
  } else {
    fs.copyFileSync(indexPath, path.join(distDir, 'index.html'));
    console.log('✓ Copiado: index.html (fallback)');
  }
} else {
  console.warn('⚠ Nenhum arquivo index encontrado!');
}

const error404Path = path.join(srcDir, '404.html');
if (fs.existsSync(error404Path)) {
  fs.copyFileSync(error404Path, path.join(distDir, '404.html'));
  console.log('✓ Copiado: 404.html');
}

const cssSrcDir = path.join(srcDir, 'css');
const cssDistDir = path.join(distDir, 'css');
if (fs.existsSync(cssSrcDir)) {
  copyDir(cssSrcDir, cssDistDir, true);
  
  const mainCssPath = path.join(cssDistDir, 'main.css');
  if (fs.existsSync(mainCssPath)) {
    const mainCssContent = fs.readFileSync(mainCssPath, 'utf8');
    const consolidated = consolidateCSS(mainCssContent, cssDistDir);
    fs.writeFileSync(mainCssPath, consolidated, 'utf8');
    console.log('✓ Consolidado: main.css (resolvidos @import)');
    
    const minified = minifyCSS(consolidated);
    fs.writeFileSync(path.join(cssDistDir, 'main.min.css'), minified, 'utf8');
    console.log('✓ Minificado: main.css consolidado');
  }
  
  console.log(`✓ Processado diretório: css/`);
} else {
  console.warn(`⚠ Diretório não encontrado: css`);
}

const jsSrcDir = path.join(srcDir, 'js');
const jsDistDir = path.join(distDir, 'js');
if (fs.existsSync(jsSrcDir)) {
  copyDir(jsSrcDir, jsDistDir, true);
  console.log(`✓ Processado diretório: js/`);
} else {
  console.warn(`⚠ Diretório não encontrado: js`);
}

const assetsSrcDir = path.join(srcDir, 'assets');
const assetsDistDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsSrcDir)) {
  copyDir(assetsSrcDir, assetsDistDir, false);
  console.log(`✓ Copiado diretório: assets/`);
} else {
  console.warn(`⚠ Diretório não encontrado: assets`);
}

const optimizeImagesScript = path.join(__dirname, 'scripts', 'optimize-images.js');
if (fs.existsSync(optimizeImagesScript)) {
  try {
    require('child_process').execSync(`node "${optimizeImagesScript}"`, { stdio: 'inherit' });
  } catch (err) {
    console.warn('⚠ Erro ao otimizar imagens (continuando build)...');
  }
} else {
  console.log('ℹ Script de otimização de imagens não encontrado. Imagens copiadas normalmente.');
}

const configDir = path.join(srcDir, 'config');
const configFiles = ['robots.txt', 'sitemap.xml', '_headers'];

configFiles.forEach(file => {
  const srcFile = path.join(configDir, file);
  if (fs.existsSync(srcFile)) {
    const destFile = path.join(distDir, file);
    fs.copyFileSync(srcFile, destFile);
    console.log(`✓ Copiado: ${file}`);
  }
});

console.log('\n✅ Build concluído! Os arquivos estão em ./dist/');
console.log('📂 Abra dist/index.html no navegador para visualizar.');
