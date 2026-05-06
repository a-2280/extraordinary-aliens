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
  button{ title, url, openInNewWindow },
  videoModal{
    title,
    description,
    "video": video.asset->url
  }
}`

export const LAYOUT_QUERY = `*[_type == "layout"][0]{
  title,
  "header": header->{
    title,
    links[]{ title, url, openInNewWindow, copyOnClick }
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

export const PROJECT_NAV_QUERY = `*[_type == "projects" && defined(slug.current)] | order(orderRank asc){
  title,
  "slug": slug.current,
  "image": images[0].asset->url
}`

const SECTION_CHILD_PROJECTION = `_key, _type,
  _type == "imageCard" => {
    variant,
    description,
    "image": image.asset->url
  },
  _type == "carousel" => {
    variant,
    "images": images[].asset->url
  },
  _type == "captionCarousel" => {
    variant,
    slides[]{
      "image": image.asset->url,
      caption
    }
  },
  _type == "annotationImage" => {
    variant,
    title,
    annotation,
    "image": image.asset->url
  },
  _type == "imageHotspot" => {
    variant,
    "image": image.asset->url,
    spots[]{
      _key,
      title,
      description,
      point
    }
  },
  _type == "imageExpandableCaption" => {
    variant,
    "image": image.asset->url,
    caption
  },
  _type == "imageCaptionHover" => {
    variant,
    "image": image.asset->url,
    caption
  },
  _type == "audioPlayer" => {
    title,
    description,
    "audio": audio.asset->url
  },
  _type == "textBlock" => {
    title,
    description
  }`

const CASE_STUDY_ITEM_PROJECTION = `_type == "textLarge" => {
    title,
    description
  },
  _type == "quote" => {
    quote
  },
  _type == "list" => {
    title,
    list[]{
      _key,
      title,
      description
    }
  },
  _type == "credits" => {
    title,
    description,
    credits[]{
      _key,
      title,
      "image": image.asset->url,
      creditInfo[]{
        _key,
        credit
      }
    }
  },
  _type == "section" => {
    left[]{ ${SECTION_CHILD_PROJECTION} },
    right[]{ ${SECTION_CHILD_PROJECTION} }
  }`

export const PROJECT_BY_SLUG_QUERY = `*[_type == "projects" && slug.current == $slug][0]{
  title,
  client,
  year,
  caseStudyIntro,
  liveWebsite{ title, url, openInNewWindow },
  "tags": tags[]->{ name },
  "heroImage": heroImage.asset->url,
  caseStudySections[]{
    _key, _type,
    ${CASE_STUDY_ITEM_PROJECTION},
    _type == "sectionGroup" => {
      title,
      "slug": slug.current,
      items[]{
        _key, _type,
        ${CASE_STUDY_ITEM_PROJECTION}
      }
    }
  }
}`

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
  "image": image.asset->url
}`

export const SPECIAL_PROJECT_PAGES_QUERY = `*[_type == "specialProjectsPage"] | order(orderRank asc){
  title,
  slug,
  description,
  "images": images[].asset->url
}`

export const SPECIAL_PROJECT_PAGE_SLUGS_QUERY = `*[_type == "specialProjectsPage" && defined(slug.current)][].slug.current`

export const SPECIAL_PROJECT_PAGE_NAV_QUERY = `*[_type == "specialProjectsPage" && defined(slug.current)] | order(orderRank asc){
  title,
  "slug": slug.current,
  "image": images[0].asset->url
}`

export const SPECIAL_PROJECT_PAGE_BY_SLUG_QUERY = `*[_type == "specialProjectsPage" && slug.current == $slug][0]{
  title,
  client,
  year,
  caseStudyIntro,
  liveWebsite{ title, url, openInNewWindow },
  "tags": tags[]->{ name },
  "heroImage": heroImage.asset->url,
  caseStudySections[]{
    _key, _type,
    ${CASE_STUDY_ITEM_PROJECTION},
    _type == "sectionGroup" => {
      title,
      "slug": slug.current,
      items[]{
        _key, _type,
        ${CASE_STUDY_ITEM_PROJECTION}
      }
    }
  }
}`

export const SPECIAL_PROJECTS_LANDING_QUERY = `*[_type == "specialProjectsSettings"][0]{
  title,
  description,
  "featured": featured->{ title, "slug": slug.current, "heroImage": heroImage.asset->url }
}`

export const ABOUT_QUERY = `*[_type == "about"][0]{
  title[]{
    ...,
    markDefs[]{
      ...,
      _type == "textColor" => {
        "color": swatch->color.hex
      }
    }
  },
  components[]{
    _key,
    _type,
    _type == "studio" => {
      title,
      founderAndDirector[]{ name },
      aboutTitle,
      about
    },
    _type == "approach" => {
      items[]{
        _key,
        "image": image.asset->url,
        title,
        description
      }
    },
    _type == "capabilities" => {
      title,
      "capabilities": capabilities[]->{ name },
      industriesTitle,
      "industries": industries[]->{ name }
    },
    _type == "clientsAndPress" => {
      title,
      clients,
      pressTitle,
      press
    }
  },
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