"use client"
import Image from "next/image"
import { useRef, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { BsChevronRight, BsChevronLeft } from "react-icons/bs"
import Spacer from "../spacer"

export default function Approach({ items }) {
    const swiperRef = useRef(null)
    const [isBeginning, setIsBeginning] = useState(true)
    const [isEnd, setIsEnd] = useState(false)

    const syncTrailingOffset = s => {
        const lastWidth = s.slides[s.slides.length - 1]?.offsetWidth ?? 0
        s.params.slidesOffsetAfter = Math.max(0, s.width - lastWidth)
        s.update()
    }

    if (!items?.length) return null

    return (
        <>
            <div className='py30 pl80 flex flex-col gap-15'>
                <Swiper
                    slidesPerView='auto'
                    slidesPerGroup={1}
                    spaceBetween={15}
                    speed={650}
                    onSwiper={s => {
                        swiperRef.current = s
                        syncTrailingOffset(s)
                        setIsBeginning(s.isBeginning)
                        setIsEnd(s.isEnd)
                    }}
                    onResize={syncTrailingOffset}
                    onImagesReady={syncTrailingOffset}
                    onSlideChange={s => {
                        setIsBeginning(s.isBeginning)
                        setIsEnd(s.isEnd)
                    }}>
                    {items.map(item => (
                        <SwiperSlide className='max-750' key={item._key}>
                            <div className='p10 flex gap-30 bg-grey-2 radius-15'>
                                {item.image && (
                                    <div className='pos-rel ratio-1-1 max-200 overflow radius-10'>
                                        <Image className='bg-image' src={item.image} alt={item.title || ""} width={600} height={600} />
                                    </div>
                                )}
                                <div className='flex flex-col gap-20 fade--in' data-sal>
                                    <p className='h4'>{item.title}</p>
                                    <p className='f-20 text-grey-6 max-500'>{item.description}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className='flex gap-10 mt30'>
                    <button className={`p10 ${isBeginning ? "text-grey-4" : "text-grey-6"} bg-grey-2 radius-15`} aria-label='Previous' onClick={() => swiperRef.current?.slidePrev()}>
                        <BsChevronLeft size={15} />
                    </button>
                    <button className={`p10 ${isEnd ? "text-grey-4" : "text-grey-6"} bg-grey-2 radius-15`} aria-label='Next' onClick={() => swiperRef.current?.slideNext()}>
                        <BsChevronRight size={15} />
                    </button>
                </div>
            </div>
            <Spacer className='x2' />
        </>
    )
}
