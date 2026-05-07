"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export default function AllWork({ projects }) {
    const gridRef = useRef()

    useGSAP(
        () => {
            const cards = gsap.utils.toArray(gridRef.current.querySelectorAll(".work-card"))
            const bound = []

            cards.forEach(card => {
                const tags = card.querySelector(".tags")
                const image = card.querySelector(".image")
                gsap.set(tags, { autoAlpha: 0 })
                gsap.set(image, { filter: "blur(0px)", scale: 1 })

                const others = cards.filter(c => c !== card).map(c => c.querySelector(".image"))
                let activeTl

                const onEnter = () => {
                    activeTl?.kill()
                    activeTl = gsap
                        .timeline({ defaults: { duration: 0.3, ease: "power2.out" } })
                        .to(others, { filter: "blur(8px)", scale: 1.03 }, 0)
                        .to(tags, { autoAlpha: 1 }, 0)
                }

                const onLeave = () => {
                    activeTl?.kill()
                    activeTl = gsap
                        .timeline({ defaults: { duration: 0.3, ease: "power2.out" } })
                        .to(others, { filter: "blur(0px)", scale: 1 }, 0)
                        .to(tags, { autoAlpha: 0 }, 0)
                }

                card.addEventListener("mouseenter", onEnter)
                card.addEventListener("mouseleave", onLeave)
                bound.push([card, onEnter, onLeave])
            })

            return () => {
                bound.forEach(([card, onEnter, onLeave]) => {
                    card.removeEventListener("mouseenter", onEnter)
                    card.removeEventListener("mouseleave", onLeave)
                })
            }
        },
        { scope: gridRef, dependencies: [projects] },
    )

    return (
        <div ref={gridRef} className='p15 grid gap-90 m-flex m-flex-col'>
            {projects.map(project => (
                <Link href={`/case-study/${project.slug.current}`} className='work-card max-full flex flex-col fade--in' data-sal key={project.slug.current}>
                    <div className='bg-grey pos-rel ratio-16-18 overflow radius-15'>
                        <Image className='image bg-image' src={project.image} alt='' width={435} height={515} />
                    </div>
                    <div className='p15 flex flex-col gap-15'>
                        <p className='h3'>{project.title}</p>
                        <div className='tags flex flex-wrap gap-5'>
                            {project.tags.map((tag, index) => (
                                <p className='tag nowrap' key={index}>
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
