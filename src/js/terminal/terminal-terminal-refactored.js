/**
 * Terminal Interativo
 * Simula um terminal zsh com comandos comuns do macOS
 * 
 * @module terminal-terminal
 * @description Simula um terminal interativo com comandos do macOS/zsh
 * REFATORADO: Sistema de comandos centralizado com help organizado e autocomplete
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

  // Variáveis para autocomplete
  let autocompleteIndex = -1;
  let autocompleteOptions = [];
  let lastAutocompleteInput = '';

  // Mapeamento de comandos lang para idiomas
  const LANGUAGE_MAP = {
    'pt': 'pt-BR',
    'en': 'en',
    'es': 'es'
  };

  /**
   * Obtém tradução do terminal
   */
  function getTerminalTranslation(key, params = {}) {
    if (!window.i18n || !window.i18n.getTranslation) {
      return key;
    }
    
    let translation = window.i18n.getTranslation(`terminal.${key}`);
    
    if (params && typeof translation === 'string') {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }
    
    return translation || key;
  }

  /**
   * Atualiza textos do terminal quando o idioma muda
   */
  function updateTerminalLanguage() {
    const currentLanguage = window.i18n ? window.i18n.getLocale() : 'pt-BR';
    console.log("[terminal-i18n] language:", currentLanguage);
    
    if (terminalInput) {
      terminalInput.placeholder = getTerminalTranslation('placeholder');
    }
  }

  /**
   * Navega para uma página específica
   */
  function navigateToPage(pageId) {
    const radio = document.getElementById(pageId);
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  /**
   * Define o tema do site
   */
  function setTheme(theme) {
    const themeCheckbox = document.querySelector('#theme');
    const themeLabel = document.querySelector('#themeLabel');
    
    if (!themeCheckbox) {
      return {
        success: false,
        message: getTerminalTranslation('error.themeNotAvailable')
      };
    }

    if (theme === 'dark') {
      themeCheckbox.checked = false;
      if (themeLabel) themeLabel.textContent = getTerminalTranslation('theme.dark');
      return {
        success: true,
        message: getTerminalTranslation('theme.setDark')
      };
    } else if (theme === 'light') {
      themeCheckbox.checked = true;
      if (themeLabel) themeLabel.textContent = getTerminalTranslation('theme.light');
      return {
        success: true,
        message: getTerminalTranslation('theme.setLight')
      };
    } else if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      themeCheckbox.checked = !prefersDark;
      if (themeLabel) themeLabel.textContent = getTerminalTranslation('theme.auto');
      return {
        success: true,
        message: getTerminalTranslation('theme.setAuto')
      };
    }
    
    return {
      success: false,
      message: getTerminalTranslation('error.invalidTheme')
    };
  }

  /**
   * Foca em um elemento específico da UI
   */
  function focusElement(target) {
    if (target === 'editor') {
      const editorTab = document.querySelector('.editor-tab.is-active');
      if (editorTab) {
        editorTab.focus();
        return {
          success: true,
          message: getTerminalTranslation('focus.editor')
        };
      }
    } else if (target === 'terminal') {
      const terminalInput = document.querySelector('#terminalInput');
      if (terminalInput) {
        terminalInput.focus();
        return {
          success: true,
          message: getTerminalTranslation('focus.terminal')
        };
      }
    } else if (target === 'explorer') {
      const explorerView = document.querySelector('#explorerView');
      if (explorerView) {
        explorerView.checked = true;
        const menu = document.querySelector('#menu');
        if (menu) menu.checked = true;
        return {
          success: true,
          message: getTerminalTranslation('focus.explorer')
        };
      }
    }
    
    return {
      success: false,
      message: getTerminalTranslation('error.invalidFocusTarget')
    };
  }

  /**
   * Define o layout do site
   */
  function setLayout(layout) {
    const body = document.body;
    
    if (layout === 'compact') {
      body.classList.add('layout-compact');
      body.classList.remove('layout-comfy');
      return {
        success: true,
        message: getTerminalTranslation('layout.setCompact')
      };
    } else if (layout === 'comfy') {
      body.classList.add('layout-comfy');
      body.classList.remove('layout-compact');
      return {
        success: true,
        message: getTerminalTranslation('layout.setComfy')
      };
    }
    
    return {
      success: false,
      message: getTerminalTranslation('error.invalidLayout')
    };
  }

  /**
   * ESTRUTURA CENTRALIZADA DE COMANDOS - ÚNICA FONTE DE VERDADE
   * Cada comando tem: description, group, args (array de argumentos válidos), execute (função)
   */
  const COMMANDS = {
    help: {
      description: 'Lista comandos disponíveis ou comandos de um grupo específico',
      group: 'system',
      args: [],
      execute: (arg) => {
        if (!arg) {
          // help → lista grupos
          const groups = {};
          Object.keys(COMMANDS).forEach(cmd => {
            const group = COMMANDS[cmd].group;
            if (!groups[group]) {
              groups[group] = [];
            }
            groups[group].push(cmd);
          });
          
          const output = ['Grupos disponíveis:', ''];
          Object.keys(groups).sort().forEach(group => {
            output.push(`  ${group.padEnd(15)} - ${groups[group].length} comando(s)`);
          });
          output.push('');
          output.push('Use "help <grupo>" para ver comandos de um grupo específico.');
          return output;
        } else {
          // help <group> → lista comandos do grupo
          const group = arg.toLowerCase();
          const commandsInGroup = Object.keys(COMMANDS).filter(cmd => 
            COMMANDS[cmd].group === group
          );
          
          if (commandsInGroup.length === 0) {
            return [`Grupo "${group}" não encontrado. Use "help" para ver grupos disponíveis.`];
          }
          
          const output = [`Comandos do grupo "${group}":`, ''];
          commandsInGroup.sort().forEach(cmd => {
            const cmdDef = COMMANDS[cmd];
            const argsStr = cmdDef.args.length > 0 
              ? ` [${cmdDef.args.join('|')}]` 
              : '';
            const desc = cmdDef.description.padEnd(50);
            output.push(`  ${cmd.padEnd(20)}${argsStr.padEnd(15)} - ${desc}`);
          });
          return output;
        }
      }
    },
    lang: {
      description: 'Altera o idioma do site',
      group: 'system',
      args: ['pt', 'en', 'es', 'pirate'],
      execute: (arg) => {
        if (!arg) {
          return [`Uso: lang <pt|en|es|pirate>`];
        }
        
        const langCode = arg.toLowerCase();
        
        // Comando especial: lang pirate
        if (langCode === 'pirate') {
          if (window.VisualEffects && typeof window.VisualEffects.activatePirate === 'function') {
            window.VisualEffects.activatePirate();
            return ['✔ Pirate mode activated 🏴‍☠️'];
          }
          return ['Error: Visual effects module not available'];
        }
        
        if (LANGUAGE_MAP[langCode]) {
          const locale = LANGUAGE_MAP[langCode];
          
          if (window.i18n && typeof window.i18n.setLanguage === 'function') {
            window.i18n.setLanguage(locale);
            
            setTimeout(() => {
              updateTerminalLanguage();
            }, 50);
            
            return [getTerminalTranslation(`lang.success.${langCode}`)];
          } else {
            return [getTerminalTranslation('error.i18nNotAvailable')];
          }
        } else {
          return [`✖ idioma inválido. use: lang pt | lang en | lang es`];
        }
      }
    },
    theme: {
      description: 'Altera o tema do site',
      group: 'ui',
      args: ['dark', 'light', 'auto'],
      execute: (arg) => {
        if (!arg) {
          return [`Uso: theme <dark|light|auto>`];
        }
        return [setTheme(arg).message];
      }
    },
    open: {
      description: 'Navega para uma página específica',
      group: 'navigation',
      args: ['home', 'readme', 'skills', 'contact', 'experience'],
      execute: (arg) => {
        if (!arg) {
          return [`Uso: open <home|readme|skills|contact|experience>`];
        }
        
        const pageMap = {
          'home': 'readme',
          'readme': 'readme',
          'skills': 'skills',
          'contact': 'contact',
          'experience': 'experience'
        };
        
        const pageId = pageMap[arg.toLowerCase()];
        if (pageId) {
          navigateToPage(pageId);
          return [getTerminalTranslation('open.success', { page: arg })];
        } else {
          return [`✖ página inválida. use: open home | open skills | open contact | open readme`];
        }
      }
    },
    focus: {
      description: 'Foca em um elemento da UI',
      group: 'ui',
      args: ['editor', 'terminal', 'explorer'],
      execute: (arg) => {
        if (!arg) {
          return [`Uso: focus <editor|terminal|explorer>`];
        }
        return [focusElement(arg).message];
      }
    },
    layout: {
      description: 'Altera o layout do site',
      group: 'ui',
      args: ['compact', 'comfy'],
      execute: (arg) => {
        if (!arg) {
          return [`Uso: layout <compact|comfy>`];
        }
        return [setLayout(arg).message];
      }
    },
    clear: {
      description: 'Limpa o terminal',
      group: 'system',
      args: [],
      execute: () => {
        if (terminalOutput) {
          terminalOutput.innerHTML = '';
        }
        return [];
      }
    },
    history: {
      description: 'Mostra histórico de comandos',
      group: 'system',
      args: [],
      execute: () => {
        return commandHistory.length > 0 
          ? commandHistory.map((cmd, idx) => `${(idx + 1).toString().padStart(4)}  ${cmd}`)
          : [getTerminalTranslation('history.empty')];
      }
    },
    ls: {
      description: 'Lista arquivos e diretórios',
      group: 'filesystem',
      args: [],
      execute: () => {
        return [
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
        ];
      }
    },
    'ls -lah': {
      description: 'Lista arquivos com detalhes (long format, all, human-readable)',
      group: 'filesystem',
      args: [],
      execute: () => {
        return [
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
        ];
      }
    },
    'ls -la': {
      description: 'Lista arquivos com detalhes (long format, all)',
      group: 'filesystem',
      args: [],
      execute: () => COMMANDS['ls -lah'].execute()
    },
    pwd: {
      description: 'Mostra diretório atual',
      group: 'filesystem',
      args: [],
      execute: () => ['/Users/delucena']
    },
    cd: {
      description: 'Navega entre diretórios',
      group: 'filesystem',
      args: ['~', '..', 'src'],
      execute: (arg) => {
        if (!arg || arg === '~') {
          currentDirectory = '~';
        } else if (arg === '..') {
          if (currentDirectory !== '~') {
            currentDirectory = '~';
          }
        } else if (arg === 'src') {
          currentDirectory = '~/src';
        }
        return [];
      }
    },
    whoami: {
      description: 'Mostra usuário atual',
      group: 'system',
      args: [],
      execute: () => {
        const nameEl = document.querySelector('[data-profile-name]');
        const titleEl = document.querySelector('[data-profile-title]');
        const name = nameEl ? nameEl.textContent.trim() : 'delucena';
        const title = titleEl ? titleEl.textContent.trim() : getTerminalTranslation('about.defaultTitle');
        return [name, title];
      }
    },
    date: {
      description: 'Mostra data e hora',
      group: 'system',
      args: [],
      execute: () => {
        const currentLanguage = window.i18n ? window.i18n.getLocale() : 'pt-BR';
        return [new Date().toLocaleString(currentLanguage, { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })];
      }
    },
    uptime: {
      description: 'Tempo de atividade do sistema',
      group: 'system',
      args: [],
      execute: () => ['10:30  up 2 days,  4:15, 1 user, load averages: 1.25 1.18 1.05']
    },
    'ps aux': {
      description: 'Lista processos em execução',
      group: 'system',
      args: [],
      execute: () => [
        'USER       PID  %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND',
        'delucena   1234   2.5  1.2 1234567 89012 ?      Ss   08:00   0:15 /Applications/iTerm.app',
        'delucena   2345   1.8  0.8  987654 45678 ?      S    09:15   0:08 /Applications/Google Chrome.app',
        'delucena   3456   0.5  0.3  456789 12345 ?      S    10:00   0:02 /usr/bin/zsh',
        'delucena   4567   0.2  0.1  234567  8901 ?      S    10:15   0:00 node server.js',
        'root       5678   0.1  0.0   12345  1234 ?      Ss   08:00   0:00 /usr/sbin/syslogd'
      ]
    },
    'df -h': {
      description: 'Espaço em disco (human-readable)',
      group: 'system',
      args: [],
      execute: () => [
        'Filesystem      Size   Used  Avail Capacity iused      ifree %iused  Mounted on',
        '/dev/disk3s1s1  500Gi   45Gi  450Gi    10%  1234567  47185920    3%   /',
        'devfs           189Ki  189Ki    0Bi   100%     654         0  100%   /dev',
        '/dev/disk3s4   500Gi  250Mi  450Gi     1%       2  47185920    0%   /System/Volumes/VM',
        '/dev/disk3s5   500Gi  1.0Gi  450Gi     1%      12  47185920    0%   /System/Volumes/Preboot',
        '/dev/disk3s6   500Gi  500Mi  450Gi     1%       5  47185920    0%   /System/Volumes/Update'
      ]
    },
    'du -sh *': {
      description: 'Tamanho de diretórios (human-readable)',
      group: 'filesystem',
      args: [],
      execute: () => [
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
      ]
    },
    'echo hello': {
      description: 'Exibe texto',
      group: 'system',
      args: [],
      execute: () => ['hello']
    },
    'echo $HOME': {
      description: 'Exibe variável de ambiente HOME',
      group: 'system',
      args: [],
      execute: () => ['/Users/delucena']
    },
    'cat README.md': {
      description: 'Mostra conteúdo de arquivo',
      group: 'filesystem',
      args: [],
      execute: () => [
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
      ]
    },
    'git status': {
      description: 'Status do repositório Git',
      group: 'development',
      args: [],
      execute: () => [
        'On branch main',
        'Your branch is up to date with \'origin/main\'.',
        '',
        'nothing to commit, working tree clean'
      ]
    },
    'git log --oneline -5': {
      description: 'Histórico de commits Git (últimos 5)',
      group: 'development',
      args: [],
      execute: () => [
        'a1b2c3d feat: add terminal simulation',
        'd4e5f6g fix: improve CSS visibility',
        'g7h8i9j refactor: simplify terminal structure',
        'j0k1l2m feat: add dark mode toggle',
        'm3n4o5p initial commit'
      ]
    },
    'git --version': {
      description: 'Versão do Git',
      group: 'development',
      args: [],
      execute: () => ['git version 2.42.0']
    },
    'brew list': {
      description: 'Lista pacotes instalados via Homebrew',
      group: 'development',
      args: [],
      execute: () => [
        'git',
        'node',
        'python@3.11',
        'zsh',
        'vim',
        'wget',
        'curl'
      ]
    },
    'brew --version': {
      description: 'Versão do Homebrew',
      group: 'development',
      args: [],
      execute: () => ['Homebrew 4.1.2']
    },
    'node --version': {
      description: 'Versão do Node.js',
      group: 'development',
      args: [],
      execute: () => ['v20.10.0']
    },
    'python3 --version': {
      description: 'Versão do Python',
      group: 'development',
      args: [],
      execute: () => ['Python 3.11.6']
    },
    'which git': {
      description: 'Localiza executável git',
      group: 'system',
      args: [],
      execute: () => ['/usr/local/bin/git']
    },
    'which node': {
      description: 'Localiza executável node',
      group: 'system',
      args: [],
      execute: () => ['/usr/local/bin/node']
    },
    'uname -a': {
      description: 'Informações do sistema',
      group: 'system',
      args: [],
      execute: () => ['Darwin MacBook-Pro.local 23.1.0 Darwin Kernel Version 23.1.0: Mon Oct  9 21:27:27 PDT 2023; root:xnu-10002.41.9~2/RELEASE_ARM64_T6000 arm64']
    },
    skills: {
      description: 'Lista habilidades e competências',
      group: 'info',
      args: [],
      execute: () => {
        const output = [];
        output.push(getTerminalTranslation('skills.title'));
        output.push('');
        
        const skillsSection = document.querySelector('#skills');
        if (skillsSection) {
          const skillCategories = skillsSection.querySelectorAll('[data-skill-category]');
          if (skillCategories.length > 0) {
            skillCategories.forEach(category => {
              const title = category.querySelector('h3, h2')?.textContent || '';
              if (title) output.push(title);
              const items = category.querySelectorAll('li, .skill-item');
              items.forEach(item => {
                output.push(`  • ${item.textContent.trim()}`);
              });
              output.push('');
            });
          } else {
            output.push(getTerminalTranslation('skills.notFound'));
          }
        } else {
          output.push(getTerminalTranslation('skills.notFound'));
        }
        
        return output;
      }
    },
    about: {
      description: 'Informações sobre mim',
      group: 'info',
      args: [],
      execute: () => {
        const output = [];
        output.push(getTerminalTranslation('about.title'));
        output.push('');
        
        const heroName = document.querySelector('.hero__name')?.textContent || 'José Paulo de Lucena';
        const heroTitle = document.querySelector('.hero__title')?.textContent || getTerminalTranslation('about.defaultTitle');
        const domain = 'delucena.dev';
        
        output.push(`${getTerminalTranslation('about.name')}: ${heroName}`);
        output.push(`${getTerminalTranslation('about.titleLabel')}: ${heroTitle}`);
        output.push(`${getTerminalTranslation('about.domain')}: ${domain}`);
        
        const companyEl = document.querySelector('[data-current-company]');
        if (companyEl) {
          output.push(`${getTerminalTranslation('about.company')}: ${companyEl.textContent.trim()}`);
        }
        
        output.push('');
        const bioEls = document.querySelectorAll('.hero__bio p, [data-bio]');
        if (bioEls.length > 0) {
          bioEls.forEach(el => output.push(el.textContent.trim()));
        } else {
          output.push(getTerminalTranslation('about.defaultBio'));
        }
        
        return output;
      }
    },
    cv: {
      description: 'Informações de contato',
      group: 'info',
      args: [],
      execute: () => [
        getTerminalTranslation('cv.message'),
        getTerminalTranslation('cv.linkedin'),
        getTerminalTranslation('cv.github')
      ]
    },
    dance: {
      description: 'Ativa modo dance (efeito visual)',
      group: 'effects',
      args: [],
      execute: () => {
        if (window.VisualEffects && typeof window.VisualEffects.activateDance === 'function') {
          window.VisualEffects.activateDance();
          return ['✔ Dance mode activated 🕺'];
        }
        return ['Error: Visual effects module not available'];
      }
    },
    'mouse chaos': {
      description: 'Ativa mouse chaos (efeito visual)',
      group: 'effects',
      args: [],
      execute: () => {
        if (window.VisualEffects && typeof window.VisualEffects.activateMouseChaos === 'function') {
          window.VisualEffects.activateMouseChaos();
          return ['✔ Mouse chaos activated 🖱️'];
        }
        return ['Error: Visual effects module not available'];
      }
    },
    debug: {
      description: 'Ativa modo debug (efeito visual)',
      group: 'effects',
      args: [],
      execute: () => {
        if (window.VisualEffects && typeof window.VisualEffects.activateDebug === 'function') {
          window.VisualEffects.activateDebug();
          return ['✔ Debug mode on 🐞'];
        }
        return ['Error: Visual effects module not available'];
      }
    },
    hack: {
      description: 'Ativa modo hack (efeito visual)',
      group: 'effects',
      args: [],
      execute: () => {
        if (window.VisualEffects && typeof window.VisualEffects.activateHack === 'function') {
          window.VisualEffects.activateHack();
          return ['✔ Hack mode activated 💻'];
        }
        return ['Error: Visual effects module not available'];
      }
    },
    'gravity off': {
      description: 'Desativa gravidade (efeito visual)',
      group: 'effects',
      args: [],
      execute: () => {
        if (window.VisualEffects && typeof window.VisualEffects.activateGravityOff === 'function') {
          window.VisualEffects.activateGravityOff();
          return ['✔ Gravity disabled 🌌'];
        }
        return ['Error: Visual effects module not available'];
      }
    },
    reset: {
      description: 'Reseta todos os efeitos visuais',
      group: 'effects',
      args: [],
      execute: () => {
        if (window.VisualEffects && typeof window.VisualEffects.reset === 'function') {
          window.VisualEffects.reset();
          return ['✔ All systems back to normal'];
        }
        return ['Error: Visual effects module not available'];
      }
    },
    java: {
      description: 'Easter egg: Java',
      group: 'easter-eggs',
      args: [],
      execute: () => [
        'openjdk version "17.0.8" 2023-07-18',
        'OpenJDK Runtime Environment (build 17.0.8+7-Ubuntu-0ubuntu120.04)',
        'OpenJDK 64-Bit Server VM (build 17.0.8+7-Ubuntu-0ubuntu120.04, mixed mode, sharing)',
        '',
        getTerminalTranslation('java.easterEgg')
      ]
    },
    go: {
      description: 'Easter egg: Go',
      group: 'easter-eggs',
      args: [],
      execute: () => [
        'go version go1.21.0 darwin/arm64',
        '',
        getTerminalTranslation('go.easterEgg')
      ]
    },
    kubectl: {
      description: 'Easter egg: Kubernetes',
      group: 'easter-eggs',
      args: [],
      execute: () => [
        'Client Version: version.Info{Major:"1", Minor:"28", GitVersion:"v1.28.0", GitCommit:"...", GitTreeState:"clean", BuildDate:"2023-07-19T12:20:54Z", GoVersion:"go1.20.6", Compiler:"gc", Platform:"darwin/arm64"}',
        'Server Version: version.Info{Major:"1", Minor:"27", GitVersion:"v1.27.3", GitCommit:"...", GitTreeState:"clean", BuildDate:"2023-06-14T09:47:40Z", GoVersion:"go1.20.5", Compiler:"gc", Platform:"linux/amd64"}',
        '',
        getTerminalTranslation('kubectl.easterEgg')
      ]
    },
    panic: {
      description: 'Easter egg: Go panic',
      group: 'easter-eggs',
      args: [],
      execute: () => [
        'panic: runtime error: index out of range [0] with length 0',
        '',
        'goroutine 1 [running]:',
        'main.main()',
        '    /tmp/main.go:5 +0x45',
        '',
        getTerminalTranslation('panic.easterEgg')
      ]
    },
    'sudo hire-me': {
      description: 'Easter egg: sudo',
      group: 'easter-eggs',
      args: [],
      execute: () => [
        getTerminalTranslation('sudo.easterEgg'),
        '',
        getTerminalTranslation('sudo.message')
      ]
    }
  };

  /**
   * Parse um comando e retorna {command, arg}
   */
  function parseCommand(input) {
    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();
    return { command, arg };
  }

  /**
   * Valida argumento de um comando
   */
  function validateArgument(commandName, arg) {
    const cmdDef = COMMANDS[commandName];
    if (!cmdDef) return { valid: false, message: `comando não encontrado: ${commandName}` };
    
    if (cmdDef.args.length === 0) {
      // Comando não aceita argumentos
      if (arg) {
        return { valid: false, message: `comando "${commandName}" não aceita argumentos` };
      }
      return { valid: true };
    }
    
    // Comando aceita argumentos, mas nenhum foi fornecido
    if (!arg) {
      const argsStr = cmdDef.args.join('|');
      return { valid: false, message: `Uso: ${commandName} <${argsStr}>` };
    }
    
    // Valida se o argumento está na lista de válidos
    if (!cmdDef.args.includes(arg)) {
      const argsStr = cmdDef.args.join('|');
      return { valid: false, message: `✖ argumento inválido. use: ${commandName} <${argsStr}>` };
    }
    
    return { valid: true };
  }

  /**
   * Processa um comando e retorna a resposta
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

      const { command: cmd, arg } = parseCommand(trimmed);
      
      // Verifica se o comando existe
      if (!COMMANDS[cmd]) {
        return [`✖ comando não encontrado: ${cmd}`];
      }

      // Valida argumentos
      const validation = validateArgument(cmd, arg);
      if (!validation.valid) {
        return [validation.message];
      }

      // Executa o comando
      const cmdDef = COMMANDS[cmd];
      const result = cmdDef.execute(arg);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Erro ao processar comando:', error);
      return [getTerminalTranslation('error.processingError', { error: error.message })];
    }
  }

  /**
   * Obtém opções de autocomplete para o input atual
   */
  function getAutocompleteOptions(inputValue) {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      // Se vazio, retorna todos os comandos
      return Object.keys(COMMANDS).sort();
    }

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] || '';
    const hasSpace = trimmed.includes(' ');

    if (!hasSpace) {
      // Sem espaço: autocomplete de comandos
      return Object.keys(COMMANDS)
        .filter(c => c.startsWith(cmd) && c !== cmd)
        .sort();
    } else {
      // Com espaço: autocomplete de argumentos
      if (!COMMANDS[cmd]) {
        return [];
      }
      
      const cmdDef = COMMANDS[cmd];
      if (cmdDef.args.length === 0) {
        return [];
      }
      
      return cmdDef.args
        .filter(a => a.startsWith(arg) && a !== arg)
        .map(a => `${cmd} ${a}`);
    }
  }

  /**
   * Implementa autocomplete com TAB
   */
  function handleAutocomplete(input) {
    const inputValue = input.value;
    
    // Se o input mudou, reseta o índice de autocomplete
    if (inputValue !== lastAutocompleteInput) {
      autocompleteIndex = -1;
      autocompleteOptions = [];
      lastAutocompleteInput = inputValue;
    }
    
    // Obtém opções de autocomplete
    if (autocompleteOptions.length === 0) {
      autocompleteOptions = getAutocompleteOptions(inputValue);
    }
    
    if (autocompleteOptions.length === 0) {
      return; // Nenhuma opção disponível
    }
    
    if (autocompleteOptions.length === 1) {
      // Apenas uma opção: completa diretamente
      const option = autocompleteOptions[0];
      if (inputValue.includes(' ')) {
        // Tem espaço: completa apenas o argumento
        const parts = inputValue.split(/\s+/);
        const cmd = parts[0];
        const arg = option.split(' ')[1];
        input.value = `${cmd} ${arg}`;
      } else {
        // Sem espaço: completa o comando
        input.value = option;
      }
      autocompleteIndex = -1;
      autocompleteOptions = [];
      lastAutocompleteInput = input.value;
    } else {
      // Múltiplas opções: cicla entre elas
      autocompleteIndex = (autocompleteIndex + 1) % autocompleteOptions.length;
      const option = autocompleteOptions[autocompleteIndex];
      
      if (inputValue.includes(' ')) {
        // Tem espaço: completa apenas o argumento
        const parts = inputValue.split(/\s+/);
        const cmd = parts[0];
        const arg = option.split(' ')[1];
        input.value = `${cmd} ${arg}`;
      } else {
        // Sem espaço: completa o comando
        input.value = option;
      }
      lastAutocompleteInput = input.value;
    }
  }

  /**
   * Inicializa os elementos do DOM
   */
  function initElements() {
    try {
      terminalOutput = document.querySelector(SELECTORS.terminalOutput);
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
          lastAutocompleteInput = '';
          autocompleteIndex = -1;
          autocompleteOptions = [];
          executeCommand(command);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (commandHistory.length > 0) {
            historyIndex = Math.max(0, historyIndex - 1);
            input.value = commandHistory[historyIndex] || '';
            lastAutocompleteInput = input.value;
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
          lastAutocompleteInput = input.value;
        } else if (e.key === 'Tab') {
          e.preventDefault();
          handleAutocomplete(input);
        } else {
          // Qualquer outra tecla reseta o autocomplete
          lastAutocompleteInput = input.value;
        }
      } catch (error) {
        console.error('Erro ao processar tecla no terminal:', error);
      }
    });
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
    
    const existingInput = terminalOutput.querySelector('.terminal-terminal-input-container');
    if (existingInput) {
      existingInput.remove();
    }
    
    const inputContainer = document.createElement('div');
    inputContainer.className = 'terminal-terminal-input-container';
    
    const prompt = document.createElement('span');
    prompt.className = 'terminal-terminal-prompt-input';
    prompt.textContent = `user@delucena.dev %`;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'terminal-terminal-input';
    input.id = 'terminalInput';
    input.autocomplete = 'off';
    input.spellcheck = false;
    input.placeholder = getTerminalTranslation('placeholder');
    
    inputContainer.appendChild(prompt);
    inputContainer.appendChild(input);
    terminalOutput.appendChild(inputContainer);
    
    terminalInput = input;
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
    prompt.textContent = `user@delucena.dev %`;
    
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

    const currentInput = terminalOutput.querySelector('.terminal-terminal-input-container');
    if (currentInput) {
      currentInput.remove();
    }

    addPrompt();
    addLine(command, 'terminal-terminal-command');

    const result = processCommand(command);
    
    setTimeout(() => {
      if (result.length > 0) {
        addLines(result);
      }
      
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

    const placeholder = terminalOutput.querySelector('.terminal-placeholder');
    if (placeholder) {
      placeholder.remove();
    }

    terminalOutput.innerHTML = '';

    const currentLanguage = window.i18n ? window.i18n.getLocale() : 'pt-BR';
    const dateStr = new Date().toLocaleString(currentLanguage);
    const welcomeMsg = getTerminalTranslation('welcome', { date: dateStr });
    addLine(welcomeMsg, 'terminal-terminal-info');
    addLine('');

    const initialInput = createInputContainer();
    if (initialInput) {
      initialInput.focus();
    }
    
    updateTerminalLanguage();

    terminalOutput.addEventListener('click', () => {
      const currentInput = terminalOutput.querySelector('.terminal-terminal-input');
      if (currentInput) {
        currentInput.focus();
      }
    });
  }

  /**
   * Verifica se é mobile
   */
  function isMobile() {
    return window.innerWidth <= 768;
  }

  function init() {
    if (isMobile()) {
      return;
    }
    
    try {
      document.addEventListener('i18n:changed', () => {
        updateTerminalLanguage();
      });
      
      setTimeout(() => {
        const terminalsRadio = document.querySelector(SELECTORS.terminalsRadio);
        
        if (terminalsRadio && terminalsRadio.checked) {
          setTimeout(initTerminal, 100);
        }
        
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
