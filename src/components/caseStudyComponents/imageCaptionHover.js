"use client"

import { useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import { GrAdd } from "react-icons/gr"
import { PortableText } from "next-sanity"
import { useImageModal } from "../imageModalContext"

export default function ImageCaptionHover({ _key, image, video, caption, variant = "normal" }) {
    const ctx = useImageModal()
    const handleOpen = () => ctx?.open(_key)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isFullyExpanded, setIsFullyExpanded] = useState(false)
    const [collapsedHeight, setCollapsedHeight] = useState(0)
    const [fullHeight, setFullHeight] = useState(0)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const captionRef = useRef(null)

    useLayoutEffect(() => {
        const el = captionRef.current
        if (!el) return
        const measure = () => {
            const hadClamp = el.classList.contains('line-clamp-2')
            if (!hadClamp) el.classList.add('line-clamp-2')
            const collapsed = el.clientHeight
            el.classList.remove('line-clamp-2')
            const full = el.scrollHeight
            if (hadClamp) el.classList.add('line-clamp-2')
            setCollapsedHeight(collapsed)
            setFullHeight(full)
            setIsOverflowing(full > collapsed + 1)
        }
        measure()
        let cancelled = false
        if (typeof document !== 'undefined' && document.fonts?.ready) {
            document.fonts.ready.then(() => { if (!cancelled) measure() })
        }
        window.addEventListener('resize', measure)
        return () => {
            cancelled = true
            window.removeEventListener('resize', measure)
        }
    }, [caption])

    const handleMouseEnter = () => {
        setIsExpanded(true)
    }

    const handleMouseLeave = () => {
        if (isFullyExpanded && captionRef.current) {
            setFullHeight(captionRef.current.scrollHeight)
            setIsFullyExpanded(false)
            requestAnimationFrame(() => {
                requestAnimationFrame(() => setIsExpanded(false))
            })
        } else {
            setIsExpanded(false)
        }
    }

    const handleTransitionEnd = (e) => {
        if (e.propertyName !== 'max-height') return
        if (isExpanded) setIsFullyExpanded(true)
    }

    if (!image) return null

    const captionStyle = isOverflowing
        ? {
            maxHeight: isFullyExpanded ? 'none' : (isExpanded ? `${fullHeight}px` : `${collapsedHeight}px`),
            overflow: 'hidden',
            transition: 'max-height 0.4s ease',
        }
        : undefined

    const hoverHandlers = isOverflowing
        ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }
        : undefined

    return (
        <div className={`variant-${variant} caption-wrapper`}>
            <div className='image-sticky-area pos-rel'>
                <div className={`variant-${variant} image-shell pos-rel ratio-3-4 max-full radius-15 overflow`} {...hoverHandlers}>
                    <Image className='bg-image' src={image} alt='' width={1600} height={1000} />
                    {video && <video className='bg-image' src={video} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
                    <button className='button-secondary lightbox-trigger pos-abs top-30 left-30 z-2' onClick={handleOpen}>
                        <img src="/images/expand.svg" alt="" width="16" height="14" />
                    </button>
                </div>
                <div className='p15 pb0 flex gap-40 space-between caption-row caption-row-clamp'>
                    <div
                        ref={captionRef}
                        className={`h4 text-grey-4 max-600${!isExpanded ? ' line-clamp-2' : ''}`}
                        style={captionStyle}
                        onTransitionEnd={handleTransitionEnd}
                    >
                        <PortableText value={caption} />
                    </div>
                    {isOverflowing && (
                        <div className='p8 radius-5 shrink-0 h-fit'>
                            <span
                                className='flex'
                                style={{
                                    opacity: isExpanded ? 0 : 1,
                                    transition: 'opacity 0.3s ease',
                                }}
                            >
                                <GrAdd size={15} />
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
