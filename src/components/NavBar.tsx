import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.webp'

export const NavBar = () => {
      const navigate = useNavigate();
      const handleLogo = () => {
    navigate('/')
  }

    return (
        <div className="flex flex-row justify-between items-center">
            <div className="flex">
                <img
                    className="w-[100px] m-2 cursor-pointer"
                    src={logo}
                    alt="logo"
                    onClick={() => handleLogo()}
                />
            </div>
            <div>
                <ul className="flex text-[#004D7C] font-semibold">
                    <li className="mx-1">Log In</li>
                    <span className="mx-1"> | </span>
                    <li className="ml-1 mr-2">Sign Up</li>
                </ul>
            </div>
        </div>
    )
}