"use client"

import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { PortableText } from "@portabletext/react"
import Spacer from "./spacer"
import { FaArrowRight } from "react-icons/fa6"

gsap.registerPlugin(useGSAP)

export default function Mission({ mission }) {
    const cardsRef = useRef()
    const [hoveredIndex, setHoveredIndex] = useState(null)

    useGSAP(
        () => {
            const cards = cardsRef.current.querySelectorAll(".mission-card")

            cards.forEach(card => {
                const image = card.querySelector(".image")

                gsap.set(image, { filter: "blur(8px)", scale: 1.1 })

                const originalMaxWidth = gsap.getProperty(card, "maxWidth")
                let activeTl

                const onEnter = () => {
                    activeTl?.kill()
                    activeTl = gsap
                        .timeline({ defaults: { duration: 0.3, ease: "power2.out" } })
                        .to(card, { maxWidth: 350 }, 0)
                        .to(image, { filter: "blur(0px)", scale: 1 }, 0)
                }

                const onLeave = () => {
                    activeTl?.kill()
                    activeTl = gsap
                        .timeline({ defaults: { duration: 0.3, ease: "power2.out" } })
                        .to(card, { maxWidth: originalMaxWidth }, 0)
                        .to(image, { filter: "blur(8px)", scale: 1.1 }, 0)
                }

                card.addEventListener("mouseenter", onEnter)
                card.addEventListener("mouseleave", onLeave)
            })
        },
        { scope: cardsRef },
    )

    return (
        <div className='p15'>
            <Spacer />
            <div className='h-100vh'>
                <div className='b-1' data-sal />
                <div className='p15 flex flex-col gap-30 max-450'>
                    <p className='h5'>{mission?.title}</p>
                    <div className='h2 fade--in' data-sal>
                        <PortableText value={mission?.description} />
                    </div>
                    <a href={mission?.button?.url} target={mission?.button?.openInNewWindow ? "_blank" : undefined} rel={mission?.button?.openInNewWindow ? "noopener noreferrer" : undefined} className='button flex align-center fade--in delay-100' data-sal>
                        <FaArrowRight className='icon' />
                        <p>{mission?.button?.title}</p>
                    </a>
                </div>
                <div className='flex justify-center pt60'>
                    <div ref={cardsRef} className='flex align-center justify-center gap-15 fade--in' data-sal>
                        {mission?.missionCards?.map((card, index) => (
                            <div className='mission-card bg-grey radius-15 p20 max-300 flex flex-col gap-30' key={index} onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                                <div className='pos-rel ratio-1-1 overflow radius-5'>
                                    <img className='image bg-image' src={card.image} alt={card.title} />
                                </div>
                                <div className='flex flex-col gap-20'>
                                    <p className='h4'>{card.title}</p>
                                    <p className={`h3 ${hoveredIndex === index ? "text-grey-6" : "text-grey-5"}`}>{hoveredIndex === index ? card.description : card.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Spacer />
        </div>
    )
}
