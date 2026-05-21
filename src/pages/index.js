import Hero from "@/components/hero";
import "../scss/site.scss"
import Layout from "@/layouts/layout";
import { fetchLayout, fetchHero, fetchProjects, fetchFeaturedProjects, fetchMission, fetchSpecialProjects, contactCta, fetchContactCta, fetchInquireOnly } from "@/sanity/lib/fetch";
import HomepageContent from "@/components/homepageContent";
import Mission from "@/components/mission";
import SpecialProjects from "@/components/specialProjects";

export async function getStaticProps() {
    if (await fetchInquireOnly()) {
        return { redirect: { destination: "/inquire", permanent: false }, revalidate: 60 }
    }
    const [layout, hero, projects, featuredProjects, mission, specialProjects, contactCta] = await Promise.all([fetchLayout(), fetchHero(), fetchProjects(), fetchFeaturedProjects(), fetchMission(), fetchSpecialProjects(), fetchContactCta()])
    return {
        props: { layout: layout ?? null, hero: hero ?? null, projects: projects ?? null, featuredProjects: featuredProjects ?? null, mission: mission ?? null, specialProjects: specialProjects ?? null, contactCta: contactCta ?? null, },
        revalidate: 60,
    }
}

export default function Homepage({ layout, hero, projects, featuredProjects, mission, specialProjects, contactCta }) {
    return (
        <Layout headerData={layout?.header} footerData={layout?.footer} contactCta={contactCta}>
            <Hero data={hero} headerLinks={layout?.header?.links} />
            <HomepageContent projects={projects} featuredProjects={featuredProjects} mission={mission} />
            <Mission mission={mission} />
            <SpecialProjects specialProjects={specialProjects} />
        </Layout>
    )
}