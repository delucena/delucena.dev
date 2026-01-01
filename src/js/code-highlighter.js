/**
 * Code Highlighter - Syntax Highlighting para HTML
 * Aplica colorização de código no estilo VS Code usando classes token.*
 * 
 * @module code-highlighter
 * @description Tokeniza e aplica syntax highlighting em código HTML
 */

(function() {
  'use strict';

  /**
   * Escapa caracteres HTML especiais
   * @param {string} text - Texto a ser escapado
   * @returns {string} - Texto escapado
   */
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Adiciona um span com classe token específica
   * @param {string} content - Conteúdo do token
   * @param {string} tokenType - Tipo do token (tag, tag-name, attr-name, etc.)
   * @returns {string} - HTML com span
   */
  function addTokenSpan(content, tokenType) {
    if (!content) return '';
    return '<span class="token ' + tokenType + '">' + content + '</span>';
  }

  /**
   * Aplica syntax highlighting ao HTML usando classes token.* no padrão VS Code
   * @param {string} html - HTML a ser destacado
   * @returns {string} - HTML com spans coloridos usando classes token.*
   */
  function highlightHTML(html) {
    if (!html) return '';
    
    // Escapa o HTML primeiro
    let escaped = escapeHtml(html);
    let result = '';
    let i = 0;
    const len = escaped.length;
    
    /**
     * Processa uma tag HTML completa
     */
    function processTag() {
      let tagResult = '';
      
      // Delimitador de abertura < (punctuation)
      if (escaped[i] === '&' && escaped.substr(i, 4) === '&lt;') {
        tagResult += addTokenSpan('&lt;', 'punctuation');
        i += 4;
      } else {
        return null;
      }
      
      // Verifica se é tag de fechamento
      let isClosing = false;
      if (escaped[i] === '/') {
        tagResult += addTokenSpan('/', 'punctuation');
        isClosing = true;
        i++;
      }
      
      // Nome da tag (tag-name)
      let tagName = '';
      while (i < len && /[\w-]/.test(escaped[i])) {
        tagName += escaped[i];
        i++;
      }
      
      if (tagName) {
        tagResult += addTokenSpan(tagName, 'tag-name');
      }
      
      // Se é tag de fechamento, só precisa do >
      if (isClosing) {
        // Pula espaços em branco
        while (i < len && /\s/.test(escaped[i])) {
          tagResult += escaped[i];
          i++;
        }
        
        // Delimitador de fechamento > (punctuation)
        if (escaped[i] === '&' && escaped.substr(i, 4) === '&gt;') {
          tagResult += addTokenSpan('&gt;', 'punctuation');
          i += 4;
          return tagResult;
        }
      }
      
      // Processa atributos
      while (i < len) {
        // Pula espaços em branco
        let whitespace = '';
        while (i < len && /\s/.test(escaped[i])) {
          whitespace += escaped[i];
          i++;
        }
        tagResult += whitespace;
        
        // Verifica se chegou ao fim da tag
        if (escaped[i] === '&' && escaped.substr(i, 4) === '&gt;') {
          tagResult += addTokenSpan('&gt;', 'punctuation');
          i += 4;
          break;
        }
        
        // Processa atributo (attr-name)
        let attrName = '';
        while (i < len && /[\w-:]/.test(escaped[i])) {
          attrName += escaped[i];
          i++;
        }
        
        if (attrName) {
          tagResult += addTokenSpan(attrName, 'attr-name');
          
          // Pula espaços antes do =
          let equalsWhitespace = '';
          while (i < len && /\s/.test(escaped[i])) {
            equalsWhitespace += escaped[i];
            i++;
          }
          tagResult += equalsWhitespace;
          
          // Verifica se tem operador = (punctuation)
          if (escaped[i] === '=') {
            tagResult += addTokenSpan('=', 'punctuation');
            i++;
            
            // Pula espaços após o =
            let valueWhitespace = '';
            while (i < len && /\s/.test(escaped[i])) {
              valueWhitespace += escaped[i];
              i++;
            }
            tagResult += valueWhitespace;
            
            // Processa valor (string entre aspas) - attr-value
            if (escaped[i] === '"' || escaped[i] === "'") {
              const quote = escaped[i];
              tagResult += addTokenSpan(quote, 'attr-value');
              i++;
              
              // Conteúdo da string (attr-value)
              let stringValue = '';
              while (i < len && escaped[i] !== quote) {
                stringValue += escaped[i];
                i++;
              }
              
              if (stringValue) {
                tagResult += addTokenSpan(stringValue, 'attr-value');
              }
              
              // Aspa de fechamento (attr-value)
              if (escaped[i] === quote) {
                tagResult += addTokenSpan(quote, 'attr-value');
                i++;
              }
            }
          }
        } else {
          // Se não conseguiu ler um atributo, pode ser fim da tag ou erro
          break;
        }
      }
      
      return tagResult;
    }
    
    /**
     * Processa comentário HTML
     */
    function processComment() {
      if (escaped.substr(i, 4) === '&lt;' && escaped.substr(i + 4, 3) === '!--') {
        let comment = '';
        let start = i;
        i += 7; // &lt;!--
        
        while (i < len) {
          if (escaped.substr(i, 2) === '--' && escaped.substr(i + 2, 4) === '&gt;') {
            comment = escaped.substring(start, i + 6);
            i += 6;
            return addTokenSpan(comment, 'comment');
          }
          i++;
        }
        
        // Comentário não fechado
        return addTokenSpan(escaped.substring(start, i), 'comment');
      }
      return null;
    }
    
    /**
     * Verifica se é início de tag ou comentário
     */
    function isTagStart() {
      return escaped[i] === '&' && escaped.substr(i, 4) === '&lt;';
    }
    
    // Processa o HTML caractere por caractere
    while (i < len) {
      // Verifica se é início de tag ou comentário
      if (isTagStart()) {
        // Tenta processar comentário primeiro (comentários começam com &lt;!--)
        if (escaped.substr(i + 4, 3) === '!--') {
          const comment = processComment();
          if (comment) {
            result += comment;
            continue;
          }
        }
        
        // Tenta processar tag
        const tag = processTag();
        if (tag) {
          result += tag;
          continue;
        }
      }
      
      // Texto normal (entre tags) - text
      let text = '';
      
      while (i < len && !isTagStart()) {
        text += escaped[i];
        i++;
      }
      
      if (text.trim()) {
        // Preserva espaços/indentação
        const beforeMatch = text.match(/^(\s*)/);
        const afterMatch = text.match(/(\s*)$/);
        const before = beforeMatch ? beforeMatch[1] : '';
        const after = afterMatch ? afterMatch[1] : '';
        const trimmed = text.trim();
        
        if (trimmed) {
          result += before + addTokenSpan(trimmed, 'text') + after;
        } else {
          result += text;
        }
      } else {
        result += text; // Espaços em branco preservados
      }
    }
    
    return result;
  }

  // Exporta a função para uso global
  window.CodeHighlighter = {
    highlightHTML: highlightHTML,
    escapeHtml: escapeHtml
  };
})();
