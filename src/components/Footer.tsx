import GitHubIcon from '@mui/icons-material/GitHub';

export const Footer = () => {

    return (
        <div className='w-full fixed bottom-0 left-0 z-50 bg-[#004D7C] py-[1px]'>
            <div className='flex justify-center items-center gap-3'>
                <span className='text-white text-xs'>© {new Date().getFullYear()} brilly. All rights reserved.</span>
                <div className='text-white text-xs cursor-pointer' onClick={() => window.open("https://github.com/danajeon/brilly", "_blank")}>
                    <GitHubIcon fontSize='small'/>
                </div>
            </div>
        </div>
    )
}