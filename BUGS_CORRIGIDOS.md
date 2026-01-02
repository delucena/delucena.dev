# 🐛 Bugs Corrigidos

Este documento contém a documentação dos bugs que foram identificados e corrigidos no projeto.

---

## 🐛 Descrição do Bug

O scroll automático não funcionava corretamente na aba "Output" do terminal quando o conteúdo era adicionado gradualmente (linha por linha). O usuário precisava rolar manualmente para ver as últimas linhas de output, especialmente quando o conteúdo era gerado dinamicamente (como nos outputs de Maven, Tasks, Java e Spring Boot).

## 🔄 Passos para Reproduzir

1. Abra o portfólio no navegador
2. Navegue até a seção do terminal
3. Clique na aba "OUTPUT" do terminal
4. Selecione um tipo de output no dropdown (Maven, Tasks, Java ou Spring Boot)
5. Observe o conteúdo sendo adicionado gradualmente linha por linha
6. Veja que o scroll não acompanha automaticamente as novas linhas adicionadas

## ✅ Comportamento Esperado

O scroll deveria acompanhar automaticamente o conteúdo sendo adicionado, mantendo sempre a última linha visível no viewport, sem necessidade de interação manual do usuário.

## ❌ Comportamento Atual (Antes da Correção)

O scroll permanecia no topo ou em uma posição intermediária, não acompanhando o conteúdo novo. As últimas linhas de output ficavam ocultas abaixo do viewport, exigindo que o usuário rolasse manualmente para visualizá-las.

## 📸 Screenshots

Não disponível no momento.

## 💻 Ambiente

- **OS**: macOS 24.5.0
- **Navegador**: Chrome 120+, Firefox 121+, Safari 17+
- **Versão do Projeto**: 2.0.0
- **Node.js**: 18.0.0+

## 📝 Informações Adicionais

### Solução Implementada

A correção foi implementada através de:

1. **MutationObserver**: Criado um observer para detectar mudanças no DOM e acionar o scroll automaticamente quando novas linhas são adicionadas.

2. **Múltiplas estratégias de scroll**: Implementado um sistema que usa tanto `setTimeout` quanto `requestAnimationFrame` para garantir que o scroll seja executado após o DOM ser atualizado.

3. **Scroll forçado**: Adicionado código que força o scroll até o final do conteúdo (`scrollTop = scrollHeight`) tanto imediatamente quanto em um frame de animação seguinte.

4. **Ajustes no CSS**: Modificações no CSS para garantir que o container de scroll funcione corretamente em um layout flexbox, incluindo:
   - `flex: 1 1 0%` para ocupar espaço disponível
   - `min-height: 0` para permitir scroll em flexbox
   - `height: 0` como técnica para forçar scroll em flexbox
   - `padding-bottom` extra para garantir que a última linha seja totalmente visível

### Arquivos Modificados

- `src/js/terminal/terminal-output.js` - Implementação do MutationObserver e lógica de scroll automático
- `src/css/terminal/terminal-output.css` - Ajustes no CSS para garantir scroll funcionando em flexbox

### Código da Correção

```172:231:src/js/terminal/terminal-output.js
  function printOutputGradually(text, outputContent) {
    if (!outputContent) {
      console.warn('Elemento outputContent não encontrado');
      return;
    }
    
    // Limpar conteúdo anterior
    outputContent.innerHTML = '';
    
    // Criar observer para scroll automático
    const scrollObserver = createScrollObserver(outputContent);
    scrollObserver.observe(outputContent, {
      childList: true,
      subtree: true
    });
    
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
        setTimeout(() => {
          if (outputContent) {
            outputContent.scrollTop = outputContent.scrollHeight;
            // Força scroll até o final para garantir que todo conteúdo seja visível
            requestAnimationFrame(() => {
              if (outputContent) {
                outputContent.scrollTop = outputContent.scrollHeight;
              }
            });
          }
        }, 0);
        
        // Velocidade variável: algumas linhas mais rápidas, outras mais lentas
        const delay = Math.random() * 50 + 20; // Entre 20ms e 70ms
        setTimeout(printNextLine, delay);
      }
    }
    
    // Iniciar impressão
    printNextLine();
  }
```

## 🔍 Checklist

- [x] Verifiquei se o bug já não foi reportado
- [x] Forneci uma descrição clara do problema
- [x] Incluí passos para reproduzir
- [ ] Adicionei screenshots (se aplicável)
- [x] Especifiquei o ambiente

---

**Obrigado por reportar!** 🙏
