#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const DIST_DIR = path.join(__dirname, '..', 'dist');

// Função para matar o processo na porta
function killProcessOnPort(port) {
  try {
    console.log(`🔍 Verificando se a porta ${port} está em uso...`);
    const pids = execSync(`lsof -ti:${port}`, { encoding: 'utf8' }).trim();
    
    if (pids) {
      const pidList = pids.split('\n').filter(pid => pid.trim());
      console.log(`⚠️  Porta ${port} está em uso por ${pidList.length} processo(s): ${pidList.join(', ')}`);
      console.log(`🔄 Encerrando processo(s)...`);
      
      // Mata todos os processos encontrados
      pidList.forEach(pid => {
        try {
          execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
        } catch (error) {
          // Processo pode já ter sido encerrado
        }
      });
      
      // Aguarda um pouco para garantir que a porta foi liberada
      return new Promise((resolve) => {
        setTimeout(() => {
          // Verifica novamente se a porta foi liberada
          try {
            execSync(`lsof -ti:${port}`, { stdio: 'ignore' });
            console.log(`⚠️  Ainda há processos na porta. Tentando novamente...`);
            setTimeout(resolve, 500);
          } catch (error) {
            console.log(`✅ Porta ${port} liberada com sucesso.`);
            resolve();
          }
        }, 500);
      });
    } else {
      console.log(`✅ Porta ${port} está livre.`);
      return Promise.resolve();
    }
  } catch (error) {
    // Porta não está em uso ou não há processo para matar
    console.log(`✅ Porta ${port} está livre.`);
    return Promise.resolve();
  }
}

// Função para verificar se o diretório dist existe
function checkDistDir() {
  if (!fs.existsSync(DIST_DIR)) {
    console.log('📦 Diretório dist não encontrado. Executando build...');
    execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  }
}

// Função para iniciar o servidor
function startServer() {
  console.log(`\n🌐 Iniciando servidor HTTP na porta ${PORT}...`);
  console.log(`📂 Servindo arquivos de: ${DIST_DIR}`);
  console.log(`\n✨ Acesse: http://localhost:${PORT}\n`);
  console.log('💡 Pressione Ctrl+C para parar o servidor\n');
  
  // Inicia o servidor Python
  const server = spawn('python3', ['-m', 'http.server', PORT.toString(), '--directory', DIST_DIR], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  // Trata o encerramento do processo
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Encerrando servidor...');
    server.kill();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n\n🛑 Encerrando servidor...');
    server.kill();
    process.exit(0);
  });
  
  server.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`\n❌ Servidor encerrado com código ${code}`);
      process.exit(code);
    }
  });
  
  server.on('error', (error) => {
    console.error(`\n❌ Erro ao iniciar servidor: ${error.message}`);
    process.exit(1);
  });
}

// Função principal
async function main() {
  console.log('🚀 Iniciando servidor de desenvolvimento...\n');
  
  try {
    // Verifica e cria dist se necessário
    checkDistDir();
    
    // Mata processo na porta se existir e aguarda liberação
    await killProcessOnPort(PORT);
    
    // Inicia o servidor
    startServer();
  } catch (error) {
    console.error(`\n❌ Erro: ${error.message}`);
    process.exit(1);
  }
}

main();
