/**
 * Simulação de Terminal
 * Simula a execução de comandos no terminal
 */

(function() {
  'use strict';

  // Logs do terminal
  const TERMINAL_LOGS = [
    '$ mvn spring-boot:run',
    '',
    '  .   ____          _            __ _ _',
    ' /\\\\ / ___\'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\',
    '( ( )\\___ | \'_ | \'_| | \'_ \\/ _` | \\ \\ \\ \\',
    ' \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )',
    '  \'  |____| .__|_| |_|_| |_\\__, | / / / /',
    ' =========|_|==============|___/=/_/_/_/',
    ' :: Spring Boot ::                (v3.2.0)',
    '',
    '2024-01-15T10:23:45.123-03:00  INFO 12345 --- [           main] c.delucena.dev.Application              : Starting Application using Java 17.0.9',
    '2024-01-15T10:23:45.234-03:00  INFO 12345 --- [           main] c.delucena.dev.Application              : No active profile set, falling back to 1 default profile: "default"',
    '2024-01-15T10:23:45.456-03:00  INFO 12345 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories in DEFAULT mode.',
    '2024-01-15T10:23:45.567-03:00  INFO 12345 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 45 ms. Found 3 JPA repository interfaces.',
    '2024-01-15T10:23:45.789-03:00  INFO 12345 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)',
    '2024-01-15T10:23:46.012-03:00  INFO 12345 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext',
    '2024-01-15T10:23:46.234-03:00  INFO 12345 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...',
    '2024-01-15T10:23:46.345-03:00  INFO 12345 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.',
    '2024-01-15T10:23:47.123-03:00  INFO 12345 --- [           main] org.hibernate.Version                    : HHH000412: Hibernate ORM core version 6.4.1.Final',
    '2024-01-15T10:23:47.567-03:00  INFO 12345 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path \'\'',
    '2024-01-15T10:23:47.678-03:00  INFO 12345 --- [           main] c.delucena.dev.Application              : Started Application in 2.456 seconds (process running for 2.789)'
  ];

  /**
   * Cria um observer para scroll automático
   * @param {HTMLElement} element - Elemento a observar
   */
  function createScrollObserver(element) {
    return new MutationObserver((mutations) => {
      if (mutations.some(m => m.addedNodes.length > 0)) {
        requestAnimationFrame(() => {
          element.scrollTop = element.scrollHeight;
        });
      }
    });
  }

  /**
   * Simula a execução do terminal linha a linha
   */
  function simulateTerminalExecution() {
    const terminalOutput = document.getElementById('terminalOutput');
    if (!terminalOutput) return;
    
    // Limpar conteúdo anterior
    terminalOutput.innerHTML = '';
    
    // Criar observer para scroll automático
    const scrollObserver = createScrollObserver(terminalOutput);
    scrollObserver.observe(terminalOutput, {
      childList: true,
      subtree: true
    });
    
    let currentLine = 0;
    
    /**
     * Adiciona próxima linha ao terminal
     */
    function addNextLine() {
      if (currentLine < TERMINAL_LOGS.length) {
        const line = TERMINAL_LOGS[currentLine];
        const lineElement = document.createElement('div');
        
        // Formatar linha baseado no conteúdo
        if (line.startsWith('$')) {
          const promptSpan = document.createElement('span');
          promptSpan.className = 'terminal-prompt';
          promptSpan.textContent = '$';
          lineElement.appendChild(promptSpan);
          lineElement.appendChild(document.createTextNode(' ' + line.substring(2)));
        } else if (line.includes('Started Application')) {
          const successSpan = document.createElement('span');
          successSpan.className = 'terminal-success';
          successSpan.textContent = line;
          lineElement.appendChild(successSpan);
        } else if (line.includes('____') || line.includes('\\\\') || line.includes('___')) {
          const bannerSpan = document.createElement('span');
          bannerSpan.className = 'terminal-banner';
          bannerSpan.textContent = line;
          lineElement.appendChild(bannerSpan);
        } else {
          lineElement.textContent = line;
        }
        
        terminalOutput.appendChild(lineElement);
        currentLine++;
        
        // Scroll automático
        lineElement.scrollIntoView({ behavior: 'auto', block: 'end' });
        setTimeout(() => {
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }, 0);
        
        // Delay variável entre linhas (20-70ms)
        const delay = Math.random() * 50 + 20;
        
        // Se chegou na última linha, trocar para output após um delay
        if (currentLine >= TERMINAL_LOGS.length) {
          setTimeout(() => {
            const outputRadio = document.getElementById('output');
            if (outputRadio) {
              outputRadio.checked = true;
              outputRadio.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }, 500);
        } else {
          setTimeout(addNextLine, delay);
        }
      }
    }
    
    // Iniciar simulação
    addNextLine();
  }

  // Iniciar simulação quando a aba terminal estiver selecionada
  const terminalsRadio = document.getElementById('terminals');
  if (terminalsRadio && terminalsRadio.checked) {
    setTimeout(simulateTerminalExecution, 300);
  }
})();
