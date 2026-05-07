import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

export default function SpecialProjects({ specialProjects }) {
    const cursorRef = useRef(null)

    const handleMouseMove = e => {
        const cursor = cursorRef.current
        cursor.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`
        cursor.style.opacity = "1"
    }

    const handleMouseLeave = () => {
        cursorRef.current.style.opacity = "0"
    }

    return (
        <div className='p15'>
            <div ref={cursorRef} className='custom-cursor'>
                <span className='label label-left'>Explore Special Projects</span>
            </div>
            <div className='b-1' data-sal />
            <p className='p15 pb60 h5'>{specialProjects?.title}</p>
            <div className='bg-grey pos-rel ratio-16-9 max-full radius-15 overflow'>
                <p className='f-20 max-450 text-center text-white pos-abs center-abs z-2 fade--in m-h4' data-sal>{specialProjects?.description}</p>
                <Image className='bg-image' width={1184} height={740} src={specialProjects?.image} alt='' />
                <Link href='/special-projects' className='pos-abs top-0 left-0 w-100 h-100 cursor-none z-2' onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />
            </div>
        </div>
    )
}
