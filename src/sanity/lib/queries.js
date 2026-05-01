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
  button{ title, url, openInNewWindow }
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

export const PROJECTS_QUERY = `*[_type == "projects"] | order(orderRank asc){ title, slug, description, "tags": tags[]->{ name }, "image": images[0].asset->url }`

export const PROJECT_SLUGS_QUERY = `*[_type == "projects" && defined(slug.current)][].slug.current`

export const FEATURED_QUERY = `*[_type == "projects" && featured == true] | order(orderRank asc){ title, slug, description, "tags": tags[]->{ name }, "images": images[].asset->url }`

export const MISSION_QUERY = `*[_type == "layout"][0].homepage->.components[_type == "mission"][0]{
  title,
  description,
  button{ title, url, openInNewWindow },
  missionCards[]{
    "image": image.asset->url,
    title,
    caption,
    description
  }
}`

export const SPECIAL_PROJECTS_QUERY = `*[_type == "layout"][0].homepage->.components[_type == "specialProjects"][0]{
  title,
  description,
  url,
  "image": image.asset->url
}`

export const CONTACT_CTA_QUERY = `*[_type == "contactCta"][0]{
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