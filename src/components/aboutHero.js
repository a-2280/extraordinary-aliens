import { PortableText } from "@portabletext/react"

const components = {
    marks: {
        textColor: ({ value, children }) => (
            <span style={{ color: value?.color }}>{children}</span>
        ),
    },
}

export default function AboutHero({ title }) {
    return (
        <div className='h-75vh pth flex align-center max-1000'>
            <div className="p30 h1 fade--in" data-sal>
                <PortableText value={title} components={components} />
            </div>
        </div>
    )
}