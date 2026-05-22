"use client"

import { useEffect, useRef, useState } from "react"
import { PortableText } from "@portabletext/react"
import { FaPhoneAlt } from "react-icons/fa"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import Spacer from "./spacer"

gsap.registerPlugin(useGSAP)

const components = {
    marks: {
        textColor: ({ value, children }) => <span style={{ color: value?.color }}>{children}</span>,
    },
}

export default function ContactCta({ contactCta }) {
    const [formOpen, setFormOpen] = useState(false)
    const rootRef = useRef()
    const formRef = useRef()
    const buttonRef = useRef()
    const descriptionRef = useRef()
    const formTextRef = useRef()

    useEffect(() => {
        rootRef.current?.classList.toggle("form-open", formOpen)
    }, [formOpen])

    useGSAP(() => {
        gsap.set(buttonRef.current, { transition: "none" })
        gsap.to(formRef.current, {
            autoAlpha: formOpen ? 1 : 0,
            x: formOpen ? 0 : -30,
            duration: 0.3,
            ease: formOpen ? "power2.out" : "power2.in",
        })
        gsap.to(buttonRef.current, {
            autoAlpha: formOpen ? 0 : 1,
            duration: 0.3,
            ease: formOpen ? "power2.in" : "power2.out",
        })
        if (formTextRef.current) {
            gsap.to(descriptionRef.current, {
                autoAlpha: formOpen ? 0 : 1,
                duration: 0.3,
                ease: "power1.inOut",
            })
            gsap.to(formTextRef.current, {
                autoAlpha: formOpen ? 1 : 0,
                duration: 0.3,
                ease: "power1.inOut",
            })
        }
    }, { dependencies: [formOpen] })

    return (
        <div ref={rootRef} className='contact-cta p30 flex align-center gap-20 fade--in' data-sal>
            <div className='w-100 flex m-flex-col m-justify-center'>
                <div className='contact-cta-intro  flex-1 flex flex-col gap-20 m-justify-center m-flex-none m-gap-0'>
                    <div className='pos-rel'>
                        <div ref={descriptionRef} className='h1'>
                            <PortableText value={contactCta?.description} components={components} />
                        </div>
                        {contactCta?.formText && (
                            <div ref={formTextRef} className='h1 pos-abs max-450' style={{ top: 0, left: 0, right: 0, visibility: "hidden", opacity: 0 }}>
                                <PortableText value={contactCta?.formText} components={components} />
                            </div>
                        )}
                    </div>
                    <button ref={buttonRef} className='button flex align-center fade--in delay-100 m-mt20' data-sal onClick={() => setFormOpen(true)}>
                        <FaPhoneAlt className='icon' />
                        <p>{contactCta?.button}</p>
                    </button>
                </div>
                <div className={`flex-1 m-flex-none ${formOpen ? "m-flex align-center m-w-100" : "m-hide"}`}>
                    <form
                        ref={formRef}
                        style={{ visibility: "hidden", opacity: 0 }}
                        className='contact-form flex flex-col gap-50 max-500 m-pt80'
                        onSubmit={e => {
                            e.preventDefault()
                            setFormOpen(false)
                        }}>
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
                        <button type='submit' className='button'>
                            <p>Check Availability</p>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
