"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { useLenis } from "lenis/react"
import Link from "next/link"

gsap.registerPlugin(MorphSVGPlugin)

const LEFT  = "M 5 0.5 L 1 4.5 L 5 8.5"
const RIGHT = "M 1 0.5 L 5 4.5 L 1 8.5"

export default function Header({ data, currentTitle }) {
    const [open, setOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const pathRef = useRef()

    useEffect(() => {
        if (window.matchMedia('(max-width: 768px)').matches) {
            setIsMobile(true)
            setOpen(false)
            gsap.set(pathRef.current, { attr: { d: RIGHT } })
        }
    }, [])

    function handleClick() {
        setOpen(!open)
        gsap.to(pathRef.current, {
            duration: .5,
            morphSVG: open ? RIGHT : LEFT,
            ease: "power2.inOut"
        })
    }

    return (
        <header className={`masthead p15 flex align-center text-black m-flex-col m-gap-3${currentTitle ? ' is-case-study' : ''}`}>
            <button className='button-nav f-nav flex gap-20 align-center shrink-0 m-w-100 m-space-between' onClick={handleClick}>
                Extraordinary Aliens
                <svg width='6' height='9' viewBox='0 0 6 9' fill='none'>
                    <path ref={pathRef} d={LEFT} stroke='currentColor' strokeWidth='1.16' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
            </button>
            <ButtonList open={open} data={data} currentTitle={currentTitle} isMobile={isMobile} onToggle={handleClick} />
        </header>
    )
}

function ButtonList({ open, data, currentTitle, isMobile, onToggle }) {
    const containerRef = useRef();
    const scrollFillRef = useRef(null);
    const scrubberPathRef = useRef(null);
    const lenis = useLenis();
    const mobileToggle = isMobile && !!currentTitle;

    useGSAP(() => {
        const children = Array.from(containerRef.current.children);
        const targets = mobileToggle
            ? children.filter(c => !c.classList.contains('button-case-study'))
            : children;
        gsap.to(targets, {
            opacity: open ? 1 : 0,
            pointerEvents: open ? "auto" : "none",
            x: open ? 0 : -10,
            duration: 0.3,
            stagger: open ? .05 : { each: .08, from: "end" },
            ease: open ? "power2.out" : "power2.in",
            overwrite: true,
        });
    }, { scope: containerRef, dependencies: [open, mobileToggle] });

    useGSAP(() => {
        if (!mobileToggle || !scrubberPathRef.current) return;
        gsap.to(scrubberPathRef.current, {
            duration: .5,
            morphSVG: open ? LEFT : RIGHT,
            ease: "power2.inOut"
        });
    }, { dependencies: [open, mobileToggle] });

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
        if (mobileToggle) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        scrub(e);
    }

    function handlePointerMove(e) {
        if (mobileToggle) return;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) scrub(e);
    }

    function handleScrubberClick() {
        if (mobileToggle) onToggle();
    }

    return (
        <div ref={containerRef} className='overflow w-100 flex gap-3 pl3 m-flex-col m-pl0'>
            {currentTitle && (
                <div
                    ref={scrollFillRef}
                    className='flex-1 h5 button-case-study flex align-center space-between'
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onClick={handleScrubberClick}
                >
                    <p>{currentTitle}</p>
                    <svg className='scrubber-chevron' width='6' height='9' viewBox='0 0 6 9' fill='none'>
                        <path ref={scrubberPathRef} d={RIGHT} stroke='currentColor' strokeWidth='1.16' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
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
            <p className="nowrap">{copied ? "Copied" : link.title}</p>
            {showDot && <div className='dot' />}
        </Link>
    );
}
