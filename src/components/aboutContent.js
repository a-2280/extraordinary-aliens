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
const SNAP_PROXIMITY_RATIO = 0.3
const MIN_SNAP_PROXIMITY = 200
const SETTLE_DELAY = 50
const SNAP_DURATION = 1.1
const SNAP_EASING = t => 1 - Math.pow(1 - t, 3)
const CLICK_OPTS = { duration: 0.8, lock: true, offset: SNAP_OFFSET }

export default function AboutContent({ components }) {
    const rootRef = useRef(null)
    const sectionRefs = useRef([])
    const dividerRefs = useRef([])
    const [activeIndex, setActiveIndex] = useState(0)
    const [dividerTops, setDividerTops] = useState([])
    const lenis = useLenis()

    useEffect(() => {
        if (!lenis) return
        let settleTimer
        const mql = window.matchMedia("(max-width: 768px)")

        const onScroll = () => {
            const sections = sectionRefs.current.filter(Boolean)
            if (sections.length) {
                const y = window.scrollY
                const positions = sections.map(el => el.getBoundingClientRect().top + y + SNAP_OFFSET)
                let idx = 0
                for (let i = 1; i < positions.length; i++) {
                    if (Math.abs(positions[i] - y) < Math.abs(positions[idx] - y)) idx = i
                }
                setActiveIndex(idx)
            }
            if (mql.matches) return
            clearTimeout(settleTimer)
            settleTimer = setTimeout(trySnap, SETTLE_DELAY)
        }

        const trySnap = () => {
            if (document.hidden) return
            const active = document.activeElement
            if (active && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)) return
            const sections = sectionRefs.current.filter(Boolean)
            if (!sections.length) return
            const y = window.scrollY
            const lastBottom = sections[sections.length - 1].getBoundingClientRect().bottom + y
            if (y > lastBottom + 50) return

            const lines = sections.map(el => el.getBoundingClientRect().top + y + SNAP_OFFSET)
            let idx = 0
            for (let i = 1; i < lines.length; i++) {
                if (Math.abs(lines[i] - y) < Math.abs(lines[idx] - y)) idx = i
            }
            const delta = lines[idx] - y
            const abs = Math.abs(delta)
            const proximity = Math.max(MIN_SNAP_PROXIMITY, window.innerHeight * SNAP_PROXIMITY_RATIO)
            if (abs <= 1 || abs > proximity) return

            lenis.scrollTo(sections[idx], {
                duration: SNAP_DURATION,
                offset: SNAP_OFFSET,
                lock: false,
                easing: SNAP_EASING,
            })
        }

        const onMqlChange = () => {
            if (mql.matches) clearTimeout(settleTimer)
        }

        lenis.on("scroll", onScroll)
        mql.addEventListener("change", onMqlChange)

        return () => {
            clearTimeout(settleTimer)
            lenis.off("scroll", onScroll)
            mql.removeEventListener("change", onMqlChange)
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
