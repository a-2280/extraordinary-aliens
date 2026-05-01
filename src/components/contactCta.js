"use client"

import { useRef, useState } from "react"
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
    const formRef = useRef()
    const buttonRef = useRef()

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
    }, { dependencies: [formOpen] })

    return (
        <div className='p30 h-80vh flex align-center gap-20'>
            <div className='flex-1 flex flex-col gap-20'>
                <div className='h1'>
                    <PortableText value={contactCta?.description} components={components} />
                </div>
                <button ref={buttonRef} className='button flex align-center fade--in delay-100' data-sal onClick={() => setFormOpen(true)}>
                    <FaPhoneAlt className='icon' />
                    <p>{contactCta?.button}</p>
                </button>
                <Spacer />
            </div>
            <div className='flex-1'>
                <form ref={formRef} style={{ visibility: 'hidden', opacity: 0 }} className='contact-form flex flex-col gap-50 max-500' onSubmit={(e) => { e.preventDefault(); setFormOpen(false) }}>
                    <div className="flex flex-col gap-20">
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
                            <input placeholder='Website/Instagram' type='text' name='website' className='contact-input' />
                        </label>
                    </div>
                    <button type='submit' className='button'>
                        <p>Check Availability</p>
                    </button>
                </form>
            </div>
        </div>
    )
}
