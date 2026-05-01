import Image from "next/image"
import { useLayoutEffect, useRef, useState } from "react"
import { PortableText } from "@portabletext/react"
import { useRouter } from "next/router"

export default function FeaturedProjects({ projects }) {
    const cursorRef = useRef(null)

    return (
        <>
            <div ref={cursorRef} className='custom-cursor'>
                <span className='label label-left'>View Case Study</span>
                <span className='label label-right'>Next</span>
            </div>
            <div className='featured-projects'>
                {projects.map((project, index) => (
                    <Project key={index} project={project} cursorRef={cursorRef} />
                ))}
            </div>
        </>
    )
}

function Project({ project, cursorRef }) {
    const [activeIndex, setActiveIndex] = useState(0)

    return (
        <div className='grid col-4 pb150'>
            <p className='h1 text-grey-6 pl30 fade--in' data-sal>
                {project.title}
            </p>
            <div className='span-3 flex flex-col gap-40'>
                <div className='flex gap-20 space-between pr30 fade--in' data-sal>
                    <div className='f-20 text-grey-5 max-500'>
                        <PortableText value={project.description} />
                    </div>
                    <div className='flex gap-5'>
                        {project.tags.map((tag, index) => (
                            <p className='tag nowrap' key={index}>
                                {tag.name}
                            </p>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col gap-15 max-full'>
                    <div className='index fade--in' data-sal>
                        {activeIndex + 1} / {project.images.length}
                    </div>
                    <ProjectSlider images={project.images} slug={project.slug.current} cursorRef={cursorRef} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
                </div>
            </div>
        </div>
    )
}

function ProjectSlider({ images, slug, cursorRef, activeIndex, setActiveIndex }) {
    const router = useRouter()
    const trackRef = useRef(null)
    const isHoveringRightRef = useRef(false)

    const restingTransform = `translateX(-${activeIndex * 100}%)`
    const leakTransform = `translateX(calc(-${activeIndex * 100}% - 5%))`

    useLayoutEffect(() => {
        if (isHoveringRightRef.current && trackRef.current) {
            trackRef.current.style.transform = leakTransform
        }
    }, [activeIndex, leakTransform])

    const handleMouseMove = e => {
        const { left, width } = e.currentTarget.getBoundingClientRect()
        const isLeft = e.clientX - left < width / 2
        isHoveringRightRef.current = !isLeft
        const cursor = cursorRef.current
        cursor.classList.toggle("is-right", !isLeft)
        cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`
        cursor.style.opacity = "1"
        trackRef.current.style.transform = isLeft ? restingTransform : leakTransform
    }

    const handleMouseLeave = () => {
        isHoveringRightRef.current = false
        cursorRef.current.style.opacity = "0"
        trackRef.current.style.transform = restingTransform
    }

    const handleClick = e => {
        const { left, width } = e.currentTarget.getBoundingClientRect()
        const isLeft = e.clientX - left < width / 2
        if (isLeft) {
            router.push(`/case-study/${slug}`)
            return
        }
        setActiveIndex(i => (i + 1) % images.length)
    }

    return (
        <div className='slider-wrap pos-rel ratio-8-5 w-100 mr15 overflow'>
            <div ref={trackRef} className='slider-track' style={{ transform: restingTransform }}>
                {[...images, ...(images.length > 1 ? [images[0]] : [])].map((src, i) => (
                    <div className='slide bg-grey' key={i} aria-hidden={i === images.length ? true : undefined}>
                        <Image className='bg-image' width={1184} height={740} src={src} alt='' />
                    </div>
                ))}
            </div>
            <div className='overlay pos-abs top-0 left-0 w-100 h-100 cursor-none z-2' onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={handleClick} />
        </div>
    )
}
