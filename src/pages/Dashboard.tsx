import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import cardsImg from "../assets/cards.webp"
import createImg from "../assets/createnew.webp"

import { NavBar } from '../components/NavBar';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

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

  const [sortOpen, setSortOpen] = useState(false)

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

  const handleSetDelete = async (cardSet: CardSet) => {
    if (confirm(`Are you sure you want to delete ${cardSet.title}?`)) {
      try {
        // Delete cards with that cardSet id
        await supabase.from("cards").delete().eq("cardSet", cardSet.id);
        // Delete cardSet
        await supabase.from("cardSets").delete().eq("id", cardSet.id);

        const { data, error } = await supabase.from('cardSets').select("*");
        if (error) throw error;
        if (data) setCardSetArray(data);

      }

      catch (error) {
        alert("Error deleting card set. Please try again")
      }
    }
  }

  // Sort by creation date (newest to oldest)
  const handleCardSetSortByDateDesc = () => {
    const sortedArray = [...cardSetArray].sort((a, b) =>
      new Date(b.created).getTime() - new Date(a.created).getTime()
    );
    setCardSetArray(sortedArray);
  };

  // Sort by creation date (oldest to newest)
  const handleCardSetSortByDateAsc = () => {
    const sortedArray = [...cardSetArray].sort((a, b) =>
      new Date(a.created).getTime() - new Date(b.created).getTime()
    );
    setCardSetArray(sortedArray);
  };

  // Sort by ascending alphabetical order (A - Z)
  const handleCardSetSortAZ = () => {
    const sortedArray = [...cardSetArray].sort((a, b) =>
      a.title.localeCompare(b.title));
    setCardSetArray(sortedArray)
  }

  // Sort by descending alphabetical order (Z - A)
  const handleCardSetSortZA = () => {
    const sortedArray = [...cardSetArray].sort((a, b) =>
      b.title.localeCompare(a.title));
    setCardSetArray(sortedArray)
  }

  return (
    <div className={`h-screen overflow-y-hidden ${cardSetArray.length > 0 ? 'opacity-100' : 'opacity-100'}`}>
      <NavBar />
      <div className="h-full w-screen flex flex-col items-center justify-center bg-[#88B1CA]">
        <div className="min-h-[95%] max-w-[75%]">
          <h1 className="text-3xl font-semibold text-white mb-4">Welcome, </h1>
          <span className='text-3xl font-semibold text-[#004D7C]'>{ }</span>
          <div className='h-[75%] w-full flex flex-row justify-between gap-3'>
            <div className="h-full w-[80%] bg-white rounded-lg shadow-xl px-6 py-2 overflow-scroll flex flex-col items-end">
              <div
                className='w-[10%] relative border text-xs p-1 hover:bg-grey-200'
                onClick={() => setSortOpen(!sortOpen)}>
                Sort by:
                <div className={`w-inherit absolute top-6 p-1 ${sortOpen ? "block" : "hidden"} border`}>
                  <div 
                    className='hover:bg-grey-200'
                    onClick={() => handleCardSetSortByDateDesc()}>
                      Date Newest
                  </div>
                  <div 
                    className='hover:bg-grey-200'
                    onClick={() => handleCardSetSortByDateAsc()}>
                      Date Oldest
                  </div>
                  <div 
                    className='hover:bg-grey-200'
                    onClick={() => handleCardSetSortAZ()}>
                      Title Ascending
                  </div>
                  <div
                    className='hover:bg-grey-200'
                    onClick={() => handleCardSetSortZA()}>
                      Title Descending
                  </div>
                </div>
              </div>
              <div className='w-full grid grid-cols-4 gap-4'>
                <div className='flex flex-col items-center justify-between bg-white border-3 border-transparent hover:border-[#88B1CA] rounded-md p-4 aspect-1/1 cursor-pointer'>
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
                    className='flex flex-col items-center justify-between bg-white border-3 border-transparent hover:border-[#88B1CA] rounded-md p-4 aspect-1/1 cursor-pointer relative'
                    onClick={() => handleCardSetClick(cardSet.id)}
                    onMouseEnter={() => setHoveredCardSet(cardSet)}
                    onMouseLeave={() => setHoveredCardSet(null)}>
                    <div className="h-7/10 flex justify-center items-center ">
                      <img
                        src={cardsImg}
                        className="w-[80%]">
                      </img>
                    </div>
                    <p className="text-md font-medium w-full text-center line-clamp-2">{cardSet.title}</p>
                    <button
                      className={`absolute top-0 right-0 p-1 aspect-1/1 flex justify-center items-center z-4 hover:text-red-500 cursor-pointer ${hoveredCardSet === cardSet ? 'opacity-100' : 'opacity-0'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetDelete(cardSet);
                      }}
                    >
                      <DeleteForeverIcon fontSize='small' />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className='w-[20%] flex flex-col bg-[#004D7C] rounded-md p-6 text-white'>
              {hoveredCardSet ?
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
    </div >
  );
}