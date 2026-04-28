import { ReactLenis } from "lenis/react";
import Footer from "@/components/footer";
import Header from "@/components/header";

const lenisOptions = {
    duration: 1.2,
    orientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
};

export default function Layout({ children, headerData, footerData }) {
    return (
        <html lang='en'>
            <body>
                <ReactLenis root options={lenisOptions}>
                    <Header data={headerData} />
                    <main>{children}</main>
                    <Footer data={footerData} />
                </ReactLenis>
            </body>
        </html>
    )
}
