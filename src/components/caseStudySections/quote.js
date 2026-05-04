import Spacer from "../spacer";

export default function Quote({ quote }) {
    return (
        <div className='flex flex-col align-center'>
            <Spacer className='x2' />
            <p className='h1 max-750 text-center fade--in' data-sal>{quote}</p>
            <Spacer className='x2' />
        </div>
    )
}