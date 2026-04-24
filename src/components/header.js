"use client"

import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"

gsap.registerPlugin(useGSAP, MorphSVGPlugin)

const LEFT  = "M 5 0.5 L 1 4.5 L 5 8.5"
const RIGHT = "M 1 0.5 L 5 4.5 L 1 8.5"

export default function Header({ data }) {
    const [open, setOpen] = useState(true);
    const pathRef = useRef()

    function handleClick() {
        setOpen(!open)
        gsap.to(pathRef.current, {
            duration: .5,
            morphSVG: open ? RIGHT : LEFT,
            ease: "power2.inOut"
        })
    }

    return (
        <header className="p15 flex">
            <button
                className="bg-grey py8 px15 radius-5 f-nav flex gap-20 align-center shrink-0"
                onClick={handleClick}
            >
                Extraordinary Aliens
                <svg width="6" height="9" viewBox="0 0 6 9" fill="none">
                    <path
                        ref={pathRef}
                        d={LEFT}
                        stroke="rgba(15,15,15,1)"
                        strokeWidth="1.16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <ButtonList open={open} data={data} />
        </header>
    )
}

function ButtonList({ open, data }) {
    const containerRef = useRef();

    useGSAP(() => {
        gsap.to(containerRef.current.children, {
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
            xPercent: open ? 0 : -100,
            duration: 0.3,
            stagger: open ? .05 : { each: .05, from: "end" },
            ease: open ? "power2.out" : "power2.in"
        });
    }, { scope: containerRef, dependencies: [open] });

    return (
        <div ref={containerRef} className="overflow w-100 flex gap-3 pl3">
            {data?.links?.map((link, index) => (
                <div className="flex-1 bg-white radius-5 pos-rel" key={index} style={{ zIndex: data.links.length - index }}>
                    <div className="h5 bg-grey py8 px15 radius-5 flex gap-20 align-center">{link.title}</div>
                </div>
            ))}
        </div>
    );
}