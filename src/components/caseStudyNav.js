"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useLenis } from "lenis/react"

const SCROLL_OFFSET = -73

export default function CaseStudyNav({ sections }) {
    const sectionGroups = sections?.filter(s => s._type === "sectionGroup" && s.slug) ?? []
    const groups = [{ _key: "introduction", title: "Introduction", slug: "introduction" }, ...sectionGroups]
    const [activeSlug, setActiveSlug] = useState("introduction")
    const [isOpen, setIsOpen] = useState(false)
    const [isTouch, setIsTouch] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [pastEnd, setPastEnd] = useState(false)
    const leaveTimeoutRef = useRef(null)
    const navRef = useRef(null)
    const sectionsElRef = useRef(null)
    const lenis = useLenis()

    useEffect(() => {
        if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
            setIsTouch(true)
        }
        setMounted(true)
    }, [])

    useEffect(() => {
        if (groups.length === 0) return
        const selector = groups.map(g => `#${g.slug}`).join(",")
        const targets = document.querySelectorAll(selector)
        if (targets.length === 0) return

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) setActiveSlug(entry.target.id)
                })
            },
            { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
        )
        targets.forEach(t => observer.observe(t))
        return () => observer.disconnect()
    }, [groups.map(g => g.slug).join("|")])

    useEffect(() => () => {
        if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current)
    }, [])

    useEffect(() => {
        function check() {
            if (!sectionsElRef.current) sectionsElRef.current = document.querySelector(".case-study-sections")
            const el = sectionsElRef.current
            if (!el) {
                setPastEnd(false)
                return
            }
            setPastEnd(el.getBoundingClientRect().bottom < window.innerHeight - 40)
        }
        check()
        if (lenis) {
            lenis.on("scroll", check)
            return () => lenis.off("scroll", check)
        }
        window.addEventListener("scroll", check, { passive: true })
        window.addEventListener("resize", check)
        return () => {
            window.removeEventListener("scroll", check)
            window.removeEventListener("resize", check)
        }
    }, [lenis])

    useEffect(() => {
        if (!isTouch || !isOpen) return
        function handleOutside(e) {
            if (navRef.current && !navRef.current.contains(e.target)) setIsOpen(false)
        }
        document.addEventListener("pointerdown", handleOutside)
        return () => document.removeEventListener("pointerdown", handleOutside)
    }, [isTouch, isOpen])

    if (sectionGroups.length === 0) return null
    if (!mounted) return null

    function handleClick(e, slug, isActive) {
        if (isTouch) {
            e.preventDefault()
            if (isActive) {
                setIsOpen(o => !o)
                return
            }
            if (lenis) lenis.scrollTo(`#${slug}`, { offset: SCROLL_OFFSET })
            setIsOpen(false)
            return
        }
        if (!lenis) return
        e.preventDefault()
        lenis.scrollTo(`#${slug}`, { offset: SCROLL_OFFSET })
    }

    function handleMouseEnter() {
        if (isTouch) return
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current)
            leaveTimeoutRef.current = null
        }
        setIsOpen(true)
    }

    function handleMouseLeave() {
        if (isTouch) return
        if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current)
        leaveTimeoutRef.current = setTimeout(() => setIsOpen(false), 450)
    }

    return createPortal(
        <nav
            ref={navRef}
            className={`case-study-nav p15 flex gap-3${isOpen ? " animate" : ""}${pastEnd ? " hidden" : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {groups.map((g, i) => {
                const isActive = g.slug === activeSlug
                return (
                    <a key={g._key} href={`#${g.slug}`} onClick={e => handleClick(e, g.slug, isActive)} className={`f-nav ${isActive ? "button-case-study text-black" : "button-nav text-grey-5"}`}>
                        <span className="flex align-center gap-15">
                            <span>{i + 1}</span>
                            <span>{g.title}</span>
                        </span>
                    </a>
                )
            })}
        </nav>,
        document.body
    )
}
