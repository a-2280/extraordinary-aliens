"use client"

import { useState } from "react"
import { PortableText } from "@portabletext/react";
import { FaPlay } from "react-icons/fa"
import VideoModal from "@/components/videoModal"

const components = {
    marks: {
        textColor: ({ value, children }) => (
            <span style={{ color: value?.color }}>{children}</span>
        ),
    },
}

export default function Hero({ data, headerLinks }) {
    const [open, setOpen] = useState(false)
    const videoSrc = data?.videoModal?.video
    const bunnyVideoId = data?.videoModal?.bunnyVideoId
    const hasVideo = Boolean(videoSrc || bunnyVideoId)

    return (
        <div className='px30 pth h-75vh'>
            <div className='h-100  flex flex-col justify-center gap-20'>
                <div className='h1 max-950 fade--in' data-sal>
                    <PortableText value={data?.description} components={components} />
                </div>
                <a
                    href={data?.button?.url}
                    target={data?.button?.openInNewWindow ? "_blank" : undefined}
                    rel={data?.button?.openInNewWindow ? "noopener noreferrer" : undefined}
                    onClick={hasVideo ? (e) => { e.preventDefault(); setOpen(true) } : undefined}
                    className='button flex align-center fade--in delay-100'
                    data-sal
                >
                    <FaPlay className="icon" />
                    <p>{data?.button?.title}</p>
                </a>
            </div>
            {hasVideo && (
                <VideoModal
                    open={open}
                    onClose={() => setOpen(false)}
                    src={videoSrc}
                    bunnyVideoId={bunnyVideoId}
                    title={data?.videoModal?.title}
                    description={data?.videoModal?.description}
                    headerLinks={headerLinks}
                />
            )}
        </div>
    )
}
