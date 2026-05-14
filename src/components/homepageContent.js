import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import AllWork from "./allWork"
import FeaturedProjects from "./featuredProjects"
import { initSal } from "@/utils/sal"

gsap.registerPlugin(useGSAP)

const EXIT_MS = 650

export default function HomepageContent({ projects, featuredProjects }) {
    const [active, setActive] = useState("featuredProjects")
    const [selected, setSelected] = useState([])
    const panelRef = useRef(null)
    const exitTimerRef = useRef(null)
    const tags = [...new Set(projects?.flatMap(p => p.tags?.map(t => t.name) ?? []) ?? [])]

    const filterFor = (sel) => sel.length === 0
        ? projects
        : projects?.filter(p => {
            const projectTags = p.tags?.map(t => t.name) ?? []
            return sel.every(tag => projectTags.includes(tag))
        })

    const [displayed, setDisplayed] = useState(() => filterFor(selected))
    const [exiting, setExiting] = useState(() => new Set())

    const selectTag = tag => { setSelected([tag]); setActive("allWork") }

    useEffect(() => {
        const next = filterFor(selected) ?? []
        const nextSlugs = new Set(next.map(p => p.slug.current))
        const exitingSlugs = new Set(
            displayed.filter(p => !nextSlugs.has(p.slug.current)).map(p => p.slug.current)
        )
        const merged = (projects ?? []).filter(
            p => nextSlugs.has(p.slug.current) || exitingSlugs.has(p.slug.current)
        )
        setDisplayed(merged)
        setExiting(exitingSlugs)

        clearTimeout(exitTimerRef.current)
        if (exitingSlugs.size > 0) {
            exitTimerRef.current = setTimeout(() => {
                setDisplayed(filterFor(selected) ?? [])
                setExiting(new Set())
            }, EXIT_MS)
        }
        return () => clearTimeout(exitTimerRef.current)
    }, [active, selected])

    useEffect(() => {
        initSal(panelRef.current)
    }, [active, displayed])

    return (
        <div>
            <Header active={active} setActive={setActive} tags={tags} selected={selected} setSelected={setSelected} />
            <div ref={panelRef}>
                {active == "allWork" ? <AllWork projects={displayed} exitingSlugs={exiting} onTagClick={selectTag} /> : <FeaturedProjects projects={featuredProjects} onTagClick={selectTag} />}
            </div>
        </div>
    )
}

function Header({ active, setActive, tags, selected, setSelected }) {
    const tagsRef = useRef(null)
    const toggle = tag => setSelected(s => s.includes(tag) ? s.filter(t => t !== tag) : [...s, tag])

    useGSAP(() => {
        gsap.to(tagsRef.current, {
            autoAlpha: active === "allWork" ? 1 : 0,
            duration: 0.3,
            ease: active === "allWork" ? "power2.out" : "power2.in",
        })
    }, { dependencies: [active] })

    return (
        <div className='px15'>
            <div className='b-1' data-sal />
            <div className='p15 pt10 pb60 flex space-between fade--in m-pt0 m-flex-col m-pt15 m-gap-30' data-sal>
                <div className='flex gap-18 text-grey-4 uppercase'>
                    <button className={`h5 nowrap uppercase hover--grey-6 ${active == "featuredProjects" ? "text-grey-6" : ""}`} onClick={() => setActive("featuredProjects")}>
                        Featured Projects
                    </button>
                    <button className={`h5 nowrap uppercase hover--grey-6 ${active == "allWork" ? "text-grey-6" : ""}`} onClick={() => setActive("allWork")}>
                        All Work
                    </button>
                </div>
                <div ref={tagsRef} style={{ visibility: "hidden", opacity: 0 }} className='flex gap-10 justify-end m-justify-start m-flex-wrap tags-row'>
                    {tags.map(tag => (
                        <button className={`hover--grey-6 hover--background p5 radius-5 nowrap ${selected.includes(tag) ? "text-grey-6 bg-grey" : "text-grey-5"}`} key={tag} onClick={() => toggle(tag)}>
                            {tag}
                        </button>
                    ))}
                    <button
                        className={`hover--background radius-5 p5 clear-btn ${selected.length > 0 ? "is-active" : ""}`}
                        onClick={() => setSelected([])}>
                        Clear
                    </button>
                </div>
            </div>
        </div>
    )
}
