"use client"

import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"

gsap.registerPlugin(useGSAP, MorphSVGPlugin)

const PLAY_D = "M3 2 L22 12 L3 22 Z"
const PAUSE_D = "M3 2 H9 V22 H3 Z M15 2 H21 V22 H15 Z"

export default function AudioPlayer({ title, description }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const pathRef = useRef()

    useGSAP(() => {
        gsap.to(pathRef.current, {
            morphSVG: isPlaying ? PAUSE_D : PLAY_D,
            duration: 0.3,
            ease: "power2.inOut",
        })
    }, { dependencies: [isPlaying] })

    return (
        <div className="ratio-3-4 max-full flex flex-col space-between">
            <p className="f-20 text-grey-4 max-450">{description}</p>
            <div className='bg-grey-2 radius-15 p30 flex flex-col gap-40'>
                <div className='flex align-center gap-20 space-between'>
                    <p className='uppercase'>{title}</p>
                    <div className='flex gap-15 align-center'>
                        <p>0:35 / 2:17</p>
                        <button className='audio-button' onClick={() => setIsPlaying(p => !p)}>
                            <svg width='10' height='10' viewBox='0 0 24 24' fill='currentColor'>
                                <path ref={pathRef} d={PLAY_D} />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className='scrubber' />
            </div>
        </div>
    )
}
