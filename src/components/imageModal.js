"use client"

import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { GrAdd } from "react-icons/gr"
import { PortableText } from "next-sanity"
import { useLenis } from "lenis/react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useImageModal } from "./imageModalContext"

gsap.registerPlugin(useGSAP)

const TRANSITION_DURATION = 0.1

function parseSanityDimensions(url) {
    const match = typeof url === "string" && url.match(/-(\d+)x(\d+)\.[a-z0-9]+(?:\?|$)/i)
    if (!match) return { width: 1600, height: 2000 }
    return { width: Number(match[1]), height: Number(match[2]) }
}

export default function ImageModal() {
    const ctx = useImageModal()
    const [mounted, setMounted] = useState(false)
    const touchStartRef = useRef(null)
    const frameRef = useRef(null)
    const captionRef = useRef(null)
    const [displayed, setDisplayed] = useState(null)
    const lenis = useLenis()

    useEffect(() => { setMounted(true) }, [])

    const isOpen = !!ctx?.isOpen
    const close = ctx?.close
    const next = ctx?.next
    const prev = ctx?.prev

    useEffect(() => {
        if (!isOpen) return
        const onKey = e => {
            if (e.key === "Escape") {
                close?.()
                return
            }
            if (e.key === "ArrowLeft") {
                prev?.()
                return
            }
            if (e.key === "ArrowRight") {
                next?.()
            }
        }
        document.addEventListener("keydown", onKey)
        document.documentElement.classList.add("no-scroll", "image-modal-open")
        lenis?.stop()
        return () => {
            document.removeEventListener("keydown", onKey)
            document.documentElement.classList.remove("no-scroll", "image-modal-open")
            lenis?.start()
        }
    }, [isOpen, close, next, prev, lenis])

    useEffect(() => {
        if (!isOpen) return
        const modalRoot = document.querySelector(".image-modal")
        const videos = Array.from(document.querySelectorAll("video")).filter(v => !modalRoot?.contains(v))
        const wasPlaying = videos.map(v => !v.paused)
        videos.forEach(v => v.pause())
        return () => {
            videos.forEach((v, i) => {
                if (!wasPlaying[i]) return
                const p = v.play()
                if (p && typeof p.catch === "function") p.catch(() => {})
            })
        }
    }, [isOpen])

    const currentImage = isOpen ? ctx?.images?.[ctx.currentIndex] : null
    const currentKey = currentImage?._key

    useEffect(() => {
        if (!isOpen) {
            setDisplayed(null)
            return
        }
        if (currentImage && !displayed) setDisplayed(currentImage)
    }, [isOpen, currentImage, displayed])

    useGSAP(() => {
        if (!isOpen || !displayed || !currentImage) return
        if (displayed._key === currentImage._key) return
        if (!frameRef.current) return

        const fadeOutTargets = [frameRef.current, captionRef.current].filter(Boolean)
        const tl = gsap.timeline()
        tl.to(fadeOutTargets, { opacity: 0, duration: TRANSITION_DURATION, ease: "power2.out", overwrite: true })
            .call(() => setDisplayed(currentImage))
            .add(() => {
                requestAnimationFrame(() => {
                    const fadeInTargets = [frameRef.current, captionRef.current].filter(Boolean)
                    if (!fadeInTargets.length) return
                    gsap.fromTo(
                        fadeInTargets,
                        { opacity: 0 },
                        { opacity: 1, duration: TRANSITION_DURATION, ease: "power2.in", overwrite: true },
                    )
                })
            })

        return () => {
            tl.kill()
        }
    }, { dependencies: [currentKey, isOpen] })

    if (!mounted || !ctx || !isOpen) return null

    const { images, currentIndex } = ctx
    const current = images[currentIndex]
    if (!current) return null

    const rendered = displayed || current
    const hasPrev = currentIndex > 0
    const hasNext = currentIndex < images.length - 1
    const showNav = images.length > 1
    const stop = e => e.stopPropagation()

    const onTouchStart = e => {
        const t = e.touches[0]
        touchStartRef.current = { x: t.clientX, y: t.clientY }
    }
    const onTouchEnd = e => {
        const start = touchStartRef.current
        if (!start) return
        touchStartRef.current = null
        const t = e.changedTouches[0]
        const dx = t.clientX - start.x
        const dy = t.clientY - start.y
        if (Math.abs(dx) < 50 || Math.abs(dx) <= Math.abs(dy)) return
        if (dx < 0) next?.()
        else prev?.()
    }

    const { width: renderedWidth, height: renderedHeight } = parseSanityDimensions(rendered.image)

    return createPortal(
        <div className='image-modal' onClick={close}>
            <div ref={frameRef} className='image-modal__frame radius-15 overflow' onClick={stop} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                <Image
                    key={rendered._key}
                    className='image-modal__img'
                    src={rendered.image}
                    alt=''
                    width={renderedWidth}
                    height={renderedHeight}
                    sizes='(max-width: 768px) 100vw, calc(100vw - 200px)'
                />
                {rendered.video && <video key={`${rendered._key}-video`} className='bg-image' src={rendered.video} autoPlay muted loop playsInline preload='auto' aria-hidden='true' />}
            </div>

            {showNav && (
                <div className="bg-red">
                    <button
                        className='image-modal__nav image-modal__nav--prev m-hide'
                        onClick={e => {
                            stop(e)
                            prev()
                        }}
                        disabled={!hasPrev}
                        aria-label='Previous image'>
                        Prev
                    </button>
                    <button
                        className='image-modal__nav image-modal__nav--next m-hide'
                        onClick={e => {
                            stop(e)
                            next()
                        }}
                        disabled={!hasNext}
                        aria-label='Next image'>
                        Next
                    </button>
                </div>
            )}

            {hasCaption(rendered.caption) && <CaptionBox ref={captionRef} key={rendered._key} caption={rendered.caption} onClick={stop} />}
        </div>,
        document.body,
    )
}

