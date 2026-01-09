#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const DIST_DIR = path.join(__dirname, '..', 'dist');
const REPORTS_DIR = path.join(__dirname, '..', 'lighthouse-reports');
const URL = `http://localhost:${PORT}`;

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Função para matar o processo na porta
function killProcessOnPort(port) {
  try {
    const pids = execSync(`lsof -ti:${port}`, { encoding: 'utf8', stdio: 'pipe' }).trim();
    if (pids) {
      const pidList = pids.split('\n').filter(pid => pid.trim());
      pidList.forEach(pid => {
        try {
          execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
        } catch (error) {
          // Processo pode já ter sido encerrado
        }
      });
      return new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    }
  } catch (error) {
    // Porta não está em uso
  }
  return Promise.resolve();
}

// Função para verificar se o diretório dist existe
function checkDistDir() {
  if (!fs.existsSync(DIST_DIR)) {
    log('📦 Diretório dist não encontrado. Executando build...', 'yellow');
    execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  }
}

// Função para criar diretório de relatórios
function createReportsDir() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

// Função para iniciar o servidor
function startServer() {
  return new Promise((resolve, reject) => {
    log(`🌐 Iniciando servidor HTTP na porta ${PORT}...`, 'cyan');
    
    const server = spawn('python3', ['-m', 'http.server', PORT.toString(), '--directory', DIST_DIR], {
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });
    
    let serverReady = false;
    
    // Aguarda o servidor estar pronto
    server.stdout.on('data', (data) => {
      if (!serverReady) {
        serverReady = true;
        setTimeout(() => resolve(server), 1000);
      }
    });
    
    server.stderr.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Serving HTTP')) {
        if (!serverReady) {
          serverReady = true;
          setTimeout(() => resolve(server), 1000);
        }
      }
    });
    
    server.on('error', (error) => {
      reject(error);
    });
    
    // Timeout de segurança
    setTimeout(() => {
      if (!serverReady) {
        serverReady = true;
        resolve(server);
      }
    }, 3000);
  });
}

// Função para executar Lighthouse
async function runLighthouse(formFactor, outputFile) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const basePath = path.join(REPORTS_DIR, `${outputFile}-${timestamp}`);
  const reportPath = `${basePath}.html`;
  const jsonPath = `${basePath}.json`;
  
  log(`\n🔍 Executando Lighthouse ${formFactor}...`, 'blue');
  
  try {
    // Para mobile usa --form-factor=mobile, para desktop usa --preset=desktop
    const presetFlag = formFactor === 'mobile' 
      ? '--form-factor=mobile' 
      : '--preset=desktop';
    
    const command = `lighthouse "${URL}" ` +
      `${presetFlag} ` +
      `--output=html,json ` +
      `--output-path="${basePath}" ` +
      `--chrome-flags="--headless --no-sandbox" ` +
      `--quiet ` +
      `--only-categories=performance,accessibility,best-practices,seo`;
    
    execSync(command, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, PATH: process.env.PATH },
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    
    // Verifica se os arquivos foram criados
    let actualReportPath = reportPath;
    let actualJsonPath = jsonPath;
    
    if (!fs.existsSync(reportPath)) {
      // Tenta encontrar o arquivo com timestamp diferente (Lighthouse pode gerar timestamp próprio)
      const files = fs.readdirSync(REPORTS_DIR).filter(f => 
        f.startsWith(outputFile) && (f.endsWith('.html') || f.endsWith('.json'))
      );
      
      if (files.length > 0) {
        // Ordena por data de modificação (mais recente primeiro)
        const sortedFiles = files.sort((a, b) => {
          const statA = fs.statSync(path.join(REPORTS_DIR, a));
          const statB = fs.statSync(path.join(REPORTS_DIR, b));
          return statB.mtime - statA.mtime;
        });
        
        const htmlFile = sortedFiles.find(f => f.endsWith('.html'));
        const jsonFile = sortedFiles.find(f => f.endsWith('.json'));
        
        if (htmlFile) actualReportPath = path.join(REPORTS_DIR, htmlFile);
        if (jsonFile) actualJsonPath = path.join(REPORTS_DIR, jsonFile);
      }
    }
    
    if (fs.existsSync(actualReportPath)) {
      log(`✅ Relatório ${formFactor} salvo em: ${actualReportPath}`, 'green');
    } else {
      log(`⚠️  Relatório HTML não encontrado em: ${reportPath}`, 'yellow');
    }
    
    return { reportPath: actualReportPath, jsonPath: actualJsonPath };
  } catch (error) {
    log(`❌ Erro ao executar Lighthouse ${formFactor}: ${error.message}`, 'red');
    throw error;
  }
}

