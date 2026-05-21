import "../../scss/site.scss"
import Layout from "@/layouts/layout"
import { fetchLayout, fetchContactCta, fetchProjectSlugs, fetchProjectBySlug, fetchProjectNav } from "@/sanity/lib/fetch"
import CaseStudyContent from "@/components/caseStudyContent"
import MoreProjects from "@/components/moreProjects"

export async function getStaticPaths() {
    const slugs = await fetchProjectSlugs()
    return {
        paths: (slugs ?? []).map(slug => ({ params: { slug } })),
        fallback: "blocking",
    }
}

export async function getStaticProps({ params }) {
    const [layout, contactCta, project, projectNav] = await Promise.all([
        fetchLayout(),
        fetchContactCta(),
        fetchProjectBySlug(params.slug),
        fetchProjectNav(),
    ])
    if (!project) return { notFound: true, revalidate: 60 }
    const list = projectNav ?? []
    const idx = list.findIndex(p => p.slug === params.slug)
    const nextProject = list.length ? list[(idx + 1) % list.length] : null
    return {
        props: { layout: layout ?? null, contactCta: contactCta ?? null, project, nextProject },
        revalidate: 60,
    }
}

export default function CaseStudy({ layout, contactCta, project, nextProject }) {
    return (
        <Layout headerData={layout?.header} footerData={layout?.footer} contactCta={contactCta} currentTitle={project?.title}>
            <CaseStudyContent project={project} />
            <MoreProjects nextProject={nextProject} />
        </Layout>
    )
}
