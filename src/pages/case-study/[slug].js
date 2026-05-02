import "../../scss/site.scss"
import Layout from "@/layouts/layout"
import { fetchLayout, fetchContactCta, fetchProjectSlugs, fetchProjectBySlug } from "@/sanity/lib/fetch"
import CaseStudyContent from "@/components/caseStudyContent"

export async function getStaticPaths() {
    const slugs = await fetchProjectSlugs()
    return {
        paths: (slugs ?? []).map(slug => ({ params: { slug } })),
        fallback: "blocking",
    }
}

export async function getStaticProps({ params }) {
    const [layout, contactCta, project] = await Promise.all([
        fetchLayout(),
        fetchContactCta(),
        fetchProjectBySlug(params.slug),
    ])
    if (!project) return { notFound: true, revalidate: 60 }
    return {
        props: { layout: layout ?? null, contactCta: contactCta ?? null, project },
        revalidate: 60,
    }
}

export default function CaseStudy({ layout, contactCta, project }) {
    return (
        <Layout headerData={layout?.header} footerData={layout?.footer} contactCta={contactCta}>
            <CaseStudyContent project={project} />
        </Layout>
    )
}
