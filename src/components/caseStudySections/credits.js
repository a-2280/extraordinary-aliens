'use client'
import { useRef, useState } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import Spacer from "../spacer"

export default function Credits({ title, description, credits, tags }) {
    const [open, setOpen] = useState(false)
    const [hoveredKey, setHoveredKey] = useState(null)
    const [lastImage, setLastImage] = useState(null)
    const [lastAlt, setLastAlt] = useState("")
    const verticalRef = useRef(null)
    const creditsRef = useRef(null)
    const mobileCreditsRef = useRef(null)
    const imageRef = useRef(null)

    useGSAP(() => {
        gsap.to(verticalRef.current, {
            scaleY: open ? 0 : 1,
            duration: 0.3,
            ease: "power2.inOut",
            transformOrigin: "center center",
        })
        gsap.to(creditsRef.current, {
            autoAlpha: open ? 1 : 0,
            duration: 0.4,
            ease: "power2.inOut",
        })
        gsap.to(mobileCreditsRef.current, {
            height: open ? "auto" : 0,
            autoAlpha: open ? 1 : 0,
            duration: 0.4,
            ease: "power2.inOut",
        })
    }, [open])

    useGSAP(() => {
        if (!imageRef.current) return
        gsap.to(imageRef.current, {
            autoAlpha: hoveredKey ? 1 : 0,
            duration: 0.4,
            ease: "power2.inOut",
        })
    }, [hoveredKey, lastImage])

    return (
        <div className='case-study-credits pt90'>
            <div className='flex m-flex-col m-gap-50'>
                <div className='flex-1 flex flex-col gap-20'>
                    <p className='h5 fade--in' data-sal>
                        {title}
                    </p>
                    <p className='f-20 text-grey-4 max-400 fade--in delay-100 credits-text' data-sal>
                        {description}
                    </p>
                </div>
                <div className='flex-1 flex space-between'>
                    <div className='flex gap-100'>
                        <div className='flex flex-col gap-30'>
                            <div className='flex flex-col gap-15 fade--in' data-sal>
                                {tags?.length > 0 && <p className='h4 w-100 max-200'>{tags.map(tag => tag.name).join(", ")}</p>}
                                <p className='h4 text-grey-4 credits-text'>Extraordinary Aliens</p>
                            </div>
                            <div ref={mobileCreditsRef} className='flex flex-col gap-40 m-show' style={{ height: 0, overflow: "hidden", opacity: 0, visibility: "hidden" }}>
                                {credits?.map(credit => (
                                    <div className='h4 flex flex-col gap-10' key={credit._key}>
                                        <p>{credit.title}</p>
                                        <div>
                                            {credit.creditInfo?.map(info => (
                                                <p
                                                    className='text-grey-4 credits-text pointer'
                                                    key={info._key}
                                                    onMouseEnter={() => {
                                                        if (!info.image) return
                                                        setHoveredKey(info._key)
                                                        setLastImage(info.image)
                                                        setLastAlt(info.credit || "")
                                                    }}
                                                    onMouseLeave={() => setHoveredKey(null)}>
                                                    {info.credit}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className='bg-grey-2 w-fit p8 radius-5 credits-toggle' onClick={() => setOpen(!open)}>
                                <svg width='15' height='15' viewBox='0 0 15 15'>
                                    <line x1='1' y1='7.5' x2='14' y2='7.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                                    <line ref={verticalRef} x1='7.5' y1='1' x2='7.5' y2='14' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                                </svg>
                            </button>
                        </div>
                        <div ref={creditsRef} className='flex flex-col gap-40 m-hide' style={{ opacity: 0, visibility: "hidden" }}>
                            {credits?.map(credit => (
                                <div className='h4 flex flex-col gap-10' key={credit._key}>
                                    <p>{credit.title}</p>
                                    <div>
                                        {credit.creditInfo?.map(info => (
                                            <p
                                                className='text-grey-4 credits-text pointer'
                                                key={info._key}
                                                onMouseEnter={() => {
                                                    if (!info.image) return
                                                    setHoveredKey(info._key)
                                                    setLastImage(info.image)
                                                    setLastAlt(info.credit || "")
                                                }}
                                                onMouseLeave={() => setHoveredKey(null)}>
                                                {info.credit}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div ref={imageRef} className='ratio-3-4 bg-grey radius-5 max-100 self-start pos-rel overflow' style={{ opacity: 0, visibility: "hidden" }}>
                        {lastImage && <Image className='bg-image' src={lastImage} alt={lastAlt} width={1600} height={1000} />}
                    </div>
                </div>
            </div>
        </div>
    )
}
