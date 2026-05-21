import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { PortableText } from "@portabletext/react"
import { useRouter } from "next/router"
import gsap from "gsap"

export default function FeaturedProjects({ projects, onTagClick }) {
    const cursorRef = useRef(null)

    return (
        <>
            <div ref={cursorRef} className='custom-cursor'>
                <span className='label label-left'>View Case Study</span>
                <span className='label label-right'>Next</span>
            </div>
            <div className='featured-projects'>
                {projects.map((project, index) => (
                    <Project key={index} project={project} cursorRef={cursorRef} onTagClick={onTagClick} />
                ))}
            </div>
        </>
    )
}

function Project({ project, cursorRef, onTagClick }) {
    const [activeIndex, setActiveIndex] = useState(0)
    const rowRef = useRef(null)

    return (
        <div ref={rowRef} className='grid col-4 pb150 m-flex m-flex-col'>
            <Link href={`/case-study/${project.slug.current}`} aria-label={project.title}>
                <p className='h1 text-grey-6 pl30 fade--in m-pb15' data-sal>
                    {project.title}
                </p>
            </Link>
            <div className='span-3 flex flex-col gap-40'>
                <div className='flex gap-20 space-between pr30 fade--in' data-sal>
                    <div className='f-20 text-grey-5 max-500 m-px30'>
                        <PortableText value={project.description} />
                    </div>
                    <div className='flex gap-5 m-hide'>
                        {project.tags.map((tag, index) => (
                            <p className='tag nowrap' key={index} onClick={() => onTagClick(tag.name)}>
                                {tag.name}
                            </p>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col gap-15 max-full'>
                    <div className='index fade--in m-hide' data-sal>
                        {(activeIndex % project.images.length) + 1} / {project.images.length}
                    </div>
                    <ProjectSlider images={project.images} slug={project.slug.current} cursorRef={cursorRef} rowRef={rowRef} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
                </div>
            </div>
        </div>
    )
}

function ProjectSlider({ images, slug, cursorRef, rowRef, setActiveIndex }) {
    const router = useRouter()
    const trackRef = useRef(null)
    const isHoveringRef = useRef(false)
    const isHoveringRightRef = useRef(false)
    const touchStartRef = useRef(null)
    const swipedRef = useRef(false)
    const indexRef = useRef(0)

    const isTouchDevice = () => typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse), (max-width: 768px)").matches

    const settle = () => {
        if (!trackRef.current) return
        const target = isHoveringRightRef.current ? -indexRef.current * 100 - 5 : -indexRef.current * 100
        gsap.to(trackRef.current, { xPercent: target, duration: 0.4, ease: "power2.out", overwrite: "auto" })
    }

    const advance = () => {
        if (images.length <= 1) return
        if (indexRef.current >= images.length) return
        const next = indexRef.current + 1
        indexRef.current = next
        setActiveIndex(next)
        gsap.to(trackRef.current, {
            xPercent: -next * 100,
            duration: 0.65,
            ease: "power2.inOut",
            overwrite: "auto",
            onComplete: () => {
                if (indexRef.current === next && next >= images.length) {
                    gsap.set(trackRef.current, { xPercent: 0 })
                    indexRef.current = 0
                    setActiveIndex(0)
                }
                if (isHoveringRightRef.current) settle()
            },
        })
    }

    const stepBack = () => {
        if (images.length <= 1) return
        if (indexRef.current <= 0) {
            const last = images.length - 1
            gsap.set(trackRef.current, { xPercent: -images.length * 100 })
            indexRef.current = last
            setActiveIndex(last)
            gsap.to(trackRef.current, {
                xPercent: -last * 100,
                duration: 0.65,
                ease: "power2.inOut",
                overwrite: "auto",
                onComplete: () => { if (isHoveringRightRef.current) settle() },
            })
            return
        }
        const prev = indexRef.current - 1
        indexRef.current = prev
        setActiveIndex(prev)
        gsap.to(trackRef.current, {
            xPercent: -prev * 100,
            duration: 0.65,
            ease: "power2.inOut",
            overwrite: "auto",
            onComplete: () => { if (isHoveringRightRef.current) settle() },
        })
    }

    const advanceRef = useRef(advance)
    advanceRef.current = advance

    useEffect(() => {
        if (images.length <= 1) return
        if (isTouchDevice()) return
        const id = setInterval(() => {
            if (isHoveringRef.current) return
            advanceRef.current()
        }, 4000)
        return () => clearInterval(id)
    }, [images.length])

    const isLeftOfRow = clientX => {
        const rect = rowRef.current?.getBoundingClientRect()
        if (!rect) return true
        return clientX - rect.left < rect.width / 2
    }

    const handleMouseMove = e => {
        if (isTouchDevice()) return
        const isLeft = isLeftOfRow(e.clientX)
        const wasRight = isHoveringRightRef.current
        isHoveringRef.current = true
        isHoveringRightRef.current = !isLeft
        const cursor = cursorRef.current
        cursor.classList.toggle("is-right", !isLeft)
        cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`
        cursor.style.opacity = "1"
        if (wasRight !== isHoveringRightRef.current) settle()
    }

    const handleMouseLeave = () => {
        if (isTouchDevice()) return
        isHoveringRef.current = false
        isHoveringRightRef.current = false
        cursorRef.current.style.opacity = "0"
        settle()
    }

    const handleClick = e => {
        if (swipedRef.current) {
            swipedRef.current = false
            return
        }
        if (isTouchDevice()) {
            router.push(`/case-study/${slug}`)
            return
        }
        const isLeft = isLeftOfRow(e.clientX)
        if (isLeft) {
            router.push(`/case-study/${slug}`)
            return
        }
        advance()
    }

    const handleTouchStart = e => {
        isHoveringRef.current = false
        isHoveringRightRef.current = false
        if (cursorRef.current) cursorRef.current.style.opacity = "0"
        if (images.length <= 1) return
        const t = e.touches[0]
        touchStartRef.current = { x: t.clientX, y: t.clientY }
    }

    const handleTouchEnd = e => {
        const start = touchStartRef.current
        touchStartRef.current = null
        if (!start) return
        const t = e.changedTouches?.[0]
        if (!t) return
        const dx = t.clientX - start.x
        const dy = t.clientY - start.y
        if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return
        swipedRef.current = true
        if (dx < 0) advance()
        else stepBack()
    }

    return (
        <div className='slider-wrap pos-rel ratio-8-5 w-100 mr15 overflow m-pl15'>
            <div ref={trackRef} className='slider-track'>
                {[...images, ...(images.length > 1 ? [images[0], images[1]] : [])].map((slide, i) => (
                    <div className='slide bg-grey' key={i} aria-hidden={i >= images.length ? true : undefined}>
                        {slide?.image && <Image className='bg-image' width={1184} height={740} src={slide.image} alt='' loading={i >= images.length ? 'eager' : undefined} />}
                        {slide?.video && <video className='bg-image' src={slide.video} autoPlay muted loop playsInline preload={i >= images.length ? 'auto' : 'metadata'} aria-hidden='true' />}
                    </div>
                ))}
            </div>
            <div
                className='overlay pos-abs top-0 left-0 w-100 h-100 cursor-none z-2'
                style={{ touchAction: 'pan-y' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            />
        </div>
    )
}
