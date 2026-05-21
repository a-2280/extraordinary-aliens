import "../../scss/site.scss"
import Layout from "@/layouts/layout"
import InquireNav from "@/components/inquireNav"
import InquireContent from "@/components/inquireContent"
import InquireFooter from "@/components/inquireFooter"
import { fetchLayout, fetchInquire } from "@/sanity/lib/fetch"

export async function getStaticProps() {
    const [layout, inquire] = await Promise.all([fetchLayout(), fetchInquire()])
    return {
        props: { layout: layout ?? null, inquire: inquire ?? null },
        revalidate: 60,
    }
}

export default function InquireIndex({ layout, inquire }) {
    return (
        <Layout headerData={layout?.header} header={<InquireNav inquireOnly={inquire?.inquireOnly} />} footer={<InquireFooter inquire={inquire} className="pos-abs bottom-28 left-28 m-hide" />} hideContactCta>
            <InquireContent inquire={inquire} />
        </Layout>
    )
}
