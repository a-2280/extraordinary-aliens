"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import { useLenis } from "lenis/react"
import Studio from "./aboutSections/studio"
import Approach from "./aboutSections/approach"
import Capabilities from "./aboutSections/capabilities"
import ClientsAndPress from "./aboutSections/clientsAndPress"

const LABELS = {
    studio: "Studio",
    approach: "Approach",
    capabilities: "Capabilities",
    clientsAndPress: "Clients & Press",
}

const COMPONENTS = {
    studio: Studio,
    approach: Approach,
    capabilities: Capabilities,
    clientsAndPress: ClientsAndPress,
}

const OFFSET = -100
const CLICK_OPTS = { duration: 0.8, lock: true, offset: OFFSET }

export default function AboutContent({ components }) {
    const sectionRefs = useRef([])
    const [activeIndex, setActiveIndex] = useState(0)
    const lenis = useLenis()

    useEffect(() => {
        if (!lenis) return
        const onScroll = () => {
            const sections = sectionRefs.current.filter(Boolean)
            if (!sections.length) return
            const y = window.scrollY
            const lines = sections.map(el => el.getBoundingClientRect().top + y + OFFSET)
            let idx = 0
            for (let i = 1; i < lines.length; i++) {
                if (Math.abs(lines[i] - y) < Math.abs(lines[idx] - y)) idx = i
            }
            setActiveIndex(idx)
        }
        lenis.on("scroll", onScroll)
        return () => lenis.off("scroll", onScroll)
    }, [lenis])

    if (!components?.length) return null

    return (
        <div className="pos-rel">
            <div className="px15">
                <div className='b-1' data-sal />
            </div>
            <div className='flex'>
                <div className='flex-1 m-hide'>
                    <div className='p30 sticky top-h-100 h1 text-grey-4'>
                        {components.map((item, i) => {
                            if (!item) return null
                            const label = LABELS[item._type]
                            if (!label) return null
                            return (
                                <p
                                    key={item._key}
                                    className={`pointer${activeIndex === i ? " text-grey-6" : ""}`}
                                    onClick={() => lenis?.scrollTo(sectionRefs.current[i], CLICK_OPTS)}
                                >
                                    {label}
                                </p>
                            )
                        })}
                    </div>
                </div>
                <div className='flex-2 flex flex-col gap-15'>
                    {components.map((item, i) => {
                        if (!item) return null
                        const Component = COMPONENTS[item._type]
                        if (!Component) return null
                        const placeholder =
                            i > 0 ? (
                                <div className="px15">
                                    <div className='b-1 sal-animate' />
                                </div>
                            ) : null
                        return (
                            <Fragment key={item._key}>
                                {placeholder}
                                <div ref={el => (sectionRefs.current[i] = el)}>
                                    <Component {...item} />
                                </div>
                            </Fragment>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
