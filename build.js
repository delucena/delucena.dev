#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');
const templatesDir = path.join(srcDir, 'templates');
const dataDir = path.join(srcDir, 'data');
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

function loadData() {
  const dataFiles = {
    profile: 'profile.json',
    experience: 'experience.json',
    skills: 'skills.json',
    contact: 'contact.json',
    meta: 'meta.json',
    pages: 'pages.json'
  };
  
  const data = {};
  for (const [key, filename] of Object.entries(dataFiles)) {
    const filePath = path.join(dataDir, filename);
    if (fs.existsSync(filePath)) {
      try {
        data[key] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`✓ Carregado: ${filename}`);
      } catch (err) {
        console.warn(`⚠ Erro ao carregar ${filename}: ${err.message}`);
        data[key] = {};
      }
    } else {
      console.warn(`⚠ Arquivo de dados não encontrado: ${filename}`);
      data[key] = {};
    }
  }
  return data;
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

function renderTemplate(template, data) {
  let result = template;
  
  // Função auxiliar para processar um único nível de loops
  function processLoops(str, ctx) {
    let result = str;
    let changed = true;
    let iterations = 0;
    
    while (changed && iterations < 20) {
      iterations++;
      const before = result;
      
      // Encontrar o primeiro {{#each}} não processado
      const eachMatch = result.match(/\{\{#each\s+([^}]+)\}\}/);
      if (!eachMatch) {
        break; // Não há mais loops para processar
      }
      
      const startIndex = eachMatch.index;
      const arrayPath = eachMatch[1].trim();
      
      // Encontrar o {{/each}} correspondente (contando aninhamento)
      let depth = 1;
      let currentIndex = startIndex + eachMatch[0].length;
      let endIndex = -1;
      
      while (depth > 0 && currentIndex < result.length) {
        const nextEach = result.indexOf('{{#each', currentIndex);
        const nextEndEach = result.indexOf('{{/each}}', currentIndex);
        
        if (nextEndEach === -1) break;
        
        if (nextEach !== -1 && nextEach < nextEndEach) {
          depth++;
          currentIndex = nextEach + 7;
        } else {
          depth--;
          if (depth === 0) {
            endIndex = nextEndEach;
            break;
          }
          currentIndex = nextEndEach + 9;
        }
      }
      
      if (endIndex === -1) {
        break; // Não encontrou o fechamento correspondente
      }
      
      const loopTemplate = result.substring(startIndex + eachMatch[0].length, endIndex);
      const fullMatch = result.substring(startIndex, endIndex + 9);
      
      const array = getNestedValue(ctx, arrayPath);
      let replacement = '';
      
      if (Array.isArray(array)) {
        replacement = array.map((item) => {
          // Criar contexto mesclando contexto global com propriedades do item
          const itemData = { ...ctx };
          // Se o item for um objeto, adicionar suas propriedades ao contexto
          if (item && typeof item === 'object') {
            Object.keys(item).forEach(key => {
              itemData[key] = item[key];
            });
          }
          // Adicionar 'this' para referenciar o item atual (útil para arrays de strings)
          itemData.this = item;
          // Processar template recursivamente (processa loops aninhados e placeholders)
          return processTemplate(loopTemplate, itemData);
        }).join('');
      } else if (array && typeof array === 'object' && !Array.isArray(array)) {
        // Para objetos (como skills)
        replacement = Object.entries(array).map(([key, value]) => {
          if (value && typeof value === 'object' && 'title' in value && 'items' in value) {
            // Criar contexto com todas as propriedades do objeto value
            const itemData = { ...ctx };
            Object.keys(value).forEach(prop => {
              itemData[prop] = value[prop];
            });
            // Também adicionar como category, title, items para compatibilidade
            itemData.category = value;
            itemData.title = value.title;
            itemData.items = value.items;
            return processTemplate(loopTemplate, itemData);
          }
          return '';
        }).join('');
      }
      
      result = result.replace(fullMatch, replacement);
      changed = (before !== result);
    }
    
    return result;
  }
  
  // Função auxiliar para processar condicionais
  function processConditionals(str, ctx) {
    return str.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, varPath, content) => {
      const value = getNestedValue(ctx, varPath.trim());
      const hasValue = value !== null && value !== undefined && value !== false && 
                       (!Array.isArray(value) || value.length > 0) &&
                       (typeof value !== 'object' || Object.keys(value).length > 0);
      return hasValue ? content : '';
    });
  }
  
  // Função auxiliar para processar placeholders
  function processPlaceholders(str, ctx) {
    return str.replace(/\{\{([^}]+)\}\}/g, (match, varPath) => {
      const trimmedPath = varPath.trim();
      // Ignorar se já foi processado por um loop ou condicional
      if (trimmedPath.startsWith('#') || trimmedPath.startsWith('/')) {
        return match;
      }
      // Tratar 'this' como referência ao item atual
      let value;
      if (trimmedPath === 'this') {
        value = ctx.this;
      } else {
        value = getNestedValue(ctx, trimmedPath);
      }
      if (value === null || value === undefined) {
        return '';
      }
      // Se for objeto ou array, converter para JSON (útil para structured data)
      if (typeof value === 'object' && !Array.isArray(value)) {
        return JSON.stringify(value, null, 2);
      }
      return String(value);
    });
  }
  
  // Função principal de processamento recursivo
  function processTemplate(tmpl, ctx) {
    let processed = tmpl;
    let changed = true;
    let iterations = 0;
    const maxIterations = 15;
    
    while (changed && iterations < maxIterations) {
      iterations++;
      const before = processed;
      
      // Processar loops primeiro (processa loops aninhados recursivamente)
      processed = processLoops(processed, ctx);
      // Processar condicionais
      processed = processConditionals(processed, ctx);
      // Processar placeholders
      processed = processPlaceholders(processed, ctx);
      
      changed = (before !== processed);
    }
    
    return processed;
  }
  
  // Primeiro, processar loops externos que podem conter loops aninhados
  result = processTemplate(result, data);
  
  return result;
}

