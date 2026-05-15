"use client"

import { useRef } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { PortableText } from "@portabletext/react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import Spacer from "./spacer"
import { FaArrowRight } from "react-icons/fa6"

gsap.registerPlugin(useGSAP)

export default function Mission({ mission }) {
    const cardsRef = useRef()

    useGSAP(
        () => {
            const cards = cardsRef.current.querySelectorAll(".mission-card")

            cards.forEach(card => {
                const image = card.querySelector(".image")
                const wrap = card.querySelector(".swap-text-wrap")
                const caption = card.querySelector(".swap-caption")
                const description = card.querySelector(".swap-description")

                gsap.set(image, { filter: "blur(8px)", scale: 1.1 })

                const captionHeight = caption.offsetHeight
                const descriptionHeight = description.offsetHeight
                gsap.set(wrap, { height: captionHeight })

                const originalMaxWidth = gsap.getProperty(card, "maxWidth")
                let activeTl

                const onEnter = () => {
                    activeTl?.kill()
                    activeTl = gsap
                        .timeline({ defaults: { duration: 0.6, ease: "power2.out" } })
                        .to(card, { maxWidth: 350 }, 0)
                        .to(image, { filter: "blur(0px)", scale: 1 }, 0)
                        .to(wrap, { width: 310, height: descriptionHeight }, 0)
                        .to(caption, { opacity: 0 }, 0)
                        .to(description, { opacity: 1 }, 0)
                }

                const onLeave = () => {
                    activeTl?.kill()
                    activeTl = gsap
                        .timeline({ defaults: { duration: 0.6, ease: "power2.out" } })
                        .to(card, { maxWidth: originalMaxWidth }, 0)
                        .to(image, { filter: "blur(8px)", scale: 1.1 }, 0)
                        .to(wrap, { width: 260, height: captionHeight }, 0)
                        .to(caption, { opacity: 1 }, 0)
                        .to(description, { opacity: 0 }, 0)
                }

                card.addEventListener("mouseenter", onEnter)
                card.addEventListener("mouseleave", onLeave)
            })
        },
        { scope: cardsRef },
    )

    return (
        <div className='p15 m-pr0'>
            <Spacer />
            <div>
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
                <div className='h-650px flex justify-center pt60 m-hide'>
                    <div ref={cardsRef} className='flex align-center justify-center gap-15 fade--in' data-sal>
                        {mission?.missionCards?.map((card, index) => (
                            <div className='mission-card bg-grey radius-15 p20 max-300 flex flex-col gap-30' key={index}>
                                <div className='pos-rel ratio-1-1 overflow radius-5'>
                                    <img className='image bg-image' src={card.image} alt={card.title} />
                                </div>
                                <div className='flex flex-col gap-20'>
                                    <p className='h4'>{card.title}</p>
                                    <div className='swap-text-wrap'>
                                        <p className='h3 swap-text swap-caption text-grey-5'>{card.caption}</p>
                                        <p className='h3 swap-text swap-description text-grey-6'>{card.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='m-show pt60 fade--in m-pl15' data-sal>
                    <Swiper slidesPerView={1.1} spaceBetween={15} snapToSlideEdge={true}>
                        {mission?.missionCards?.map((card, index) => (
                            <SwiperSlide key={index}>
                                <div className='mission-card bg-grey radius-15 p20 flex flex-col gap-30'>
                                    <div className='pos-rel ratio-1-1 overflow radius-5'>
                                        <img className='image bg-image' src={card.image} alt={card.title} />
                                    </div>
                                    <div className='flex flex-col gap-20'>
                                        <p className='h4'>{card.title}</p>
                                        <p className='h3 text-grey-5'>{card.description}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            <Spacer />
        </div>
    )
}
