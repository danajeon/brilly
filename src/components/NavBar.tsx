import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp'
import { createClient } from '@supabase/supabase-js';

type Props = {
    isDemo: boolean
    setIsDemo: (value: boolean) => void
    user: any
    setUser: (user: any) => void
}

// Info needed to connect to Supabase
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const NavBar = ({ isDemo, setIsDemo, user, setUser }: Props) => {
    const navigate = useNavigate();

    const handleLogo = () => {
        user ? navigate('/dashboard') : navigate('/')
    }

    const handleExitDemo = () => {
        setIsDemo(false)
        navigate('/')
    }

    const handleAuth = () => {
        navigate('/auth')
    }

    const handleLogOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Logout error:", error.message);
        } else {
            setUser(null); // update App state
            navigate('/'); // redirect to home
        }
    };

    return (
        <div className="flex flex-row bg-white justify-between items-center sticky top-0">
            <div className="flex">
                <img
                    className="lg:w-[100px] md:w-[100px] w-[80px] m-2 cursor-pointer"
                    src={logo}
                    alt="logo"
                    onClick={() => handleLogo()}
                />
            </div>
            <div className='flex items-center'>
                {isDemo &&
                    <button
                        className='text-red-500 text-xs bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md lg:p-2 p-1 lg:m-2 m-1 font-bold'
                        onClick={() => handleExitDemo()}
                    >Exit Demo Mode
                    </button>
                }
                {!user &&
                    <li
                        className="flex text-[#004D7C] lg:text-sm md:text-sm text-xs font-semibold items-center text-right mx-2 hover:cursor-pointer hover:underline"
                        onClick={() => handleAuth()}>
                        Log In | Sign Up
                    </li>
                }
                {user &&
                    <ul className="flex gap-1 mx-2 text-[#004D7C] lg:text-sm md:text-sm text-xs font-semibold items-center">
                        <li className="">{user.email}</li>
                        <span className=""> | </span>
                        <li
                            className="hover:cursor-pointer hover:underline"
                            onClick={() => handleLogOut()}>
                            Log Out
                        </li>
                    </ul>
                }
            </div>
        </div>
    )
}