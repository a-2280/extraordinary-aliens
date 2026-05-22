"use client"

import { useEffect, useRef, useState } from "react"
import { PortableText } from "@portabletext/react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import InquireFooter from "@/components/inquireFooter"

gsap.registerPlugin(useGSAP)

const components = {
    marks: {
        textColor: ({ value, children }) => <span style={{ color: value?.color }}>{children}</span>,
    },
}

export default function InquireContent({ inquire }) {
    const [formOpen, setFormOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const formRef = useRef()
    const buttonRef = useRef()
    const newDivRef = useRef()
    const inquireTextRef = useRef()
    const contactTextRef = useRef()
    const slotRef = useRef()
    const imageWrapperRef = useRef()
    const ctaInitRef = useRef(true)
    const ctaNaturalHRef = useRef(0)

    useEffect(() => {
        if (!formOpen) return
        const onKey = e => {
            if (e.key === "Escape") setFormOpen(false)
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [formOpen])

    useEffect(() => {
        if (!newDivRef.current || !imageWrapperRef.current) return
        if (window.matchMedia("(max-width: 768px)").matches) return
        const wrap = imageWrapperRef.current
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                wrap.style.width = `${entry.contentRect.width}px`
            }
        })
        observer.observe(newDivRef.current)
        return () => observer.disconnect()
    }, [])

    useGSAP(() => {
        gsap.set(buttonRef.current, { transition: "none" })
        const out = 0.25
        const inDur = 0.3
        const stag = 0.1
        const slot = slotRef.current
        const form = formRef.current

        const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
        const closedLeft = [inquireTextRef.current, buttonRef.current]
        const openLeft = [contactTextRef.current]
        const closedRight = [newDivRef.current]
        const openRight = isMobile ? [form, newDivRef.current] : [form]

        const [leavingLeft, leavingRight, enteringLeft, enteringRight] = formOpen
            ? [closedLeft, closedRight, openLeft, openRight]
            : [openLeft, openRight, closedLeft, closedRight]

        const startH = slot.offsetHeight
        form.style.display = formOpen ? "flex" : "none"
        const endH = slot.offsetHeight
        if (!formOpen) form.style.display = "flex"

        gsap.fromTo(slot, { height: startH }, {
            height: endH,
            duration: out + inDur,
            delay: stag,
            ease: "power2.inOut",
            onComplete: () => {
                if (!formOpen) gsap.set(form, { display: "none" })
                gsap.set(slot, { clearProps: "height" })
            },
        })

        gsap.to(leavingLeft, { autoAlpha: 0, duration: out, ease: "power2.in" })
        gsap.to(leavingRight, { autoAlpha: 0, duration: out, delay: stag, ease: "power2.in" })
        gsap.to(enteringLeft, { autoAlpha: 1, duration: inDur, delay: out, ease: "power2.out" })
        gsap.to(enteringRight, { autoAlpha: 1, duration: inDur, delay: out + stag, ease: "power2.out" })

        const cta = buttonRef.current
        if (isMobile) {
            if (ctaInitRef.current) {
                ctaNaturalHRef.current = cta.offsetHeight
                ctaInitRef.current = false
            } else if (formOpen) {
                gsap.fromTo(cta,
                    { height: ctaNaturalHRef.current || cta.offsetHeight, marginTop: 0 },
                    { height: 0, marginTop: -20, duration: out + inDur, delay: stag, ease: "power2.inOut" }
                )
            } else {
                gsap.fromTo(cta,
                    { height: 0, marginTop: -20 },
                    {
                        height: ctaNaturalHRef.current,
                        marginTop: 0,
                        duration: out + inDur,
                        delay: stag,
                        ease: "power2.inOut",
                        onComplete: () => gsap.set(cta, { clearProps: "height,marginTop" }),
                    }
                )
            }
        } else {
            gsap.set(cta, { clearProps: "height,marginTop" })
        }
    }, { dependencies: [formOpen] })

    return (
        <div className='p28 h-100vh flex flex-col justify-center fade--in m-justify-start' data-sal>
            <div className={`flex gap-40 m-flex-col m-mt75 m-gap-30${formOpen ? " form-open" : ""}`}>
                <div className='flex-1 flex flex-col gap-20 m-justify-center'>
                    <div className='text-stack'>
                        <div ref={inquireTextRef} className='h1 max-950'>
                            <PortableText value={inquire?.description} components={components} />
                        </div>
                        <div ref={contactTextRef} className='h1 max-950' style={{ visibility: "hidden", opacity: 0 }}>
                            <PortableText value={inquire?.formText} components={components} />
                        </div>
                    </div>
                    <button ref={buttonRef} className='button flex align-center fade--in delay-100 inquire-cta' data-sal onClick={() => setFormOpen(true)}>
                        <img className='icon' src='/images/top-right.svg' alt='' width='14' height='9' />
                        <p>Book a call</p>
                    </button>
                </div>
                <div ref={slotRef} className='flex-1 inquire-slot'>
                    <div ref={newDivRef} className='flex gap-3 inquire-buttons m-pt15'>
                        {inquire?.buttons?.map(button => (
                            <div key={button._key} className='inquire-tag w-100'>
                                <p className='h5 text-black'>{button.title}</p>
                            </div>
                        ))}
                        <div ref={imageWrapperRef} className="inquire-image-wrap">
                            <div className='m-hide bg-grey pos-rel ratio-16-10 radius-15 overflow inquire-content-image'>
                                {inquire?.footerImage && <img className='bg-image' src={inquire.footerImage} alt='' />}
                                {inquire?.footerVideo && <video className='bg-image' src={inquire.footerVideo} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
                            </div>
                        </div>
                    </div>
                    <form
                        ref={formRef}
                        name='inquire-form'
                        method='POST'
                        netlify
                        style={{ visibility: "hidden", opacity: 0, display: "none" }}
                        className='contact-form flex flex-col gap-50 max-500 m-pb45'
                        onSubmit={async e => {
                            e.preventDefault()
                            if (isSubmitting) return
                            setIsSubmitting(true)
                            try {
                                const data = new URLSearchParams(new FormData(e.currentTarget))
                                await fetch("/", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                                    body: data.toString(),
                                })
                                setFormOpen(false)
                            } finally {
                                setIsSubmitting(false)
                            }
                        }}>
                        <input type='hidden' name='form-name' value='inquire-form' />
                        <div className='flex flex-col gap-20'>
                            <label className='contact-field flex flex-col'>
                                <input placeholder='Name*' type='text' name='name' className='contact-input' required />
                            </label>
                            <label className='contact-field flex flex-col'>
                                <input placeholder='Company Name' type='text' name='company' className='contact-input' />
                            </label>
                            <label className='contact-field flex flex-col'>
                                <input placeholder='Email*' type='email' name='email' className='contact-input' required />
                            </label>
                            <label className='contact-field flex flex-col'>
                                <input placeholder='Links' type='text' name='website' className='contact-input' />
                            </label>
                            <label className='contact-field flex flex-col'>
                                <input placeholder='Message' type='text' name='message' className='contact-input contact-input-tall' />
                            </label>
                        </div>
                        <button type='submit' className='button flex align-center' disabled={isSubmitting}>
                            {isSubmitting && <span className='spinner' aria-hidden />}
                            <p>Check Availability</p>
                        </button>
                    </form>
                </div>
            </div>
            <InquireFooter inquire={inquire} className='m-show' />
        </div>
    )
}
