"use client"

import { useLayoutEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { Flip } from "gsap/Flip"

gsap.registerPlugin(Flip)

export default function AllWork({ projects, exitingSlugs = new Set(), onTagClick }) {
    const gridRef = useRef()
    const prevProjectsRef = useRef(projects)
    const flipStateRef = useRef(null)

    if (prevProjectsRef.current !== projects && gridRef.current) {
        flipStateRef.current = Flip.getState(gridRef.current.querySelectorAll(".work-card"))
    }
    prevProjectsRef.current = projects

    useLayoutEffect(() => {
        const grid = gridRef.current
        if (!grid) return

        grid.querySelectorAll(".work-card").forEach(card => {
            if (card.dataset.exitPositioned && !card.classList.contains("is-exiting")) {
                card.style.position = ""
                card.style.top = ""
                card.style.left = ""
                card.style.width = ""
                delete card.dataset.exitPositioned
            }
        })

        if (!flipStateRef.current) return

        const gridRect = grid.getBoundingClientRect()
        grid.querySelectorAll(".is-exiting").forEach(card => {
            if (card.dataset.exitPositioned) return
            const rect = card.getBoundingClientRect()
            card.style.position = "absolute"
            card.style.top = (rect.top - gridRect.top) + "px"
            card.style.left = (rect.left - gridRect.left) + "px"
            card.style.width = rect.width + "px"
            card.dataset.exitPositioned = "1"
        })

        Flip.from(flipStateRef.current, {
            duration: 0.55,
            ease: "power2.inOut",
        })
        flipStateRef.current = null
    })

    return (
        <div ref={gridRef} className='work-grid p15 grid gap-90 m-gap-80 m-flex m-flex-col pos-rel'>
            {projects.map(project => (
                <Link href={`/case-study/${project.slug.current}`} className={`work-card max-full flex flex-col fade--in ${exitingSlugs.has(project.slug.current) ? "is-exiting" : ""}`} data-sal key={project.slug.current}>
                    <div className='bg-grey pos-rel ratio-16-18 overflow radius-15'>
                        {project.image && <Image className='image bg-image' src={project.image} alt='' width={435} height={515} />}
                        {project.video && <video className='bg-image' src={project.video} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
                    </div>
                    <div className='p15 flex flex-col gap-15'>
                        <p className='h3'>{project.title}</p>
                        <div className='tags flex flex-wrap gap-5 m-hide'>
                            {project.tags.map((tag, index) => (
                                <p className='tag nowrap' key={index} onClick={e => { e.preventDefault(); e.stopPropagation(); onTagClick(tag.name) }}>
                                    {tag.name}
                                </p>
                            ))}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
