"use client"

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useLenis } from "lenis/react"
import Snap from "lenis/snap"
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
const SNAP_DURATION = 1.1
const SNAP_EASING = t => 1 - Math.pow(1 - t, 3)
const CLICK_OPTS = { duration: 0.8, lock: true, offset: SNAP_OFFSET }
const DRIFT_CLEAR_PX = 24

function DividerOverlay() {
    const ref = useRef(null)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        let r2
        const r1 = requestAnimationFrame(() => {
            r2 = requestAnimationFrame(() => el.classList.add("sal-animate"))
        })
        return () => {
            cancelAnimationFrame(r1)
            if (r2) cancelAnimationFrame(r2)
        }
    }, [])
    return <div ref={ref} className='b-1' />
}

export default function AboutContent({ components }) {
    const rootRef = useRef(null)
    const sectionRefs = useRef([])
    const dividerRefs = useRef([])
    const [activeIndex, setActiveIndex] = useState(0)
    const [snappedIndex, setSnappedIndex] = useState(null)
    const [snapKey, setSnapKey] = useState(0)
    const [dividerTops, setDividerTops] = useState([])
    const snappedIndexRef = useRef(null)
    const isSnappingRef = useRef(false)
    const lenis = useLenis()

    useEffect(() => {
        snappedIndexRef.current = snappedIndex
    }, [snappedIndex])

    useEffect(() => {
        if (!lenis) return
        const onScroll = () => {
            const sections = sectionRefs.current.filter(Boolean)
            if (!sections.length) return
            const y = window.scrollY
            const lines = sections.map(el => el.getBoundingClientRect().top + y + SNAP_OFFSET)
            let idx = 0
            for (let i = 1; i < lines.length; i++) {
                if (Math.abs(lines[i] - y) < Math.abs(lines[idx] - y)) idx = i
            }
            setActiveIndex(idx)
            const snapped = snappedIndexRef.current
            if (snapped != null && lines[snapped] != null && !isSnappingRef.current) {
                if (Math.abs(lines[snapped] - y) > DRIFT_CLEAR_PX) setSnappedIndex(null)
            }
        }
        lenis.on("scroll", onScroll)
        return () => lenis.off("scroll", onScroll)
    }, [lenis])

    useEffect(() => {
        if (!lenis) return
        if (!components?.length) return

        const mql = window.matchMedia("(max-width: 768px)")
        let snap = null

        const findIndexByValue = value => {
            const y = window.scrollY
            let bestI = 0
            let bestD = Infinity
            sectionRefs.current.forEach((el, i) => {
                if (!el) return
                const d = Math.abs(el.getBoundingClientRect().top + y + SNAP_OFFSET - value)
                if (d < bestD) {
                    bestD = d
                    bestI = i
                }
            })
            return bestI
        }

        const build = () => {
            if (mql.matches) return
            const sections = sectionRefs.current.filter(Boolean)
            if (!sections.length) return
            snap = new Snap(lenis, {
                type: "proximity",
                distanceThreshold: "60%",
                duration: SNAP_DURATION,
                easing: SNAP_EASING,
                debounce: 180,
                onSnapStart: ({ value }) => {
                    isSnappingRef.current = true
                    const i = findIndexByValue(value)
                    setSnappedIndex(i)
                    setSnapKey(k => k + 1)
                },
                onSnapComplete: ({ value }) => {
                    setSnappedIndex(findIndexByValue(value))
                    isSnappingRef.current = false
                },
            })
            const y = window.scrollY
            sections.forEach(el => snap.add(el.getBoundingClientRect().top + y + SNAP_OFFSET))
        }

        const rebuild = () => {
            snap?.destroy()
            snap = null
            isSnappingRef.current = false
            build()
        }

        build()
        window.addEventListener("resize", rebuild)
        const onMqlChange = () => rebuild()
        mql.addEventListener("change", onMqlChange)

        return () => {
            window.removeEventListener("resize", rebuild)
            mql.removeEventListener("change", onMqlChange)
            snap?.destroy()
            isSnappingRef.current = false
        }
    }, [lenis, components])

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
                                    style={snappedIndex === i ? { visibility: "hidden" } : undefined}
                                >
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
            {snappedIndex != null && snappedIndex > 0 && components[snappedIndex] ? (
                <div
                    key={`overlay-${snappedIndex}-${snapKey}`}
                    className='pos-abs left-0 w-100 px15 z-2'
                    style={{ top: dividerTops[snappedIndex] ?? 0 }}
                >
                    <DividerOverlay />
                </div>
            ) : null}
        </div>
    )
}
