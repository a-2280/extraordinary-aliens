"use client"

import { useEffect, useRef, useState } from "react"
import { useLenis } from "lenis/react"

export default function CaseStudyNav({ sections }) {
    const sectionGroups = sections?.filter(s => s._type === "sectionGroup" && s.slug) ?? []
    const groups = [{ _key: "introduction", title: "Introduction", slug: "introduction" }, ...sectionGroups]
    const [activeSlug, setActiveSlug] = useState("introduction")
    const [animateNav, setAnimateNav] = useState(false)
    const leaveTimeoutRef = useRef(null)
    const lenis = useLenis()

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

    if (sectionGroups.length === 0) return null

    function handleClick(e, slug) {
        if (!lenis) return
        e.preventDefault()
        lenis.scrollTo(`#${slug}`)
    }

    function handleMouseEnter() {
        if (leaveTimeoutRef.current) {
            clearTimeout(leaveTimeoutRef.current)
            leaveTimeoutRef.current = null
        }
        setAnimateNav(true)
    }

    function handleMouseLeave() {
        if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current)
        leaveTimeoutRef.current = setTimeout(() => setAnimateNav(false), 450)
    }

    return (
        <nav
            className={`case-study-nav p15 flex gap-3${animateNav ? " animate" : ""}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {groups.map((g, i) => {
                const isActive = g.slug === activeSlug
                return (
                    <a key={g._key} href={`#${g.slug}`} onClick={e => handleClick(e, g.slug)} className={`f-nav ${isActive ? "button-case-study text-black" : "button-nav text-grey-5"}`}>
                        <span className="flex align-center gap-15">
                            <span>{i + 1}</span>
                            <span>{g.title}</span>
                        </span>
                    </a>
                )
            })}
        </nav>
    )
}
