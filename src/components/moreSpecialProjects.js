"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import Spacer from "./spacer"
import { FaArrowRight } from "react-icons/fa6"

gsap.registerPlugin(useGSAP)

export default function MoreSpecialProjects({ nextProject }) {
    const rowRef = useRef()
    const imageRef = useRef()
    const titleRef = useRef()

    useGSAP(
        () => {
            if (!imageRef.current || !rowRef.current) return

            const hiddenX = () => -(imageRef.current.getBoundingClientRect().right + 50)
            gsap.set(imageRef.current, { autoAlpha: 0, x: hiddenX })
            gsap.set(titleRef.current, { autoAlpha: 0 })

            let activeTl

            const onEnter = () => {
                activeTl?.kill()
                activeTl = gsap
                    .timeline({ defaults: { duration: 0.6, ease: "power3.out" } })
                    .to(imageRef.current, { autoAlpha: 1, x: 0 }, 0)
                    .to(titleRef.current, { autoAlpha: 1 }, 0)
            }

            const onLeave = () => {
                activeTl?.kill()
                activeTl = gsap
                    .timeline({ defaults: { duration: 0.6, ease: "power3.in" } })
                    .to(imageRef.current, { autoAlpha: 0, x: hiddenX }, 0)
                    .to(titleRef.current, { autoAlpha: 0 }, 0)
            }

            const row = rowRef.current
            row.addEventListener("mouseenter", onEnter)
            row.addEventListener("mouseleave", onLeave)

            return () => {
                row.removeEventListener("mouseenter", onEnter)
                row.removeEventListener("mouseleave", onLeave)
                activeTl?.kill()
            }
        },
        { scope: rowRef },
    )

    if (!nextProject) return null
    const href = `/special-projects/${nextProject.slug}`
    return (
        <div className='p15'>
            <div className='b-1' data-sal />
            <p className='h5 p15 m-pb50'>More Projects</p>
            <Spacer className="m-hide" />
            <div ref={rowRef} className='flex m-hide'>
                <div className='p15 flex-2'>
                    <div ref={imageRef} className='pos-rel ratio-16-10 max-full radius-15 overflow'>
                        {nextProject.image && <Image className='bg-image radius-15' src={nextProject.image} alt='' width={435} height={515} />}
                        {nextProject.video && <video className='bg-image radius-15' src={nextProject.video} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
                    </div>
                    <p ref={titleRef} className='h3 p15'>
                        {nextProject.title}
                    </p>
                </div>
                <div className='flex-1 flex justify-center align-center'>
                    <Link href={href} className='button flex align-center fade--in delay-100' data-sal>
                        <FaArrowRight className='icon' />
                        <p>View Case Study</p>
                    </Link>
                </div>
            </div>
            <Link href={href} className='flex m-show'>
                    <div className='pos-rel ratio-16-10 max-full radius-15 overflow'>
                        {nextProject.image && <Image className='bg-image radius-15' src={nextProject.image} alt='' width={435} height={515} />}
                        {nextProject.video && <video className='bg-image radius-15' src={nextProject.video} autoPlay muted loop playsInline preload='metadata' aria-hidden='true' />}
                    </div>
                    <p className='h3 p15'>
                        {nextProject.title}
                    </p>
            </Link>
        </div>
    )
}
