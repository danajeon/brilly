import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'react-router-dom';

import Elaborator from '../components/Elaborator';

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ShuffleOnIcon from '@mui/icons-material/ShuffleOn';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// Info needed to connect to Supabase
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Card {
    id: string;
    front: string;
    back: string;
    cardSet: string;
    ai: string | null;
    index: number
}

export default function Flashcards({ isDemo }: { isDemo: boolean }) {
    const params = useParams<{ postId: string }>();
    const cardSetId = params.postId
    const [cardsArray, setCardsArray] = useState<Card[]>([])
    const [showFront, setShowFront] = useState(true)
    const [title, setTitle] = useState('')
    const [cardIndex, setCardIndex] = useState(0)
    const [front, setFront] = useState('')
    const [back, setBack] = useState('')
    const [disableForwardButton, setDisableForwardButton] = useState(false)
    const [disableBackButton, setDisableBackButton] = useState(false)
    const [originalCardsArray, setOriginalCardsArray] = useState<Card[]>([]);
    const [isShuffled, setIsShuffled] = useState(false);

    //function that takes in cardsArray to shuffle
    const shuffleArray = (array: Card[]) => {
        return [...array].sort(() => Math.random() - 0.5);
    }

    useEffect(() => {
        if (isDemo) {
            // DEMO MODE: fetch from localStorage
            const storedSets = JSON.parse(localStorage.getItem('cardSets') || '[]');
            const foundSet = storedSets.find((s: any) => s.id === cardSetId);

            if (foundSet) {
                setTitle(foundSet.title);

                // cards for this set
                const storedCards = JSON.parse(localStorage.getItem('cards') || '[]');
                const demoCards = storedCards
                    .filter((c: any) => c.cardSet === cardSetId)
                    .sort((a: any, b: any) => a.index - b.index);

                setCardsArray(demoCards);
                setOriginalCardsArray(demoCards);
            }
        } else {
            // Fetches cardSet by ID
            async function fetchCardSet() {
                try {
                    const { data, error } =
                        await supabase
                            .from("cardSets")
                            .select("*")
                            .eq("id", cardSetId).single();
                    if (error) throw error;
                    if (data) setTitle(data.title);
                }

                catch (error) {
                    console.error(error);
                    alert('Error fetching card sets.');
                }
            }
            fetchCardSet()

            // Fetches all cards in given cardSet
            async function fetchCards() {
                try {
                    const { data, error } =
                        await supabase
                            .from("cards")
                            .select("*")
                            .eq("cardSet", cardSetId)
                            .order("index", { ascending: true });
                    if (error) throw error;
                    if (data) {
                        setCardsArray(data)
                        setOriginalCardsArray(data)
                    };
                }

                catch (error) {
                    console.error(error);
                    alert('Error fetching cards.');
                }
            }
            fetchCards()
        }
    }, []);

    // Updates front and back of first card when cardsArray is populated
    useEffect(() => {
        setShowFront(true)

        if (cardsArray.length > 0) {
            setFront(cardsArray[cardIndex].front)
            setBack(cardsArray[cardIndex].back)
        }

        // Disables forward button when at last card
        if (cardIndex === cardsArray.length - 1) {
            setDisableForwardButton(true)
        }
        else {
            setDisableForwardButton(false)
        }

        // Disables back button when at first card
        if (cardIndex === 0) {
            setDisableBackButton(true)
        }
        else {
            setDisableBackButton(false)
        }
    }, [cardsArray, cardIndex])

    // Forward 1 card
    const addOne = () => {
        const current = cardIndex
        setCardIndex(current + 1)
    }

    // Back 1 card
    const minusOne = () => {
        const current = cardIndex
        setCardIndex(current - 1)
    }

    const handleSaveElaboration = async (cardId: string, elaborationText: string) => {
        if (isDemo) {
            // DEMO MODE: update localStorage
            const storedCards = JSON.parse(localStorage.getItem('cards') || '[]');
            const updated = storedCards.map((card: any) =>
                card.id === cardId ? { ...card, ai: elaborationText } : card
            );
            localStorage.setItem('cards', JSON.stringify(updated));

            setCardsArray((prev) =>
                prev.map((card) => (card.id === cardId ? { ...card, ai: elaborationText } : card))
            );
        } else {
            await supabase
                .from('cards')
                .update({ ai: elaborationText })
                .eq('id', cardId)
                .then(({ error }) => {
                    if (error) {
                        console.error('Error saving elaboration to Supabase:', error);
                    }
                    else {
                        // Update local state to reflect new elaboration without refresh
                        setCardsArray(prev =>
                            prev.map(card =>
                                card.id === cardId ? { ...card, ai: elaborationText } : card
                            )
                        );
                    }
                });
        }
    };

    // 
    const handleShuffle = () => {
        if (isShuffled) {
            // Un-shuffle
            setCardsArray(originalCardsArray);
            setIsShuffled(false);
            setCardIndex(0);
        } else {
            // Shuffle
            const shuffled = shuffleArray(originalCardsArray);
            setCardsArray(shuffled);
            setIsShuffled(true);
            setCardIndex(0);
        }
    }


    return (
        <div className={`h-screen overflow-y-hidden ${cardsArray.length > 0 ? 'opacity-100' : 'opacity-0'}`}>

            <div className="h-[95%] w-screen flex flex-col items-center justify-center bg-[#88B1CA]">
                <div className="flex flex-row h-full w-[70%] gap-8 mt-8">
                    {/* left side */}
                    <div className='h-[80%] w-1/2'>
                        <h1 className='w-full text-xl text-[#004D7C] font-semibold text-left line-clamp-2 mb-2'>{title}</h1>
                        <div className='flex justify-center items-center'>
                            <div className="w-[90%] aspect-5/3 bg-white rounded-md shadow-lg/50">

                                {showFront ?
                                    // CARD FRONT
                                    <div
                                        className="w-full h-full flex justify-center items-center text-center text-4xl p-4"
                                        onClick={() => setShowFront(false)}>
                                        <span>{front}</span>
                                    </div>
                                    :
                                    // CARD BACK
                                    <div
                                        className="w-full h-full flex justify-center items-center text-center text-2xl p-4"
                                        onClick={() => setShowFront(true)}>
                                        <span>{back}</span>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className='flex justify-evenly items-center p-2'>
                            <button
                                className={`text-[#004D7C] active:scale-90 ${disableBackButton ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                                onClick={() => minusOne()}
                                disabled={disableBackButton}>
                                <ArrowCircleLeftIcon />
                            </button>
                            <span className='font-semibold text-[#004D7C] text-md font-bold'>
                                {cardIndex + 1}/{cardsArray.length}
                            </span>
                            <button
                                className={`text-[#004D7C] active:scale-90 ${disableForwardButton ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                                onClick={() => addOne()}
                                disabled={disableForwardButton}>
                                <ArrowCircleRightIcon />
                            </button>
                        </div>
                        <div className='w-full aspect-5/3 rounded-md'>
                            {cardsArray.length > 0 && (
                                <Elaborator
                                    flashcardContent={front}
                                    cardId={cardsArray[cardIndex].id}
                                    ai={cardsArray[cardIndex].ai}
                                    onSaveElaboration={handleSaveElaboration}
                                />
                            )}
                        </div>
                    </div>

                    {/* right side */}
                    <div className='h-[85%] w-1/2 bg-[#004D7C] border border-white border-2 rounded-md px-4'>
                        <div className='flex justify-between py-2 text-white'>
                            <div
                                className='hover:cursor-pointer'
                                onClick={() => handleShuffle()}>
                                {isShuffled ?
                                    <ShuffleOnIcon
                                        sx={{ color: 'white' }}
                                    />
                                    :
                                    <ShuffleIcon
                                        sx={{ color: 'white' }}
                                    />
                                }
                            </div>
                        </div>
                        <div className='h-[90%] overflow-y-scroll pr-3'>
                            <div className='flex flex-col gap-1'>
                                {cardsArray.length === 0 && (
                                    <p className="text-gray-700">No cards found.</p>)}
                                {cardsArray.map((card, i) => (
                                    <div
                                        key={card.id}
                                        className={`rounded-md flex p-3 gap-2 cursor-pointer ${i === cardIndex ? 'bg-[#88B1CA]' : 'bg-zinc-200'}`}
                                        onClick={() => {
                                            setCardIndex(i)
                                        }}>
                                        <div className="min-w-[25%]  aspect-5/3 bg-white rounded-md flex justify-center items-center">
                                            <p className="m-3 text-sm font-medium text-center">{card.front}</p>
                                        </div>
                                        <p className="text-sm text-black my-4 line-clamp-2">{card.back}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}