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
    const progressEndRef = useRef(null);
    const lenis = useLenis();
    const mobileToggle = isMobile && !!currentTitle;

    useEffect(() => {
        if (!currentTitle) {
            progressEndRef.current = null;
            return;
        }
        let raf = 0;
        function measure() {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const el = document.querySelector('.case-study-credits');
                progressEndRef.current = el ? el.getBoundingClientRect().top + window.scrollY : null;
            });
        }
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(document.body);
        window.addEventListener('load', measure);
        return () => {
            ro.disconnect();
            window.removeEventListener('load', measure);
            cancelAnimationFrame(raf);
        };
    }, [currentTitle]);

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

    useLenis(({ scroll, progress }) => {
        if (!scrollFillRef.current) return;
        const end = progressEndRef.current;
        const value = end && end > 0 ? Math.min(1, Math.max(0, scroll / end)) : (progress || 0);
        scrollFillRef.current.style.setProperty('--scroll-progress', value);
    });

    function scrub(e) {
        if (!lenis) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const end = progressEndRef.current ?? lenis.limit;
        lenis.scrollTo(fraction * end, { immediate: true, force: true });
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
    const [hovered, setHovered] = useState(false);
    const timeoutRef = useRef(null);

    function handleCopy() {
        navigator.clipboard?.writeText(link.url);
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), 1000);
    }

    const label = copied
        ? "Copied"
        : link.copyOnClick && hovered
            ? link.url.replace(/^(mailto:|tel:|sms:)/i, "")
            : link.title;

    const [displayedLabel, setDisplayedLabel] = useState(label);
    const pRef = useRef(null);
    const isInitialRender = useRef(true);

    useGSAP(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        gsap.timeline()
            .to(pRef.current, { opacity: 0, duration: 0.15, ease: "power1.out", overwrite: "auto" })
            .call(() => setDisplayedLabel(label))
            .to(pRef.current, { opacity: 1, duration: 0.15, ease: "power1.in" });
    }, { dependencies: [label] });

    if (link.copyOnClick) {
        return (
            <button
                type="button"
                className={className}
                style={style}
                onClick={handleCopy}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
            >
                <p ref={pRef} className="nowrap">{displayedLabel}</p>
                {showDot && <div className='dot' />}
            </button>
        );
    }

    return (
        <Link href={link.url} className={className} style={style}>
            <p ref={pRef} className="nowrap">{displayedLabel}</p>
            {showDot && <div className='dot' />}
        </Link>
    );
}
