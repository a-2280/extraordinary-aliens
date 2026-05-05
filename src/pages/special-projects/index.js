import "../../scss/site.scss"
import Layout from "@/layouts/layout"
import { fetchLayout, fetchContactCta, fetchSpecialProjectPages } from "@/sanity/lib/fetch"
import AllSpecialProjects from "@/components/allSpecialProjects"

export async function getStaticProps() {
    const [layout, contactCta, specialProjectPages] = await Promise.all([fetchLayout(), fetchContactCta(), fetchSpecialProjectPages()])
    return {
        props: { layout: layout ?? null, contactCta: contactCta ?? null, specialProjectPages: specialProjectPages ?? [] },
        revalidate: 60,
    }
}

export default function SpecialProjectsIndex({ layout, contactCta, specialProjectPages }) {
    return (
        <Layout headerData={layout?.header} footerData={layout?.footer} contactCta={contactCta} theme="dark">
            <AllSpecialProjects projects={specialProjectPages} />
        </Layout>
    )
}
