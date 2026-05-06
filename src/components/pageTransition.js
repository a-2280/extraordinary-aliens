"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/router"
import { useLenis } from "lenis/react"

const FADE_OUT_MS = 350

export default function PageTransition({ children }) {
    const router = useRouter()
    const wrapperRef = useRef(null)
    const lenis = useLenis()

    const routeKey = router.asPath.split("#")[0]

    useEffect(() => {
        const wrapper = wrapperRef.current
        if (!wrapper) return

        const hash = window.location.hash
        if (hash) {
            const target = document.querySelector(hash)
            if (target) {
                if (lenis) lenis.scrollTo(target, { immediate: true })
                else target.scrollIntoView()
            }
        } else {
            if (lenis) lenis.scrollTo(0, { immediate: true })
            else window.scrollTo(0, 0)
        }
        wrapper.classList.remove("fade--out")
        wrapper.classList.add("fade--in")

        const bound = []
        const links = document.querySelectorAll("a[href]")
        links.forEach((link) => {
            const handler = (e) => {
                if (e.defaultPrevented) return
                if (e.button !== 0) return
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

                const target = link.getAttribute("target")
                if (target && target !== "_self") return

                const href = link.getAttribute("href")
                if (!href) return
                if (href.startsWith("#")) return

                let url
                try {
                    url = new URL(href, window.location.origin)
                } catch {
                    return
                }
                if (url.origin !== window.location.origin) return
                if (url.pathname === window.location.pathname) return

                e.preventDefault()
                wrapper.classList.remove("fade--in")
                wrapper.classList.add("fade--out")
                setTimeout(() => {
                    router.push(url.pathname + url.search + url.hash)
                }, FADE_OUT_MS)
            }
            link.addEventListener("click", handler)
            bound.push([link, handler])
        })

        return () => {
            bound.forEach(([link, handler]) => link.removeEventListener("click", handler))
        }
    }, [routeKey, router, lenis])

    return (
        <div ref={wrapperRef} className="page--transition fade--in">
            {children}
        </div>
    )
}
