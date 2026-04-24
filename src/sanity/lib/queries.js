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
