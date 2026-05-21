import AboutHero from "@/components/aboutHero"
import "../../scss/site.scss"
import Layout from "@/layouts/layout"
import { fetchLayout, fetchContactCta, fetchAbout, fetchInquireOnly } from "@/sanity/lib/fetch"
import AboutContent from "@/components/aboutContent"
import AboutImage from "@/components/aboutImage"

export async function getStaticProps() {
    if (await fetchInquireOnly()) {
        return { redirect: { destination: "/inquire", permanent: false }, revalidate: 60 }
    }
    const [layout, contactCta, about] = await Promise.all([fetchLayout(), fetchContactCta(), fetchAbout()])
    return {
        props: { layout: layout ?? null, contactCta: contactCta ?? null, about: about ?? null },
        revalidate: 60,
    }
}

export default function AboutIndex({ layout, contactCta, about }) {
    return (
        <Layout headerData={layout?.header} footerData={layout?.footer} contactCta={contactCta}>
            <AboutHero title={about.title} />
            <AboutContent components={about?.components} />
            <AboutImage image={about?.image} video={about?.video} />
        </Layout>
    )
}
