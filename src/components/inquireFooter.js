"use client"

import { useState } from "react"

export default function InquireFooter({ inquire, className = '' }) {
    const [addressHovered, setAddressHovered] = useState(false)
    return (
        <div className={`flex flex-col gap-15 m-pt10 m-pb20 ${className}`.trim()}>
            <div className='bg-grey pos-rel ratio-16-10 radius-15 overflow inquire-footer-image'>
                {inquire?.footerImage && <img className='bg-image' src={inquire.footerImage} alt='' />}
                {inquire?.footerVideo && <video className='bg-image' src={inquire.footerVideo} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
                <div className={`inquire-footer-hover${addressHovered ? ' is-active' : ''}`}>
                    {inquire?.locationImage && <img className='bg-image' src={inquire.locationImage} alt='' />}
                    {inquire?.locationVideo && <video className='bg-image' src={inquire.locationVideo} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <p
                    className="h5 pointer"
                    onMouseEnter={() => setAddressHovered(true)}
                    onMouseLeave={() => setAddressHovered(false)}
                    onFocus={() => setAddressHovered(true)}
                    onBlur={() => setAddressHovered(false)}
                >{inquire?.location}</p>
                <p className="h5 text-grey-5">{inquire?.copyright}</p>
            </div>
        </div>
    )
}
