# Analytics Paraíba Pet (delucena.dev)

## Eventos implementados

- `traffic_entry` (uma vez por sessão)
- `page_view` (a cada carregamento da página)
- `portfolio_engaged` (uma vez por sessão, por tempo >= 30s ou clique em CTA)

Campos enviados em todos os eventos:

- `page_path`
- `referrer`
- `timestamp`
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_term`
- `utm_content`

Campos adicionais em `portfolio_engaged`:

- `engagement_reason` (`time_on_page_30s` ou `cta_click`)
- `cta_id`

## Persistência de UTM

- Captura de UTM da URL: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- Persistência por 30 dias em:
  - `localStorage` (`dlc_attribution_v1`)
  - cookie (`dlc_attribution_v1`)
- Sem UTM na URL, reaproveita UTM persistida.

## Filtro de qualidade

- Eventos são ignorados para user-agents de bots conhecidos e `navigator.webdriver`.

## Dashboard no GA4

1. Abrir **Reports > Acquisition > Traffic acquisition**.
2. Definir dimensão principal para `Session source / medium`.
3. Filtrar por:
   - `Session source` = `paraiba_pet`
   - `Session medium` = `footer`
   - `Session campaign` = `credito_delucena`
4. Para engajamento:
   - Abrir **Explore > Free form**
   - Métricas: `Sessions`, `Event count`
   - Dimensões: `Session campaign`, `Event name`
   - Filtro `Event name` in (`portfolio_engaged`, `page_view`)
   - Fórmula: `engagement_rate = portfolio_engaged / sessions`
5. Top páginas de entrada:
   - **Explore > Free form**
   - Dimensões: `Landing page + query string`, `Session campaign`
   - Métrica: `Sessions`
   - Filtro `Session campaign = credito_delucena`

## Dashboard no Plausible

1. Abrir o site em **Plausible > Dashboard**.
2. Em **Filters**, aplicar:
   - `utm_source = paraiba_pet`
   - `utm_medium = footer`
   - `utm_campaign = credito_delucena`
3. Em **Goals**, criar metas para:
   - `traffic_entry`
   - `portfolio_engaged`
4. Ver:
   - sessões e pageviews por dia no gráfico principal
   - desempenho por UTM em **Acquisition**
   - top páginas de entrada em **Top pages** com filtro `utm_campaign=credito_delucena`
