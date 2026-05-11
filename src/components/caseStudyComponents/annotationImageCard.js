"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { GrAdd } from "react-icons/gr"
import { RiExpandDiagonalSLine } from "react-icons/ri"
import { PortableText } from "next-sanity"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { useImageModal } from "../imageModalContext"

gsap.registerPlugin(useGSAP)

export default function AnnotationImage({ _key, image, video, title, annotation, variant = "normal" }) {
    const [isOpen, setIsOpen] = useState(false)
    const popupRef = useRef()
    const iconRef = useRef()
    const ctx = useImageModal()
    const handleOpen = () => ctx?.open(_key)

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

    if (!image) return null

    return (
        <div className={`variant-${variant} pos-rel ratio-3-4 max-full radius-15 overflow`}>
            <Image className='bg-image' src={image} alt='' width={1600} height={1000} />
            {video && <video className='bg-image' src={video} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
            <button className='button-secondary pos-abs top-30 left-30 z-5' onClick={handleOpen}>
                <RiExpandDiagonalSLine size={15} strokeWidth={.01} />
            </button>
            <div
                className='z-4 bg-solid-grey pos-abs top-30 right-30 radius-5 p5 text-black flex align-center justify-center annotation-toggle'
                style={{ cursor: 'pointer' }}
                onClick={() => setIsOpen(prev => !prev)}
            >
                <span ref={iconRef} className='flex'>
                    <GrAdd size={15} />
                </span>
            </div>
            <div
                ref={popupRef}
                className='p15 z-3 bg-solid-grey pos-abs top-30 right-30 radius-5 text-black flex flex-col gap-40 annotation-popup'
            >
                <p className='h5'>{title}</p>
                <div className='h4 max-300'>
                    <PortableText value={annotation} />
                </div>
            </div>
        </div>
    )
}
