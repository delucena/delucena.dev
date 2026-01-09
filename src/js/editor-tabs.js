/**
 * Editor Tabs - Interação fake das abas estilo VS Code
 * Gerencia fechamento de abas e atualização do breadcrumb
 * 
 * @module editor-tabs
 */

(function() {
  'use strict';

  /**
   * Atualiza o breadcrumb com o caminho do arquivo ativo
   * SEMPRE detecta do radio button checked para garantir precisão
   */
  function updateBreadcrumb() {
    const header = document.getElementById('header');
    if (!header) {
      return;
    }

    const checkedRadio = header.querySelector('input[type="radio"][name="openedFile"]:checked');
    if (!checkedRadio) {
      // Se não há radio checked, limpa o breadcrumb
      const breadcrumb = document.getElementById('editor-breadcrumb');
      if (breadcrumb) {
        const list = breadcrumb.querySelector('.editor-breadcrumb__list');
        if (list) {
          list.innerHTML = '';
        }
      }
      return;
    }

    const tab = checkedRadio.closest('.editor-tab');
    if (!tab) {
      return;
    }

    const path = tab.getAttribute('data-path');
    
    if (!path) {
      return;
    }
    
    const breadcrumb = document.getElementById('editor-breadcrumb');
    if (!breadcrumb) {
      return;
    }

    const list = breadcrumb.querySelector('.editor-breadcrumb__list');
    if (!list) {
      return;
    }

    // Limpa o breadcrumb completamente
    list.innerHTML = '';

    // Divide o caminho em segmentos
    const pathSegments = path.split('/');

    // Cria os itens do breadcrumb
    pathSegments.forEach((segment, index) => {
      const isLast = index === pathSegments.length - 1;
      
      if (isLast) {
        // Último item (arquivo atual) - não clicável, destacado
        const item = document.createElement('li');
        item.className = 'editor-breadcrumb__item editor-breadcrumb__item--active';
        const span = document.createElement('span');
        span.className = 'editor-breadcrumb__current';
        span.textContent = segment;
        item.appendChild(span);
        list.appendChild(item);
      } else {
        // Itens intermediários - clicáveis
        const item = document.createElement('li');
        item.className = 'editor-breadcrumb__item';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'editor-breadcrumb__link';
        button.textContent = segment;
        button.setAttribute('data-path', pathSegments.slice(0, index + 1).join('/'));
        button.addEventListener('click', function() {
          const clickedPath = this.getAttribute('data-path');
          navigateToPathInExplorer(clickedPath);
        });
        item.appendChild(button);
        list.appendChild(item);

        // Separador
        const separator = document.createElement('li');
        separator.className = 'editor-breadcrumb__separator';
        separator.setAttribute('aria-hidden', 'true');
        separator.textContent = '›';
        list.appendChild(separator);
      }
    });
  }

  /**
   * Expande todas as pastas necessárias para mostrar um arquivo no explorer
   * @param {string} fileId - ID do arquivo (readme, index, experience, etc)
   */
  function expandFoldersForFile(fileId) {
    const FILE_FOLDER_MAP = {
      'readme': {
        folders: ['folderToggleDelucenaDev']
      },
      'index': {
        folders: ['folderToggleDelucenaDev', 'folderToggleSrc', 'folderToggleMain', 'folderToggleResources', 'folderToggleStatic']
      },
      'experience': {
        folders: ['folderToggleDelucenaDev', 'folderToggleSrc', 'folderToggleMain', 'folderToggleResources', 'folderToggleStatic']
      },
      'skills': {
        folders: ['folderToggleDelucenaDev', 'folderToggleSrc', 'folderToggleMain', 'folderToggleResources', 'folderToggleStatic']
      },
      'contact': {
        folders: ['folderToggleDelucenaDev', 'folderToggleSrc', 'folderToggleMain', 'folderToggleResources', 'folderToggleStatic']
      }
    };

    const fileConfig = FILE_FOLDER_MAP[fileId];
    if (!fileConfig) return;

    // Expande todas as pastas necessárias
    fileConfig.folders.forEach(folderId => {
      const folderCheckbox = document.getElementById(folderId);
      if (folderCheckbox) {
        folderCheckbox.checked = true;
      }
    });
  }

  // Flag para prevenir loops recursivos
  let isSettingActiveTab = false;

  /**
   * Define a aba ativa e atualiza o breadcrumb
   * 
   * @param {HTMLElement|string} tabElOrFileId - Elemento da aba (.editor-tab) ou ID do arquivo
   */
  function setActiveTab(tabElOrFileId) {
    // Previne loops recursivos
    if (isSettingActiveTab) {
      return;
    }
    
    isSettingActiveTab = true;
    
    try {
      let tabEl = null;
      
      // Se recebeu um ID de arquivo, busca ou recria a aba
      if (typeof tabElOrFileId === 'string') {
        const fileId = tabElOrFileId;
        tabEl = document.querySelector(`.editor-tab[data-file-id="${fileId}"]`);
        
        // Se a aba não existe, tenta recriá-la
        if (!tabEl) {
          tabEl = recreateTab(fileId);
        }
      } else {
        tabEl = tabElOrFileId;
      }

      if (!tabEl) {
        return;
      }

      // Remove .is-active de todas as tabs
      const allTabs = document.querySelectorAll('.editor-tabs .editor-tab');
      allTabs.forEach(tab => {
        tab.classList.remove('is-active');
        const radio = tab.querySelector('.editor-tab__radio');
        if (radio && tab !== tabEl) {
          radio.checked = false;
        }
      });

      // Verificação adicional: garante que apenas uma aba esteja marcada como checked
      const header = document.getElementById('header');
      if (header) {
        const allCheckedRadios = header.querySelectorAll('input[type="radio"][name="openedFile"]:checked');
        if (allCheckedRadios.length > 1) {
          allCheckedRadios.forEach(radio => {
            const tab = radio.closest('.editor-tab');
            if (tab && tab !== tabEl) {
              radio.checked = false;
              tab.classList.remove('is-active');
            }
          });
        }
      }

      // Adiciona .is-active na tab clicada e marca o radio como checked
      tabEl.classList.add('is-active');
      const radio = tabEl.querySelector('.editor-tab__radio');
      if (radio) {
        // Marca o radio como checked sem disparar eventos para evitar loops
        radio.checked = true;
      }
      
      // Verificação final: garante que apenas esta aba tenha is-active
      const allActiveTabs = document.querySelectorAll('.editor-tabs .editor-tab.is-active');
      if (allActiveTabs.length > 1) {
        allActiveTabs.forEach(tab => {
          if (tab !== tabEl) {
            tab.classList.remove('is-active');
          }
        });
      }

      // Atualiza o breadcrumb imediatamente
      updateBreadcrumb();

      // Expande as pastas no explorer e faz scroll até o arquivo
      const fileId = tabEl.getAttribute('data-file-id');
      if (fileId) {
        expandFoldersForFile(fileId);
        // Aguarda um pouco para garantir que as pastas foram expandidas
        setTimeout(function() {
          scrollToFileInExplorer(fileId);
        }, 100);
      }
    } finally {
      // Sempre libera a flag, mesmo se houver erro
      isSettingActiveTab = false;
    }
  }

  /**
   * Define a aba ativa baseada na aba marcada como checked inicialmente
   */
  function setActiveTabByCurrentPage() {
    const header = document.getElementById('header');
    if (!header) return;
    
    const checkedRadio = header.querySelector('input[type="radio"][name="openedFile"]:checked');
    if (checkedRadio) {
      const activeTab = checkedRadio.closest('.editor-tab');
      if (activeTab) {
        activeTab.classList.add('is-active');
        updateBreadcrumb();
        
        // Expande as pastas no explorer e faz scroll até o arquivo inicial
        const fileId = activeTab.getAttribute('data-file-id');
        if (fileId) {
          // Aguarda um pouco para garantir que o DOM está totalmente carregado
          setTimeout(function() {
            expandFoldersForFile(fileId);
            setTimeout(function() {
              scrollToFileInExplorer(fileId);
            }, 100);
          }, 200);
        }
      }
    } else {
      // Se não encontrou, tenta ativar a primeira tab disponível
      const firstTab = document.querySelector('.editor-tabs .editor-tab');
      if (firstTab) {
        setActiveTab(firstTab);
      }
    }
  }

  /**
   * Navega para o caminho no explorer quando clica no breadcrumb
   * Expande as pastas necessárias e faz scroll até o arquivo atual
   * 
   * @param {string} path - Caminho do breadcrumb (ex: "src", "src/main", "src/main/resources")
   */
  function navigateToPathInExplorer(path) {
    if (!path) return;

    // Mapeamento de segmentos de path para IDs de pastas no explorer
    const pathToFolderMap = {
      'src': 'folderToggleSrc',
      'main': 'folderToggleMain',
      'resources': 'folderToggleResources',
      'static': 'folderToggleStatic'
    };

    const pathSegments = path.split('/');
    const foldersToExpand = [];

    // Mapeia cada segmento para o ID da pasta correspondente
    pathSegments.forEach(segment => {
      const folderId = pathToFolderMap[segment];
      if (folderId) {
        foldersToExpand.push(folderId);
      }
    });

    // Expande todas as pastas necessárias
    foldersToExpand.forEach(folderId => {
      const folderCheckbox = document.getElementById(folderId);
      if (folderCheckbox) {
        folderCheckbox.checked = true;
      }
    });

    // Depois de expandir, navega até o arquivo atual
    const header = document.getElementById('header');
    if (header) {
      const checkedRadio = header.querySelector('input[type="radio"][name="openedFile"]:checked');
      if (checkedRadio) {
        const fileId = checkedRadio.id;
        
        // Aguarda um pouco para garantir que as pastas foram expandidas
        setTimeout(function() {
          scrollToFileInExplorer(fileId);
        }, 100);
      }
    }
  }

  /**
   * Faz scroll até o arquivo no explorer
   * 
   * @param {string} fileId - ID do arquivo (readme, index, skills, contact, etc)
   */
  function scrollToFileInExplorer(fileId) {
    const fileLabel = document.querySelector(`.explorer label[for="${fileId}"]`);
    if (!fileLabel) return;

    const explorer = document.querySelector('.explorer > div:first-child');
    if (!explorer) return;

    // Aguarda um pouco para garantir que as pastas foram expandidas
    setTimeout(() => {
      const labelRect = fileLabel.getBoundingClientRect();
      const explorerRect = explorer.getBoundingClientRect();

      // Verifica se o label está visível no viewport do explorer
      const isVisible = (
        labelRect.top >= explorerRect.top &&
        labelRect.bottom <= explorerRect.bottom
      );

      if (!isVisible) {
        // Calcula a posição para scroll
        let labelOffsetTop = 0;
        let element = fileLabel;
        while (element && element !== explorer) {
          labelOffsetTop += element.offsetTop;
          element = element.offsetParent;
        }

        const explorerHeight = explorer.clientHeight;
        const labelHeight = fileLabel.offsetHeight;

        // Centraliza o arquivo na viewport do explorer
        const targetScroll = labelOffsetTop - (explorerHeight / 2) + (labelHeight / 2);
        
        explorer.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
      }
    }, 150);
  }

  /**
   * Armazena os dados das abas fechadas para poder recriá-las
   */
  const closedTabsData = {};

  /**
   * Recria uma aba que foi fechada
   * @param {string} fileId - ID do arquivo (readme, index, experience, etc)
   */
  function recreateTab(fileId) {
    const header = document.getElementById('header');
    if (!header) return null;

    // Verifica se a aba já existe
    const existingTab = header.querySelector(`.editor-tab[data-file-id="${fileId}"]`);
    if (existingTab) {
      return existingTab;
    }

    // Busca os dados da aba fechada
    const tabData = closedTabsData[fileId];
    if (!tabData) {
      // Se não tem dados salvos, tenta recriar baseado no template padrão
      const defaultTabs = {
        'readme': {
          fileId: 'readme',
          fileName: 'README.md',
          path: 'README.md',
          icon: 'icon-file-markdown',
          ariaLabel: 'Fechar README.md'
        },
        'index': {
          fileId: 'index',
          fileName: 'index.html',
          path: 'src/main/resources/index.html',
          icon: 'icon-file-html',
          ariaLabel: 'Fechar index.html'
        },
        'experience': {
          fileId: 'experience',
          fileName: 'experience.html',
          path: 'src/main/resources/experience.html',
          icon: 'icon-file-html',
          ariaLabel: 'Fechar experience.html'
        },
        'skills': {
          fileId: 'skills',
          fileName: 'skills.html',
          path: 'src/main/resources/skills.html',
          icon: 'icon-file-html',
          ariaLabel: 'Fechar skills.html'
        },
        'contact': {
          fileId: 'contact',
          fileName: 'contact.html',
          path: 'src/main/resources/contact.html',
          icon: 'icon-file-html',
          ariaLabel: 'Fechar contact.html'
        }
      };

      const defaultData = defaultTabs[fileId];
      if (!defaultData) {
        return null;
      }

      return createTabElement(defaultData);
    }

    return createTabElement(tabData);
  }

  /**
   * Cria um elemento de aba
   * @param {Object} data - Dados da aba
   */
  function createTabElement(data) {
    const header = document.getElementById('header');
    if (!header) return null;

    const tab = document.createElement('div');
    tab.className = 'editor-tab';
    tab.setAttribute('data-file-id', data.fileId);
    tab.setAttribute('data-file-name', data.fileName);
    tab.setAttribute('data-path', data.path);

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'openedFile';
    radio.id = data.fileId;
    radio.className = 'editor-tab__radio';

    const label = document.createElement('label');
    label.htmlFor = data.fileId;
    label.className = 'editor-tab__label';

    const iconSpan = document.createElement('span');
    iconSpan.className = 'editor-tab__icon';
    const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconSvg.setAttribute('class', 'icon icon--sm');
    iconSvg.setAttribute('width', '16');
    iconSvg.setAttribute('height', '16');
    iconSvg.setAttribute('viewBox', '0 0 384 512');
    iconSvg.setAttribute('fill', 'currentColor');
    iconSvg.setAttribute('aria-hidden', 'true');
    const iconUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    iconUse.setAttribute('href', `#${data.icon}`);
    iconSvg.appendChild(iconUse);
    iconSpan.appendChild(iconSvg);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'editor-tab__name';
    nameSpan.textContent = data.fileName;

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'editor-tab__close';
    closeBtn.setAttribute('aria-label', data.ariaLabel);
    closeBtn.setAttribute('title', 'Fechar');
    const closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    closeSvg.setAttribute('class', 'icon icon--sm');
    closeSvg.setAttribute('width', '16');
    closeSvg.setAttribute('height', '16');
    closeSvg.setAttribute('viewBox', '0 0 384 512');
    closeSvg.setAttribute('fill', 'currentColor');
    closeSvg.setAttribute('aria-hidden', 'true');
    const closeUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    closeUse.setAttribute('href', '#icon-xmark');
    closeSvg.appendChild(closeUse);
    closeBtn.appendChild(closeSvg);

    label.appendChild(iconSpan);
    label.appendChild(nameSpan);
    label.appendChild(closeBtn);

    tab.appendChild(radio);
    tab.appendChild(label);

    // Adiciona os event listeners
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      closeTab(tab);
    });

    label.addEventListener('click', function(e) {
      if (e.target.closest('.editor-tab__close')) {
        return;
      }
      setActiveTab(tab);
    });

    radio.addEventListener('change', function() {
      if (this.checked) {
        setActiveTab(tab);
      }
    });

    // Adiciona a aba ao header
    header.appendChild(tab);

    // Força uma atualização do layout para garantir que o CSS seja aplicado
    // Isso é necessário para elementos criados dinamicamente
    void tab.offsetHeight;

    return tab;
  }

  /**
   * Fecha uma aba (remove do DOM, mas salva os dados para recriar depois)
   */
  function closeTab(tabElement) {
    const radio = tabElement.querySelector('.editor-tab__radio');
    const isActive = radio && radio.checked;
    
    // Salva os dados da aba antes de removê-la
    const fileId = tabElement.getAttribute('data-file-id');
    if (fileId) {
      closedTabsData[fileId] = {
        fileId: fileId,
        fileName: tabElement.getAttribute('data-file-name'),
        path: tabElement.getAttribute('data-path'),
        icon: tabElement.querySelector('.editor-tab__icon use')?.getAttribute('href')?.replace('#', '') || 'icon-file-html',
        ariaLabel: tabElement.querySelector('.editor-tab__close')?.getAttribute('aria-label') || `Fechar ${tabElement.getAttribute('data-file-name')}`
      };
    }
    
    if (isActive) {
      const tabs = document.querySelectorAll('.editor-tabs .editor-tab');
      let nextTab = null;
      
      tabs.forEach((tab, index) => {
        if (tab === tabElement) {
          if (index < tabs.length - 1) {
            nextTab = tabs[index + 1];
          } else if (index > 0) {
            nextTab = tabs[index - 1];
          }
        }
      });

      if (nextTab) {
        setActiveTab(nextTab);
      } else {
        // Se não há mais abas, limpa o breadcrumb
        updateBreadcrumb();
      }
    }

    tabElement.remove();
    
    // Verifica se ainda há abas após remover
    const remainingTabs = document.querySelectorAll('.editor-tabs .editor-tab');
    if (remainingTabs.length === 0) {
      // Se não há mais abas, limpa o breadcrumb
      updateBreadcrumb();
    }
  }

  /**
   * Inicializa os event listeners
   */
  function init() {
    const header = document.getElementById('header');
    if (!header) {
      return;
    }

    const tabs = document.querySelectorAll('.editor-tabs .editor-tab');
    
    tabs.forEach(tab => {
      // Botão de fechar
      const closeBtn = tab.querySelector('.editor-tab__close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          closeTab(tab);
        });
      }

      // Click no label da aba - ativa a aba
      const label = tab.querySelector('.editor-tab__label');
      if (label) {
        label.addEventListener('click', function(e) {
          if (e.target.closest('.editor-tab__close')) {
            return;
          }
          setActiveTab(tab);
        });
      }

      // Radio button change
      const radio = tab.querySelector('.editor-tab__radio');
      if (radio) {
        radio.addEventListener('change', function() {
          // Ignora se já estamos configurando uma aba ativa (previne loops)
          if (isSettingActiveTab) {
            return;
          }
          
          if (this.checked) {
            setActiveTab(tab);
          }
        });
      }
    });

    // Listener global para mudanças de tabs via radio buttons
    header.addEventListener('change', function(e) {
      // Ignora se já estamos configurando uma aba ativa (previne loops)
      if (isSettingActiveTab) {
        return;
      }
      
      if (e.target.type === 'radio' && e.target.name === 'openedFile' && e.target.checked) {
        const tab = e.target.closest('.editor-tab');
        if (tab) {
          setActiveTab(tab);
        } else {
          // Se o radio não está dentro de uma aba, significa que a aba foi fechada
          // Recria a aba e ativa ela
          const fileId = e.target.id;
          const recreatedTab = recreateTab(fileId);
          if (recreatedTab) {
            setActiveTab(recreatedTab);
          }
        }
      }
    }, true); // Usa capture phase

    // Listener para cliques nos labels do explorer (para recriar abas fechadas)
    // Usa capture phase para interceptar antes do comportamento padrão
    document.addEventListener('click', function(e) {
      const label = e.target.closest('.explorer label[for="readme"], .explorer label[for="index"], .explorer label[for="experience"], .explorer label[for="skills"], .explorer label[for="contact"]');
      if (!label) return;
      
      const fileId = label.getAttribute('for');
      if (!fileId) return;
      
      // Verifica se a aba existe, se não, recria antes do comportamento padrão
      const existingTab = header.querySelector(`.editor-tab[data-file-id="${fileId}"]`);
      if (!existingTab) {
        e.preventDefault();
        e.stopPropagation();
        
        const recreatedTab = recreateTab(fileId);
        if (recreatedTab) {
          // Marca o radio e ativa a aba
          const radio = recreatedTab.querySelector('.editor-tab__radio');
          if (radio) {
            radio.checked = true;
          }
          setActiveTab(recreatedTab);
        }
      }
    }, true); // Usa capture phase

    // Observer para mudanças nos radio buttons (backup)
    const observer = new MutationObserver(function(mutations) {
      // Ignora se já estamos configurando uma aba ativa (previne loops)
      if (isSettingActiveTab) {
        return;
      }
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'checked') {
          const radio = mutation.target;
          if (radio.checked && radio.name === 'openedFile') {
            setTimeout(function() {
              updateBreadcrumb();
            }, 0);
          }
        }
      });
    });

    // Observa todos os radios existentes e futuros
    const observeRadios = function() {
      const radios = header.querySelectorAll('input[type="radio"][name="openedFile"]');
      radios.forEach(radio => {
        // Evita observar o mesmo radio múltiplas vezes
        if (!radio.dataset.observed) {
          observer.observe(radio, { attributes: true, attributeFilter: ['checked'] });
          radio.dataset.observed = 'true';
        }
      });
    };

    // Observa os radios iniciais
    observeRadios();

    // Observa mudanças no DOM para novos radios (abas recriadas)
    const headerObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length > 0) {
          observeRadios();
        }
      });
    });

    headerObserver.observe(header, { childList: true, subtree: true });

    // Define aba ativa e breadcrumb baseado na aba marcada como checked inicialmente
    setActiveTabByCurrentPage();
    
    // Atualiza o breadcrumb após um pequeno delay para garantir
    setTimeout(function() {
      updateBreadcrumb();
    }, 100);
    
    // Verificação periódica para garantir que o breadcrumb está sempre correto
    setInterval(function() {
      const checkedRadio = header.querySelector('input[type="radio"][name="openedFile"]:checked');
      if (checkedRadio) {
        const tab = checkedRadio.closest('.editor-tab');
        if (tab) {
          const currentPath = tab.getAttribute('data-path');
          const breadcrumb = document.getElementById('editor-breadcrumb');
          if (breadcrumb) {
            const currentBreadcrumbFile = breadcrumb.querySelector('.editor-breadcrumb__current')?.textContent;
            const expectedFile = currentPath?.split('/').pop();
            
            if (currentBreadcrumbFile !== expectedFile && expectedFile) {
              updateBreadcrumb();
            }
          }
        }
      }
    }, 200);
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
