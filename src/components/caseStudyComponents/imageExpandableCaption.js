"use client"

import { useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import { GrAdd } from "react-icons/gr"
import { RiExpandDiagonalSLine } from "react-icons/ri"
import { PortableText } from "next-sanity"
import { useImageModal } from "../imageModalContext"

export default function ImageExpandableCaption({ _key, image, video, caption, variant = "normal" }) {
    const ctx = useImageModal()
    const handleOpen = () => ctx?.open(_key)
    const [isExpanded, setIsExpanded] = useState(false)
    const [showClamp, setShowClamp] = useState(true)
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
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [caption])

    const handleClick = () => {
        if (isExpanded) {
            setIsExpanded(false)
        } else {
            setShowClamp(false)
            setIsExpanded(true)
        }
    }

    const handleTransitionEnd = (e) => {
        if (e.propertyName !== 'max-height') return
        if (!isExpanded) setShowClamp(true)
    }

    if (!image) return null

    const captionStyle = isOverflowing
        ? {
            maxHeight: isExpanded ? `${fullHeight}px` : `${collapsedHeight}px`,
            overflow: 'hidden',
            transition: 'max-height 0.4s ease',
        }
        : undefined

    return (
        <div className={`variant-${variant}`}>
            <div className={`variant-${variant} pos-rel ratio-3-4 max-full radius-15 overflow`}>
                <Image className='bg-image' src={image} alt='' width={1600} height={1000} />
                {video && <video className='bg-image' src={video} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
                <button className='button-secondary pos-abs top-30 left-30 z-2' onClick={handleOpen}>
                    <RiExpandDiagonalSLine size={15} strokeWidth={.01} />
                </button>
            </div>
            <div className='p15 flex gap-40 space-between caption-row'>
                <div
                    ref={captionRef}
                    className={`h4 text-grey-4 max-600${showClamp && !isExpanded ? ' line-clamp-2' : ''}`}
                    style={captionStyle}
                    onTransitionEnd={handleTransitionEnd}
                >
                    <PortableText value={caption} />
                </div>
                {isOverflowing && (
                    <div
                        className='bg-grey-2 p5 radius-5 shrink-0 h-fit caption-toggle'
                        style={{ cursor: 'pointer' }}
                        onClick={handleClick}
                    >
                        <span
                            className='flex'
                            style={{
                                transform: isExpanded ? 'rotate(45deg)' : 'none',
                                transition: 'transform 0.3s ease',
                            }}
                        >
                            <GrAdd size={15} />
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
