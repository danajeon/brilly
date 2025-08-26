import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp'
import { useState } from 'react';

type Props = {
    isDemo: boolean
    setIsDemo: (value: boolean) => void
}

export const NavBar = ({ isDemo, setIsDemo }: Props) => {
    const navigate = useNavigate();
    
    const handleLogo = () => {
        navigate('/')
    }

    const handleExitDemo = () => {
        setIsDemo(false)
        navigate('/')
    }

    return (
        <div className="flex flex-row bg-white justify-between items-center sticky top-0">
            <div className="flex">
                <img
                    className="w-[100px] m-2 cursor-pointer"
                    src={logo}
                    alt="logo"
                    onClick={() => handleLogo()}
                />
            </div>
            <div className='flex items-center'>
                {isDemo &&
                    <button
                        className='text-red-500 text-xs bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md p-1 m-2 font-bold'
                        onClick={() => handleExitDemo()}
                    >Exit Demo Mode
                    </button>
                }
                <ul className="flex text-[#004D7C] font-semibold items-center">
                    <li className="mx-1">Log In</li>
                    <span className="mx-1"> | </span>
                    <li className="ml-1 mr-2">Sign Up</li>
                </ul>
            </div>
        </div>
    )
}