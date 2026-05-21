"use client"

import Image from "next/image"
import { useImageModal } from "../imageModalContext"

export default function ImageCard({ _key, image, video, variant = "normal" }) {
    const ctx = useImageModal()
    if (!image) return null
    const handleOpen = () => ctx?.open(_key)
    return (
        <div className={`variant-${variant} image-shell pos-rel ratio-3-4 max-full radius-15 overflow`}>
            <button className="button-secondary lightbox-trigger pos-abs top-30 left-30 z-2" onClick={handleOpen}>
                <img src="/images/expand.svg" alt="" width="16" height="14" />
            </button>
            <Image className='bg-image' src={image} alt='' width={1600} height={1000} />
            {video && <video className='bg-image' src={video} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
        </div>
    )
}
