"use client"

import { useState } from "react"
import Image from "next/image"
import { useImageModal } from "../imageModalContext"
import VideoModal from "../videoModal"

export default function ImageCard({ _key, image, video, description, variant = "normal" }) {
    const ctx = useImageModal()
    const [videoOpen, setVideoOpen] = useState(false)
    if (!image && !video) return null
    const handleClick = video ? () => setVideoOpen(true) : () => ctx?.open(_key)
    return (
        <div className={`variant-${variant} image-shell pos-rel ratio-3-4 radius-15 overflow`}>
            <button className="button-secondary lightbox-trigger pos-abs top-30 left-30 z-2" onClick={handleClick}>
                <img src="/images/expand.svg" alt="" width="16" height="14" />
            </button>
            {image && <Image className='bg-image' src={image} alt='' width={1600} height={1000} />}
            {video && <video className='bg-image' src={video} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
            {video && (
                <VideoModal
                    open={videoOpen}
                    onClose={() => setVideoOpen(false)}
                    src={video}
                    poster={image}
                    description={description}
                />
            )}
        </div>
    )
}
