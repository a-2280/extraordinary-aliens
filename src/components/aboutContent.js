"use client"

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react"
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

const SNAP_OFFSET = -100
const SNAP_OPTS = { duration: 0.5, lock: true, offset: SNAP_OFFSET }
const SNAP_COOLDOWN = 80

export default function AboutContent({ components }) {
    const rootRef = useRef(null)
    const sectionRefs = useRef([])
    const dividerRefs = useRef([])
    const [activeIndex, setActiveIndex] = useState(0)
    const [dividerTops, setDividerTops] = useState([])
    const lenis = useLenis()

    useEffect(() => {
        if (!lenis) return
        let isSnapping = false
        let cooldown

        const onScroll = () => {
            const sections = sectionRefs.current.filter(Boolean)
            if (!sections.length) return
            const y = window.scrollY
            const positions = sections.map(el => el.getBoundingClientRect().top + y + SNAP_OFFSET)
            let idx = 0
            for (let i = 1; i < positions.length; i++) {
                if (Math.abs(positions[i] - y) < Math.abs(positions[idx] - y)) idx = i
            }
            setActiveIndex(idx)
        }

        const onWheel = e => {
            if (isSnapping) { e.preventDefault(); return }
            const sections = sectionRefs.current.filter(Boolean)
            if (!sections.length) return
            const y = window.scrollY
            const tops = sections.map(el => el.getBoundingClientRect().top + y)
            const positions = tops.map(t => t + SNAP_OFFSET)
            const lastBottom = sections[sections.length - 1].getBoundingClientRect().bottom + y
            if (y > lastBottom + 50) return

            let target = -1
            if (e.deltaY > 0) {
                target = positions.findIndex(p => p > y + 5)
            } else if (e.deltaY < 0) {
                for (let i = positions.length - 1; i >= 0; i--) {
                    if (positions[i] < y - 5) { target = i; break }
                }
            }
            if (target < 0) return

            e.preventDefault()
            isSnapping = true
            lenis.scrollTo(tops[target], {
                ...SNAP_OPTS,
                onComplete: () => {
                    clearTimeout(cooldown)
                    cooldown = setTimeout(() => { isSnapping = false }, SNAP_COOLDOWN)
                },
            })
        }

        lenis.on("scroll", onScroll)
        window.addEventListener("wheel", onWheel, { passive: false })
        return () => {
            clearTimeout(cooldown)
            lenis.off("scroll", onScroll)
            window.removeEventListener("wheel", onWheel)
        }
    }, [lenis])

    useLayoutEffect(() => {
        if (!components?.length) return
        const measure = () => {
            const root = rootRef.current
            if (!root) return
            const rootTop = root.getBoundingClientRect().top
            const tops = dividerRefs.current.map(el =>
                el ? el.getBoundingClientRect().top - rootTop : 0
            )
            setDividerTops(tops)
        }
        measure()
        window.addEventListener("resize", measure)
        return () => window.removeEventListener("resize", measure)
    }, [components])

    if (!components?.length) return null

    return (
        <div ref={rootRef} className="pos-rel">
            <div className="px15">
                <div className='b-1' data-sal />
            </div>
            <div className='flex'>
                <div className='flex-1'>
                    <div className='p30 sticky top-h-100 h1 text-grey-4'>
                        {components.map((item, i) => {
                            if (!item) return null
                            const label = LABELS[item._type]
                            if (!label) return null
                            return (
                                <p
                                    key={item._key}
                                    className={`pointer${activeIndex === i ? " text-grey-6" : ""}`}
                                    onClick={() => lenis?.scrollTo(sectionRefs.current[i], SNAP_OPTS)}
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
                                <div
                                    ref={el => (dividerRefs.current[i] = el)}
                                    className="px15"
                                    style={activeIndex === i ? { visibility: "hidden" } : undefined}
                                >
                                    <div className='b-1' data-sal />
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
            {components.map((item, i) =>
                i > 0 && item ? (
                    <div
                        key={`overlay-${item._key}`}
                        className={`pos-abs left-0 w-100 px15 z-2${activeIndex === i ? "" : " hide"}`}
                        style={{ top: dividerTops[i] ?? 0 }}
                    >
                        <div className='b-1 sal-animate' />
                    </div>
                ) : null
            )}
        </div>
    )
}
