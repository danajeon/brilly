import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import cardsImg from "../assets/cards.webp"
import createImg from "../assets/createnew.webp"

import { NavBar } from '../components/NavBar';

// Info needed to connect to Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Interface allows declaration merging
interface CardSet {
  id: string;
  created: string;
  title: string;
  user: string;
  quantity: number;
}

export default function Dashboard() {
  const [cardSetArray, setCardSetArray] = useState<CardSet[]>([]);
  const [hoveredCardSet, setHoveredCardSet] = useState<CardSet | null>(null)

  const isoTime = (hoveredCardSet ? new Date(hoveredCardSet.created).toLocaleDateString() : null)

  const navigate = useNavigate();

  // Pulls up cardSets as soon as page renders
  // Runs only once because dependency is empty
  useEffect(() => {
    async function fetchCardSets() {
      try {
        const { data, error } = await supabase.from('cardSets').select("*");
        if (error) throw error;
        if (data) setCardSetArray(data);
      }

      catch (error) {
        console.error(error);
        alert('Error fetching card sets.');
      }
    }

    fetchCardSets();
  }, []);

  const handleCardSetClick = (cardSetId: string) => {
    navigate(`/flashcards/${cardSetId}`)
  }

  const handleCreateNewSet = () => {
    navigate('/createnewset')
  }

  return (
    <div className="h-screen overflow-y-hidden">
      <NavBar />
      <div className="h-full w-screen flex flex-col items-center justify-center bg-[#88B1CA]">
        <div className="min-h-[95%] max-w-[75%]">
          <h1 className="text-3xl font-semibold text-white mb-4">Welcome, </h1>
          <span className='text-3xl font-semibold text-[#004D7C]'>{ }</span>
          <div className='min-h-[75%] flex flex-row justify-between gap-3 w-full overflow-scroll'>
            <div className="grid grid-cols-4 gap-4 bg-white rounded-lg shadow-xl p-6 w-[80%]">
              <div className=' flex flex-col items-center justify-between bg-white border-3 border-transparent hover:border-[#88B1CA] rounded-md p-4 aspect-1/1 cursor-pointer'>
                <div
                  className='flex justify-center items-center h-7/10'
                  onClick={() => handleCreateNewSet()}>
                  <img
                      src={createImg}
                      className="w-[70%] shadow-md">
                    </img>
                </div>
                <span className="text-md font-medium">Create New Set</span>
              </div>
              {cardSetArray.map((cardSet) => (
                <div
                  key={cardSet.id}
                  className='flex flex-col items-center justify-between bg-white border-3 border-transparent hover:border-[#88B1CA] rounded-md p-4 aspect-1/1 cursor-pointer overflow-hidden'
                  onClick={() => handleCardSetClick(cardSet.id)}
                  onMouseEnter={() => setHoveredCardSet(cardSet)}>
                  <div className="h-7/10 flex justify-center items-center ">
                    <img
                      src={cardsImg}
                      className="w-[80%]">
                    </img>
                  </div>
                  <p className="text-md font-medium w-full text-center line-clamp-2">{cardSet.title}</p>
                </div>
              ))}
            </div>
            <div className='w-[20%] flex flex-col bg-[#004D7C] rounded-md p-6 text-white'>
              {cardSetArray.length > 0 ? 
              <div>
                <p className="font-semibold text-lg pb-2">{hoveredCardSet?.title}</p>
                <p className='text-xs pb-5'>Created on {isoTime}</p>
                <p className=''>{hoveredCardSet?.quantity} cards</p>
              </div>
              : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}