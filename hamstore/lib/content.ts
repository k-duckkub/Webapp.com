import site from '@/content/site.json'

/**
 * The editable surface of the site.
 *
 * Everything a non-developer should be able to change — every line of copy,
 * every price, every cover image — lives in `content/site.json` and is read
 * through here. Nothing in `components/` should hold a user-visible string of
 * its own; if a component needs new copy, the field goes in the JSON first.
 *
 * The import is a build-time one, so the static export keeps working with no
 * server: the studio (`npm run studio`) writes the JSON, the next build bakes
 * it in. What stays in code is design, not content — motifs, gradients, icon
 * names and category metadata are choices about how the thing looks, and a
 * text field is the wrong place to edit them.
 */

export type SiteContent = typeof site

export const CONTENT = site as SiteContent

export const COPY = {
  nav: site.nav,
  store: site.store,
  library: site.library,
  cart: site.cart,
  footer: site.footer,
}

/** `''` in the JSON means "no image, draw the generated cover instead". */
export function imageSrc(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}
