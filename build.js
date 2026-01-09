#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Importar bibliotecas de minificação (com fallback se não instaladas)
let htmlMinifier, terser, CleanCSS, PurgeCSS;
try {
  htmlMinifier = require('html-minifier-terser');
  terser = require('terser');
  CleanCSS = require('clean-css');
  PurgeCSS = require('purgecss').PurgeCSS;
} catch (e) {
  console.warn('⚠ Bibliotecas de minificação não encontradas. Execute: npm install');
  console.warn('⚠ Continuando com minificação básica...');
}

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');
const templatesDir = path.join(srcDir, 'templates');
const dataDir = path.join(srcDir, 'data');

// Mapa de arquivos com hash para atualizar referências no HTML
const assetMap = {
  css: {},
  js: {},
  images: {}
};

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Gerar hash SHA-256 mais robusto (16 caracteres hex)
function generateHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
}

// Gerar nome de arquivo com hash
function getHashedFilename(originalName, content) {
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const hash = generateHash(content);
  return `${name}.${hash}${ext}`;
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

// Tree-shaking de CSS usando PurgeCSS
async function purgeUnusedCSS(cssContent, htmlFiles, options = {}) {
  if (!PurgeCSS) {
    console.warn('⚠ PurgeCSS não disponível, pulando tree-shaking de CSS');
    return cssContent;
  }
  
  try {
    const result = await new PurgeCSS().purge({
      content: htmlFiles,
      css: [{ raw: cssContent }],
      defaultExtractor: (content) => {
        // Extrator padrão melhorado
        const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
        const innerMatches = content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
        return broadMatches.concat(innerMatches);
      },
      safelist: {
        // Manter classes críticas que podem ser adicionadas dinamicamente
        standard: [/^icon-/, /^sr-only/, /^skip-link/, /^floating-toggle/],
        deep: [/^editor/, /^terminal/, /^explorer/],
        greedy: [/^nav/, /^header/, /^footer/]
      },
      ...options
    });
    
    return result[0]?.css || cssContent;
  } catch (err) {
    console.warn('⚠ Erro no tree-shaking CSS:', err.message);
    return cssContent;
  }
}

// Minificação agressiva de CSS usando CleanCSS
async function minifyCSS(css, options = {}) {
  if (CleanCSS) {
    const cleanCSS = new CleanCSS({
      level: 2, // Otimização agressiva
      compatibility: 'ie11', // Compatibilidade mínima
      format: false, // Sem formatação
      inline: false, // Não inline @import
      rebase: false,
      ...options
    });
    const result = cleanCSS.minify(css);
    if (result.errors && result.errors.length > 0) {
      console.warn('⚠ Erros na minificação CSS:', result.errors);
    }
    return result.styles || css;
  }
  // Fallback básico
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

// Minificação agressiva de JS usando Terser
async function minifyJS(js, options = {}) {
  if (terser) {
    try {
      const result = await terser.minify(js, {
        compress: {
          drop_console: false, // Manter console para debug
          drop_debugger: true,
          ecma: 2020,
          passes: 2, // Múltiplas passadas para otimização máxima
          unsafe: false,
          unsafe_comps: false,
          unsafe_math: false,
          unsafe_methods: false,
          ...options.compress
        },
        mangle: {
          toplevel: false,
          ...options.mangle
        },
        format: {
          comments: false,
          ...options.format
        },
        ...options
      });
      return result.code || js;
    } catch (err) {
      console.warn('⚠ Erro na minificação JS:', err.message);
      return js;
    }
  }
  // Fallback básico
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

// Minificação agressiva de HTML
async function minifyHTML(html) {
  if (htmlMinifier) {
    return htmlMinifier.minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: false, // CSS já será minificado separadamente
      minifyJS: false, // JS já será minificado separadamente
      removeEmptyAttributes: true,
      removeOptionalTags: false, // Manter tags opcionais para compatibilidade
      removeAttributeQuotes: false, // Manter aspas para compatibilidade
      caseSensitive: false,
      conservativeCollapse: false,
      decodeEntities: true,
      html5: true,
      keepClosingSlash: false,
      maxLineLength: false,
      minifyURLs: true,
      preserveLineBreaks: false,
      quoteCharacter: '"',
      removeTagWhitespace: true,
      sortAttributes: false,
      sortClassName: false
    });
  }
  // Fallback básico
  return html
    .replace(/\s+/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
}

/**
 * Consolida scripts não essenciais em um único bundle
 * Scripts não essenciais: terminal, syntax highlight, explorer features, etc.
 */
function consolidateNonEssentialJS(jsSrcDir, jsDistDir) {
  const nonEssentialFiles = [
    'code-highlighter.js',
    'code-copy.js',
    'preview-toggle.js',
    'explorer-resize.js',
    'explorer-highlight.js',
    'explorer-actions.js',
    'explorer-controls.js',
    'terminal-resize.js',
    'terminal/terminal-core.js',
    'terminal/terminal-terminal.js',
    'terminal/terminal-output.js',
    'output.js'
  ];
  
  let bundleContent = `/**
 * Bundle de scripts não essenciais
 * Carregado após o First Contentful Paint para não bloquear renderização
 * Inclui: terminal, syntax highlight, explorer features, etc.
 */
(function() {
  'use strict';
  
  // Adia a execução até que o navegador esteja ocioso
  // ou após um delay mínimo para garantir que o FCP já ocorreu
  function loadNonEssentialScripts() {
`;

  // Lê e adiciona cada arquivo ao bundle (mantém IIFEs intactos)
  nonEssentialFiles.forEach(jsFile => {
    const filePath = path.join(jsSrcDir, jsFile);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      bundleContent += `\n    // === ${jsFile} ===\n`;
      bundleContent += content;
      bundleContent += '\n';
    } else {
      console.warn(`⚠ Arquivo não encontrado para bundle: ${jsFile}`);
    }
  });
  
  bundleContent += `  }
  
  // Usa requestIdleCallback se disponível, senão usa setTimeout
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (window.requestIdleCallback) {
        requestIdleCallback(loadNonEssentialScripts, { timeout: 2000 });
      } else {
        setTimeout(loadNonEssentialScripts, 1000);
      }
    });
  } else {
    if (window.requestIdleCallback) {
      requestIdleCallback(loadNonEssentialScripts, { timeout: 2000 });
    } else {
      setTimeout(loadNonEssentialScripts, 1000);
    }
  }
})();
`;

  // Salva o bundle (não minificado para debug)
  const bundlePath = path.join(jsDistDir, 'non-essential-bundle.js');
  fs.writeFileSync(bundlePath, bundleContent, 'utf8');
  console.log('✓ Bundle criado: non-essential-bundle.js');
  
  // Minifica o bundle agressivamente
  return minifyJS(bundleContent).then(minified => {
    const hash = generateHash(minified);
    const hashedName = `non-essential-bundle.${hash}.min.js`;
    const bundleMinPath = path.join(jsDistDir, hashedName);
  fs.writeFileSync(bundleMinPath, minified, 'utf8');
    console.log(`✓ Bundle minificado: ${hashedName}`);
    
    // Registrar no mapa de assets
    assetMap.js['non-essential-bundle.min.js'] = hashedName;
  
  return bundleMinPath;
  });
}

// Processar arquivos com minificação agressiva e hash
async function processAssets(src, dest, options = {}) {
  const { minify = false, addHash = false, purgeCSS = false, htmlFiles = [] } = options;
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  const processedFiles = [];
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await processAssets(srcPath, destPath, options);
    } else {
      if (minify && (entry.name.endsWith('.css') || entry.name.endsWith('.js'))) {
        const content = fs.readFileSync(srcPath, 'utf8');
        
        // Minificar
        let minified = entry.name.endsWith('.css') 
          ? await minifyCSS(content)
          : await minifyJS(content);
        
        // Tree-shaking CSS se solicitado
        if (entry.name.endsWith('.css') && purgeCSS && htmlFiles.length > 0) {
          minified = await purgeUnusedCSS(minified, htmlFiles);
        }
        
        // Gerar nome com hash se solicitado
        let finalName = entry.name.replace(/\.(css|js)$/, '.min.$1');
        if (addHash) {
          const hash = generateHash(minified);
          const ext = path.extname(finalName);
          const name = path.basename(finalName, ext);
          finalName = `${name}.${hash}${ext}`;
          
          // Registrar no mapa de assets
          const originalName = entry.name.replace(/\.(css|js)$/, '.min.$1');
          if (entry.name.endsWith('.css')) {
            assetMap.css[originalName] = finalName;
          } else {
            assetMap.js[originalName] = finalName;
          }
        }
        
        const minDestPath = path.join(dest, finalName);
        fs.writeFileSync(minDestPath, minified, 'utf8');
        console.log(`✓ Minificado: ${path.relative(srcDir, srcPath)} -> ${finalName}`);
        
        processedFiles.push({ original: entry.name, hashed: finalName, path: minDestPath });
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(`✓ Copiado: ${path.relative(srcDir, srcPath)}`);
      }
    }
  }
  
  return processedFiles;
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

