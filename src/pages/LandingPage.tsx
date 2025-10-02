import { useNavigate } from 'react-router-dom';

import mockupImg from "../assets/mockup.webp"
import plusImg from "../assets/plus.webp"
import brainImg from "../assets/brainAi.webp"
import knowledgeImg from "../assets/knowledge.webp"
import sc1Img from "../assets/sc1.png"
import sc2Img from "../assets/sc2.png"
import aiImg from "../assets/ai.png"

type Props = {
  setIsDemo: (value: boolean) => void;
};

export default function LandingPage({ setIsDemo }: Props) {
    const navigate = useNavigate();

    const handleDemoClick = () => {
        setIsDemo(true)
        navigate(`/dashboard`)
    }
    
    return (
        <div className=''>
            <div className='bg-[#88B1CA] flex flex-col justify-center items-center'>
                <div className="max-w-[1600px] flex justify-center items-center 
                    lg:flex-row md:flex-row flex-col
                    lg:gap-6 md:gap-3">
                    <div className="w-[300px] flex flex-col justify-center items-center">
                        <h2 className='text-white font-semibold px-5
                            lg:text-left md:text-left text-center
                            lg:text-3xl md:text-2xl text-2xl
                            lg:mb-10 md:mb-4 mb-3
                            lg:pt-0 md:pt-3 pt-5'>
                                Smarter Study, Beautifully Designed
                        </h2>
                        <h4 className='text-[#004D7C] 
                            lg:text-lg md:text-sm 
                            lg:text-left md:text-left text-center
                            mx-5 mb-6'>Smarter flashcards powered by AI. Memorize quickly, understand deeply, and retain longer.
                        </h4>
                        <button
                            className="bg-[#004D7C] text-white rounded-2xl 
                            md: mb-4
                            px-8 py-2
                            hover:bg-white hover:text-[#004D7C] hover:cursor-pointer"
                            onClick={() => handleDemoClick()}
                        >
                                Try Demo
                        </button>
                    </div>
                    <div>
                        <img
                            src={mockupImg}
                            alt="mockup"
                        />
                    </div>
                </div>
                <div className="w-screen flex flex-col bg-white 
                    lg:py-15 md:py-10 py-7">
                    <h3 className="flex flex-col items-center text-[#004D7C] font-semibold text-center mx-3 pb-5
                    lg:text-3xl md:text-3xl text-xl
                    ">More of a Learning Tool Than a Memorization Tool</h3>
                    <div className="flex flex-row justify-center lg:gap-4 md:gap-4 gap-2">
                        <div className="max-w-[15%] flex flex-col items-center text-center m-5">
                            <img
                                src={plusImg}
                                alt="plus"
                                className="w-[100px]"
                            />
                            <span className="flex text-[#004D7C] font-semibold lg:text-lg md:text-sm text-xs m-2">Create your set of flashcards.</span>
                        </div>
                        <div className="max-w-[15%] flex flex-col items-center text-center m-5">
                            <img
                                src={brainImg}
                                alt="brain"
                                className="w-[100px]"
                            />
                            <span className="text-[#004D7C] font-semibold lg:text-lg md:text-sm text-xs m-2">Let Artificial Intelligence elaborate and explain.</span>
                        </div>
                        <div className="max-w-[15%] flex flex-col items-center text-center m-5">
                            <img
                                src={knowledgeImg}
                                alt="knowledge"
                                className="w-[100px]"
                            />
                            <span className="text-[#004D7C] font-semibold lg:text-lg md:text-sm text-xs m-2">Memorize, and most importantly, LEARN.</span>
                        </div>
                    </div>
                </div>
                <div className="w-screen flex flex-col bg-[#004D7C] items-center gap-4 py-8">
                    <img
                        src={sc1Img}
                        alt="sc1"
                        className="max-w-[50%]"
                    />
                    <p className="w-[80%] text-white text-center lg:text-2xl md:text-xl text-md">For additional definitions or explanations, select the Elaborate<img
                        src={aiImg}
                        alt=""
                        className="inline-block lg:h-8 h-6 align-text-top mx-1 invert"
                    />button to generate an AI-powered breakdown of the concept.</p>
                    <img
                        src={sc2Img}
                        alt="sc2"
                        className="max-w-[50%]"
                    />
                </div>
            </div>
        </div>
    )
}
