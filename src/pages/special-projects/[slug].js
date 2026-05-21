import "../../scss/site.scss"
import Layout from "@/layouts/layout"
import { fetchLayout, fetchContactCta, fetchSpecialProjectPageSlugs, fetchSpecialProjectPageBySlug, fetchSpecialProjectPageNav, fetchInquireOnly } from "@/sanity/lib/fetch"
import CaseStudyContent from "@/components/caseStudyContent"
import MoreSpecialProjects from "@/components/moreSpecialProjects"

export async function getStaticPaths() {
    const slugs = await fetchSpecialProjectPageSlugs()
    return {
        paths: (slugs ?? []).map(slug => ({ params: { slug } })),
        fallback: "blocking",
    }
}

export async function getStaticProps({ params }) {
    if (await fetchInquireOnly()) {
        return { redirect: { destination: "/inquire", permanent: false }, revalidate: 60 }
    }
    const [layout, contactCta, project, projectNav] = await Promise.all([
        fetchLayout(),
        fetchContactCta(),
        fetchSpecialProjectPageBySlug(params.slug),
        fetchSpecialProjectPageNav(),
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

export default function SpecialProjectCaseStudy({ layout, contactCta, project, nextProject }) {
    return (
        <Layout headerData={layout?.header} footerData={layout?.footer} contactCta={contactCta} currentTitle={project?.title} theme="dark">
            <CaseStudyContent project={project} />
            <MoreSpecialProjects nextProject={nextProject} />
        </Layout>
    )
}
