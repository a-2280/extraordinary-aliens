"use client"

import { useContext, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { FaVolumeMute, FaVolumeUp, FaExpand, FaCompress } from "react-icons/fa"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { HeaderTitleContext } from "@/layouts/layout"

gsap.registerPlugin(useGSAP, MorphSVGPlugin)

const PLAY_D = "M3 2 L22 12 L3 22 Z"
const PAUSE_D = "M3 2 H9 V22 H3 Z M15 2 H21 V22 H15 Z"

export default function VideoModal({ open, onClose, src, title, description }) {
    const [mounted, setMounted] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const videoRef = useRef(null)
    const frameRef = useRef(null)
    const trackRef = useRef(null)
    const pathRef = useRef(null)
    const draggingRef = useRef(false)
    const { setOverride } = useContext(HeaderTitleContext)

    useEffect(() => { setMounted(true) }, [])

    useEffect(() => {
        if (!open) return
        const onKey = e => {
            if (e.key !== "Escape") return
            if (document.fullscreenElement) return
            onClose()
        }
        document.addEventListener("keydown", onKey)
        document.documentElement.classList.add("no-scroll")
        return () => {
            document.removeEventListener("keydown", onKey)
            document.documentElement.classList.remove("no-scroll")
        }
    }, [open, onClose])

    useEffect(() => {
        if (!open || !title) return
        setOverride(title)
        return () => setOverride(null)
    }, [open, title, setOverride])

    useEffect(() => {
        if (!open) return
        const el = videoRef.current
        if (!el) return
        const onPlay = () => setIsPlaying(true)
        const onPause = () => setIsPlaying(false)
        const onTime = () => setCurrentTime(el.currentTime)
        const onMeta = () => setDuration(el.duration)
        const onVolume = () => setIsMuted(el.muted)
        if (el.readyState >= 1 && Number.isFinite(el.duration)) setDuration(el.duration)
        setIsMuted(el.muted)
        el.addEventListener("play", onPlay)
        el.addEventListener("pause", onPause)
        el.addEventListener("ended", onPause)
        el.addEventListener("timeupdate", onTime)
        el.addEventListener("loadedmetadata", onMeta)
        el.addEventListener("durationchange", onMeta)
        el.addEventListener("volumechange", onVolume)
        return () => {
            el.removeEventListener("play", onPlay)
            el.removeEventListener("pause", onPause)
            el.removeEventListener("ended", onPause)
            el.removeEventListener("timeupdate", onTime)
            el.removeEventListener("loadedmetadata", onMeta)
            el.removeEventListener("durationchange", onMeta)
            el.removeEventListener("volumechange", onVolume)
        }
    }, [open])

    useEffect(() => {
        const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
        document.addEventListener("fullscreenchange", onFsChange)
        return () => document.removeEventListener("fullscreenchange", onFsChange)
    }, [])

    useGSAP(() => {
        if (!pathRef.current) return
        gsap.to(pathRef.current, {
            morphSVG: isPlaying ? PAUSE_D : PLAY_D,
            duration: 0.3,
            ease: "power2.inOut",
        })
    }, { dependencies: [isPlaying, mounted, open] })

    if (!mounted || !open) return null

    const togglePlay = () => {
        const el = videoRef.current
        if (!el) return
        if (el.paused) el.play()
        else el.pause()
    }

    const toggleMute = () => {
        const el = videoRef.current
        if (!el) return
        el.muted = !el.muted
    }

    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else if (frameRef.current) {
            frameRef.current.requestFullscreen()
        }
    }

    const seekFromEvent = e => {
        const el = videoRef.current
        const track = trackRef.current
        if (!el || !track || !Number.isFinite(el.duration)) return
        const rect = track.getBoundingClientRect()
        const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
        el.currentTime = ratio * el.duration
    }

    const onTrackPointerDown = e => {
        e.stopPropagation()
        draggingRef.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        seekFromEvent(e)
    }

    const onTrackPointerMove = e => {
        if (!draggingRef.current) return
        seekFromEvent(e)
    }

    const onTrackPointerUp = e => {
        draggingRef.current = false
        try { e.currentTarget.releasePointerCapture(e.pointerId) } catch {}
    }

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0
    const stop = e => e.stopPropagation()

    return createPortal(
        <div className='video-modal' onClick={onClose}>
            <div ref={frameRef} className='video-modal__frame radius-15 overflow' onClick={stop}>
                <video
                    ref={videoRef}
                    src={src}
                    autoPlay
                    muted
                    playsInline
                    onClick={togglePlay}
                />
                <div className='video-modal__controls' onClick={stop}>
                    <button className='video-modal__btn' onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
                        <svg width='12' height='12' viewBox='0 0 24 24' fill='currentColor'>
                            <path ref={pathRef} d={PLAY_D} />
                        </svg>
                    </button>
                    <div
                        ref={trackRef}
                        className='video-modal__progress'
                        onPointerDown={onTrackPointerDown}
                        onPointerMove={onTrackPointerMove}
                        onPointerUp={onTrackPointerUp}
                        onPointerCancel={onTrackPointerUp}
                    >
                        <div className='video-modal__progress-fill' style={{ width: `${progress}%` }} />
                    </div>
                    <button className='video-modal__btn' onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
                        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                    <button className='video-modal__btn' onClick={toggleFullscreen} aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}>
                        {isFullscreen ? <FaCompress /> : <FaExpand />}
                    </button>
                </div>
            </div>
            {(title || description) && (
                <div className='video-modal__caption bg-grey radius-5 p15 flex flex-col gap-5' onClick={stop}>
                    {title && <p className='h5'>{title}</p>}
                    {description && <p className="h4">{description}</p>}
                </div>
            )}
        </div>,
        document.body,
    )
}
