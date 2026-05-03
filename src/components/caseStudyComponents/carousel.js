"use client"
import Image from "next/image"
import { useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

export default function Carousel({ images, variant = "normal" }) {
    const swiperRef = useRef(null)
    const cursorRef = useRef(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!images?.length) return null

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
            <div className={`variant-${variant}`}>
                <Swiper className={`variant-${variant} pos-rel radius-15 overflow`} slidesPerView={1} loop={images.length > 1} speed={500} spaceBetween={15} onSwiper={s => (swiperRef.current = s)} onSlideChange={s => setCurrentIndex(s.realIndex)}>
                    {images.map((src, i) => (
                        <SwiperSlide key={i} className='pos-rel ratio-3-4 max-full'>
                            <Image className='radius-15' src={src} alt='' fill sizes='(max-width: 768px) 100vw, 50vw' style={{ objectFit: "cover", objectPosition: "center" }} />
                        </SwiperSlide>
                    ))}
                    <div className='p5 radius-5 text-black pos-abs z-2 bg-grey top-30 right-30'>
                        {currentIndex + 1} / {images.length}
                    </div>
                    <div className='pos-abs top-0 left-0 w-100 h-100 cursor-none z-2' onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={handleClick} />
                </Swiper>
            </div>
        </>
    )
}
