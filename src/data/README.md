# Arquivos de Dados do Portfólio

Esta pasta contém todos os dados pessoais do portfólio em formato JSON. Durante o processo de build, esses dados são injetados nos templates HTML, permitindo fácil personalização sem modificar o código.

## Estrutura dos Arquivos

### `profile.json`
Contém informações pessoais básicas do perfil.

```json
{
  "name": "Seu Nome Completo",
  "fullName": "Nome Completo para Meta Tags",
  "alternateName": "seu-usuario",
  "nickname": "Seu Apelido",
  "title": "Seu Título Profissional",
  "titleEmoji": "🚀",
  "description": "Descrição curta para SEO",
  "bio": [
    "Parágrafo 1 da sua biografia",
    "Parágrafo 2 da sua biografia"
  ],
  "readme": {
    "greeting": "👋 Mensagem de boas-vindas",
    "tagline": "Sua tagline",
    "description": "Descrição curta",
    "credlyUrl": "URL do seu perfil Credly (opcional)",
    "skillsIcons": "java,go,spring,aws,docker"
  },
  "profileImage": {
    "png": "./assets/images/profile.png",
    "webp": "./assets/images/profile.webp",
    "alt": "Texto alternativo da imagem"
  },
  "domain": "seudominio.dev",
  "url": "https://seudominio.dev",
  "currentCompany": "Nome da Empresa Atual"
}
```

### `experience.json`
Array de experiências profissionais, ordenadas da mais recente para a mais antiga.

```json
[
  {
    "company": "Nome da Empresa",
    "icon": "🏢",
    "position": "Cargo",
    "period": "jan de 2020 - o momento · 2 anos · Remota",
    "description": "Descrição geral da experiência",
    "responsibilities": [
      {
        "title": "Título da Responsabilidade",
        "description": "Descrição detalhada"
      }
    ],
    "projects": [
      {
        "name": "Nome do Projeto",
        "description": "Descrição do projeto"
      }
    ]
  }
]
```

**Notas:**
- `responsibilities` e `projects` são opcionais (pode ser `null`)
- Use emojis no campo `icon` para personalizar (🏢, 🏦, 🏛️, etc.)

### `skills.json`
Objeto com categorias de skills. Cada categoria tem um título e uma lista de itens.

```json
{
  "languages": {
    "title": "💻 Linguagens e Frameworks",
    "items": [
      "Java 8+",
      "Go (Golang)",
      "Python"
    ]
  },
  "architecture": {
    "title": "🏗️ Arquitetura e Design",
    "items": [
      "Microsserviços",
      "DDD"
    ]
  }
}
```

**Categorias disponíveis:**
- `languages` - Linguagens e Frameworks
- `architecture` - Arquitetura e Design
- `integration` - Integração e Comunicação
- `databases` - Banco de Dados e Cache
- `devops` - DevOps e Infraestrutura
- `observability` - Monitoramento e Observabilidade
- `security` - Segurança & Plataforma
- `testing` - Qualidade e Testes Automatizados
- `culture` - Cultura e Práticas
- `spokenLanguages` - Idiomas
- `softSkills` - Soft Skills

Você pode adicionar novas categorias ou remover as existentes.

### `contact.json`
Links de contato e redes sociais.

```json
{
  "linkedin": {
    "url": "https://www.linkedin.com/in/seu-usuario",
    "username": "seu-usuario",
    "display": "linkedin.com/in/seu-usuario",
    "label": "Conecte-se comigo profissionalmente"
  },
  "github": {
    "url": "https://github.com/seu-usuario",
    "username": "seu-usuario",
    "display": "github.com/seu-usuario",
    "label": "Veja meus projetos e contribuições"
  },
  "email": {
    "address": "seu-email@dominio.com",
    "url": "mailto:seu-email@dominio.com",
    "label": "Envie uma mensagem direta"
  }
}
```

### `meta.json`
Meta tags para SEO e redes sociais.

```json
{
  "title": "Título da Página",
  "description": "Descrição para SEO",
  "keywords": "palavra1, palavra2, palavra3",
  "author": "Seu Nome Completo",
  "language": "pt-BR",
  "locale": "pt_BR",
  "canonicalUrl": "https://seudominio.dev/",
  "og": {
    "type": "website",
    "url": "https://seudominio.dev/",
    "title": "Título para Open Graph",
    "description": "Descrição para Open Graph",
    "image": "https://seudominio.dev/assets/images/profile.png",
    "locale": "pt_BR",
    "siteName": "seudominio.dev"
  },
  "twitter": {
    "card": "summary_large_image",
    "url": "https://seudominio.dev/",
    "title": "Título para Twitter",
    "description": "Descrição para Twitter",
    "image": "https://seudominio.dev/assets/images/profile.png"
  },
  "structuredData": {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Seu Nome",
    "alternateName": "seu-usuario",
    "url": "https://seudominio.dev",
    "image": "https://seudominio.dev/assets/images/profile.png",
    "jobTitle": "Seu Cargo",
    "worksFor": {
      "@type": "Organization",
      "name": "Nome da Empresa"
    },
    "sameAs": [
      "https://www.linkedin.com/in/seu-usuario",
      "https://github.com/seu-usuario"
    ],
    "email": "seu-email@dominio.com",
    "knowsAbout": [
      "Java",
      "Go",
      "Microsserviços"
    ]
  }
}
```

## Como Personalizar

1. **Edite os arquivos JSON** nesta pasta (`src/data/`)
2. **Execute o build**: `npm run build`
3. **Verifique o resultado** em `dist/index.html`

## Sintaxe de Templates

Os templates usam uma sintaxe simples de placeholders:

### Variáveis Simples
```
{{profile.name}}
{{contact.linkedin.url}}
```

### Loops
```
{{#each experience}}
  <h2>{{company}}</h2>
  <p>{{description}}</p>
{{/each}}
```

### Condicionais
```
{{#if responsibilities}}
  <ul>
    {{#each responsibilities}}
      <li>{{title}}</li>
    {{/each}}
  </ul>
{{/if}}
```

### Acesso a Propriedades Aninhadas
```
{{profile.readme.greeting}}
{{meta.og.title}}
```

## Dicas

- **Imagens**: Coloque suas imagens em `src/assets/images/` e atualize os caminhos em `profile.json`
- **URLs**: Certifique-se de atualizar todas as URLs nos arquivos JSON (domínio, links sociais, etc.)
- **Validação**: Após editar, valide o JSON usando um validador online antes de rodar o build
- **Backup**: Mantenha backup dos seus dados antes de fazer alterações grandes

## Estrutura de Pastas Recomendada

```
src/
  data/
    profile.json
    experience.json
    skills.json
    contact.json
    meta.json
  assets/
    images/
      profile.png
      profile.webp
```

## Suporte

Se encontrar problemas ao personalizar os dados, verifique:
1. Se o JSON está válido (sem vírgulas extras, chaves fechadas, etc.)
2. Se os caminhos das imagens estão corretos
3. Se todas as URLs estão atualizadas
4. Se os placeholders nos templates correspondem às chaves nos JSONs
