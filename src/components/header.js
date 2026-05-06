"use client"

import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { useLenis } from "lenis/react"
import Link from "next/link"

gsap.registerPlugin(useGSAP, MorphSVGPlugin)

const LEFT  = "M 5 0.5 L 1 4.5 L 5 8.5"
const RIGHT = "M 1 0.5 L 5 4.5 L 1 8.5"

export default function Header({ data, currentTitle }) {
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
        <header className='masthead p15 flex align-center text-black'>
            <button className='button-nav f-nav flex gap-20 align-center shrink-0' onClick={handleClick}>
                Extraordinary Aliens
                <svg width='6' height='9' viewBox='0 0 6 9' fill='none'>
                    <path ref={pathRef} d={LEFT} stroke='currentColor' strokeWidth='1.16' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
            </button>
            <ButtonList open={open} data={data} currentTitle={currentTitle} />
        </header>
    )
}

function ButtonList({ open, data, currentTitle }) {
    const containerRef = useRef();
    const scrollFillRef = useRef(null);
    const lenis = useLenis();

    useGSAP(() => {
        gsap.to(containerRef.current.children, {
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
            x: open ? 0 : -10,
            duration: 0.3,
            stagger: open ? .05 : { each: .08, from: "end" },
            ease: open ? "power2.out" : "power2.in",
        });
    }, { scope: containerRef, dependencies: [open] });

    useLenis(({ progress }) => {
        if (scrollFillRef.current) {
            scrollFillRef.current.style.setProperty('--scroll-progress', progress || 0)
        }
    });

    function scrub(e) {
        if (!lenis) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        lenis.scrollTo(fraction * lenis.limit, { immediate: true, force: true });
    }

    function handlePointerDown(e) {
        e.currentTarget.setPointerCapture(e.pointerId);
        scrub(e);
    }

    function handlePointerMove(e) {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) scrub(e);
    }

    return (
        <div ref={containerRef} className='overflow w-100 flex gap-3 pl3'>
            {currentTitle && (
                <div
                    ref={scrollFillRef}
                    className='flex-1 h5 button-case-study flex align-center space-between'
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                >
                    <p>{currentTitle}</p>
                </div>
            )}
            {data?.links?.map((link, index) => (
                <NavLink
                    key={index}
                    link={link}
                    showDot={!currentTitle}
                    className={`${currentTitle ? '' : 'flex-1 '}h5 button-nav flex align-center space-between`}
                    style={{ zIndex: data.links.length - index }}
                />
            ))}
        </div>
    )
}

function NavLink({ link, showDot, className, style }) {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef(null);

    function handleCopy(e) {
        e.preventDefault();
        navigator.clipboard?.writeText(link.url);
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), 1000);
    }

    return (
        <Link
            href={link.url}
            className={className}
            style={style}
            onClick={link.copyOnClick ? handleCopy : undefined}
        >
            <p>{copied ? "Copied" : link.title}</p>
            {showDot && <div className='dot' />}
        </Link>
    );
}