async function buildIndexHtml() {
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
  html = html.replace('<!-- TEMPLATE: top-header.html -->', renderTemplate(readTemplate('top-header.html'), data));
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
  const cssSrcDir = path.join(srcDir, 'css');
  
  // Carregar e injetar CSS crítico inline no <head> (minificado)
  const criticalCssPath = path.join(cssSrcDir, 'critical.css');
  if (fs.existsSync(criticalCssPath)) {
    const criticalCssContent = fs.readFileSync(criticalCssPath, 'utf8');
    const criticalCssMinified = await minifyCSS(criticalCssContent);
    const criticalCssInline = `<style>${criticalCssMinified}</style>`;
    
    // Inserir CSS crítico inline antes do primeiro stylesheet
    html = html.replace(/(<link rel=['"]stylesheet['"])/, `${criticalCssInline}\n    $1`);
    console.log('✓ CSS crítico injetado inline no <head>');
  } else {
    console.warn('⚠ Arquivo critical.css não encontrado, pulando injeção inline');
  }
  
  // Substituir CSS por versão com hash
  const mainCssOriginal = 'main.min.css';
  const mainCssHashed = assetMap.css[mainCssOriginal] || mainCssOriginal;
  if (mainCssHashed !== mainCssOriginal) {
    const cssPath = `./css/${mainCssHashed}`;
    html = html.replace(/href=["']\.\/css\/main\.css["']/g, `href="${cssPath}"`);
    
    // Adicionar preload do CSS principal
    const preloadLink = `<link rel="preload" href="${cssPath}" as="style">`;
    html = html.replace(/(<link rel="preconnect"[^>]*>)/, `$1\n    ${preloadLink}`);
    console.log(`✓ CSS atualizado para versão com hash: ${mainCssHashed}`);
  }
  
  // Scripts essenciais (carregam com defer, não bloqueiam FCP)
  const essentialJSFiles = ['theme.js', 'navigation.js', 'header-command-palette.js', 'editor-tabs.js'];
  
  // Substituir scripts essenciais por versões com hash
  essentialJSFiles.forEach(jsFile => {
    const originalMin = `${jsFile.replace(/\.js$/, '')}.min.js`;
    const hashedName = assetMap.js[originalMin] || originalMin;
    if (hashedName !== originalMin) {
      const originalPath = `./js/${jsFile}`;
      const hashedPath = `./js/${hashedName}`;
      html = html.replace(
        new RegExp(`src=["']${originalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g'),
        `src="${hashedPath}"`
      );
      console.log(`✓ JS atualizado para versão com hash: ${hashedName}`);
    }
  });
  
  // Remover scripts não essenciais do HTML (serão carregados via bundle)
  const nonEssentialJSFiles = [
    'terminal/terminal-core.js',
    'terminal/terminal-terminal.js',
    'terminal/terminal-output.js',
    'code-highlighter.js',
    'code-copy.js',
    'preview-toggle.js',
    'explorer-resize.js',
    'explorer-highlight.js',
    'terminal-resize.js',
    'main.js'
  ];
  
  nonEssentialJSFiles.forEach(jsFile => {
    const originalPath = `./js/${jsFile}`;
    html = html.replace(
      new RegExp(`<script[^>]*src=["']${originalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*></script>\\s*`, 'g'),
      ''
    );
  });
  
  // Adicionar bundle não essencial ao final do body (com defer)
  const bundleOriginal = 'non-essential-bundle.min.js';
  const bundleHashed = assetMap.js[bundleOriginal] || bundleOriginal;
  const bundlePath = `./js/${bundleHashed}`;
  const bundleScript = `<script src="${bundlePath}" defer></script>`;
  html = html.replace(/(<\/body>)/, `    ${bundleScript}\n$1`);
  console.log(`✓ Bundle não essencial adicionado: ${bundleHashed}`);
  
  // Minificar HTML agressivamente
  html = await minifyHTML(html);
  
  const distIndexPath = path.join(distDir, 'index.html');
  fs.writeFileSync(distIndexPath, html, 'utf8');
  console.log('✓ Montado: index.html (minificado e otimizado)');
  console.log('✓ Otimizado: arquivos com hash de cache aplicado');
}

// Função principal de build (assíncrona)
async function build() {
  console.log('🚀 Iniciando build otimizado...\n');
  
  // Processar CSS primeiro (consolidar e minificar)
const cssSrcDir = path.join(srcDir, 'css');
const cssDistDir = path.join(distDir, 'css');
if (fs.existsSync(cssSrcDir)) {
    // Copiar CSS primeiro
    await processAssets(cssSrcDir, cssDistDir, { minify: false, addHash: false });
  
    // Consolidar main.css
  const mainCssPath = path.join(cssDistDir, 'main.css');
  if (fs.existsSync(mainCssPath)) {
    const mainCssContent = fs.readFileSync(mainCssPath, 'utf8');
    const consolidated = consolidateCSS(mainCssContent, cssDistDir);
    fs.writeFileSync(mainCssPath, consolidated, 'utf8');
    console.log('✓ Consolidado: main.css (resolvidos @import)');
    
      // Minificar com hash
      const minified = await minifyCSS(consolidated);
      const hash = generateHash(minified);
      const hashedName = `main.${hash}.min.css`;
      const minPath = path.join(cssDistDir, hashedName);
      fs.writeFileSync(minPath, minified, 'utf8');
      assetMap.css['main.min.css'] = hashedName;
      console.log(`✓ Minificado: main.css -> ${hashedName}`);
  }
  
  console.log(`✓ Processado diretório: css/`);
} else {
  console.warn(`⚠ Diretório não encontrado: css`);
}

  // Processar JS (minificar com hash)
  const jsSrcDir = path.join(srcDir, 'js');
  const jsDistDir = path.join(distDir, 'js');
  if (fs.existsSync(jsSrcDir)) {
    await processAssets(jsSrcDir, jsDistDir, { 
      minify: true, 
      addHash: true,
      purgeCSS: false 
    });
    console.log(`✓ Processado diretório: js/`);
    
    // Consolida scripts não essenciais em bundle
    await consolidateNonEssentialJS(jsSrcDir, jsDistDir);
  } else {
    console.warn(`⚠ Diretório não encontrado: js`);
  }
  
  // Processar HTML (depois de ter os assets com hash)
  const indexPath = path.join(srcDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    if (indexContent.includes('<!-- TEMPLATE:')) {
      await buildIndexHtml();
    } else {
      // Minificar HTML mesmo sem templates
      const html = fs.readFileSync(indexPath, 'utf8');
      const minified = await minifyHTML(html);
      fs.writeFileSync(path.join(distDir, 'index.html'), minified, 'utf8');
      console.log('✓ Copiado e minificado: index.html (fallback)');
    }
  } else {
    console.warn('⚠ Nenhum arquivo index encontrado!');
  }
  
  // Processar 404.html
  const error404Path = path.join(srcDir, '404.html');
  if (fs.existsSync(error404Path)) {
    const html404 = fs.readFileSync(error404Path, 'utf8');
    const minified404 = await minifyHTML(html404);
    fs.writeFileSync(path.join(distDir, '404.html'), minified404, 'utf8');
    console.log('✓ Copiado e minificado: 404.html');
  }

  // Copiar assets (imagens, favicons, etc)
  const assetsSrcDir = path.join(srcDir, 'assets');
  const assetsDistDir = path.join(distDir, 'assets');
  if (fs.existsSync(assetsSrcDir)) {
    await processAssets(assetsSrcDir, assetsDistDir, { minify: false, addHash: false });
    console.log(`✓ Copiado diretório: assets/`);
  } else {
    console.warn(`⚠ Diretório não encontrado: assets`);
  }

  // Otimizar imagens (se script disponível)
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

  // Copiar arquivos de configuração
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
  console.log('\n📊 Resumo de otimizações:');
  console.log(`   - CSS com hash: ${Object.keys(assetMap.css).length} arquivo(s)`);
  console.log(`   - JS com hash: ${Object.keys(assetMap.js).length} arquivo(s)`);
  console.log('   - HTML minificado');
  console.log('   - Compatível com Cloudflare CDN');
}

// Executar build
build().catch(err => {
  console.error('❌ Erro no build:', err);
  process.exit(1);
});
