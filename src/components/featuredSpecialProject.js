"use client"
import Link from "next/link"
import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import Spacer from "./spacer"

gsap.registerPlugin(useGSAP)

export default function FeaturedSpecialProject({ description, title, slug, heroImage, heroVideo }) {
    const containerRef = useRef(null)
    const descriptionRef = useRef(null)
    const imageRef = useRef(null)
    const cursorRef = useRef(null)
    const [hovered, setHovered] = useState(false)

    const handleMouseMove = e => {
        const cursor = cursorRef.current
        if (!cursor) return
        cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`
        cursor.style.opacity = "1"
    }

    const handleMouseLeave = () => {
        setHovered(false)
        if (cursorRef.current) cursorRef.current.style.opacity = "0"
    }

    useGSAP(() => {
        gsap.set(descriptionRef.current, { autoAlpha: 0, y: 20 })
        if (imageRef.current) gsap.set(imageRef.current, { filter: "blur(8px)", scale: 1.05 })
    }, { scope: containerRef })

    useGSAP(() => {
        gsap.to(descriptionRef.current, {
            autoAlpha: hovered ? 1 : 0,
            y: hovered ? 0 : 20,
            duration: 0.4,
            ease: hovered ? "power2.out" : "power2.in",
        })
    }, { scope: containerRef, dependencies: [hovered] })

    useGSAP(() => {
        if (!imageRef.current) return
        gsap.to(imageRef.current, {
            filter: hovered ? "blur(0px)" : "blur(8px)",
            scale: hovered ? 1 : 1.05,
            duration: 0.65,
            ease: hovered ? "power3.out" : "power2.in",
        })
    }, { scope: containerRef, dependencies: [hovered] })

    if (!slug) return null
    return (
        <>
            <div ref={containerRef} className='p15 h-100vh flex flex-col m-h-100'>
                <div ref={cursorRef} className='custom-cursor'>
                    <span className='label label-left'>View Case Study</span>
                </div>
                <div className='b-1' data-sal />
                <p className='h5 py15'>Featured Project</p>
                <Spacer />
                <div className='flex-1 min-h-0 flex align-center justify-center featured-special-stage'>
                    <div onMouseEnter={() => setHovered(true)} onMouseLeave={handleMouseLeave} onMouseMove={handleMouseMove} className={`pos-rel ratio-16-10 overflow radius-15 fit cursor-none${hovered ? " is-hovered" : ""}`}>
                        {heroImage && <img ref={imageRef} className='bg-image image--blur' src={heroImage} alt={title} />}
                        {heroVideo && <video className='bg-image' src={heroVideo} autoPlay muted loop playsInline preload='auto' aria-hidden='true' />}
                        {title && <p className='h1 pos-abs center-abs'>{title}</p>}
                        {description && (
                            <p ref={descriptionRef} className='py15 pos-abs left-half bottom-30 max-350 text-center text-grey-4 m-hide'>
                                {description}
                            </p>
                        )}
                        <Link href={`/special-projects/${slug}`} aria-label={title} className='pos-abs top-0 left-0 w-100 h-100 featured-special-link-overlay' />
                    </div>
                </div>
                {description && (
                    <div className='m-show flex justify-center p10 pt0'>
                        <p className='h4 max-350 text-center text-grey-4'>{description}</p>
                    </div>
                )}
                <Spacer className="m-hide" />
            </div>
        </>
    )
}
