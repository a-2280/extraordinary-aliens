import "../../scss/site.scss"
import Layout from "@/layouts/layout"
import { fetchLayout, fetchContactCta, fetchProjectSlugs } from "@/sanity/lib/fetch"

export async function getStaticPaths() {
    const slugs = await fetchProjectSlugs()
    return {
        paths: (slugs ?? []).map(slug => ({ params: { slug } })),
        fallback: "blocking",
    }
}

export async function getStaticProps({ params }) {
    const [layout, contactCta] = await Promise.all([fetchLayout(), fetchContactCta()])
    return {
        props: { layout: layout ?? null, contactCta: contactCta ?? null, slug: params.slug },
        revalidate: 60,
    }
}

export default function CaseStudy({ layout, contactCta, slug }) {
    return (
        <Layout headerData={layout?.header} footerData={layout?.footer} contactCta={contactCta}>
            <h1>Hello world — {slug}</h1>
        </Layout>
    )
}
