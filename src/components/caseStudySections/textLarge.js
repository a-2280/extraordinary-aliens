import Spacer from "../spacer";

export default function TextLarge({ title, description }) {
    return (
        <div className="pt90">
            <div className='flex gap-15 m-flex-col'>
                <div className='flex-1'>
                    <p className='h5 fade--in' data-sal>{title}</p>
                </div>
                <div className='flex-1'>
                    <p className='f-20 text-grey-4 max-700 fade--in delay-100' data-sal>{description}</p>
                </div>
            </div>
            <Spacer className="m-show" />
        </div>
    )
}