// Função para extrair scores do JSON
function extractScores(jsonPath) {
  try {
    if (!fs.existsSync(jsonPath)) {
      log(`⚠️  Arquivo JSON não encontrado: ${jsonPath}`, 'yellow');
      return null;
    }
    
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonContent);
    
    return {
      performance: Math.round((data.categories?.performance?.score || 0) * 100),
      accessibility: Math.round((data.categories?.accessibility?.score || 0) * 100),
      bestPractices: Math.round((data.categories?.['best-practices']?.score || 0) * 100),
      seo: Math.round((data.categories?.seo?.score || 0) * 100),
      lcp: data.audits?.['largest-contentful-paint']?.numericValue,
      fcp: data.audits?.['first-contentful-paint']?.numericValue,
      cls: data.audits?.['cumulative-layout-shift']?.numericValue,
      inp: data.audits?.['interaction-to-next-paint']?.numericValue,
      tti: data.audits?.['interactive']?.numericValue,
    };
  } catch (error) {
    log(`⚠️  Não foi possível extrair scores do JSON: ${error.message}`, 'yellow');
    return null;
  }
}

// Função para exibir resumo
function displaySummary(mobileScores, desktopScores) {
  log('\n' + '='.repeat(60), 'bright');
  log('📊 RESUMO DOS RESULTADOS DO LIGHTHOUSE', 'bright');
  log('='.repeat(60), 'bright');
  
  if (mobileScores) {
    log('\n📱 MOBILE:', 'cyan');
    log(`   Performance:     ${mobileScores.performance}/100`, mobileScores.performance >= 90 ? 'green' : mobileScores.performance >= 50 ? 'yellow' : 'red');
    log(`   Accessibility:   ${mobileScores.accessibility}/100`, mobileScores.accessibility >= 90 ? 'green' : 'yellow');
    log(`   Best Practices:  ${mobileScores.bestPractices}/100`, mobileScores.bestPractices >= 90 ? 'green' : 'yellow');
    log(`   SEO:             ${mobileScores.seo}/100`, mobileScores.seo >= 90 ? 'green' : 'yellow');
    if (mobileScores.lcp) log(`   LCP:             ${(mobileScores.lcp / 1000).toFixed(2)}s`, mobileScores.lcp < 2500 ? 'green' : mobileScores.lcp < 4000 ? 'yellow' : 'red');
    if (mobileScores.fcp) log(`   FCP:             ${(mobileScores.fcp / 1000).toFixed(2)}s`, mobileScores.fcp < 1800 ? 'green' : mobileScores.fcp < 3000 ? 'yellow' : 'red');
    if (mobileScores.cls) log(`   CLS:             ${mobileScores.cls.toFixed(3)}`, mobileScores.cls < 0.1 ? 'green' : mobileScores.cls < 0.25 ? 'yellow' : 'red');
    if (mobileScores.inp) log(`   INP:             ${mobileScores.inp}ms`, mobileScores.inp < 200 ? 'green' : mobileScores.inp < 500 ? 'yellow' : 'red');
    if (mobileScores.tti) log(`   TTI:             ${(mobileScores.tti / 1000).toFixed(2)}s`, mobileScores.tti < 3800 ? 'green' : mobileScores.tti < 7300 ? 'yellow' : 'red');
  }
  
  if (desktopScores) {
    log('\n🖥️  DESKTOP:', 'cyan');
    log(`   Performance:     ${desktopScores.performance}/100`, desktopScores.performance >= 90 ? 'green' : desktopScores.performance >= 50 ? 'yellow' : 'red');
    log(`   Accessibility:   ${desktopScores.accessibility}/100`, desktopScores.accessibility >= 90 ? 'green' : 'yellow');
    log(`   Best Practices:  ${desktopScores.bestPractices}/100`, desktopScores.bestPractices >= 90 ? 'green' : 'yellow');
    log(`   SEO:             ${desktopScores.seo}/100`, desktopScores.seo >= 90 ? 'green' : 'yellow');
    if (desktopScores.lcp) log(`   LCP:             ${(desktopScores.lcp / 1000).toFixed(2)}s`, desktopScores.lcp < 2500 ? 'green' : desktopScores.lcp < 4000 ? 'yellow' : 'red');
    if (desktopScores.fcp) log(`   FCP:             ${(desktopScores.fcp / 1000).toFixed(2)}s`, desktopScores.fcp < 1800 ? 'green' : desktopScores.fcp < 3000 ? 'yellow' : 'red');
    if (desktopScores.cls) log(`   CLS:             ${desktopScores.cls.toFixed(3)}`, desktopScores.cls < 0.1 ? 'green' : desktopScores.cls < 0.25 ? 'yellow' : 'red');
    if (desktopScores.inp) log(`   INP:             ${desktopScores.inp}ms`, desktopScores.inp < 200 ? 'green' : desktopScores.inp < 500 ? 'yellow' : 'red');
    if (desktopScores.tti) log(`   TTI:             ${(desktopScores.tti / 1000).toFixed(2)}s`, desktopScores.tti < 3800 ? 'green' : desktopScores.tti < 7300 ? 'yellow' : 'red');
  }
  
  log('\n' + '='.repeat(60), 'bright');
  log(`📁 Relatórios salvos em: ${REPORTS_DIR}`, 'cyan');
  log('='.repeat(60) + '\n', 'bright');
}