function getAssetVersion(assetPath) {
  if (!fs.existsSync(assetPath)) {
    return '';
  }
  const content = fs.readFileSync(assetPath, 'utf8');
  return generateHash(content).substring(0, 8);
}

function buildIndexHtml() {
  // Carregar dados JSON
  const data = loadData();
  
  // Normalizar configuração de páginas com valores padrão
  const defaultSections = {
    index: { enabled: true },
    experience: { enabled: true },
    skills: { enabled: true },
    contact: { enabled: true },
    readme: { enabled: true }
  };
  
  const pagesConfig = data.pages && data.pages.sections ? data.pages.sections : {};
  
  // Garantir que todas as seções tenham configuração (mesclar com padrões)
  if (!data.pages) {
    data.pages = {};
  }
  if (!data.pages.sections) {
    data.pages.sections = {};
  }
  
  // Mesclar configurações do usuário com padrões
  Object.keys(defaultSections).forEach(key => {
    if (!data.pages.sections[key]) {
      data.pages.sections[key] = defaultSections[key];
    } else {
      // Garantir que 'enabled' existe (padrão true se não especificado)
      if (data.pages.sections[key].enabled === undefined) {
        data.pages.sections[key].enabled = true;
      }
    }
  });
  
  const baseHtml = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');
  let html = baseHtml;
  
  // Processar templates com dados
  html = html.replace('<!-- TEMPLATE: navigation.html -->', renderTemplate(readTemplate('navigation.html'), data));
  
  // Processar editor-header e garantir que o primeiro item habilitado tenha checked
  let editorHeader = renderTemplate(readTemplate('editor-header.html'), data);
  // Encontrar o primeiro input radio habilitado e adicionar checked
  const enabledSections = ['readme', 'index', 'experience', 'skills', 'contact'];
  let firstChecked = false;
  enabledSections.forEach(sectionKey => {
    if (data.pages.sections[sectionKey] && data.pages.sections[sectionKey].enabled !== false) {
      if (!firstChecked) {
        // Adicionar checked ao primeiro item habilitado
        editorHeader = editorHeader.replace(
          new RegExp(`(<input type="radio" name="openedFile" id="${sectionKey}")([^>]*>)`, 'i'),
          `$1 checked$2`
        );
        firstChecked = true;
      } else {
        // Remover checked de outros itens
        editorHeader = editorHeader.replace(
          new RegExp(`(<input type="radio" name="openedFile" id="${sectionKey}")([^>]*checked[^>]*>)`, 'i'),
          `$1>`
        );
      }
    }
  });
  html = html.replace('<!-- TEMPLATE: editor-header.html -->', editorHeader);
  
  // Processar seções baseado na configuração de páginas
  const sections = [
    { key: 'index', template: 'sections/index-section.html' },
    { key: 'experience', template: 'sections/experience-section.html' },
    { key: 'skills', template: 'sections/skills-section.html' },
    { key: 'contact', template: 'sections/contact-section.html' },
    { key: 'readme', template: 'sections/readme-section.html' }
  ];
  
  sections.forEach(section => {
    const sectionConfig = data.pages.sections[section.key];
    const isEnabled = sectionConfig && sectionConfig.enabled !== false;
    
    if (isEnabled) {
      const templatePath = section.template;
      const templateContent = renderTemplate(readTemplate(templatePath), data);
      html = html.replace(`<!-- TEMPLATE: ${templatePath} -->`, templateContent);
      console.log(`✓ Seção incluída: ${section.key}`);
    } else {
      // Remover o placeholder da seção desabilitada
      html = html.replace(`<!-- TEMPLATE: ${section.template} -->`, '');
      console.log(`⊘ Seção desabilitada: ${section.key}`);
    }
  });
  
  let terminalHtml = readTemplate('terminal/terminal.html');
  terminalHtml = terminalHtml.replace('<!-- TEMPLATE: terminal-header.html -->', readTemplate('terminal/terminal-header.html'));
  terminalHtml = terminalHtml.replace('<!-- TEMPLATE: terminal-tabs/problems-tab.html -->', readTemplate('terminal/terminal-tabs/problems-tab.html'));
  terminalHtml = terminalHtml.replace('<!-- TEMPLATE: terminal-tabs/output-tab.html -->', readTemplate('terminal/terminal-tabs/output-tab.html'));
  terminalHtml = terminalHtml.replace('<!-- TEMPLATE: terminal-tabs/terminal-tab.html -->', readTemplate('terminal/terminal-tabs/terminal-tab.html'));
  terminalHtml = terminalHtml.replace('<!-- TEMPLATE: terminal-tabs/debug-tab.html -->', readTemplate('terminal/terminal-tabs/debug-tab.html'));
  terminalHtml = terminalHtml.replace('<!-- TEMPLATE: terminal-tabs/ports-tab.html -->', readTemplate('terminal/terminal-tabs/ports-tab.html'));
  html = html.replace('<!-- TEMPLATE: terminal.html -->', terminalHtml);
  
  html = html.replace('<!-- TEMPLATE: footer.html -->', renderTemplate(readTemplate('footer.html'), data));
  
  // Processar o HTML base com dados (meta tags, etc)
  html = renderTemplate(html, data);
  
  // Otimizações de performance: usar arquivos minificados e adicionar versionamento
  const cssDistDir = path.join(distDir, 'css');
  const jsDistDir = path.join(distDir, 'js');
  
  // Substituir CSS por versão minificada com versionamento
  const mainCssMinPath = path.join(cssDistDir, 'main.min.css');
  if (fs.existsSync(mainCssMinPath)) {
    const cssVersion = getAssetVersion(mainCssMinPath);
    const cssVersionQuery = cssVersion ? `?v=${cssVersion}` : '';
    const cssMinPath = `./css/main.min.css${cssVersionQuery}`;
    
    // Substituir referências ao CSS principal
    html = html.replace(/href=["']\.\/css\/main\.css["']/g, `href="${cssMinPath}"`);
    
    // Adicionar preload do CSS crítico no <head> (antes do link stylesheet)
    const preloadLink = `    <link rel="preload" href="${cssMinPath}" as="style">\n    `;
    // Inserir após o último meta tag ou antes do primeiro stylesheet
    html = html.replace(/(<link rel="preconnect"[^>]*>)/, `$1\n${preloadLink}`);
  }
  
  // Substituir JS por versões minificadas com versionamento
  const jsFiles = [
    'theme.js', 'navigation.js', 'terminal/terminal-core.js', 
    'terminal/terminal-terminal.js', 'terminal/terminal-output.js',
    'code-highlighter.js', 'code-copy.js', 'preview-toggle.js',
    'explorer-resize.js', 'terminal-resize.js', 'main.js'
  ];
  
  jsFiles.forEach(jsFile => {
    const jsMinPath = path.join(jsDistDir, jsFile.replace(/\.js$/, '.min.js'));
    if (fs.existsSync(jsMinPath)) {
      const jsVersion = getAssetVersion(jsMinPath);
      const jsVersionQuery = jsVersion ? `?v=${jsVersion}` : '';
      const originalPath = `./js/${jsFile}`;
      const minPath = `./js/${jsFile.replace(/\.js$/, '.min.js')}`;
      
      // Substituir referências ao JS
      html = html.replace(
        new RegExp(`src=["']${originalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g'),
        `src="${minPath}${jsVersionQuery}"`
      );
    }
  });
  
  const distIndexPath = path.join(distDir, 'index.html');
  fs.writeFileSync(distIndexPath, html, 'utf8');
  console.log('✓ Montado: index.html (a partir de templates com dados injetados)');
  console.log('✓ Otimizado: arquivos minificados e versionamento aplicado');
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
