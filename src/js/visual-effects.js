/**
 * Visual Effects Module
 * Gerencia efeitos visuais temporários e reversíveis no preview do site
 * 
 * @module visual-effects
 * @description Controla efeitos visuais divertidos acionados via terminal
 */

(function() {
  'use strict';

  // Namespace global para efeitos visuais
  window.VisualEffects = window.VisualEffects || {};

  // Estado dos efeitos ativos
  const activeEffects = {
    pirate: false,
    dance: false,
    mouseChaos: false,
    debug: false,
    hack: false,
    gravity: false
  };

  // Referências para listeners que precisam ser removidos
  const listeners = {
    mouseChaos: null
  };

  // Elemento de mouse chaos (se existir)
  let mouseChaosElement = null;

  /**
   * Obtém o elemento do preview (editor)
   * @returns {HTMLElement|null}
   */
  function getPreviewElement() {
    return document.querySelector('#editor .editor');
  }

  /**
   * Verifica se está em modo preview (não código)
   * @returns {boolean}
   */
  function isPreviewMode() {
    const editor = getPreviewElement();
    return editor && !editor.classList.contains('code-mode');
  }

  /**
   * Ativa modo pirata (idioma fake)
   */
  function activatePirateMode() {
    if (activeEffects.pirate) return;
    
    activeEffects.pirate = true;
    document.body.classList.add('mode-pirate');
  }

  /**
   * Desativa modo pirata
   */
  function deactivatePirateMode() {
    if (!activeEffects.pirate) return;
    
    activeEffects.pirate = false;
    document.body.classList.remove('mode-pirate');
  }

  /**
   * Ativa modo dance (animações)
   */
  function activateDanceMode() {
    if (activeEffects.dance) return;
    
    activeEffects.dance = true;
    document.body.classList.add('mode-dance');
    
    // Auto-reset após 4 segundos
    setTimeout(() => {
      deactivateDanceMode();
    }, 4000);
  }

  /**
   * Desativa modo dance
   */
  function deactivateDanceMode() {
    if (!activeEffects.dance) return;
    
    activeEffects.dance = false;
    document.body.classList.remove('mode-dance');
  }

  /**
   * Cria elemento que segue o cursor
   */
  function createMouseChaosElement() {
    if (mouseChaosElement) return;
    
    const element = document.createElement('div');
    element.className = 'mouse-chaos-trail';
    element.setAttribute('aria-hidden', 'true');
    document.body.appendChild(element);
    mouseChaosElement = element;
  }

  /**
   * Remove elemento de mouse chaos
   */
  function removeMouseChaosElement() {
    if (mouseChaosElement) {
      mouseChaosElement.remove();
      mouseChaosElement = null;
    }
  }

  /**
   * Handler para mouse chaos
   * Usa transform ao invés de left/top para animação composta (melhor performance)
   */
  function handleMouseMove(e) {
    if (!mouseChaosElement || !isPreviewMode()) return;
    
    const preview = getPreviewElement();
    if (!preview) return;
    
    const rect = preview.getBoundingClientRect();
    
    // Só mostra dentro do preview
    if (e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom) {
      // Usar transform ao invés de left/top para animação composta
      mouseChaosElement.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%) translateZ(0)`;
      mouseChaosElement.style.display = 'block';
    } else {
      mouseChaosElement.style.display = 'none';
    }
  }

  /**
   * Ativa modo mouse chaos
   */
  function activateMouseChaos() {
    if (activeEffects.mouseChaos) return;
    
    activeEffects.mouseChaos = true;
    createMouseChaosElement();
    
    // Adiciona listener
    listeners.mouseChaos = handleMouseMove;
    document.addEventListener('mousemove', listeners.mouseChaos);
  }

  /**
   * Desativa modo mouse chaos
   */
  function deactivateMouseChaos() {
    if (!activeEffects.mouseChaos) return;
    
    activeEffects.mouseChaos = false;
    
    // Remove listener
    if (listeners.mouseChaos) {
      document.removeEventListener('mousemove', listeners.mouseChaos);
      listeners.mouseChaos = null;
    }
    
    removeMouseChaosElement();
  }

  /**
   * Ativa modo debug
   */
  function activateDebugMode() {
    if (activeEffects.debug) return;
    
    activeEffects.debug = true;
    document.body.classList.add('mode-debug');
  }

  /**
   * Desativa modo debug
   */
  function deactivateDebugMode() {
    if (!activeEffects.debug) return;
    
    activeEffects.debug = false;
    document.body.classList.remove('mode-debug');
  }

  /**
   * Ativa modo hack
   */
  function activateHackMode() {
    if (activeEffects.hack) return;
    
    activeEffects.hack = true;
    document.body.classList.add('mode-hack');
  }

  /**
   * Desativa modo hack
   */
  function deactivateHackMode() {
    if (!activeEffects.hack) return;
    
    activeEffects.hack = false;
    document.body.classList.remove('mode-hack');
  }

  /**
   * Ativa modo gravity off
   */
  function activateGravityOff() {
    if (activeEffects.gravity) return;
    
    activeEffects.gravity = true;
    document.body.classList.add('mode-gravity');
  }

  /**
   * Desativa modo gravity off
   */
  function deactivateGravityOff() {
    if (!activeEffects.gravity) return;
    
    activeEffects.gravity = false;
    document.body.classList.remove('mode-gravity');
  }

  /**
   * Reseta todos os efeitos
   */
  function resetAllEffects() {
    deactivatePirateMode();
    deactivateDanceMode();
    deactivateMouseChaos();
    deactivateDebugMode();
    deactivateHackMode();
    deactivateGravityOff();
  }

  // API pública
  VisualEffects.activatePirate = activatePirateMode;
  VisualEffects.deactivatePirate = deactivatePirateMode;
  VisualEffects.activateDance = activateDanceMode;
  VisualEffects.deactivateDance = deactivateDanceMode;
  VisualEffects.activateMouseChaos = activateMouseChaos;
  VisualEffects.deactivateMouseChaos = deactivateMouseChaos;
  VisualEffects.activateDebug = activateDebugMode;
  VisualEffects.deactivateDebug = deactivateDebugMode;
  VisualEffects.activateHack = activateHackMode;
  VisualEffects.deactivateHack = deactivateHackMode;
  VisualEffects.activateGravityOff = activateGravityOff;
  VisualEffects.deactivateGravityOff = deactivateGravityOff;
  VisualEffects.reset = resetAllEffects;
  VisualEffects.isActive = (effect) => activeEffects[effect] || false;

})();
