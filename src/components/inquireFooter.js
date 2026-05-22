"use client"

import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export default function InquireFooter({ inquire, className = '' }) {
    const [addressHovered, setAddressHovered] = useState(false)
    const desktopTileRef = useRef()
    const hoverTlRef = useRef()

    useGSAP(() => {
        if (!desktopTileRef.current) return
        gsap.set(desktopTileRef.current, { autoAlpha: 0, y: 20 })
        hoverTlRef.current = gsap.timeline({ paused: true }).to(desktopTileRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
        })
    }, [])

    useGSAP(() => {
        const tl = hoverTlRef.current
        if (!tl) return
        if (addressHovered) tl.play()
        else tl.reverse()
    }, [addressHovered])

    return (
        <div className={`flex flex-col gap-15 m-pt10 m-pb20 ${className}`.trim()}>
            <div className='m-show bg-grey pos-rel ratio-16-10 radius-15 overflow inquire-footer-image'>
                {inquire?.footerImage && <img className='bg-image' src={inquire.footerImage} alt='' />}
                {inquire?.footerVideo && <video className='bg-image' src={inquire.footerVideo} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
                <div className={`inquire-footer-hover${addressHovered ? " is-active" : ""}`}>
                    {inquire?.locationImage && <img className='bg-image' src={inquire.locationImage} alt='' />}
                    {inquire?.locationVideo && <video className='bg-image' src={inquire.locationVideo} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
                </div>
            </div>
            <div className="m-hide">
                <div ref={desktopTileRef} className='bg-grey pos-rel ratio-16-10 radius-15 overflow inquire-hover-image' style={{ opacity: 0, visibility: 'hidden' }}>
                    {inquire?.locationImage && <img className='bg-image' src={inquire.locationImage} alt='' />}
                    {inquire?.locationVideo && <video className='bg-image' src={inquire.locationVideo} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
                </div>
            </div>
            <div className='flex flex-col gap-3'>
                <p className='h5' onMouseEnter={() => setAddressHovered(true)} onMouseLeave={() => setAddressHovered(false)} onFocus={() => setAddressHovered(true)} onBlur={() => setAddressHovered(false)}>
                    {inquire?.location}
                </p>
                <p className='h5 text-grey-5'>{inquire?.copyright}</p>
            </div>
        </div>
    )
}
