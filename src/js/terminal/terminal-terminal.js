/**
 * Terminal Interativo
 * Simula um terminal zsh com comandos comuns do macOS
 * 
 * @module terminal-terminal
 * @description Simula um terminal interativo com comandos do macOS/zsh
 */

(function() {
  'use strict';

  const SELECTORS = {
    terminalOutput: '#terminalOutput',
    terminalInput: '#terminalInput',
    terminalsRadio: '#terminals'
  };

  let terminalOutput;
  let terminalInput;
  let commandHistory = [];
  let historyIndex = -1;
  let currentDirectory = '~';

  // Comandos suportados e suas respostas simuladas
  const COMMANDS = {
    'ls': () => [
      'Applications',
      'Desktop',
      'Documents',
      'Downloads',
      'Library',
      'Movies',
      'Music',
      'Pictures',
      'Public',
      'src'
    ],
    'ls -lah': () => [
      'total 64',
      'drwxr-xr-x+ 15 delucena  staff   480 Jan 15 10:30 .',
      'drwxr-xr-x   5 root      admin   160 Dec 20 09:15 ..',
      '-rw-r--r--   1 delucena  staff   220 Jan 10 14:22 .bash_profile',
      '-rw-r--r--   1 delucena  staff   180 Jan 12 09:30 .gitconfig',
      'drwx------+  3 delucena  staff    96 Jan 14 16:45 .ssh',
      'drwx------+  5 delucena  staff   160 Jan 15 08:20 Applications',
      'drwx------+  8 delucena  staff   256 Jan 15 09:45 Desktop',
      'drwx------+ 12 delucena  staff   384 Jan 15 10:15 Documents',
      'drwx------+  6 delucena  staff   192 Jan 15 09:30 Downloads',
      'drwx------+  4 delucena  staff   128 Jan 15 08:00 Library',
      'drwx------+  3 delucena  staff    96 Jan 14 20:15 Movies',
      'drwx------+  4 delucena  staff   128 Jan 15 07:30 Music',
      'drwx------+  5 delucena  staff   160 Jan 15 09:00 Pictures',
      'drwxr-xr-x+  2 delucena  staff    64 Jan 10 12:00 Public',
      'drwxr-xr-x+  8 delucena  staff   256 Jan 15 10:30 src'
    ],
    'ls -la': () => COMMANDS['ls -lah'](),
    'pwd': () => [`/Users/delucena`],
    'whoami': () => [`delucena`],
    'date': () => [new Date().toLocaleString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })],
    'uptime': () => [`10:30  up 2 days,  4:15, 1 user, load averages: 1.25 1.18 1.05`],
    'ps aux': () => [
      'USER       PID  %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND',
      'delucena   1234   2.5  1.2 1234567 89012 ?      Ss   08:00   0:15 /Applications/iTerm.app',
      'delucena   2345   1.8  0.8  987654 45678 ?      S    09:15   0:08 /Applications/Google Chrome.app',
      'delucena   3456   0.5  0.3  456789 12345 ?      S    10:00   0:02 /usr/bin/zsh',
      'delucena   4567   0.2  0.1  234567  8901 ?      S    10:15   0:00 node server.js',
      'root       5678   0.1  0.0   12345  1234 ?      Ss   08:00   0:00 /usr/sbin/syslogd'
    ],
    'df -h': () => [
      'Filesystem      Size   Used  Avail Capacity iused      ifree %iused  Mounted on',
      '/dev/disk3s1s1  500Gi   45Gi  450Gi    10%  1234567  47185920    3%   /',
      'devfs           189Ki  189Ki    0Bi   100%     654         0  100%   /dev',
      '/dev/disk3s4   500Gi  250Mi  450Gi     1%       2  47185920    0%   /System/Volumes/VM',
      '/dev/disk3s5   500Gi  1.0Gi  450Gi     1%      12  47185920    0%   /System/Volumes/Preboot',
      '/dev/disk3s6   500Gi  500Mi  450Gi     1%       5  47185920    0%   /System/Volumes/Update'
    ],
    'du -sh *': () => [
      '1.2G\tApplications',
      '450M\tDesktop',
      '2.3G\tDocuments',
      '890M\tDownloads',
      '120M\tLibrary',
      '5.4G\tMovies',
      '2.1G\tMusic',
      '3.2G\tPictures',
      '45K\tPublic',
      '890M\tsrc'
    ],
    'echo hello': () => [`hello`],
    'echo $HOME': () => [`/Users/delucena`],
    'cat README.md': () => [
      '# delucena.dev',
      '',
      'Portfolio pessoal desenvolvido com tecnologias modernas.',
      '',
      '## Tecnologias',
      '- HTML5',
      '- CSS3',
      '- JavaScript',
      '- Spring Boot',
      '',
      '## Autor',
      'José Paulo de Lucena'
    ],
    'cd ~': () => {
      currentDirectory = '~';
      return [];
    },
    'cd ..': () => {
      if (currentDirectory !== '~') {
        currentDirectory = '~';
      }
      return [];
    },
    'cd src': () => {
      currentDirectory = '~/src';
      return [];
    },
    'cd': () => {
      currentDirectory = '~';
      return [];
    },
    'mkdir test': () => [],
    'touch file.txt': () => [],
    'rm file.txt': () => [],
    'clear': () => {
      if (terminalOutput) {
        terminalOutput.innerHTML = '';
      }
      return [];
    },
    'history': () => commandHistory.length > 0 
      ? commandHistory.map((cmd, idx) => `${idx + 1}  ${cmd}`)
      : ['No history found'],
    'git status': () => [
      'On branch main',
      'Your branch is up to date with \'origin/main\'.',
      '',
      'nothing to commit, working tree clean'
    ],
    'git log --oneline -5': () => [
      'a1b2c3d feat: add terminal simulation',
      'd4e5f6g fix: improve CSS visibility',
      'g7h8i9j refactor: simplify terminal structure',
      'j0k1l2m feat: add dark mode toggle',
      'm3n4o5p initial commit'
    ],
    'brew list': () => [
      'git',
      'node',
      'python@3.11',
      'zsh',
      'vim',
      'wget',
      'curl'
    ],
    'brew --version': () => [`Homebrew 4.1.2`],
    'node --version': () => [`v20.10.0`],
    'python3 --version': () => [`Python 3.11.6`],
    'git --version': () => [`git version 2.42.0`],
    'which git': () => [`/usr/local/bin/git`],
    'which node': () => [`/usr/local/bin/node`],
    'uname -a': () => [`Darwin MacBook-Pro.local 23.1.0 Darwin Kernel Version 23.1.0: Mon Oct  9 21:27:27 PDT 2023; root:xnu-10002.41.9~2/RELEASE_ARM64_T6000 arm64`],
    'help': () => [
      'Comandos disponíveis:',
      '  ls, ls -lah, ls -la    - Lista arquivos',
      '  pwd                     - Mostra diretório atual',
      '  cd, cd ~, cd ..         - Navega entre diretórios',
      '  whoami                  - Mostra usuário atual',
      '  date                    - Mostra data e hora',
      '  uptime                  - Tempo de atividade do sistema',
      '  ps aux                  - Lista processos',
      '  df -h                   - Espaço em disco',
      '  du -sh *                - Tamanho de diretórios',
      '  echo                    - Exibe texto',
      '  cat                     - Mostra conteúdo de arquivo',
      '  clear                   - Limpa o terminal',
      '  history                 - Histórico de comandos',
      '  git status, git log     - Comandos Git',
      '  brew                    - Homebrew package manager',
      '  which                   - Localiza executáveis',
      '  uname -a                - Informações do sistema'
    ]
  };

  /**
   * Inicializa os elementos do DOM
   * @returns {boolean} - true se os elementos foram encontrados
   */
  function initElements() {
    try {
      terminalOutput = document.querySelector(SELECTORS.terminalOutput);
      // Input será criado dinamicamente dentro do scrollable
      return !!terminalOutput;
    } catch (error) {
      console.error('Erro ao inicializar elementos do terminal:', error);
      return false;
    }
  }

  /**
   * Configura os event listeners do input
   */
  function setupInputListeners(input) {
    if (!input) return;
    
    input.addEventListener('keydown', (e) => {
      try {
        if (e.key === 'Enter') {
          const command = input.value;
          input.value = '';
          executeCommand(command);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (commandHistory.length > 0) {
            historyIndex = Math.max(0, historyIndex - 1);
            input.value = commandHistory[historyIndex] || '';
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (historyIndex < commandHistory.length - 1) {
            historyIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
            input.value = commandHistory[historyIndex + 1] || '';
          } else {
            historyIndex = commandHistory.length;
            input.value = '';
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          // Auto-complete básico
          const inputValue = input.value.trim();
          const matches = Object.keys(COMMANDS).filter(cmd => 
            cmd.startsWith(inputValue) && cmd !== inputValue
          );
          if (matches.length === 1) {
            input.value = matches[0];
          }
        }
      } catch (error) {
        console.error('Erro ao processar tecla no terminal:', error);
      }
    });
  }

  /**
   * Processa um comando e retorna a resposta
   * @param {string} command - Comando a ser processado
   * @returns {string[]} - Array de linhas de resposta
   */
  function processCommand(command) {
    try {
      const trimmed = command.trim();
      if (!trimmed) return [];

      // Adiciona ao histórico
      if (trimmed !== 'history' && commandHistory[commandHistory.length - 1] !== trimmed) {
        commandHistory.push(trimmed);
        historyIndex = commandHistory.length;
      }

      // Verifica se o comando existe
      if (COMMANDS[trimmed]) {
        const result = COMMANDS[trimmed]();
        return Array.isArray(result) ? result : [];
      }

      // Comando não encontrado
      return [`zsh: command not found: ${trimmed.split(' ')[0]}`];
    } catch (error) {
      console.error('Erro ao processar comando:', error);
      return [`Erro ao processar comando: ${error.message}`];
    }
  }

  /**
   * Adiciona uma linha ao terminal
   */
  function addLine(text, className = '') {
    if (!terminalOutput) return;
    
    const line = document.createElement('div');
    if (className) {
      line.className = className;
    }
    line.textContent = text;
    terminalOutput.appendChild(line);
    scrollToBottom();
  }

  /**
   * Adiciona múltiplas linhas
   */
  function addLines(lines, className = '') {
    lines.forEach(line => addLine(line, className));
  }

  /**
   * Cria ou atualiza o input container dentro do scrollable
   */
  function createInputContainer() {
    if (!terminalOutput) return null;
    
    // Remove input container existente se houver
    const existingInput = terminalOutput.querySelector('.terminal-terminal-input-container');
    if (existingInput) {
      existingInput.remove();
    }
    
    // Cria novo input container
    const inputContainer = document.createElement('div');
    inputContainer.className = 'terminal-terminal-input-container';
    
    const prompt = document.createElement('span');
    prompt.className = 'terminal-terminal-prompt-input';
    prompt.textContent = `delucena@macbook ${currentDirectory} %`;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'terminal-terminal-input';
    input.id = 'terminalInput';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.placeholder = 'Digite um comando...';
    
    inputContainer.appendChild(prompt);
    inputContainer.appendChild(input);
    terminalOutput.appendChild(inputContainer);
    
    // Atualiza referência do input
    terminalInput = input;
    
    // Adiciona event listeners ao novo input
    setupInputListeners(input);
    
    scrollToBottom();
    return input;
  }

  /**
   * Adiciona o prompt (sem input, apenas prompt visual)
   */
  function addPrompt() {
    if (!terminalOutput) return;
    
    const promptLine = document.createElement('div');
    promptLine.className = 'terminal-terminal-line';
    
    const prompt = document.createElement('span');
    prompt.className = 'terminal-terminal-prompt';
    prompt.textContent = `delucena@macbook ${currentDirectory} %`;
    
    promptLine.appendChild(prompt);
    terminalOutput.appendChild(promptLine);
    scrollToBottom();
  }

  /**
   * Scroll automático para o final
   */
  function scrollToBottom() {
    if (terminalOutput) {
      requestAnimationFrame(() => {
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
      });
    }
  }

  /**
   * Exibe o resultado de um comando
   */
  function executeCommand(command) {
    if (!terminalOutput || !command.trim()) return;

    // Remove o input container atual
    const currentInput = terminalOutput.querySelector('.terminal-terminal-input-container');
    if (currentInput) {
      currentInput.remove();
    }

    // Adiciona o comando digitado
    addPrompt();
    addLine(command, 'terminal-terminal-command');

    // Processa o comando
    const result = processCommand(command);
    
    // Adiciona delay para simular processamento
    setTimeout(() => {
      if (result.length > 0) {
        addLines(result);
      }
      
      // Cria novo input container no final
      const newInput = createInputContainer();
      if (newInput) {
        newInput.focus();
      }
    }, 100);
  }

  /**
   * Inicializa o terminal
   */
  function initTerminal() {
    if (!initElements()) {
      return;
    }

    // Remover placeholder se existir
    const placeholder = terminalOutput.querySelector('.terminal-placeholder');
    if (placeholder) {
      placeholder.remove();
    }

    // Limpa o terminal
    terminalOutput.innerHTML = '';

    // Mensagem de boas-vindas
    addLine('Last login: ' + new Date().toLocaleString('pt-BR') + ' on ttys000', 'terminal-terminal-info');
    addLine('');

    // Cria o input container inicial
    const initialInput = createInputContainer();
    if (initialInput) {
      initialInput.focus();
    }

    // Foca no input quando clicar no terminal
    terminalOutput.addEventListener('click', () => {
      const currentInput = terminalOutput.querySelector('.terminal-terminal-input');
      if (currentInput) {
        currentInput.focus();
      }
    });
  }

  /**
   * Inicializa quando o DOM estiver pronto
   */
  function init() {
    try {
      setTimeout(() => {
        const terminalsRadio = document.querySelector(SELECTORS.terminalsRadio);
        
        // Inicializa quando a aba terminal estiver selecionada
        if (terminalsRadio && terminalsRadio.checked) {
          setTimeout(initTerminal, 100);
        }
        
        // Observa mudanças nas abas
        const allTerminalRadios = document.querySelectorAll('.terminal > input[type="radio"]');
        allTerminalRadios.forEach(radio => {
          radio.addEventListener('change', function() {
            try {
              if (this.id === 'terminals' && this.checked) {
                setTimeout(initTerminal, 100);
              }
            } catch (error) {
              console.error('Erro ao processar mudança de aba do terminal:', error);
            }
          });
        });
      }, 50);
    } catch (error) {
      console.error('Erro ao inicializar terminal:', error);
    }
  }

  // Iniciar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
