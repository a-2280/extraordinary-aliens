import Image from "next/image"
import { PortableText } from "@portabletext/react"
import Section from "./caseStudyComponents/section"
import TextLarge from "./caseStudySections/textLarge"
import Quote from "./caseStudySections/quote"
import List from "./caseStudySections/list"
import Credits from "./caseStudySections/credits"
import ImageTrio from "./caseStudyComponents/imageTrio"
import Spacer from "./spacer"
import CaseStudyNav from "./caseStudyNav"
import { ImageModalProvider } from "./imageModalContext"
import ImageModal from "./imageModal"
import { TfiArrowTopRight } from "react-icons/tfi"

function renderItem(item, project) {
    if (item._type === "textLarge") return <TextLarge key={item._key} {...item} />
    if (item._type === "quote") return <Quote key={item._key} {...item} />
    if (item._type === "list") return <List key={item._key} {...item} />
    if (item._type === "credits") return <Credits key={item._key} tags={project.tags} {...item} />
    if (item._type === "imageTrio") return <div key={item._key} className='w-100'><ImageTrio {...item} /></div>
    return <Section key={item._key} {...item} />
}

export default function CaseStudyContent({ project }) {
    if (!project) return null

    const { caseStudySections } = project

    return (
        <ImageModalProvider sections={caseStudySections}>
            <div>
                <Header project={project} />
                <Spacer className='x2 m-hide' />
                <Spacer className='m-show h60' />
                {caseStudySections?.length > 0 && (
                    <div className='p15 flex flex-col gap-15 case-study-sections'>
                        {caseStudySections.map(entry => {
                            if (entry._type === "sectionGroup") {
                                return (
                                    <section key={entry._key} id={entry.slug} aria-label={entry.title} className='flex flex-col gap-15'>
                                        {entry.items?.map(item => renderItem(item, project))}
                                    </section>
                                )
                            }
                            return renderItem(entry, project)
                        })}
                    </div>
                )}
                <CaseStudyNav sections={caseStudySections} />
            </div>
            <ImageModal />
        </ImageModalProvider>
    )
}

function Header({ project }) {
    const { title, client, year, caseStudyIntro, tags, heroImage, heroVideo, liveWebsite } = project

    return (
        <div id='introduction' className='p15 flex flex-col gap-15'>
            {(heroImage || heroVideo) && (
                <div>
                    <Spacer className="h75" />
                    <div className='pos-rel ratio-16-9 max-100vh radius-15 overflow'>
                        {heroImage && <Image className='bg-image' src={heroImage} alt={title || ""} width={1920} height={1080} loading='eager' />}
                        {heroVideo && <video className='bg-image' src={heroVideo} autoPlay muted loop playsInline preload='auto' aria-hidden='true' />}
                    </div>
                </div>
            )}
            <div className='p15 flex gap-15 fade--in m-flex-col m-gap-100' data-sal>
                <p className='flex-1 h1'>{client}</p>
                <div className='flex-1 flex gap-20 space-between m-flex-col m-gap-50'>
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
                            <a href={liveWebsite.url} target={liveWebsite.openInNewWindow ? "_blank" : undefined} rel={liveWebsite.openInNewWindow ? "noopener noreferrer" : undefined} className='button flex align-center fade--in delay-100 m-hide' data-sal>
                                <TfiArrowTopRight className='icon' strokeWidth={2} />
                                <p>{liveWebsite.title}</p>
                            </a>
                        )}
                    </div>
                    <div className='flex flex-col gap-15 m-hide'>
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
                        <div className='flex flex-col gap-15 m-hide'>
                            <p className='h5'>Year</p>
                            <p className='f-20 text-grey-4'>{year}</p>
                        </div>
                    )}
                    <div className='m-show w-100 flex'>
                        <div className='flex-1 flex flex-col gap-15'>
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
                            <div className='flex-1 flex flex-col gap-15'>
                                <p className='h5'>Year</p>
                                <p className='f-20 text-grey-4'>{year}</p>
                            </div>
                        )}
                    </div>
                    {liveWebsite?.url && (
                        <a href={liveWebsite.url} target={liveWebsite.openInNewWindow ? "_blank" : undefined} rel={liveWebsite.openInNewWindow ? "noopener noreferrer" : undefined} className='button flex align-center fade--in delay-100 m-show' data-sal>
                            <TfiArrowTopRight className='icon' strokeWidth={2} />
                            <p>{liveWebsite.title}</p>
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
