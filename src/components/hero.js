import { PortableText } from "@portabletext/react";

const components = {
    marks: {
        textColor: ({ value, children }) => (
            <span style={{ color: value?.color }}>{children}</span>
        ),
    },
}

export default function Hero({ data }) {
    return (
        <div className='px15 pth h-100vh'>
            <div>
                <div className="h1">
                    <PortableText value={data?.description} components={components} />
                </div>
                <button className="button">{data?.button}</button>
            </div>
        </div>
    )
}