import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import cardsImg from "../assets/cards.webp"
import createImg from "../assets/createnew.webp"

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

type Props = {
  isDemo: boolean;
  user: any
};

export default function Dashboard({ isDemo, user }: Props) {

  const [cardSetArray, setCardSetArray] = useState<CardSet[]>([]);
  const [hoveredCardSet, setHoveredCardSet] = useState<CardSet | null>(null)

  const [sortOpen, setSortOpen] = useState(false)

  const isoTime = (hoveredCardSet ? new Date(hoveredCardSet.created).toLocaleDateString() : null)

  const navigate = useNavigate();

  const at = user ? user.email.indexOf("@") : null
  const trimmed = user ? user.email.slice(0, at) : null

  // Forces user to Landing Page if not demo or not signed in
  useEffect(() => {
    if (!isDemo && !user) {
      navigate("/")
    }
  }, [])

  // Pulls up cardSets when page renders or when user/isDemo changes
  useEffect(() => {
    if (isDemo) {
      // --- DEMO MODE: Load from localStorage instead of Supabase ---
      const localSets = localStorage.getItem("cardSets");

      if (localSets) {
        try {
          setCardSetArray(JSON.parse(localSets));
        } catch (err) {
          console.error("Error parsing localStorage cardSets:", err);
          setCardSetArray([]);
        }
      } else {
        setCardSetArray([]); // no sets yet in localStorage
      }
    } else {
      // If not logged in yet, clear list and wait
      if (!user) {
        setCardSetArray([]);
        return;
      }

      async function fetchCardSets() {
        try {
          // Filter cardSets by the logged-in user's id.
          // If your cardSets.user column stores email instead, use .eq('user', user.email)
          const { data, error } = await supabase
            .from('cardSets')
            .select('*')
            .eq('user', user.id);

          if (error) throw error;
          if (data) setCardSetArray(data);
        }

        catch (error) {
          console.error(error);
          alert('Error fetching card sets.');
        }
      }

      fetchCardSets();
    }
  }, [isDemo, user]);

  const handleCardSetClick = (cardSetId: string) => {
    navigate(`/flashcards/${cardSetId}`)
  }

  const handleCreateNewSet = () => {
    navigate('/createnewset')
  }

  const handleSetDelete = async (cardSet: CardSet) => {
    if (!confirm(`Are you sure you want to delete ${cardSet.title}?`)) return;

    try {
      if (!isDemo) {
        // Delete cards with that cardSet id
        const { error: delCardsErr } = await supabase.from("cards").delete().eq("cardSet", cardSet.id);
        if (delCardsErr) throw delCardsErr;

        // Delete cardSet
        const { error: delSetErr } = await supabase.from("cardSets").delete().eq("id", cardSet.id);
        if (delSetErr) throw delSetErr;

        // refresh list
        const { data, error } = await supabase.from('cardSets').select("*").eq('user', user!.id);
        if (error) throw error;
        if (data) setCardSetArray(data);
      } else {
        // demo mode: delete from localStorage
        const localSets = localStorage.getItem("cardSets");
        if (localSets) {
          const parsed: CardSet[] = JSON.parse(localSets);
          const updated = parsed.filter((s) => s.id !== cardSet.id);
          localStorage.setItem("cardSets", JSON.stringify(updated));
          setCardSetArray(updated);
        }
      }
    }

    catch (error) {
      console.error(error);
      alert("Error deleting card set. Please try again")
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
    <div className="h-screen overflow-y-hidden">

      <div className="h-full w-screen flex flex-col items-center justify-center bg-[#88B1CA]">
        <div className="min-h-[95%] lg:max-w-[75%]
        md:max-w-[95%]">
          <h1 className="lg:text-3xl md:text-3xl text-xl font-semibold text-white mx-3 mb-4">Welcome{user ? `, ${trimmed}` : ''}</h1>
          <div className='lg:h-[75%] md:h-[75%] h-[80%] w-full flex lg:flex-row 
          md:flex-row flex-col 
          items-center lg:justify-between  md:justify-between gap-1'>
            <div className="lg:h-full md:h-full h-[80%] lg:w-[80%] md:w-[80%] w-[95%] bg-white rounded-lg shadow-xl px-4 py-2 overflow-y-scroll flex flex-col items-end gap-1"> 
              <button
                className="flex relative w-[100px] hover:bg-slate-200 bg-slate-100 text-xs px-3 py-1 text-left shadow-md rounded-sm justify-between z-3" 
                onClick={() => setSortOpen(!sortOpen)}
              >
                Sort by
                {sortOpen ? <span>▲</span> : <span>▼</span>}
                {/* Dropdown Menu */}
                {sortOpen && (
                  <div className="absolute left-0 mt-6 w-full bg-slate-100 shadow-md z-6 rounded-sm">
                    <div
                      className="px-3 py-2 hover:bg-[#88B1CA] cursor-pointer"
                      onClick={() => handleCardSetSortByDateDesc()}
                    >
                      Date Newest
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-[#88B1CA] cursor-pointer"
                      onClick={() => handleCardSetSortByDateAsc()}
                    >
                      Date Oldest
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-[#88B1CA] cursor-pointer"
                      onClick={() => handleCardSetSortAZ()}
                    >
                      Title Ascending
                    </div>
                    <div
                      className="px-3 py-2 hover:bg-[#88B1CA] cursor-pointer"
                      onClick={() => handleCardSetSortZA()}
                    >
                      Title Descending
                    </div>
                  </div>
                )}
              </button>
              {/* lg and md */}
              <div className='w-full lg:grid md:grid hidden lg:grid-cols-4 md:grid-cols-3 gap-4'>
                <div className='flex flex-col items-center justify-between bg-white border-3 border-transparent hover:border-[#88B1CA] rounded-md p-4 aspect-1/1 cursor-pointer'>
                  <div
                    className='flex justify-center items-center h-7/10'
                    onClick={() => handleCreateNewSet()}>
                    <img
                      src={createImg}
                      className="w-[70%] shadow-md">
                    </img>
                  </div>
                  <span className="text-sm text-center">Create New Set</span>
                </div>
                {cardSetArray.map((cardSet, i) => (
                  <div
                    key={cardSet.id}
                    className={`flex flex-col items-center justify-between border-3 border-transparent hover:border-[#88B1CA] rounded-md p-4 aspect-1/1 cursor-pointer relative ${i%2 ? 'bg-white':'bg-slate-100'}`}
                    onClick={() => handleCardSetClick(cardSet.id)}
                    onMouseEnter={() => setHoveredCardSet(cardSet)}
                    onMouseLeave={() => setHoveredCardSet(null)}>
                    <div className="h-7/10 flex justify-center items-center ">
                      <img
                        src={cardsImg}
                        className="w-[80%]">
                      </img>
                    </div>
                    <p className="text-sm font-medium w-full text-center line-clamp-2">{cardSet.title}</p>
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
                {/* sm */} 
                <div className='w-full lg:hidden md:hidden grid grid-cols-1 gap-2 my-3'>
                  <div className='flex w-full border-transparent bg-[#004D7C] rounded-md cursor-pointer justify-center items-center text-white p-2'
                  onClick={() => handleCreateNewSet()}>
                    <span className="text-xs">Create New Set</span>
                  </div>
                  {cardSetArray.map((cardSet, i) => (
                    <div
                      key={cardSet.id}
                      className={`flex items-center justify-between border-2 border-transparent cursor-pointer relative p-1 ${i%2 ? 'bg-white':'bg-slate-200'}`}
                      onClick={() => handleCardSetClick(cardSet.id)}
                      onMouseEnter={() => setHoveredCardSet(cardSet)}
                      onMouseLeave={() => setHoveredCardSet(null)}>
                      <div className="h-full w-[20%] flex items-center">
                        <img
                          src={cardsImg}
                          className="w-full">
                        </img>
                      </div>
                      <div className='flex-col w-[65%]'>
                        <p className="text-xs font-semibold w-full text-left break-words">{cardSet.title}</p>
                        <div className='text-xs flex gap-6'>
                          <p>{new Date(cardSet.created).toLocaleDateString()}</p>
                          <p>{cardSet.quantity} {cardSet.quantity > 1 ? " cards" : " card"}</p>
                        </div>
                      </div>
                      <button
                        className={`w-[10%] aspect-1/1 flex justify-center items-center z-2 hover:text-red-500 cursor-pointer`}
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
              <div className='lg:w-[20%] md:w-[20%] lg:h-full md:h-full h-1/10 lg:flex md:flex hidden flex-col bg-[#004D7C] rounded-md lg:p-6 md:p-3 text-white'>
                {hoveredCardSet ?
                  <div className="flex flex-col pb-2 gap-4">
                    <p className="font-semibold lg:text-lg text-sm break-words">{hoveredCardSet?.title}</p>
                    <p className='text-xs'>Created on {isoTime}</p>
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
