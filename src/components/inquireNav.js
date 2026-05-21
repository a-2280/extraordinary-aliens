import Link from "next/link"

export default function InquireNav({ inquireOnly }) {
    return (
        <header className="masthead z-2 p28 flex align-center">
            {inquireOnly ? (
                <span className="f-nav text-grey-6">Extraordinary Aliens</span>
            ) : (
                <div className="f-nav text-grey-6">
                    Extraordinary Aliens
                </div>
            )}
        </header>
    )
}
