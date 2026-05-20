import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { initSal } from "@/utils/sal";
import ContactCta from "@/components/contactCta";
import PageTransition from "@/components/pageTransition";

const lenisOptions = {
    duration: 1.2,
    orientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    autoRaf: false,
};

export const HeaderTitleContext = createContext({ setOverride: () => {} })

export default function Layout({ children, headerData, footerData, contactCta, currentTitle, theme, header, footer, hideFooter, hideContactCta }) {
    const lenisRef = useRef(null)
    const [overrideTitle, setOverrideTitle] = useState(null)

    useEffect(() => {
        function update(time) {
            lenisRef.current?.lenis?.raf(time * 1000)
        }
        gsap.ticker.add(update)
        gsap.ticker.lagSmoothing(0)
        return () => gsap.ticker.remove(update)
    }, [])

    useEffect(() => {
        initSal()
    }, [])

    useEffect(() => {
        if (!theme) return
        const className = `theme-${theme}`
        document.documentElement.classList.add(className)
        return () => {
            document.documentElement.classList.remove(className)
        }
    }, [theme])

    const headerCtx = useMemo(() => ({ setOverride: setOverrideTitle }), [])

    return (
        <ReactLenis ref={lenisRef} root options={lenisOptions}>
            <HeaderTitleContext.Provider value={headerCtx}>
                {header ?? <Header data={headerData} currentTitle={overrideTitle ?? currentTitle} />}
                <PageTransition>
                    <main>{children}</main>
                    {!hideContactCta && <ContactCta contactCta={contactCta} />}
                </PageTransition>
                {footer ?? (!hideFooter && <Footer data={footerData} />)}
            </HeaderTitleContext.Provider>
        </ReactLenis>
    )
}
