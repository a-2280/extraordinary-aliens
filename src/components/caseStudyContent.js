import Image from "next/image"
import { PortableText } from "@portabletext/react"
import Section from "./caseStudyComponents/section"
import Spacer from "./spacer"
import { TfiArrowTopRight } from "react-icons/tfi"

export default function CaseStudyContent({ project }) {
    if (!project) return null

    const { caseStudySections } = project

    return (
        <div>
            <Header project={project} />
            <Spacer className="x2" />
            {caseStudySections?.length > 0 && (
                <div className='p15 flex flex-col gap-15'>
                    {caseStudySections.map(section => (
                        <Section key={section._key} {...section} />
                    ))}
                </div>
            )}
        </div>
    )
}

function Header({ project }) {
    const { title, client, year, caseStudyIntro, tags, heroImage, liveWebsite } = project

    return (
        <div className='p15 flex flex-col gap-15'>
            {heroImage && (
                <div>
                    <Spacer />
                    <div className='pos-rel ratio-16-9 max-100vh radius-15 overflow'>
                        <Image className='bg-image' src={heroImage} alt={title || ""} width={1920} height={1080} loading="eager" />
                    </div>
                </div>
            )}
            <div className='p15 flex gap-15'>
                <p className='flex-1 h1'>{client}</p>
                <div className='flex-1 flex gap-20 space-between'>
                    <div className='flex flex-col gap-40'>
                        {caseStudyIntro && (
                            <div className='flex flex-col gap-15'>
                                <p className='h5'>Introduction</p>
                                <div className='f-20 text-grey-4 max-400'>
                                    <PortableText value={caseStudyIntro} />
                                </div>
                            </div>
                        )}
                        {liveWebsite?.url && (
                            <a href={liveWebsite.url} target={liveWebsite.openInNewWindow ? "_blank" : undefined} rel={liveWebsite.openInNewWindow ? "noopener noreferrer" : undefined} className='button flex align-center fade--in delay-100' data-sal>
                                <TfiArrowTopRight className='icon' strokeWidth={2} />
                                <p>{liveWebsite.title}</p>
                            </a>
                        )}
                    </div>
                    <div className='flex flex-col gap-15'>
                        <p className='h5'>Scope</p>
                        {tags?.length > 0 && (
                            <div className='flex flex-col'>
                                {tags.map((tag, index) => (
                                    <p className='f-20 text-grey-4' key={index}>
                                        {tag.name}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                    {year && (
                        <div className='flex flex-col gap-15'>
                            <p className='h5'>Year</p>
                            <p className='f-20 text-grey-4'>{year}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
