"use client"
import Link from "next/link"
import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import Spacer from "./spacer"

gsap.registerPlugin(useGSAP)

export default function FeaturedSpecialProject({ description, title, slug, heroImage }) {
    const containerRef = useRef(null)
    const descriptionRef = useRef(null)
    const buttonRef = useRef(null)
    const [hovered, setHovered] = useState(false)

    useGSAP(() => {
        gsap.set([descriptionRef.current, buttonRef.current], { autoAlpha: 0, y: 20 })
    }, { scope: containerRef })

    useGSAP(() => {
        gsap.to([descriptionRef.current, buttonRef.current], {
            autoAlpha: hovered ? 1 : 0,
            y: hovered ? 0 : 20,
            duration: 0.4,
            ease: hovered ? "power2.out" : "power2.in",
            stagger: hovered ? 0.05 : 0,
        })
    }, { scope: containerRef, dependencies: [hovered] })

    if (!slug) return null
    return (
        <div className='p15 h-100vh flex flex-col'>
            <div className='b-1' data-sal />
            <p className='h5 py15'>Featured Project</p>
            <Spacer />
            <div className='flex-1 min-h-0 flex align-center justify-center'>
                <div
                    ref={containerRef}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className='pos-rel ratio-16-10 overflow radius-15 fit hover--unblur'
                >
                    {heroImage && <img className='bg-image image--blur' src={heroImage} alt={title} />}
                    {title && <p className='h1 pos-abs center-abs'>{title}</p>}
                    {description && <p ref={descriptionRef} className='py15 pos-abs left-half bottom-30 max-350 text-center text-grey-4'>{description}</p>}
                    <Link ref={buttonRef} href={`/special-projects/${slug}`} className='view-button pos-abs top-60 right-20 f-10 radius-5 bg-grey-2 p10 text-grey-6'>View Case Study</Link>
                </div>
            </div>
            <Spacer />
        </div>
    )
}
