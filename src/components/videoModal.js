"use client"

import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { PortableText } from "next-sanity"
import { FaVolumeMute, FaVolumeUp, FaExpand, FaCompress } from "react-icons/fa"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { HeaderTitleContext } from "@/layouts/layout"
import { runNavSwap } from "@/components/pageTransition"
import { bunnyHlsUrl, bunnyThumbUrl } from "@/utils/bunny"

gsap.registerPlugin(useGSAP, MorphSVGPlugin)

const PLAY_D = "M3 2 L22 12 L3 22 Z"
const PAUSE_D = "M3 2 H9 V22 H3 Z M15 2 H21 V22 H15 Z"
const ENTER_DURATION = 0.3
const EXIT_DURATION = 0.25

function prefersReducedMotion() {
    if (typeof window === "undefined" || !window.matchMedia) return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export default function VideoModal({ open, onClose, src, poster, title, description, bunnyVideoId }) {
    const hlsSrc = bunnyVideoId ? bunnyHlsUrl(bunnyVideoId) : null
    const posterSrc = poster || (bunnyVideoId ? bunnyThumbUrl(bunnyVideoId) : undefined)
    const [mounted, setMounted] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const [visible, setVisible] = useState(false)
    const overlayRef = useRef(null)
    const videoRef = useRef(null)
    const frameRef = useRef(null)
    const captionRef = useRef(null)
    const trackRef = useRef(null)
    const pathRef = useRef(null)
    const draggingRef = useRef(false)
    const navSwapCancelRef = useRef(null)
    const { setOverride } = useContext(HeaderTitleContext)

    useEffect(() => { setMounted(true) }, [])

    useLayoutEffect(() => {
        if (open) setVisible(true)
    }, [open])

    useGSAP(() => {
        if (!visible) return
        const overlay = overlayRef.current
        const frame = frameRef.current
        const caption = captionRef.current
        if (!overlay) return

        const reduced = prefersReducedMotion()

        if (open) {
            gsap.set(overlay, { opacity: 0 })
            if (frame) gsap.set(frame, { opacity: 0, scale: 0.96 })
            if (caption) gsap.set(caption, { opacity: 0 })
            if (reduced) {
                gsap.set(overlay, { opacity: 1 })
                if (frame) gsap.set(frame, { opacity: 1, scale: 1 })
                if (caption) gsap.set(caption, { opacity: 1 })
                return
            }
            const tl = gsap.timeline()
            tl.to(overlay, { opacity: 1, duration: ENTER_DURATION, ease: "power2.out" }, 0)
            if (frame) tl.to(frame, { opacity: 1, scale: 1, duration: ENTER_DURATION, ease: "power2.out" }, 0)
            if (caption) tl.to(caption, { opacity: 1, duration: ENTER_DURATION, ease: "power2.out" }, 0)
            return () => { tl.kill() }
        }

        if (reduced) {
            setVisible(false)
            return
        }
        const tl = gsap.timeline({ onComplete: () => setVisible(false) })
        tl.to(overlay, { opacity: 0, duration: EXIT_DURATION, ease: "power2.in" }, 0)
        if (frame) tl.to(frame, { opacity: 0, scale: 0.96, duration: EXIT_DURATION, ease: "power2.in" }, 0)
        if (caption) tl.to(caption, { opacity: 0, duration: EXIT_DURATION, ease: "power2.in" }, 0)
        return () => { tl.kill() }
    }, { dependencies: [open, visible] })

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
        if (navSwapCancelRef.current) navSwapCancelRef.current()
        navSwapCancelRef.current = runNavSwap(() => setOverride(title))
        return () => {
            if (navSwapCancelRef.current) navSwapCancelRef.current()
            navSwapCancelRef.current = runNavSwap(() => setOverride(null))
        }
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
        const onReady = () => setIsReady(true)
        const onWaiting = () => setIsReady(false)
        if (el.readyState >= 1 && Number.isFinite(el.duration)) setDuration(el.duration)
        if (el.readyState >= 3) setIsReady(true)
        setIsMuted(el.muted)
        el.addEventListener("play", onPlay)
        el.addEventListener("pause", onPause)
        el.addEventListener("ended", onPause)
        el.addEventListener("timeupdate", onTime)
        el.addEventListener("loadedmetadata", onMeta)
        el.addEventListener("durationchange", onMeta)
        el.addEventListener("volumechange", onVolume)
        el.addEventListener("canplay", onReady)
        el.addEventListener("playing", onReady)
        el.addEventListener("waiting", onWaiting)
        return () => {
            el.removeEventListener("play", onPlay)
            el.removeEventListener("pause", onPause)
            el.removeEventListener("ended", onPause)
            el.removeEventListener("timeupdate", onTime)
            el.removeEventListener("loadedmetadata", onMeta)
            el.removeEventListener("durationchange", onMeta)
            el.removeEventListener("volumechange", onVolume)
            el.removeEventListener("canplay", onReady)
            el.removeEventListener("playing", onReady)
            el.removeEventListener("waiting", onWaiting)
            setIsReady(false)
        }
    }, [open])

    useEffect(() => {
        const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
        document.addEventListener("fullscreenchange", onFsChange)
        return () => document.removeEventListener("fullscreenchange", onFsChange)
    }, [])

    // Attach the Bunny HLS stream for long-form video. Safari plays HLS natively;
    // other browsers get hls.js (lazy-loaded so it's not in the main bundle).
    useEffect(() => {
        if (!open || !hlsSrc) return
        const el = videoRef.current
        if (!el) return
        if (el.canPlayType("application/vnd.apple.mpegurl")) {
            el.src = hlsSrc
            return
        }
        let hls
        let cancelled = false
        import("hls.js").then(({ default: Hls }) => {
            if (cancelled) return
            const node = videoRef.current
            if (!node) return
            if (Hls.isSupported()) {
                hls = new Hls()
                hls.loadSource(hlsSrc)
                hls.attachMedia(node)
            } else {
                node.src = hlsSrc
            }
        })
        return () => {
            cancelled = true
            if (hls) hls.destroy()
        }
    }, [open, hlsSrc])

    useGSAP(() => {
        if (!pathRef.current) return
        gsap.to(pathRef.current, {
            morphSVG: isPlaying ? PAUSE_D : PLAY_D,
            duration: 0.3,
            ease: "power2.inOut",
        })
    }, { dependencies: [isPlaying, mounted, open] })

    if (!mounted || (!open && !visible)) return null

    const togglePlay = () => {
        const el = videoRef.current
        if (!el) return
        if (el.paused) {
            const p = el.play()
            if (p && typeof p.catch === "function") p.catch(() => {})
        } else {
            el.pause()
        }
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
        <div ref={overlayRef} className='video-modal' onClick={onClose}>
            <div ref={frameRef} className='video-modal__frame radius-15 overflow' onClick={stop}>
                <video
                    ref={videoRef}
                    src={hlsSrc ? undefined : src}
                    poster={posterSrc}
                    autoPlay
                    muted
                    playsInline
                    preload='auto'
                    onClick={togglePlay}
                />
                {!isReady && <div className='video-modal__spinner' aria-hidden='true' />}
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
                <div ref={captionRef} className='video-modal__caption bg-grey radius-5 p15 flex flex-col gap-5' onClick={stop}>
                    {title && <p className='h5'>{title}</p>}
                    {description && (
                        Array.isArray(description)
                            ? <div className='h4'><PortableText value={description} /></div>
                            : <p className='h4'>{description}</p>
                    )}
                </div>
            )}
        </div>,
        document.body,
    )
}
