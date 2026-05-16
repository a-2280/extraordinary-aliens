"use client"

import { PortableText } from "next-sanity"
import { useRef, useEffect } from "react"
import gsap from "gsap"

const NUM_GHOSTS = 6
const HALO_INDEX = 5

const LERP_REST = [0.11, 0.105, 0.10, 0.10, 0.095, 0.090]
const LERP_FAST = [0.16, 0.085, 0.050, 0.030, 0.018, 0.080]

const OPACITY_REST = [0.22, 0.10, 0.06, 0.030, 0.015, 0.060]
const OPACITY_FAST = [0.24, 0.18, 0.13, 0.090, 0.050, 0.180]

const BLUR_BASE = 60
const BLUR_BOOST_FAST = [0, 6, 12, 18, 24, 40]

const HALO_SCALE = [1, 1, 1, 1, 1, 1.6]

const DRIFT_AMP = 10
const DRIFT_FREQ_X = [0.00075, 0.00092, 0.00081, 0.00108, 0.00067, 0.00038]
const DRIFT_FREQ_Y = [0.00060, 0.00084, 0.00097, 0.00071, 0.00103, 0.00045]

const SPEED_TO_NORM = 0.45
const LEAD_STRETCH = 0.16

export default function Footer({ data }) {
    const containerRef = useRef(null)
    const glowsRef = useRef([])

    useEffect(() => {
        const container = containerRef.current
        const glows = glowsRef.current.filter(Boolean)
        if (!container || glows.length !== NUM_GHOSTS) return

        const target = { x: 0, y: 0 }
        const ghosts = glows.map(el => ({
            el,
            current: { x: 0, y: 0, r: 45 },
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
        }))

        const lerp = (a, b, t) => a + (b - a) * t

        let lastTargetX = 0
        let lastTargetY = 0
        let lastTime = performance.now()
        let speedSmoothed = 0
        let prevSpeedSmoothed = 0
        let flare = 0
        let envelope = 0
        let hovered = false
        let rafId

        ghosts.forEach(g => gsap.set(g.el, { xPercent: -50, yPercent: -50, rotation: 45, opacity: 0 }))

        const tick = () => {
            const now = performance.now()
            const dt = Math.max(now - lastTime, 1)
            lastTime = now

            const dvx = target.x - lastTargetX
            const dvy = target.y - lastTargetY
            const instSpeed = Math.sqrt(dvx * dvx + dvy * dvy) / dt
            lastTargetX = target.x
            lastTargetY = target.y
            speedSmoothed += (instSpeed - speedSmoothed) * 0.10

            const s = Math.min(speedSmoothed * SPEED_TO_NORM, 1)
            const rest = 1 - s

            const speedDelta = Math.max(0, speedSmoothed - prevSpeedSmoothed)
            prevSpeedSmoothed = speedSmoothed
            flare = Math.max(flare * 0.93, Math.min(speedDelta * 12, 1))

            envelope += ((hovered ? 1 : 0) - envelope) * 0.05

            ghosts.forEach((g, i) => {
                const lerpRate = lerp(LERP_REST[i], LERP_FAST[i], s)

                const driftX = rest * DRIFT_AMP * Math.sin(now * DRIFT_FREQ_X[i] + g.phaseX)
                const driftY = rest * DRIFT_AMP * Math.cos(now * DRIFT_FREQ_Y[i] + g.phaseY)
                const tx = target.x + driftX
                const ty = target.y + driftY

                const prevX = g.current.x
                const prevY = g.current.y
                g.current.x += (tx - g.current.x) * lerpRate
                g.current.y += (ty - g.current.y) * lerpRate
                const dx = g.current.x - prevX
                const dy = g.current.y - prevY
                if (i !== HALO_INDEX && (Math.abs(dx) > 0.15 || Math.abs(dy) > 0.15)) {
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI)
                    let delta = angle - (g.current.r % 360)
                    if (delta > 180) delta -= 360
                    if (delta < -180) delta += 360
                    g.current.r += delta * 0.10
                }

                const opacity = lerp(OPACITY_REST[i], OPACITY_FAST[i], s) * envelope * (1 + flare * 0.4)
                const blurPx = BLUR_BASE + s * BLUR_BOOST_FAST[i]
                const uniformScale = HALO_SCALE[i] * (1 + flare * 0.12)
                const stretchX = i === 0 ? (1 + s * LEAD_STRETCH) : 1

                gsap.set(g.el, {
                    x: g.current.x,
                    y: g.current.y,
                    rotation: g.current.r,
                    scaleX: uniformScale * stretchX,
                    scaleY: uniformScale,
                    opacity,
                    filter: `blur(${blurPx}px)`
                })
            })

            rafId = requestAnimationFrame(tick)
        }
        rafId = requestAnimationFrame(tick)

        const onEnter = () => { hovered = true }
        const onLeave = () => { hovered = false }
        const onMove = (e) => {
            const { left, top } = container.getBoundingClientRect()
            target.x = e.clientX - left
            target.y = e.clientY - top
        }

        container.addEventListener("mouseenter", onEnter)
        container.addEventListener("mouseleave", onLeave)
        container.addEventListener("mousemove", onMove)

        return () => {
            cancelAnimationFrame(rafId)
            container.removeEventListener("mouseenter", onEnter)
            container.removeEventListener("mouseleave", onLeave)
            container.removeEventListener("mousemove", onMove)
        }
    }, [])

    return (
        <div className='p15 h-100vh pth text-grey-6 m-pt15'>
            <div ref={containerRef} className='bg-black radius-15 h-100' style={{ position: "relative", overflow: "hidden" }}>
                {Array.from({ length: NUM_GHOSTS }).map((_, i) => (
                    <div key={i} ref={el => { glowsRef.current[i] = el }} className="footer-glow" style={{ opacity: 0 }} />
                ))}
                <div className='p35 h-100 flex flex-col space-between'>
                    <div className='h3 text-footer max-500'>
                        <PortableText value={data.caption} />
                    </div>
                    <div className='flex gap-100 m-flex-wrap m-gap-50 footer-detail-row'>
                        {data.details.map((detail, index) => (
                            <div className='flex flex-col gap-30 m-gap-15' key={index}>
                                <p className='h5'>{detail.title}</p>
                                <div className='text-grey-4 nowrap'>
                                    <PortableText value={detail.detail} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-10">
                        <p className='h5 footer-copyright'>{data.copyright}</p>
                        <div className='logo--footer' />
                    </div>
                </div>
            </div>
        </div>
    )
}
