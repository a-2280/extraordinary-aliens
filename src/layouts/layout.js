import { useEffect } from "react";
import { ReactLenis } from "lenis/react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { initSal } from "@/utils/sal";
import ContactCta from "@/components/contactCta";

const lenisOptions = {
    duration: 1.2,
    orientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
};

export default function Layout({ children, headerData, footerData, contactCta }) {
    useEffect(() => {
        initSal()
    }, [])

    return (
        <ReactLenis root options={lenisOptions}>
            <Header data={headerData} />
            <main>{children}</main>
            <ContactCta contactCta={contactCta} />
            <Footer data={footerData} />
        </ReactLenis>
    )
}
