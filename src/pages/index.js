import "../scss/site.scss"
import Layout from "@/layouts/layout";
import { fetchLayout } from "@/sanity/lib/fetch";

export async function getStaticProps() {
    const layout = await fetchLayout()
    return {
        props: { layout: layout ?? null },
        revalidate: 60,
    }
}

export default function Homepage({ layout }) {
    return (
        <Layout headerData={layout?.header} footerData={layout?.footer}>
            this is homepage
        </Layout>
    )
}