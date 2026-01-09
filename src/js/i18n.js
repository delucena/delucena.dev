/**
 * Sistema de Internacionalização (i18n)
 * Gerencia traduções e alternância de idiomas sem frameworks externos
 */

(function() {
  'use strict';

  // Configuração
  const I18N_CONFIG = {
    defaultLocale: 'pt-BR',
    supportedLocales: ['pt-BR', 'en', 'es'],
    storageKey: 'delucena.dev:locale',
    translationsPath: './assets/i18n/'
  };

  // Estado
  let currentLocale = I18N_CONFIG.defaultLocale;
  let translations = {};
  let isInitialized = false;

  /**
   * Obtém o idioma salvo ou detecta do navegador
   */
  function getInitialLocale() {
    // 1. Verifica localStorage
    const saved = localStorage.getItem(I18N_CONFIG.storageKey);
    if (saved && I18N_CONFIG.supportedLocales.includes(saved)) {
      return saved;
    }

    // 2. Detecta do navegador (apenas idioma base)
    const browserLang = navigator.language || navigator.userLanguage;
    const browserBase = browserLang.split('-')[0];
    
    // Mapeia para idiomas suportados
    if (browserBase === 'pt') return 'pt-BR';
    if (browserBase === 'en') return 'en';
    if (browserBase === 'es') return 'es';

    // 3. Fallback para padrão
    return I18N_CONFIG.defaultLocale;
  }

  /**
   * Carrega o arquivo JSON de traduções
   */
  async function loadTranslations(locale) {
    // Detectar se está sendo usado via file:// (protocolo de arquivo local)
    if (window.location.protocol === 'file:') {
      console.error('[i18n] ❌ ERRO: Arquivo aberto diretamente do sistema de arquivos (file://)');
      console.error('[i18n] 📌 SOLUÇÃO: Use um servidor HTTP local:');
      console.error('[i18n]    1. Execute: npm run serve');
      console.error('[i18n]    2. Acesse: http://localhost:8000');
      console.error('[i18n]    Ou use: python3 -m http.server 8000 --directory dist');
      alert('⚠️ ERRO: Este site precisa ser servido via HTTP.\n\nExecute: npm run serve\nDepois acesse: http://localhost:8000');
      return {};
    }
    
    try {
      const response = await fetch(`${I18N_CONFIG.translationsPath}${locale}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load translations for ${locale}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`[i18n] Error loading translations for ${locale}:`, error);
      // Fallback para pt-BR se houver erro
      if (locale !== I18N_CONFIG.defaultLocale) {
        return loadTranslations(I18N_CONFIG.defaultLocale);
      }
      return {};
    }
  }

  /**
   * Obtém valor de tradução por chave (suporta nested keys como "nav.theme")
   */
  function getTranslation(key, translations) {
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`[i18n] Translation key not found: ${key}`);
        return key; // Retorna a chave se não encontrar
      }
    }

    return value;
  }

  /**
   * Aplica tradução em um elemento
   */
  function translateElement(element, key, translations) {
    const value = getTranslation(key, translations);
    
    if (value === undefined || value === null) {
      return;
    }

    // Se for array, junta com quebras de linha
    if (Array.isArray(value)) {
      element.textContent = value.join('\n');
      return;
    }

    // Se for objeto, não traduz (estrutura complexa)
    if (typeof value === 'object') {
      return;
    }

    // Atualiza texto ou atributo conforme o tipo de elemento
    const attr = element.getAttribute('data-i18n-attr');
    if (attr) {
      // Suporta múltiplos atributos separados por vírgula
      const attrs = attr.split(',').map(a => a.trim());
      attrs.forEach(attrName => {
        element.setAttribute(attrName, String(value));
        // Também atualiza title se for aria-label
        if (attrName === 'aria-label') {
          element.setAttribute('title', String(value));
        }
      });
    } else {
      // Preserva HTML se o elemento tiver filhos com estrutura
      if (element.children.length > 0 && element.querySelector('[data-i18n]')) {
        // Elemento tem filhos traduzíveis, não sobrescreve
        return;
      }
      element.textContent = String(value);
    }
  }

  /**
   * Aplica tradução em uma lista (ul/ol)
   */
  function translateList(element, key, translations) {
    const items = getTranslation(key, translations);
    
    if (!Array.isArray(items)) {
      return;
    }

    // Limpa a lista
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    
    // Cria novos itens
    items.forEach(item => {
      const li = document.createElement('li');
      li.style.fontSize = 'var(--font-size-base)';
      li.textContent = item;
      element.appendChild(li);
    });
  }

  /**
   * Aplica todas as traduções no DOM
   * Dispara evento antes de aplicar traduções para permitir que outros módulos
   * capturem o HTML original antes da tradução
   */
  function applyTranslations() {
    if (!translations || Object.keys(translations).length === 0) {
      return;
    }

    // Dispara evento antes de aplicar traduções
    // Permite que outros módulos (como preview-toggle) capturem o HTML original
    document.dispatchEvent(new CustomEvent('i18n:before-translate', {
      detail: { locale: currentLocale }
    }));

    // Busca todos os elementos com data-i18n-list (listas)
    const listElements = document.querySelectorAll('[data-i18n-list]');
    listElements.forEach(element => {
      const key = element.getAttribute('data-i18n-list');
      if (key) {
        translateList(element, key, translations);
      }
    });

    // Busca todos os elementos com data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key) {
        // Suporta chaves com índices numéricos (ex: hero.bio.0)
        const keyParts = key.split('.');
        const lastPart = keyParts[keyParts.length - 1];
        const isNumericIndex = /^\d+$/.test(lastPart);
        
        if (isNumericIndex) {
          // É um índice numérico, busca o array e pega o item
          const arrayKey = keyParts.slice(0, -1).join('.');
          const array = getTranslation(arrayKey, translations);
          if (Array.isArray(array)) {
            const index = parseInt(lastPart, 10);
            if (array[index] !== undefined) {
              const attr = element.getAttribute('data-i18n-attr');
              if (attr) {
                // Suporta múltiplos atributos separados por vírgula
                const attrs = attr.split(',').map(a => a.trim());
                attrs.forEach(attrName => {
                  element.setAttribute(attrName, String(array[index]));
                  // Também atualiza title se for aria-label
                  if (attrName === 'aria-label') {
                    element.setAttribute('title', String(array[index]));
                  }
                });
              } else {
                element.textContent = String(array[index]);
              }
            }
          }
        } else {
          // Chave normal
          translateElement(element, key, translations);
        }
      }
    });

    // Atualiza atributo lang do HTML (crítico para SEO)
    document.documentElement.lang = currentLocale;

    // Atualiza título da página
    const titleKey = 'meta.title';
    const title = getTranslation(titleKey, translations);
    if (title && document.title !== title) {
      document.title = title;
    }

    // Atualiza meta description
    const descKey = 'meta.description';
    const desc = getTranslation(descKey, translations);
    if (desc) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', desc);
      }
    }

    // Atualiza meta tags Open Graph
    const ogTitle = getTranslation('meta.title', translations);
    const ogDesc = getTranslation('meta.description', translations);
    if (ogTitle) {
      const ogTitleMeta = document.querySelector('meta[property="og:title"]');
      if (ogTitleMeta) {
        ogTitleMeta.setAttribute('content', ogTitle);
      }
    }
    if (ogDesc) {
      const ogDescMeta = document.querySelector('meta[property="og:description"]');
      if (ogDescMeta) {
        ogDescMeta.setAttribute('content', ogDesc);
      }
    }
    
    // Atualiza og:locale baseado no idioma atual (sempre, independente de ogDesc)
    const ogLocaleMeta = document.querySelector('meta[property="og:locale"]');
    const ogLocale = currentLocale.replace('-', '_'); // Converte pt-BR para pt_BR (formato Open Graph)
    if (ogLocaleMeta) {
      ogLocaleMeta.setAttribute('content', ogLocale);
    } else {
      // Cria og:locale se não existir
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:locale');
      meta.setAttribute('content', ogLocale);
      const ogUrlMeta = document.querySelector('meta[property="og:url"]');
      if (ogUrlMeta && ogUrlMeta.parentNode) {
        ogUrlMeta.parentNode.insertBefore(meta, ogUrlMeta.nextSibling);
      } else {
        document.head.appendChild(meta);
      }
    }

    // Atualiza meta tags Twitter
    const twitterTitle = getTranslation('meta.title', translations);
    const twitterDesc = getTranslation('meta.description', translations);
    if (twitterTitle) {
      const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitleMeta) {
        twitterTitleMeta.setAttribute('content', twitterTitle);
      }
    }
    if (twitterDesc) {
      const twitterDescMeta = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescMeta) {
        twitterDescMeta.setAttribute('content', twitterDesc);
      }
    }

    // Atualiza tags hreflang (preparação para SEO multilíngua)
    updateHreflangTags();

    // Dispara evento customizado
    document.dispatchEvent(new CustomEvent('i18n:changed', {
      detail: { locale: currentLocale }
    }));
  }

  /**
   * Atualiza ou cria tags hreflang para SEO multilíngua
   * Como não há URLs por idioma, todas apontam para a mesma URL
   * Preparação para futuro caso decida expor URLs por idioma
   */
  function updateHreflangTags() {
    const canonicalUrl = document.querySelector('link[rel="canonical"]');
    const baseUrl = canonicalUrl ? canonicalUrl.getAttribute('href') : window.location.origin + window.location.pathname;
    
    // Remove tags hreflang existentes
    const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflangs.forEach(tag => tag.remove());

    // Cria tags hreflang para cada idioma suportado
    I18N_CONFIG.supportedLocales.forEach(locale => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', locale);
      link.setAttribute('href', baseUrl);
      
      // Insere antes do canonical ou no final do head
      if (canonicalUrl && canonicalUrl.parentNode) {
        canonicalUrl.parentNode.insertBefore(link, canonicalUrl.nextSibling);
      } else {
        document.head.appendChild(link);
      }
    });

    // Adiciona tag x-default (recomendado pelo Google)
    const xDefaultLink = document.createElement('link');
    xDefaultLink.setAttribute('rel', 'alternate');
    xDefaultLink.setAttribute('hreflang', 'x-default');
    xDefaultLink.setAttribute('href', baseUrl);
    
    if (canonicalUrl && canonicalUrl.parentNode) {
      canonicalUrl.parentNode.insertBefore(xDefaultLink, canonicalUrl.nextSibling);
    } else {
      document.head.appendChild(xDefaultLink);
    }
  }

  /**
   * Alterna para um novo idioma
   */
  async function setLocale(locale) {
    if (!I18N_CONFIG.supportedLocales.includes(locale)) {
      console.warn(`[i18n] Unsupported locale: ${locale}`);
      return;
    }

    if (locale === currentLocale && isInitialized) {
      return; // Já está no idioma solicitado
    }

    currentLocale = locale;
    
    // Salva preferência
    localStorage.setItem(I18N_CONFIG.storageKey, locale);

    // Carrega traduções
    translations = await loadTranslations(locale);
    
    // Aplica traduções
    applyTranslations();

    // Atualiza seletor de idioma se existir
    updateLanguageSelector();
  }

  /**
   * Atualiza o seletor de idioma na UI
   */
  function updateLanguageSelector() {
    const selector = document.getElementById('language-selector');
    if (selector) {
      selector.value = currentLocale;
    }

    // Atualiza labels dos botões de idioma se existirem
    const langButtons = document.querySelectorAll('[data-locale]');
    langButtons.forEach(btn => {
      const btnLocale = btn.getAttribute('data-locale');
      if (btnLocale === currentLocale) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  /**
   * Inicializa o sistema i18n
   */
  async function init() {
    if (isInitialized) {
      return;
    }

    // Obtém idioma inicial
    // Se existir idioma no localStorage → usar
    // Senão → pt-BR (padrão)
    currentLocale = getInitialLocale();

    // Atualiza lang do HTML imediatamente (antes de carregar traduções)
    // Isso é crítico para SEO e acessibilidade
    if (document.documentElement) {
      document.documentElement.lang = currentLocale;
    }

    // Carrega traduções
    translations = await loadTranslations(currentLocale);

    // Aplica traduções quando DOM estiver pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        applyTranslations();
        isInitialized = true;
      });
    } else {
      applyTranslations();
      isInitialized = true;
    }

    // Configura listeners para seletor de idioma
    setupLanguageSelector();
  }

  /**
   * Configura listeners do seletor de idioma
   */
  function setupLanguageSelector() {
    // Select dropdown
    const selector = document.getElementById('language-selector');
    if (selector) {
      selector.addEventListener('change', (e) => {
        setLocale(e.target.value);
      });
    }

    // Botões de idioma
    const langButtons = document.querySelectorAll('[data-locale]');
    langButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const locale = btn.getAttribute('data-locale');
        if (locale) {
          setLocale(locale);
        }
      });
    });
    
    // Re-configura listeners quando novos elementos são adicionados dinamicamente
    // Usa MutationObserver para detectar mudanças no DOM
    const observer = new MutationObserver(() => {
      const newButtons = document.querySelectorAll('[data-locale]:not([data-i18n-listener])');
      newButtons.forEach(btn => {
        btn.setAttribute('data-i18n-listener', 'true');
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const locale = btn.getAttribute('data-locale');
          if (locale) {
            setLocale(locale);
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // API pública
  window.i18n = {
    init,
    setLocale,
    // Alias para compatibilidade com requisitos
    setLanguage: setLocale,
    getLocale: () => currentLocale,
    // Estado global currentLanguage (getter)
    get currentLanguage() {
      return currentLocale;
    },
    getTranslation: (key) => getTranslation(key, translations),
    isReady: () => isInitialized
  };
  
  // Expõe currentLanguage como propriedade global
  Object.defineProperty(window, 'currentLanguage', {
    get: () => currentLocale,
    configurable: true
  });

  // Auto-inicializa quando o script é carregado
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
