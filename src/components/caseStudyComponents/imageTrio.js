"use client"

import { useState } from "react"
import Image from "next/image"
import { useImageModal } from "../imageModalContext"
import VideoModal from "../videoModal"

function TrioItem({ item, ratioClass }) {
    const ctx = useImageModal()
    const [videoOpen, setVideoOpen] = useState(false)
    const handleTriggerClick = item.video ? () => setVideoOpen(true) : () => ctx?.open(item._key)
    return (
        <div className={`flex-1 min-w-0 image-shell pos-rel ${ratioClass} radius-15 overflow`}>
            <button className="button-secondary lightbox-trigger pos-abs top-30 left-30 z-2" onClick={handleTriggerClick}>
                <img src="/images/expand.svg" alt="" width="16" height="14" />
            </button>
            {item.image && <Image className='bg-image' src={item.image} alt='' width={1600} height={1000} />}
            {item.video && <video className='bg-image' src={item.video} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
            {item.video && (
                <VideoModal
                    open={videoOpen}
                    onClose={() => setVideoOpen(false)}
                    src={item.video}
                    poster={item.image}
                />
            )}
        </div>
    )
}

export default function ImageTrio({ items, aspect = "portrait", variant = "fullWidth" }) {
    if (!items?.length) return null
    const ratioClass = aspect === "landscape" ? "ratio-16-10" : "ratio-3-4"
    return (
        <div className={`variant-${variant} flex gap-15 m-flex-col`}>
            {items.slice(0, 3).map(it => {
                if (!it?.image && !it?.video) return null
                return <TrioItem key={it._key} item={it} ratioClass={ratioClass} />
            })}
        </div>
    )
}
