import Image from "next/image"
import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { PortableText } from "@portabletext/react"

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

function ProjectSlider({ images, slug, cursorRef, rowRef, activeIndex, setActiveIndex }) {
    const trackRef = useRef(null)
    const isHoveringRef = useRef(false)
    const isHoveringRightRef = useRef(false)
    const touchStartRef = useRef(null)
    const swipedRef = useRef(false)

    const restingTransform = `translateX(-${activeIndex * 100}%)`
    const leakTransform = `translateX(calc(-${activeIndex * 100}% - 5%))`

    const isTouchDevice = () => typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse), (max-width: 768px)").matches

    useLayoutEffect(() => {
        if (isHoveringRightRef.current && trackRef.current) {
            trackRef.current.style.transform = leakTransform
        }
    }, [activeIndex, leakTransform])

    useEffect(() => {
        if (activeIndex !== images.length) return
        const el = trackRef.current
        const onEnd = () => {
            el.style.transition = "none"
            setActiveIndex(0)
            requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transition = "" }))
        }
        el.addEventListener("transitionend", onEnd, { once: true })
        return () => el.removeEventListener("transitionend", onEnd)
    }, [activeIndex, images.length, setActiveIndex])

    useEffect(() => {
        if (images.length <= 1) return
        if (isTouchDevice()) return
        const id = setInterval(() => {
            if (isHoveringRef.current) return
            setActiveIndex(i => i >= images.length ? i : i + 1)
        }, 4000)
        return () => clearInterval(id)
    }, [images.length, setActiveIndex])

    const isLeftOfRow = clientX => {
        const rect = rowRef.current?.getBoundingClientRect()
        if (!rect) return true
        return clientX - rect.left < rect.width / 2
    }

    const handleMouseMove = e => {
        if (isTouchDevice()) return
        const isLeft = isLeftOfRow(e.clientX)
        isHoveringRef.current = true
        isHoveringRightRef.current = !isLeft
        const cursor = cursorRef.current
        cursor.classList.toggle("is-right", !isLeft)
        cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`
        cursor.style.opacity = "1"
        trackRef.current.style.transform = isLeft ? restingTransform : leakTransform
    }

    const handleMouseLeave = () => {
        if (isTouchDevice()) return
        isHoveringRef.current = false
        isHoveringRightRef.current = false
        cursorRef.current.style.opacity = "0"
        trackRef.current.style.transform = restingTransform
    }

    const handleClick = e => {
        if (swipedRef.current) {
            swipedRef.current = false
            e.preventDefault()
            return
        }
        if (isTouchDevice()) return
        if (isLeftOfRow(e.clientX)) return
        e.preventDefault()
        if (images.length <= 1) return
        setActiveIndex(i => i >= images.length ? i : i + 1)
    }

    const handleTouchStart = e => {
        isHoveringRef.current = false
        isHoveringRightRef.current = false
        if (cursorRef.current) cursorRef.current.style.opacity = "0"
        if (trackRef.current) trackRef.current.style.transform = restingTransform
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
        if (dx < 0) {
            setActiveIndex(i => i >= images.length - 1 ? images.length : i + 1)
        } else if (activeIndex > 0) {
            setActiveIndex(i => i - 1)
        } else {
            const track = trackRef.current
            if (track) {
                track.style.transition = "none"
                track.style.transform = `translateX(-${images.length * 100}%)`
                void track.offsetWidth
                track.style.transition = ""
            }
            setActiveIndex(images.length - 1)
        }
    }

    return (
        <div className='slider-wrap pos-rel ratio-8-5 w-100 mr15 overflow m-pl15'>
            <div ref={trackRef} className='slider-track' style={{ transform: restingTransform }}>
                {[...images, ...(images.length > 1 ? [images[0], images[1]] : [])].map((slide, i) => (
                    <div className='slide bg-grey' key={i} aria-hidden={i >= images.length ? true : undefined}>
                        {slide?.image && <Image className='bg-image' width={1184} height={740} src={slide.image} alt='' />}
                        {slide?.video && <video className='bg-image' src={slide.video} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
                    </div>
                ))}
            </div>
            <Link
                href={`/case-study/${slug}`}
                className='overlay pos-abs top-0 left-0 w-100 h-100 cursor-none z-2'
                style={{ touchAction: 'pan-y' }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                aria-label='View case study'
            />
        </div>
    )
}
