"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"

gsap.registerPlugin(useGSAP, MorphSVGPlugin)

const PLAY_D = "M3 2 L22 12 L3 22 Z"
const PAUSE_D = "M3 2 H9 V22 H3 Z M15 2 H21 V22 H15 Z"

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00"
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
}

export default function AudioPlayer({ title, description, audio }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const pathRef = useRef()
    const audioRef = useRef()

    useGSAP(() => {
        gsap.to(pathRef.current, {
            morphSVG: isPlaying ? PAUSE_D : PLAY_D,
            duration: 0.3,
            ease: "power2.inOut",
        })
    }, { dependencies: [isPlaying] })

    useEffect(() => {
        const el = audioRef.current
        if (!el) return
        el.volume = 0.5
        const onPlay = () => setIsPlaying(true)
        const onPause = () => setIsPlaying(false)
        const onTime = () => setCurrentTime(el.currentTime)
        const onMeta = () => setDuration(el.duration)
        if (el.readyState >= 1 && Number.isFinite(el.duration)) {
            setDuration(el.duration)
        }
        el.addEventListener("play", onPlay)
        el.addEventListener("pause", onPause)
        el.addEventListener("ended", onPause)
        el.addEventListener("timeupdate", onTime)
        el.addEventListener("loadedmetadata", onMeta)
        el.addEventListener("durationchange", onMeta)
        return () => {
            el.removeEventListener("play", onPlay)
            el.removeEventListener("pause", onPause)
            el.removeEventListener("ended", onPause)
            el.removeEventListener("timeupdate", onTime)
            el.removeEventListener("loadedmetadata", onMeta)
            el.removeEventListener("durationchange", onMeta)
        }
    }, [])

    const toggle = () => {
        const el = audioRef.current
        if (!el) return
        if (el.paused) el.play()
        else el.pause()
    }

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0

    return (
        <div className='ratio-3-4 flex flex-col space-between'>
            <div className='m-show h-100 flex felx-col align-center'>
                <p className='f-20 text-grey-4 max-450 m-pb15'>{description}</p>
            </div>
            <p className='f-20 text-grey-4 max-450 m-hide'>{description}</p>
            <div className='bg-grey-2 radius-15 p30 flex flex-col gap-40 audio-player'>
                <div className='flex align-start gap-20 space-between'>
                    <p className='uppercase'>{title}</p>
                    <div className='flex gap-15 align-center mt-5'>
                        <p className='nowrap'>
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </p>
                        <button className='audio-button' onClick={toggle}>
                            <svg width='10' height='10' viewBox='0 0 24 24' fill='currentColor'>
                                <path ref={pathRef} d={PLAY_D} />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className='scrubber'>
                    <div className='scrubber-fill' style={{ width: `${progress}%` }} />
                </div>
            </div>
            <audio ref={audioRef} src={audio} preload='metadata' />
        </div>
    )
}
