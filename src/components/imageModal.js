"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { GrAdd } from "react-icons/gr"
import { useImageModal } from "./imageModalContext"

export default function ImageModal() {
    const ctx = useImageModal()
    const [mounted, setMounted] = useState(false)

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
        document.documentElement.classList.add("no-scroll")
        return () => {
            document.removeEventListener("keydown", onKey)
            document.documentElement.classList.remove("no-scroll")
        }
    }, [isOpen, close, next, prev])

    if (!mounted || !ctx || !isOpen) return null

    const { images, currentIndex } = ctx
    const current = images[currentIndex]
    if (!current) return null

    const hasPrev = currentIndex > 0
    const hasNext = currentIndex < images.length - 1
    const showNav = images.length > 1
    const stop = e => e.stopPropagation()

    return createPortal(
        <div className='image-modal' onClick={close}>
            <div className='image-modal__frame radius-15 overflow' onClick={stop}>
                <Image
                    key={current._key}
                    className='bg-image'
                    src={current.image}
                    alt=''
                    width={1600}
                    height={2000}
                />
            </div>

            {showNav && (
                <>
                    <button
                        className='image-modal__nav image-modal__nav--prev'
                        onClick={e => { stop(e); prev() }}
                        disabled={!hasPrev}
                        aria-label='Previous image'
                    >
                        Prev
                    </button>
                    <button
                        className='image-modal__nav image-modal__nav--next'
                        onClick={e => { stop(e); next() }}
                        disabled={!hasNext}
                        aria-label='Next image'
                    >
                        Next
                    </button>
                </>
            )}

            {current.description && (
                <CaptionBox key={current._key} description={current.description} onClick={stop} />
            )}
        </div>,
        document.body,
    )
}

function CaptionBox({ description, onClick }) {
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
    }, [description])

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
        <div className='image-modal__caption bg-solid-grey radius-5 p15 flex gap-40 space-between' onClick={onClick}>
            <div
                ref={ref}
                className={`h4 max-600${showClamp && !isExpanded ? " line-clamp-2" : ""}`}
                style={captionStyle}
                onTransitionEnd={handleTransitionEnd}
            >
                {description}
            </div>
            {isOverflowing && (
                <div
                    className='shrink-0 h-fit caption-toggle'
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
}
