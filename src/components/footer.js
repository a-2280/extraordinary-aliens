import { PortableText } from "next-sanity"
import React, { useRef, useEffect } from "react"
import gsap from "gsap"

export default function Footer({ data }) {
    const containerRef = useRef(null)
    const glowRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        const glow = glowRef.current

        const target = { x: 0, y: 0, r: 45 }
        const current = { x: 0, y: 0, r: 45 }
        let rafId

        gsap.set(glow, { xPercent: -50, yPercent: -50, rotation: 45 })

        const tick = () => {
            current.x += (target.x - current.x) * 0.05
            current.y += (target.y - current.y) * 0.05

            let rDelta = target.r - current.r
            if (rDelta > 180) rDelta -= 360
            if (rDelta < -180) rDelta += 360
            current.r += rDelta * 0.03

            gsap.set(glow, { x: current.x, y: current.y, rotation: current.r })

            rafId = requestAnimationFrame(tick)
        }
        rafId = requestAnimationFrame(tick)

        const onEnter = () => { gsap.to(glow, { opacity: 0.72, duration: 1.2, overwrite: "auto" }) }
        const onLeave = () => { gsap.to(glow, { opacity: 0, duration: 1.2, overwrite: "auto" }) }
        const onMove = (e) => {
            const { left, top } = container.getBoundingClientRect()
            const newX = e.clientX - left
            const newY = e.clientY - top

            const dx = newX - target.x
            const dy = newY - target.y

            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                const angle = Math.atan2(dy, dx) * (180 / Math.PI)
                let delta = angle - (target.r % 360)
                if (delta > 180) delta -= 360
                if (delta < -180) delta += 360
                target.r += Math.max(-8, Math.min(8, delta))
            }

            target.x = newX
            target.y = newY
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
        <div className='p15 h-100vh text-dark-grey'>
            <div ref={containerRef} className='bg-black radius-15 h-100' style={{ position: "relative", overflow: "hidden" }}>
                <div ref={glowRef} className="footer-glow" style={{ opacity: 0 }} />
                <div className='p35 h-100 flex flex-col space-between'>
                    <div className='h3 text-grey'>
                        <PortableText value={data.caption} />
                    </div>
                    <div className='flex gap-100'>
                        {data.details.map((detail, index) => (
                            <div className='flex flex-col gap-30' key={index}>
                                <p className='h5'>{detail.title}</p>
                                <div className='text-light-grey'>
                                    <PortableText value={detail.detail} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-20">
                        <p className='h5'>{data.copyright}</p>
                        <div className='logo--footer' />
                    </div>
                </div>
            </div>
        </div>
    )
}
