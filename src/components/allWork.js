import Image from "next/image"

export default function AllWork({ projects }) {
    return (
        <div className='p15 grid gap-90'>
            {projects.map((project, index) => (
                <div className='fade--in' data-sal key={index}>
                    <div className='bg-grey pos-rel ratio-16-18 overflow radius-15 max-full'>
                        <Image className='bg-image' src={project.image} alt='' width={435} height={515} />
                    </div>
                    <p className='h3 p15'>{project.title}</p>
                </div>
            ))}
        </div>
    )
}
