import Hero from "@/components/hero";
import "../scss/site.scss"
import Layout from "@/layouts/layout";
import { fetchLayout, fetchHero } from "@/sanity/lib/fetch";

export async function getStaticProps() {
    const [layout, hero] = await Promise.all([fetchLayout(), fetchHero()])
    return {
        props: { layout: layout ?? null, hero: hero ?? null },
        revalidate: 60,
    }
}

export default function Homepage({ layout, hero }) {
    return (
        <Layout headerData={layout?.header} footerData={layout?.footer}>
            <Hero data={hero} />
        </Layout>
    )
}