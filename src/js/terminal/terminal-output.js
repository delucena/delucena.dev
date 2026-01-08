/**
 * Terminal Output
 * Simula diferentes tipos de output com combo selector
 * 
 * @module terminal-output
 * @description Simula outputs de Maven, Tasks, Java e Spring Boot
 */

(function() {
  'use strict';

  const SELECTORS = {
    outputContent: '#outputContent',
    outputSelector: '#terminalOutputSelector',
    outputRadio: '#output'
  };

  // Conteúdo de cada tipo de output
  const OUTPUTS = {
    maven: `[INFO] Scanning for projects...
[INFO] 
[INFO] ------------------< com.delucena.dev:application >------------------
[INFO] Building application 1.0.0
[INFO] --------------------------------[ jar ]---------------------------------
[INFO] 
[INFO] --- maven-clean-plugin:3.2.0:clean (default-clean) @ application ---
[INFO] Deleting target
[INFO] 
[INFO] --- maven-resources-plugin:3.3.1:resources (default-resources) @ application ---
[INFO] Copying 3 resources
[INFO] Copying 3 resources
[INFO] 
[INFO] --- maven-compiler-plugin:3.11.0:compile (default-compile) @ application ---
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 1 source file to target/classes
[INFO] 
[INFO] --- maven-resources-plugin:3.3.1:testResources (default-testResources) @ application ---
[INFO] Copying 1 resource
[INFO] 
[INFO] --- maven-compiler-plugin:3.11.0:testCompile (default-testCompile) @ application ---
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 1 source file to target/test-classes
[INFO] 
[INFO] --- maven-surefire-plugin:3.1.2:test (default-test) @ application ---
[INFO] Using auto detected provider JUnit5
[INFO] 
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.delucena.dev.ApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.234 s - in com.delucena.dev.ApplicationTests
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] --- maven-jar-plugin:3.3.0:jar (default-jar) @ application ---
[INFO] Building jar: target/application-1.0.0.jar
[INFO] 
[INFO] --- spring-boot-maven-plugin:3.2.0:repackage (repackage) @ application ---
[INFO] Repackaging jar to target/application-1.0.0.jar
[INFO] Repackaged jar to target/application-1.0.0.jar
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  15.234 s
[INFO] Finished at: 2024-01-15T10:24:00-03:00
[INFO] ------------------------------------------------------------------------`,

    tasks: `[TODO] Application.java:42 - Implementar validação de dados
[TODO] Application.java:58 - Adicionar tratamento de exceções
[TODO] Application.java:73 - Refatorar método de autenticação
[TODO] UserService.java:15 - Implementar cache de usuários
[TODO] UserService.java:32 - Adicionar paginação na listagem
[TODO] UserController.java:25 - Adicionar validação de entrada
[TODO] UserController.java:41 - Implementar rate limiting
[TODO] DatabaseConfig.java:12 - Configurar pool de conexões
[TODO] SecurityConfig.java:28 - Implementar JWT authentication
[TODO] SecurityConfig.java:45 - Adicionar CORS configuration
[TODO] EmailService.java:8 - Implementar envio de emails
[TODO] EmailService.java:22 - Adicionar templates de email
[TODO] PaymentService.java:15 - Integrar gateway de pagamento
[TODO] PaymentService.java:33 - Implementar webhook handler
[TODO] NotificationService.java:10 - Adicionar notificações push
[TODO] NotificationService.java:27 - Implementar notificações SMS`,

    java: `javac Application.java
Note: Application.java uses unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.
Application.java:42: warning: [deprecation] getInstance() in DateFormat has been deprecated
        DateFormat df = DateFormat.getInstance();
                        ^
Application.java:58: warning: [unchecked] unchecked conversion
        List<String> items = new ArrayList();
                              ^
  required: List<String>
  found:    ArrayList
Application.java:73: warning: [rawtypes] found raw type: HashMap
        Map config = new HashMap();
                     ^
  missing type arguments for generic class Map<K,V>
  where K,V are type-variable:
    K extends Object declared in interface Map
    V extends Object declared in interface Map
3 warnings
Compilation successful.`,

    spring: `  .   ____          _            __ _ _
 /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\
( ( )\\___ | '_ | '_| | '_ \\/ _\` | \\ \\ \\ \\
 \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

2024-01-15T10:23:45.123-03:00  INFO 12345 --- [           main] c.delucena.dev.Application              : Starting Application using Java 17.0.9
2024-01-15T10:23:45.234-03:00  INFO 12345 --- [           main] c.delucena.dev.Application              : No active profile set, falling back to 1 default profile: "default"
2024-01-15T10:23:45.456-03:00  INFO 12345 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2024-01-15T10:23:45.567-03:00  INFO 12345 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 45 ms. Found 3 JPA repository interfaces.
2024-01-15T10:23:45.789-03:00  INFO 12345 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2024-01-15T10:23:45.890-03:00  INFO 12345 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2024-01-15T10:23:45.901-03:00  INFO 12345 --- [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/10.1.15]
2024-01-15T10:23:46.012-03:00  INFO 12345 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2024-01-15T10:23:46.123-03:00  INFO 12345 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 234 ms
2024-01-15T10:23:46.234-03:00  INFO 12345 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2024-01-15T10:23:46.345-03:00  INFO 12345 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
2024-01-15T10:23:46.456-03:00  INFO 12345 --- [           main] o.hibernate.jpa.internal.util.LogHelper  : HHH000204: Processing PersistenceUnitInfo [name: default]
2024-01-15T10:23:46.567-03:00  INFO 12345 --- [           main] org.hibernate.Version                    : HHH000412: Hibernate ORM core version 6.4.1.Final
2024-01-15T10:23:46.678-03:00  INFO 12345 --- [           main] org.hibernate.cfg.Environment            : HHH000206: hibernate.properties not found
2024-01-15T10:23:46.789-03:00  INFO 12345 --- [           main] o.hibernate.annotations.common.Version   : HCANN000001: Hibernate Commons Annotations {6.0.6.Final}
2024-01-15T10:23:46.890-03:00  INFO 12345 --- [           main] org.hibernate.dialect.Dialect            : HHH000400: Using dialect: org.hibernate.dialect.MySQLDialect
2024-01-15T10:23:47.012-03:00  INFO 12345 --- [           main] o.h.e.t.j.p.i.JtaPlatformInitiator       : HHH000490: Using JtaPlatform implementation: [org.hibernate.engine.transaction.jta.platform.internal.NoJtaPlatform]
2024-01-15T10:23:47.123-03:00  INFO 12345 --- [           main] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
2024-01-15T10:23:47.234-03:00  INFO 12345 --- [           main] o.s.b.a.h2.H2ConsoleAutoConfiguration    : H2 Console available at '/h2-console'. Available databases: 'jdbc:h2:mem:testdb'
2024-01-15T10:23:47.345-03:00  INFO 12345 --- [           main] o.s.b.a.w.s.WelcomePageHandlerMapping    : Adding welcome page template: index
2024-01-15T10:23:47.456-03:00  INFO 12345 --- [           main] o.s.b.a.e.web.EndpointLinksResolver      : Exposing 1 endpoint(s) beneath base path '/actuator'
2024-01-15T10:23:47.567-03:00  INFO 12345 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
2024-01-15T10:23:47.678-03:00  INFO 12345 --- [           main] c.delucena.dev.Application              : Started Application in 2.456 seconds (process running for 2.789)
2024-01-15T10:23:47.789-03:00  INFO 12345 --- [           main] o.s.b.a.ApplicationAvailabilityBean      : Application availability state LivenessState changed to CORRECT
2024-01-15T10:23:47.890-03:00  INFO 12345 --- [           main] o.s.b.a.ApplicationAvailabilityBean      : Application availability state ReadinessState changed to ACCEPTING_TRAFFIC`
  };

  /**
   * Cria um observer para scroll automático
   * @param {HTMLElement} element - Elemento a observar
   * @returns {MutationObserver} - Observer configurado
   */
  function createScrollObserver(element) {
    if (!element || !(element instanceof HTMLElement)) {
      throw new Error('Elemento inválido para observer');
    }
    
    let scrollTimeout;
    
    return new MutationObserver((mutations) => {
      try {
        // Detecta qualquer mudança no conteúdo (nós adicionados, texto alterado, etc)
        const hasChanges = mutations.some(m => 
          m.addedNodes.length > 0 || 
          m.removedNodes.length > 0 || 
          (m.type === 'characterData' && m.target.textContent.trim())
        );
        
        if (hasChanges) {
          // Usa debounce para evitar múltiplos scrolls
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            requestAnimationFrame(() => {
              if (element && element.isConnected) {
                element.scrollTop = element.scrollHeight;
              }
            });
          }, 10);
        }
      } catch (error) {
        console.error('Erro no scroll observer:', error);
      }
    });
  }

  /**
   * Mantém o scroll no final do output
   * @param {HTMLElement} outputContent - Elemento de output
   */
  function maintainScrollAtBottom(outputContent) {
    if (!outputContent) return;
    
    // Função para garantir scroll no final
    const scrollToBottom = () => {
      if (outputContent) {
        requestAnimationFrame(() => {
          if (outputContent) {
            outputContent.scrollTop = outputContent.scrollHeight;
          }
        });
      }
    };
    
    // Listener para resize - mantém scroll no final quando terminal é redimensionado
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        scrollToBottom();
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Observer para mudanças no conteúdo - mantém scroll no final
    const scrollObserver = createScrollObserver(outputContent);
    scrollObserver.observe(outputContent, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    // Retorna função de limpeza
    return () => {
      window.removeEventListener('resize', handleResize);
      scrollObserver.disconnect();
    };
  }

  /**
   * Imprime o texto gradualmente no output
   * @param {string} text - Texto a ser impresso
   * @param {HTMLElement} outputContent - Elemento de output
   */
  function printOutputGradually(text, outputContent) {
    if (!outputContent) {
      return;
    }
    
    // Remover placeholder se existir
    const placeholder = outputContent.querySelector('.output-placeholder');
    if (placeholder) {
      placeholder.remove();
    }
    
    // Limpar conteúdo anterior
    outputContent.innerHTML = '';
    
    // Iniciar manutenção de scroll (mantém ativo mesmo após impressão)
    const cleanupScroll = maintainScrollAtBottom(outputContent);
    
    // Armazenar cleanup para uso futuro se necessário
    if (!outputContent._scrollCleanup) {
      outputContent._scrollCleanup = cleanupScroll;
    }
    
    // Dividir o texto em linhas
    const lines = text.split('\n');
    let currentLine = 0;
    let accumulatedText = '';
    
    /**
     * Imprime próxima linha
     */
    function printNextLine() {
      if (currentLine < lines.length) {
        const line = lines[currentLine];
        // Adiciona a linha ao texto acumulado
        if (currentLine > 0) {
          accumulatedText += '\n';
        }
        accumulatedText += line;
        
        // Atualiza o conteúdo diretamente
        outputContent.textContent = accumulatedText;
        
        currentLine++;
        
        // Scroll automático - garante que chegue até o final
        requestAnimationFrame(() => {
          if (outputContent) {
            outputContent.scrollTop = outputContent.scrollHeight;
            // Força scroll até o final para garantir que todo conteúdo seja visível
            requestAnimationFrame(() => {
              if (outputContent) {
                outputContent.scrollTop = outputContent.scrollHeight;
              }
            });
          }
        });
        
        // Velocidade variável: algumas linhas mais rápidas, outras mais lentas
        const delay = Math.random() * 50 + 20; // Entre 20ms e 70ms
        setTimeout(printNextLine, delay);
      } else {
        // Após terminar a impressão, garante scroll final
        requestAnimationFrame(() => {
          if (outputContent) {
            outputContent.scrollTop = outputContent.scrollHeight;
          }
        });
      }
    }
    
    // Iniciar impressão
    printNextLine();
  }

  /**
   * Atualiza o conteúdo do output baseado no selector
   * @param {string} type - Tipo de output (maven, tasks, java, spring)
   */
  function updateOutput(type) {
    try {
      const outputContent = document.querySelector(SELECTORS.outputContent);
      if (!outputContent) {
        console.warn('Elemento outputContent não encontrado');
        return;
      }

      const outputText = OUTPUTS[type] || OUTPUTS.maven;
      printOutputGradually(outputText, outputContent);
    } catch (error) {
      console.error('Erro ao atualizar output:', error);
    }
  }

  /**
   * Inicializa o módulo de output
   */
  function init() {
    try {
      const outputRadio = document.querySelector(SELECTORS.outputRadio);
      const outputSelector = document.querySelector(SELECTORS.outputSelector);
      
      if (!outputRadio) {
        return;
      }

      // Handler para mudança de aba
      let hasInitialized = false;
      
      outputRadio.addEventListener('change', function() {
        try {
          if (this.checked && !hasInitialized) {
            hasInitialized = true;
            // Pequeno delay para garantir que a aba está visível
            setTimeout(() => {
              const selector = document.querySelector(SELECTORS.outputSelector);
              if (selector) {
                updateOutput(selector.value || 'maven');
              }
            }, 100);
          }
        } catch (error) {
          console.error('Erro ao processar mudança de aba:', error);
        }
      });

      // Handler para mudança do selector
      if (outputSelector) {
        outputSelector.addEventListener('change', function() {
          try {
            if (outputRadio.checked) {
              updateOutput(this.value);
            }
          } catch (error) {
            console.error('Erro ao processar mudança de selector:', error);
          }
        });
      }
      
      // Se a aba já estiver selecionada ao carregar a página
      if (outputRadio.checked) {
        setTimeout(() => {
          const selector = document.querySelector(SELECTORS.outputSelector);
          if (selector) {
            updateOutput(selector.value || 'maven');
          }
        }, 100);
      }
    } catch (error) {
      console.error('Erro ao inicializar módulo de output:', error);
    }
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
