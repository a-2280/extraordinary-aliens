import { useState } from "react"
import AllWork from "./allWork"
import FeaturedProjects from "./featuredProjects"

export default function HomepageContent({ projects, featuredProjects }) {
    const [active, setActive] = useState("featuredProjects")

    return (
        <div>
            <Header active={active} setActive={setActive} />
            {active == "allWork" ? <AllWork projects={projects} /> : <FeaturedProjects projects={featuredProjects} />}
        </div>
    )
}

function Header({ active, setActive }) {
    return (
        <div className='px15'>
            <div className='b-1' data-sal />
            <div className='p15 pb75 flex gap-20 h5 text-grey-4 uppercase fade--in' data-sal>
                <button className={`uppercase hover--grey-6 ${active == "featuredProjects" ? "text-grey-6" : ""}`} onClick={() => setActive("featuredProjects")}>
                    Featured Projects
                </button>
                <button className={`uppercase hover--grey-6 ${active == "allWork" ? "text-grey-6" : ""}`} onClick={() => setActive("allWork")}>
                    All Work
                </button>
            </div>
        </div>
    )
}
