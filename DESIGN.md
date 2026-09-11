# Derrick Cheng Portfolio

## Direction

A reference-led Computer Science portfolio with a cool paper foundation, oversized work typography, one blue signal color, and tactile interactions. The work should feel direct and credible, with the interface receding behind the projects.

## Visual Tokens

- Canvas: `#F7F8FA`
- Surface: `#FFFFFF`
- Ink: `#12141A`
- Muted text: `#6B7280`
- Rule: `#E4E7EC`
- Signal: `#2E5BFF`
- Secondary signal: `#FFB020`

## Type

- Interface and body: `Inter`, with a robust system fallback.
- Display type: `Space Grotesk`, with a robust system fallback.
- Technical metadata: system monospace.
- Display type uses short statement lines and oversized project names, while body copy stays readable.

## Layout

- Navigation is fixed and lightly translucent with a single ruled edge.
- The hero is a statement-led page opening with a restrained dot field and two clear actions.
- Projects are an oversized typographic index with direct links and real image previews on hover.
- Skills use a draggable tool field instead of a card grid.
- Desktop uses generous lateral space. Mobile collapses to one readable column with no sideways overflow.

## Motion

- Intro words enter once in sequence.
- The statement reveals word by word as it enters the viewport.
- Project rows reveal with a horizontal clip, exhibition entries draw along a timeline, and project images follow the pointer on desktop.
- Tool chips can be moved with pointer input.
- Motion uses GSAP and ScrollTrigger with transform and opacity changes, no scroll hijacking, and a reduced-motion fallback.
