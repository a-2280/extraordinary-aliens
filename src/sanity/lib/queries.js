export const HERO_QUERY = `*[_type == "layout"][0].homepage->.components[_type == "hero"][0]{
  description[]{
    ...,
    markDefs[]{
      ...,
      _type == "textColor" => {
        "color": swatch->color.hex
      }
    }
  },
  button
}`

export const LAYOUT_QUERY = `*[_type == "layout"][0]{
  title,
  "header": header->{
    title,
    links[]{ title, url, openInNewWindow }
  },
  "footer": footer->{
    "logo": logo.asset->url,
    caption,
    copyright,
    details[]{ title, detail }
  }
}`