// Função para verificar se Lighthouse está disponível
function checkLighthouse() {
  try {
    execSync('which lighthouse', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// Função principal
async function main() {
  log('🚀 Iniciando auditoria Lighthouse (Mobile e Desktop)...\n', 'bright');
  
  // Verifica se Lighthouse está disponível
  if (!checkLighthouse()) {
    log('❌ Lighthouse CLI não encontrado!', 'red');
    log('💡 Instale com: npm install -g lighthouse', 'yellow');
    process.exit(1);
  }
  
  let server = null;
  
  try {
    // Verifica e cria dist se necessário
    checkDistDir();
    
    // Cria diretório de relatórios
    createReportsDir();
    
    // Mata processo na porta se existir
    await killProcessOnPort(PORT);
    
    // Inicia o servidor
    server = await startServer();
    log(`✅ Servidor rodando em ${URL}\n`, 'green');
    
    // Aguarda um pouco para garantir que o servidor está pronto
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Executa Lighthouse Mobile
    const mobileReport = await runLighthouse('mobile', 'lighthouse-mobile');
    const mobileScores = extractScores(mobileReport.jsonPath);
    
    // Executa Lighthouse Desktop
    const desktopReport = await runLighthouse('desktop', 'lighthouse-desktop');
    const desktopScores = extractScores(desktopReport.jsonPath);
    
    // Exibe resumo
    displaySummary(mobileScores, desktopScores);
    
    log('✅ Auditoria concluída com sucesso!', 'green');
    
  } catch (error) {
    log(`\n❌ Erro durante a auditoria: ${error.message}`, 'red');
    if (error.stack) {
      log(`\nStack trace: ${error.stack}`, 'red');
    }
    process.exit(1);
  } finally {
    // Para o servidor
    if (server) {
      log('\n🛑 Encerrando servidor...', 'yellow');
      server.kill();
      await killProcessOnPort(PORT);
    }
  }
}

main();
