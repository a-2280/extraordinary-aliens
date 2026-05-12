"use client"
import Image from "next/image"
import { useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { PortableText } from "next-sanity"
import { RiExpandDiagonalSLine } from "react-icons/ri"
import { useImageModal } from "../imageModalContext"

export default function CaptionCarousel({ slides, variant = "normal" }) {
    const swiperRef = useRef(null)
    const cursorRef = useRef(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const ctx = useImageModal()

    if (!slides?.length) return null

    const activeCaption = slides[currentIndex]?.caption

    const handleOpen = e => {
        e.stopPropagation()
        const key = slides[currentIndex]?._key
        if (key) ctx?.open(key)
    }

    const handleMouseMove = e => {
        const { left, width } = e.currentTarget.getBoundingClientRect()
        const isLeft = e.clientX - left < width / 2
        const cursor = cursorRef.current
        if (!cursor) return
        cursor.classList.toggle("is-right", !isLeft)
        cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`
        cursor.style.opacity = "1"
    }

    const handleMouseLeave = () => {
        if (cursorRef.current) cursorRef.current.style.opacity = "0"
    }

    const handleClick = e => {
        const { left, width } = e.currentTarget.getBoundingClientRect()
        const isLeft = e.clientX - left < width / 2
        if (isLeft) swiperRef.current?.slidePrev()
        else swiperRef.current?.slideNext()
    }

    return (
        <>
            <div ref={cursorRef} className='custom-cursor-secondary'>
                <span className='label label-left'>Prev</span>
                <span className='label label-right'>Next</span>
            </div>
            <div className={`variant-${variant} caption-wrapper pos-rel`}>
                <div className='image-sticky-area pos-rel'>
                    <div className='image-shell pos-rel'>
                        <button className='button-secondary carousel-expand pos-abs top-30 left-30 z-3' onClick={handleOpen}>
                            <RiExpandDiagonalSLine size={15} strokeWidth={0.01} />
                        </button>
                        <Swiper className={`variant-${variant} pos-rel radius-15 overflow`} slidesPerView={1} loop={slides.length > 1} speed={500} spaceBetween={15} onSwiper={s => (swiperRef.current = s)} onSlideChange={s => setCurrentIndex(s.realIndex)}>
                            {slides.map((slide, i) => (
                                <SwiperSlide key={slide._key || i} className='pos-rel ratio-3-4 max-full'>
                                    {slide?.image && <Image className='radius-15' src={slide.image} alt='' fill sizes='(max-width: 768px) 100vw, 50vw' style={{ objectFit: "cover", objectPosition: "center" }} />}
                                    {slide?.video && <video className='radius-15' src={slide.video} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />}
                                </SwiperSlide>
                            ))}
                            <div className='p5 radius-5 text-black pos-abs z-2 bg-grey top-30 right-30 carousel-index'>
                                {currentIndex + 1} / {slides.length}
                            </div>
                            <div className='pos-abs top-0 left-0 w-100 h-100 cursor-none z-2' onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={handleClick} />
                        </Swiper>
                    </div>
                </div>
                {activeCaption?.length > 0 && (
                    <div className='h4 text-grey-4 p15 pb0 caption-row fade--in' data-sal>
                        <PortableText value={activeCaption} />
                    </div>
                )}
            </div>
        </>
    )
}
