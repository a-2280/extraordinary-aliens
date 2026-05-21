"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import { useRouter } from "next/router"
import { useLenis } from "lenis/react"
import gsap from "gsap"

const FADE_OUT_MS = 350
const NAV_CHILDREN_SELECTOR = ".masthead .overflow > *"
const TITLE_ONLY_SELECTOR = ".masthead .overflow > .button-case-study"

let didNavigate = false

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

function navTargets() {
    const sel = document.querySelector(".masthead.menu-closed")
        ? TITLE_ONLY_SELECTOR
        : NAV_CHILDREN_SELECTOR
    return document.querySelectorAll(sel)
}

export function fadeOutNavChildren() {
    const navChildren = navTargets()
    if (!navChildren.length) return null
    return gsap.to(navChildren, {
        opacity: 0,
        x: -10,
        duration: 0.3,
        stagger: { each: 0.08, from: "end" },
        ease: "power2.in",
        overwrite: true,
    })
}

export function fadeInNavChildren() {
    const navChildren = navTargets()
    if (!navChildren.length) return null
    gsap.set(navChildren, { opacity: 0, x: -10 })
    return gsap.to(navChildren, {
        opacity: 1,
        x: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: "power2.out",
        overwrite: true,
    })
}

export function runNavSwap(onSwap) {
    let outTween = null
    let inTween = null
    let cancelled = false
    let rafId = 0

    const swap = () => {
        if (typeof onSwap === "function") onSwap()
        rafId = requestAnimationFrame(() => {
            if (cancelled) return
            inTween = fadeInNavChildren()
        })
    }

    const navChildren = navTargets()
    if (!navChildren.length) {
        swap()
    } else {
        outTween = gsap.to(navChildren, {
            opacity: 0,
            x: -10,
            duration: 0.3,
            stagger: { each: 0.08, from: "end" },
            ease: "power2.in",
            overwrite: true,
            onComplete: () => {
                if (cancelled) return
                swap()
            },
        })
    }

    return () => {
        cancelled = true
        if (rafId) cancelAnimationFrame(rafId)
        if (outTween) outTween.kill()
        if (inTween) inTween.kill()
    }
}

export default function PageTransition({ children }) {
    const router = useRouter()
    const wrapperRef = useRef(null)
    const lenis = useLenis()

    const routeKey = router.asPath.split("#")[0]

    useIsoLayoutEffect(() => {
        if (!didNavigate) return
        didNavigate = false
        fadeInNavChildren()
    }, [routeKey])

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

                fadeOutNavChildren()
                didNavigate = true

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
