import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import AllWork from "./allWork"
import FeaturedProjects from "./featuredProjects"
import { initSal } from "@/utils/sal"

gsap.registerPlugin(useGSAP)

export default function HomepageContent({ projects, featuredProjects }) {
    const [active, setActive] = useState("featuredProjects")
    const [selected, setSelected] = useState([])
    const panelRef = useRef(null)
    const tags = [...new Set(projects?.flatMap(p => p.tags?.map(t => t.name) ?? []) ?? [])]
    const filteredProjects = selected.length === 0
        ? projects
        : projects?.filter(p => {
            const projectTags = p.tags?.map(t => t.name) ?? []
            return selected.every(tag => projectTags.includes(tag))
        })

    useEffect(() => {
        initSal(panelRef.current)
    }, [active, selected])

    return (
        <div>
            <Header active={active} setActive={setActive} tags={tags} selected={selected} setSelected={setSelected} />
            <div ref={panelRef}>
                {active == "allWork" ? <AllWork projects={filteredProjects} /> : <FeaturedProjects projects={featuredProjects} />}
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
            <div className='p15 pb75 flex space-between fade--in' data-sal>
                <div className='flex gap-20 h5 text-grey-4 uppercase'>
                    <button className={`uppercase hover--grey-6 ${active == "featuredProjects" ? "text-grey-6" : ""}`} onClick={() => setActive("featuredProjects")}>
                        Featured Projects
                    </button>
                    <button className={`uppercase hover--grey-6 ${active == "allWork" ? "text-grey-6" : ""}`} onClick={() => setActive("allWork")}>
                        All Work
                    </button>
                </div>
                <div ref={tagsRef} style={{ visibility: "hidden", opacity: 0 }} className='flex gap-15'>
                    {tags.map(tag => (
                        <button className={`hover--grey-6 hover--background p5 radius-5 ${selected.includes(tag) ? "text-grey-6 bg-grey" : "text-grey-5"}`} key={tag} onClick={() => toggle(tag)}>
                            {tag}
                        </button>
                    ))}
                    <button
                    className="hover--background radius-5 p5"
                        style={{
                            opacity: selected.length > 0 ? 1 : 0,
                            pointerEvents: selected.length > 0 ? "auto" : "none",
                            transition: "opacity 0.3s ease",
                        }}
                        onClick={() => setSelected([])}>
                        Clear
                    </button>
                </div>
            </div>
        </div>
    )
}
