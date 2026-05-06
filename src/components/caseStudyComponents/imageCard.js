"use client"

import Image from "next/image"
import { RiExpandDiagonalSLine } from "react-icons/ri"
import { useImageModal } from "../imageModalContext"

export default function ImageCard({ _key, image, variant = "normal" }) {
    const ctx = useImageModal()
    if (!image) return null
    const handleOpen = () => ctx?.open(_key)
    return (
        <div className={`variant-${variant} pos-rel ratio-3-4 max-full radius-15 overflow`}>
            <button className="button-secondary pos-abs top-30 left-30 z-2" onClick={handleOpen}>
                <RiExpandDiagonalSLine size={15} strokeWidth={.01} />
            </button>
            <Image className='bg-image' src={image} alt='' width={1600} height={1000} />
        </div>
    )
}
