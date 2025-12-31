/**
 * Simulação de Output Maven
 * Simula a saída do Maven no painel de output
 */

(function() {
  'use strict';

  // Texto do output Maven
  const OUTPUT_TEXT = `[INFO] Scanning for projects...
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
[INFO] 
[INFO] --- maven-jar-plugin:3.3.0:jar (default-jar) @ application ---
[INFO] Building jar: target/application-1.0.0.jar
[INFO] 
[INFO] --- spring-boot-maven-plugin:3.2.0:repackage (repackage) @ application ---
[INFO] Repackaging jar to target/application-1.0.0.jar
[INFO] Repackaged jar to target/application-1.0.0.jar
[INFO] 
[INFO] --- spring-boot-maven-plugin:3.2.0:run (default-cli) @ application ---
[INFO] Attaching agents: []
[INFO] 
[INFO]   .   ____          _            __ _ _
[INFO]  /\\\\ / ___'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\
[INFO] ( ( )\\___ | '_ | '_| | '_ \\/ _\` | \\ \\ \\ \\
[INFO]  \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )
[INFO]   '  |____| .__|_| |_|_| |_\\__, | / / / /
[INFO]  =========|_|==============|___/=/_/_/_/
[INFO]  :: Spring Boot ::                (v3.2.0)
[INFO] 
[INFO] 2024-01-15T10:23:45.123-03:00  INFO 12345 --- [           main] c.delucena.dev.Application              : Starting Application using Java 17.0.9
[INFO] 2024-01-15T10:23:45.234-03:00  INFO 12345 --- [           main] c.delucena.dev.Application              : No active profile set, falling back to 1 default profile: "default"
[INFO] 2024-01-15T10:23:45.456-03:00  INFO 12345 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories in DEFAULT mode.
[INFO] 2024-01-15T10:23:45.567-03:00  INFO 12345 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 45 ms. Found 3 JPA repository interfaces.
[INFO] 2024-01-15T10:23:45.789-03:00  INFO 12345 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
[INFO] 2024-01-15T10:23:45.890-03:00  INFO 12345 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
[INFO] 2024-01-15T10:23:45.901-03:00  INFO 12345 --- [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/10.1.15]
[INFO] 2024-01-15T10:23:46.012-03:00  INFO 12345 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
[INFO] 2024-01-15T10:23:46.123-03:00  INFO 12345 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 234 ms
[INFO] 2024-01-15T10:23:46.234-03:00  INFO 12345 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
[INFO] 2024-01-15T10:23:46.345-03:00  INFO 12345 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
[INFO] 2024-01-15T10:23:46.456-03:00  INFO 12345 --- [           main] o.hibernate.jpa.internal.util.LogHelper  : HHH000204: Processing PersistenceUnitInfo [name: default]
[INFO] 2024-01-15T10:23:46.567-03:00  INFO 12345 --- [           main] org.hibernate.Version                    : HHH000412: Hibernate ORM core version 6.4.1.Final
[INFO] 2024-01-15T10:23:46.678-03:00  INFO 12345 --- [           main] org.hibernate.cfg.Environment            : HHH000206: hibernate.properties not found
[INFO] 2024-01-15T10:23:46.789-03:00  INFO 12345 --- [           main] o.hibernate.annotations.common.Version   : HCANN000001: Hibernate Commons Annotations {6.0.6.Final}
[INFO] 2024-01-15T10:23:46.890-03:00  INFO 12345 --- [           main] org.hibernate.dialect.Dialect            : HHH000400: Using dialect: org.hibernate.dialect.MySQLDialect
[INFO] 2024-01-15T10:23:47.012-03:00  INFO 12345 --- [           main] o.h.e.t.j.p.i.JtaPlatformInitiator       : HHH000490: Using JtaPlatform implementation: [org.hibernate.engine.transaction.jta.platform.internal.NoJtaPlatform]
[INFO] 2024-01-15T10:23:47.123-03:00  INFO 12345 --- [           main] j.LocalContainerEntityManagerFactoryBean : Initialized JPA EntityManagerFactory for persistence unit 'default'
[INFO] 2024-01-15T10:23:47.234-03:00  INFO 12345 --- [           main] o.s.b.a.h2.H2ConsoleAutoConfiguration    : H2 Console available at '/h2-console'. Available databases: 'jdbc:h2:mem:testdb'
[INFO] 2024-01-15T10:23:47.345-03:00  INFO 12345 --- [           main] o.s.b.a.w.s.WelcomePageHandlerMapping    : Adding welcome page template: index
[INFO] 2024-01-15T10:23:47.456-03:00  INFO 12345 --- [           main] o.s.b.a.e.web.EndpointLinksResolver      : Exposing 1 endpoint(s) beneath base path '/actuator'
[INFO] 2024-01-15T10:23:47.567-03:00  INFO 12345 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
[INFO] 2024-01-15T10:23:47.678-03:00  INFO 12345 --- [           main] c.delucena.dev.Application              : Started Application in 2.456 seconds (process running for 2.789)
[INFO] 2024-01-15T10:23:47.789-03:00  INFO 12345 --- [           main] o.s.b.a.ApplicationAvailabilityBean      : Application availability state LivenessState changed to CORRECT
[INFO] 2024-01-15T10:23:47.890-03:00  INFO 12345 --- [           main] o.s.b.a.ApplicationAvailabilityBean      : Application availability state ReadinessState changed to ACCEPTING_TRAFFIC
[INFO] 
[INFO] --- maven-compiler-plugin:3.11.0:compile (default-compile) @ application ---
[INFO] Nothing to compile - all classes are up to date
[INFO] 
[INFO] --- maven-resources-plugin:3.3.1:resources (default-resources) @ application ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Using 'UTF-8' encoding to copy filtered properties files.
[INFO] Copying 3 resources
[INFO] 
[INFO] --- maven-compiler-plugin:3.11.0:testCompile (default-testCompile) @ application ---
[INFO] Nothing to compile - all classes are up to date
[INFO] 
[INFO] --- maven-surefire-plugin:3.1.2:test (default-test) @ application ---
[INFO] Using auto detected provider JUnit5
[INFO] 
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.delucena.dev.ApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.189 s - in com.delucena.dev.ApplicationTests
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  15.234 s
[INFO] Finished at: 2024-01-15T10:24:00-03:00
[INFO] ------------------------------------------------------------------------`;

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
   * Imprime o texto gradualmente no output
   */
  function printOutputGradually() {
    const outputContent = document.getElementById('outputContent');
    if (!outputContent) return;
    
    // Limpar conteúdo anterior
    outputContent.innerHTML = '';
    
    // Criar observer para scroll automático
    const scrollObserver = createScrollObserver(outputContent);
    scrollObserver.observe(outputContent, {
      childList: true,
      subtree: true
    });
    
    // Dividir o texto em linhas
    const lines = OUTPUT_TEXT.split('\n');
    let currentLine = 0;
    
    /**
     * Imprime próxima linha
     */
    function printNextLine() {
      if (currentLine < lines.length) {
        const line = lines[currentLine];
        const lineElement = document.createElement('span');
        lineElement.className = 'output-line';
        lineElement.textContent = line;
        outputContent.appendChild(lineElement);
        const brElement = document.createElement('br');
        outputContent.appendChild(brElement);
        
        currentLine++;
        
        // Scroll automático
        brElement.scrollIntoView({ behavior: 'auto', block: 'end' });
        setTimeout(() => {
          outputContent.scrollTop = outputContent.scrollHeight;
        }, 0);
        
        // Velocidade variável: algumas linhas mais rápidas, outras mais lentas
        const delay = Math.random() * 50 + 20; // Entre 20ms e 70ms
        setTimeout(printNextLine, delay);
      }
    }
    
    // Iniciar impressão
    printNextLine();
  }

  // Detectar quando a aba output é selecionada
  const outputRadio = document.getElementById('output');
  if (outputRadio) {
    let hasPrinted = false;
    
    outputRadio.addEventListener('change', function() {
      if (this.checked && !hasPrinted) {
        hasPrinted = true;
        // Pequeno delay para garantir que a aba está visível
        setTimeout(printOutputGradually, 100);
      }
    });
    
    // Se a aba já estiver selecionada ao carregar a página
    if (outputRadio.checked) {
      setTimeout(printOutputGradually, 100);
    }
  }
})();
