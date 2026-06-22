# Midnight Studio — Design System

Identitate vizuală nouă pentru C Design (piața UK). Direcție: **dark premium** — agenție high-end, modern, high-tech.

## Paletă (CSS tokens în `:root`)

| Token | Hex | Rol |
|---|---|---|
| `--bg` | `#0B0F14` | Fundal principal (near-black) |
| `--bg2` | `#151B23` | Suprafețe / carduri |
| `--bg3` | `#1C242E` | Suprafețe ridicate |
| `--bg4` | `#232E3A` | Borduri pline / hover |
| `--text` | `#E8EDF2` | Text principal |
| `--soft` | `#AAB4C0` | Text secundar |
| `--muted` | `#7A8694` | Text terțiar / labels |
| `--heading` | `#F4F8FC` | Titluri |
| `--teal` (accent) | `#00E5A8` | Accent primar — mint electric (CTA, highlights) |
| `--teal-dk` | `#00b386` | Accent închis |
| `--teal-lt` | `#5cffd0` | Accent deschis (hover) |
| `--teal-glow` | `#5B8CFF` | Accent secundar — albastru electric (glow, efecte) |

Bordurile și gradientele hero au fost convertite pe fundal întunecat.

## Tipografie

- **Titluri:** Space Grotesk (600/700/800) — păstrat, se potrivește look-ului high-tech.
- **Text:** Inter (400/500/600) — înlocuiește DM Sans, mai neutru și lizibil pe fundal închis.
- **Mono accent:** Share Tech Mono — păstrat (telefon, detalii tehnice).

## Componente

- **CTA primar** (`.btn-nav`, `.btn-primary`, `.btn-submit`): fundal mint `--teal`, text închis `#06140F`, hover spre `--teal-lt`. Aspect „neon", pop pe fundal negru.
- **Carduri:** fundal `--bg2`, borduri `--border` (alb 10%).
- **Hero:** foto + overlay gradient întunecat, textură de puncte și glow albastru pe accent.
- **Indicator „live":** punct pulsant mint.

## Aplicare

Identitatea e definită aproape integral prin tokens în `:root`. Pentru rollout pe toate paginile: se extrage acest bloc de tokeni într-un `design-system.css` comun (vezi `tech-audit.md`) și se aplică o singură dată pe cele 16 pagini.

## Prototip

`redesign/index.html` — homepage live cu noua identitate aplicată. Conținut, secțiuni, SEO și structured data păstrate identic față de `index.html`; s-a schimbat doar stratul vizual. Imaginile sunt root-relative (`/hero-banner.webp`), deci se afișează corect când e servit la o rută (preview deploy), nu la deschidere locală din subfolder.
