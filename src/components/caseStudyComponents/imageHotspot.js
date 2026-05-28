"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { PortableText } from "next-sanity"
import { useImageModal } from "../imageModalContext"
import VideoModal from "../videoModal"

export default function ImageHotspot({ _key, image, video, spots, variant = "normal" }) {
    const [openIndex, setOpenIndex] = useState(null)
    const [renderedIndex, setRenderedIndex] = useState(null)
    const [videoOpen, setVideoOpen] = useState(false)
    const ctx = useImageModal()
    const handleTriggerClick = video ? () => setVideoOpen(true) : () => ctx?.open(_key)

    const placedSpots = (spots || []).filter(s => s?.point && typeof s.point.x === "number" && typeof s.point.y === "number")
    const isOpen = openIndex !== null
    const rendered = renderedIndex !== null ? placedSpots[renderedIndex] : null

    useEffect(() => {
        if (openIndex !== null) setRenderedIndex(openIndex)
    }, [openIndex])

    if (!image && !video) return null

    return (
        <div className={`variant-${variant} image-shell pos-rel ratio-3-4 radius-15 overflow`}>
            {image && <Image className='bg-image' src={image} alt='' width={1600} height={1000} />}
            {video && <video className='bg-image' src={video} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
            <button className='button-secondary lightbox-trigger pos-abs top-30 left-30 z-5' onClick={handleTriggerClick}>
                <img src="/images/expand.svg" alt="" width="16" height="14" />
            </button>
            {video && (
                <VideoModal
                    open={videoOpen}
                    onClose={() => setVideoOpen(false)}
                    src={video}
                    poster={image}
                />
            )}
            {isOpen && (
                <div
                    className='spot-backdrop pos-abs top-0 left-0 z-1'
                    onClick={() => setOpenIndex(null)}
                    aria-hidden='true'
                />
            )}
            {placedSpots.map((spot, i) => (
                <button
                    key={spot._key || i}
                    type='button'
                    className='spot-marker'
                    style={{ left: `${spot.point.x * 100}%`, top: `${spot.point.y * 100}%` }}
                    onClick={() => setOpenIndex(prev => prev === i ? null : i)}
                    aria-label={`Open spot ${i + 1}: ${spot.title || ""}`}
                >
                    {i + 1}
                </button>
            ))}
            {rendered && (
                <div
                    key={renderedIndex}
                    className={`spot-popup ${isOpen ? 'is-open' : 'is-closing'} p15 z-3 bg-solid-grey pos-abs bottom-30 left-30 radius-5 text-black flex flex-col gap-15`}
                    onAnimationEnd={() => { if (!isOpen) setRenderedIndex(null) }}
                >
                    <p className='h5'>{rendered.title}</p>
                    <div className='h4 max-300'>
                        <PortableText value={rendered.description} />
                    </div>
                </div>
            )}
        </div>
    )
}
