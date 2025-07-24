import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'react-router-dom';
import Elaborator from '../components/Elaborator';

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

export default function Flashcards() {
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

    useEffect(() => {
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
                if (data) setCardsArray(data);
            }

            catch (error) {
                console.error(error);
                alert('Error fetching cards.');
            }
        }
        fetchCards()
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
    };


    return (
        <div className='flex flex-row'>

            {/* left side */}
            <div className='w-1/2 bg-[lime]'>
                <h1>{title}</h1>
                <div className="w-[200px] h-[200px] border">

                    {showFront ?
                        // CARD FRONT
                        <div
                            className="w-full h-full"
                            onClick={() => setShowFront(false)}>
                            <span>{front}</span>
                        </div>
                        :
                        // CARD BACK
                        <div
                            className="w-full h-full"
                            onClick={() => setShowFront(true)}>
                            <span>{back}</span>
                        </div>
                    }
                </div>
                <div className='flex justify-evenly'>
                    <button
                        className={`bg-[DarkBlue] text-white ${disableBackButton ? 'bg-gray-400 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => minusOne()}
                        disabled={disableBackButton}>
                        back
                    </button>
                    <button
                        className={`bg-[OrangeRed] ${disableForwardButton ? 'bg-gray-400 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => addOne()}
                        disabled={disableForwardButton}>
                        forward
                    </button>
                </div>
                {cardsArray.length > 0 && (
                    <Elaborator
                        flashcardContent={front}
                        cardId={cardsArray[cardIndex].id}
                        ai={cardsArray[cardIndex].ai}
                        onSaveElaboration={handleSaveElaboration}
                    />
                )}
            </div>

            {/* right side */}
            <div className='w-1/2 bg-[chartreuse]'>
                {cardsArray.length === 0 && (
                    <p className="text-gray-700">No cards found.</p>)}
                {cardsArray.map((card, i) => (
                    <div
                        key={card.id}
                        className={`cursor-pointer ${i === cardIndex ? 'bg-[blue]' : 'bg-none'}`}
                        onClick={() => {
                            setCardIndex(i)
                        }}>
                        <p className="text-lg font-medium">{card.front}</p>
                        <p className="text-sm text-gray-500">{card.back}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}