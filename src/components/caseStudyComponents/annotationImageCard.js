"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { GrAdd } from "react-icons/gr"
import { PortableText } from "next-sanity"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useImageModal } from "../imageModalContext"
import VideoModal from "../videoModal"

gsap.registerPlugin(useGSAP)

export default function AnnotationImage({ _key, image, video, title, annotation, variant = "normal" }) {
    const [isOpen, setIsOpen] = useState(false)
    const [videoOpen, setVideoOpen] = useState(false)
    const popupRef = useRef()
    const iconRef = useRef()
    const ctx = useImageModal()
    const handleTriggerClick = video ? () => setVideoOpen(true) : () => ctx?.open(_key)

    useGSAP(() => {
        gsap.set(popupRef.current, { autoAlpha: 0 })
    }, [])

    useGSAP(() => {
        gsap.to(popupRef.current, {
            autoAlpha: isOpen ? 1 : 0,
            duration: 0.3,
            ease: "power2.inOut",
        })
        gsap.to(iconRef.current, {
            rotation: isOpen ? 45 : 0,
            duration: 0.3,
            ease: "power2.inOut",
            transformOrigin: "50% 50%",
        })
    }, { dependencies: [isOpen] })

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
                    title={title}
                    description={annotation}
                />
            )}
            <div className={`z-4 bg-solid-grey pos-abs top-30 right-30 radius-5 p8 text-black flex align-center justify-center annotation-toggle${isOpen ? " is-open" : ""}`} style={{ cursor: "pointer" }} onClick={() => setIsOpen(prev => !prev)}>
                <span ref={iconRef} className='flex'>
                    <GrAdd size={15} />
                </span>
            </div>
            <div ref={popupRef} className='p15 z-3 bg-solid-grey pos-abs top-30 right-30 radius-5 text-black flex flex-col gap-40 annotation-popup'>
                <p className='h5'>{title}</p>
                <div className='h4 max-300'>
                    <PortableText value={annotation} />
                </div>
            </div>
        </div>
    )
}
