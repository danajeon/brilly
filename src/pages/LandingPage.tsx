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
            <div className='bg-[#88B1CA]'>
                <div className="max-w-[1600px] flex flex-row justify-center gap-6">
                    <div className="w-[300px] flex flex-col justify-center items-center">
                        <h2 className='text-white text-4xl font-semibold text-left mb-10'>Smarter Study, Beautifully Designed</h2>
                        <h4 className='text-[#004D7C] text-xl mb-6'>Smarter flashcards powered by AI. Memorize quickly, understand deeply, and retain longer.</h4>
                        <button
                            className="bg-[#004D7C] text-white rounded-2xl px-8 py-2 hover:bg-white hover:text-[#004D7C] hover:cursor-pointer"
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
                <div className="max-w-[1600px] flex flex-col bg-white py-15">
                    <h3 className="flex flex-col items-center text-[#004D7C] text-3xl font-semibold pb-5">More of a Learning Tool Than a Memorization Tool</h3>
                    <div className="flex flex-row justify-center gap-4">
                        <div className="max-w-[15%] flex flex-col items-center text-center m-5">
                            <img
                                src={plusImg}
                                alt="plus"
                                className="w-[100px]"
                            />
                            <span className="flex text-[#004D7C] text-lg font-semibold">Create your set of flashcards.</span>
                        </div>
                        <div className="max-w-[15%] flex flex-col items-center text-center m-5">
                            <img
                                src={brainImg}
                                alt="brain"
                                className="w-[100px]"
                            />
                            <span className="text-[#004D7C] text-lg font-semibold">Let Artificial Intelligence elaborate and explain.</span>
                        </div>
                        <div className="max-w-[15%] flex flex-col items-center text-center m-5">
                            <img
                                src={knowledgeImg}
                                alt="knowledge"
                                className="w-[100px]"
                            />
                            <span className="text-[#004D7C] text-lg font-semibold">Memorize, and most importantly, LEARN.</span>
                        </div>
                    </div>
                </div>
                <div className="max-w-[1600px] flex flex-col bg-[#004D7C] items-center gap-4 py-4">
                    <img
                        src={sc1Img}
                        alt="sc1"
                        className="w-[40%]"
                    />
                    <p className="w-[80%] text-white text-2xl text-center">For additional definitions or explanations, select the Elaborate<img
                        src={aiImg}
                        alt=""
                        className="inline-block h-8 align-text-top mx-1 invert"
                    />button to generate an AI-powered breakdown of the concept.</p>
                    <img
                        src={sc2Img}
                        alt="sc2"
                        className="w-[30%]"
                    />
                </div>
            </div>
        </div>
    )
}
