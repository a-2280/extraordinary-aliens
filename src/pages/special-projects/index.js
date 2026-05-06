import "../../scss/site.scss"
import Layout from "@/layouts/layout"
import { fetchLayout, fetchContactCta, fetchSpecialProjectPages, fetchSpecialProjectsLanding } from "@/sanity/lib/fetch"
import AllSpecialProjects from "@/components/allSpecialProjects"
import SpecialProjectsHero from "@/components/specialProjectsHero"
import FeaturedSpecialProject from "@/components/featuredSpecialProject"

export async function getStaticProps() {
    const [layout, contactCta, specialProjectPages, landing] = await Promise.all([fetchLayout(), fetchContactCta(), fetchSpecialProjectPages(), fetchSpecialProjectsLanding()])
    return {
        props: { layout: layout ?? null, contactCta: contactCta ?? null, specialProjectPages: specialProjectPages ?? [], landing: landing ?? null },
        revalidate: 60,
    }
}

export default function SpecialProjectsIndex({ layout, contactCta, specialProjectPages, landing }) {
    return (
        <Layout headerData={layout?.header} footerData={layout?.footer} contactCta={contactCta} theme="dark">
            <SpecialProjectsHero {...landing} />
            <FeaturedSpecialProject description={landing?.description} {...(landing?.featured ?? {})} />
            <AllSpecialProjects projects={specialProjectPages} />
        </Layout>
    )
}