function hasCaption(caption) {
    if (!caption) return false
    if (Array.isArray(caption)) return caption.length > 0
    return true
}

const CaptionBox = forwardRef(function CaptionBox({ caption, onClick }, outerRef) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [showClamp, setShowClamp] = useState(true)
    const [collapsedHeight, setCollapsedHeight] = useState(0)
    const [fullHeight, setFullHeight] = useState(0)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const ref = useRef(null)

    useLayoutEffect(() => {
        const el = ref.current
        if (!el) return
        const measure = () => {
            const hadClamp = el.classList.contains("line-clamp-2")
            if (!hadClamp) el.classList.add("line-clamp-2")
            const collapsed = el.clientHeight
            el.classList.remove("line-clamp-2")
            const full = el.scrollHeight
            if (hadClamp) el.classList.add("line-clamp-2")
            setCollapsedHeight(collapsed)
            setFullHeight(full)
            setIsOverflowing(full > collapsed + 1)
        }
        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [caption])

    const handleToggle = () => {
        if (isExpanded) {
            setIsExpanded(false)
        } else {
            setShowClamp(false)
            setIsExpanded(true)
        }
    }

    const handleTransitionEnd = e => {
        if (e.propertyName !== "max-height") return
        if (!isExpanded) setShowClamp(true)
    }

    const captionStyle = isOverflowing
        ? {
            maxHeight: isExpanded ? `${fullHeight}px` : `${collapsedHeight}px`,
            overflow: "hidden",
            transition: "max-height 0.4s ease",
        }
        : undefined

    return (
        <div ref={outerRef} className='image-modal__caption bg-solid-grey radius-5 p15 flex gap-40 space-between' onClick={onClick}>
            <div
                ref={ref}
                className={`h4 max-600${showClamp && !isExpanded ? " line-clamp-2" : ""}`}
                style={captionStyle}
                onTransitionEnd={handleTransitionEnd}
            >
                {Array.isArray(caption) ? <PortableText value={caption} /> : caption}
            </div>
            {isOverflowing && (
                <div
                    className='bg-grey-2 p5 radius-5 shrink-0 h-fit caption-toggle'
                    style={{ cursor: "pointer" }}
                    onClick={handleToggle}
                >
                    <span
                        className='flex'
                        style={{
                            transform: isExpanded ? "rotate(45deg)" : "none",
                            transition: "transform 0.3s ease",
                        }}
                    >
                        <GrAdd size={15} />
                    </span>
                </div>
            )}
        </div>
    )
})
