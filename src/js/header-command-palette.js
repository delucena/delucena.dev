/**
 * Header Command Palette - Estilo Visual Studio Code
 * Simulação de UI idêntica ao VS Code, apenas visual
 */

(function() {
  'use strict';

  // Aguarda DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const input = document.querySelector('.top-header__search-input');
    const commandPalette = document.querySelector('.top-header__command-palette');
    
    if (!input || !commandPalette) return;

    // Comandos exatos conforme especificação
    const commands = [
      { 
        label: 'Go to File', 
        shortcut: ['⌘', 'P']
      },
      { 
        label: 'Show and Run Commands >', 
        shortcut: ['⇧', '⌘', 'P']
      },
      { 
        label: 'Search for Text %', 
        shortcut: null
      },
      { 
        label: 'Open Quick Chat', 
        shortcut: ['⌘', 'K']
      },
      { 
        label: 'Open to Symbol in Editor', 
        shortcut: ['⇧', '⌘', 'O']
      },
      { 
        label: 'Start Debugging', 
        shortcut: null
      },
      { 
        label: 'Run Task', 
        shortcut: null
      },
      { 
        label: 'More ?', 
        shortcut: null
      }
    ];

    let isOpen = false;
    let selectedIndex = -1;

    /**
     * Cria um elemento keycap
     */
    function createKeycap(key) {
      const keycap = document.createElement('span');
      keycap.className = 'top-header__keycap';
      keycap.textContent = key;
      return keycap;
    }

    /**
     * Cria separador entre teclas
     */
    function createSeparator() {
      const separator = document.createElement('span');
      separator.className = 'top-header__keycap-separator';
      separator.textContent = '+';
      return separator;
    }

    /**
     * Renderiza a lista de comandos
     */
    function renderCommands(commandsToRender = commands) {
      commandPalette.innerHTML = '';
      
      commandsToRender.forEach((command, index) => {
        const item = document.createElement('div');
        item.className = 'top-header__command-item';
        item.setAttribute('role', 'option');
        item.setAttribute('data-index', index);
        item.setAttribute('data-command', command.label);
        
        // Label do comando
        const label = document.createElement('span');
        label.className = 'top-header__command-label';
        label.textContent = command.label;
        item.appendChild(label);
        
        // Shortcut (se existir)
        if (command.shortcut && command.shortcut.length > 0) {
          const shortcutContainer = document.createElement('div');
          shortcutContainer.className = 'top-header__command-shortcut';
          
          command.shortcut.forEach((key, keyIndex) => {
            shortcutContainer.appendChild(createKeycap(key));
            if (keyIndex < command.shortcut.length - 1) {
              shortcutContainer.appendChild(createSeparator());
            }
          });
          
          item.appendChild(shortcutContainer);
        }
        
        // Event listeners
        item.addEventListener('mousedown', (e) => {
          e.preventDefault(); // Previne blur do input
          selectCommand(command);
        });

        item.addEventListener('mouseenter', () => {
          selectedIndex = index;
          updateSelection();
        });

        commandPalette.appendChild(item);
      });

      commandPalette.classList.add('top-header__command-palette--visible');
      input.setAttribute('aria-expanded', 'true');
      selectedIndex = 0; // Primeiro item selecionado por padrão
      updateSelection();
      isOpen = true;
    }

    /**
     * Atualiza seleção visual
     */
    function updateSelection() {
      const items = commandPalette.querySelectorAll('.top-header__command-item');
      items.forEach((item, index) => {
        if (index === selectedIndex) {
          item.classList.add('top-header__command-item--selected');
          // Scroll para o item selecionado
          item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
          item.classList.remove('top-header__command-item--selected');
        }
      });
    }

    /**
     * Seleciona um comando
     */
  function selectCommand(command) {
    closeCommandPalette();
    input.blur();
  }

    /**
     * Fecha o Command Palette
     */
    function closeCommandPalette() {
      commandPalette.classList.remove('top-header__command-palette--visible');
      input.setAttribute('aria-expanded', 'false');
      isOpen = false;
      selectedIndex = -1;
    }

    /**
     * Abre o Command Palette
     */
    function openCommandPalette() {
      if (!isOpen) {
        renderCommands();
      }
    }

    // Event: onFocus
    input.addEventListener('focus', function() {
      input.classList.add('top-header__search-input--active');
      openCommandPalette();
    });

    // Event: onBlur (fecha com delay para permitir clicks)
    input.addEventListener('blur', function() {
      input.classList.remove('top-header__search-input--active');
      setTimeout(() => {
        if (!commandPalette.matches(':hover') && document.activeElement !== input) {
          closeCommandPalette();
        }
      }, 200);
    });

    // Event: onInput (filtra comandos se necessário)
    input.addEventListener('input', function(e) {
      const text = e.target.value.trim().toLowerCase();
      
      if (text) {
        // Filtra comandos baseado no texto digitado
        const filteredCommands = commands.filter(cmd => 
          cmd.label.toLowerCase().includes(text)
        );
        
        // Atualiza lista filtrada
        if (filteredCommands.length > 0) {
          renderCommands(filteredCommands);
        } else {
          commandPalette.innerHTML = '';
          commandPalette.classList.remove('top-header__command-palette--visible');
          isOpen = false;
        }
      } else {
        // Mostra todos os comandos
        renderCommands();
      }
    });

    // Event: Keyboard navigation
    input.addEventListener('keydown', function(e) {
      if (!isOpen) return;
      
      const items = commandPalette.querySelectorAll('.top-header__command-item');
      
      if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          const commandLabel = items[selectedIndex].getAttribute('data-command');
          const command = commands.find(cmd => cmd.label === commandLabel);
          if (command) {
            selectCommand(command);
          }
        } else if (items.length > 0) {
          // Executa o primeiro item
          const commandLabel = items[0].getAttribute('data-command');
          const command = commands.find(cmd => cmd.label === commandLabel);
          if (command) {
            selectCommand(command);
          }
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (items.length > 0) {
          selectedIndex = (selectedIndex + 1) % items.length;
          updateSelection();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (items.length > 0) {
          selectedIndex = selectedIndex <= 0 ? items.length - 1 : selectedIndex - 1;
          updateSelection();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeCommandPalette();
        input.blur();
      }
    });

    // Fecha ao clicar fora
    document.addEventListener('click', function(e) {
      if (!input.contains(e.target) && !commandPalette.contains(e.target)) {
        closeCommandPalette();
      }
    });
  }
})();
