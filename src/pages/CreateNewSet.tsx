import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';

// Info needed to connect to Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Interface allows declaration merging
interface Card {
  front: string;
  back: string;
  _cid?: string; // client-only id for React keys
}

type Props = {
  isDemo: boolean;
  user: any
};

export default function CreateNewSet({ isDemo, user }: Props) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [cards, setCards] = useState<Card[]>([{ front: "", back: "", _cid: crypto.randomUUID() }]);
  const [loading, setLoading] = useState(false);

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const addNewCard = () => {
    setCards([...cards, { front: "", back: "", _cid: crypto.randomUUID() }]);
  };

  const handleCardChange = (index: number, field: "front" | "back", value: string) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleCreate = async () => {
    // trim() removes whitespace from both ends
    // ! turns "" into true so if statement can run
    if (!title.trim()) {
      alert("Please enter a title for your set.");
      return;
    }

    if (cards.some((card) => !card.front.trim() || !card.back.trim())) {
      alert("One or more blank cards. Please fill out or delete.");
      return;
    }
    setLoading(true);

    // Explicit declaration of current type vs anticipated type
    let createdCardSetId: string | null = null;

    try {
      if (isDemo) {
        // DEMO MODE — store in localStorage instead of Supabase

        // Assigns unique ID for card set
        createdCardSetId = `cdst${crypto.randomUUID()}`;

        const cardSetData = {
          id: createdCardSetId,
          title,
          quantity: cards.length,
          created: new Date().toISOString(),
        };

        // Save card set into localStorage
        const existingSets = JSON.parse(localStorage.getItem("cardSets") || "[]");
        localStorage.setItem("cardSets", JSON.stringify([...existingSets, cardSetData]));

        // Assigns ID, front & back, cardSet ID for every card
        const newCards = cards.map((card, i) => ({
          id: `cd${crypto.randomUUID()}`,
          front: card.front,
          back: card.back,
          cardSet: createdCardSetId,
          ai: null,
          index: i,
        }));

        const existingCards = JSON.parse(localStorage.getItem("cards") || "[]");
        localStorage.setItem("cards", JSON.stringify([...existingCards, ...newCards]));

        alert("Flashcard set created successfully!");

        // Resets title, front & back to blank
        setTitle("");
        setCards([{ front: "", back: "", _cid: crypto.randomUUID() }]);

        setLoading(false);
        navigate("/dashboard");
      }

      else {
        // NORMAL MODE — Supabase storage

        // Assigns unique ID for card set
        // Creates cardSet row within database
        const { data: cardSetData, error: cardSetError } = await supabase
          .from("cardSets")
          .insert([{ title, id: `cdst${crypto.randomUUID()}`, quantity: cards.length, user: user.id }])
          .select()
          .single();

        // Stores createdCardSetId into temp variable
        createdCardSetId = cardSetData.id;
        if (cardSetError) throw cardSetError;

        // Assigns ID, front & back, cardSet ID for every card
        const { error: cardsError } = await supabase.from("cards").insert(
          cards.map((card, i) => ({
            id: `cd${crypto.randomUUID()}`,
            front: card.front,
            back: card.back,
            cardSet: cardSetData.id,
            ai: null,
            index: i,
          }))
        );

        if (cardsError) throw cardsError;

        alert("Flashcard set created successfully!");

        // Resets title, front & back to blank
        setTitle("");
        setCards([{ front: "", back: "", _cid: crypto.randomUUID() }]);

        setLoading(false);
        navigate("/dashboard");
      }
    }

    // Catches error when they are thrown from try
    catch (error) {
      console.error(error);

      if (!isDemo) {
        // Pulls ID of cardSet that triggers error
        if (createdCardSetId) {
          // Delete cards with that cardSet id
          await supabase.from("cards").delete().eq("cardSet", createdCardSetId);
          // Delete cardSet
          await supabase.from("cardSets").delete().eq("id", createdCardSetId);
        }
      }

      alert("Error creating flashcard set.");
    }
  };

  // const handleCreate = async () => {
  //   // trim() removes whitespace from both ends
  //   // ! turns "" into true so if statement can run
  //   if (!title.trim()) {
  //     alert("Please enter a title for your set.");
  //     return;
  //   }

  //   if (cards.some((card) => !card.front.trim() || !card.back.trim())) {
  //     alert("One or more blank cards. Please fill out or delete.");
  //     return;
  //   }
  //   setLoading(true);

  //   // Explicit declaration of current type vs anticipated type
  //   let createdCardSetId: string | null = null

  //   try {
  //     // Initiates user auth before creating sets

  //     // const user = await supabase.auth.getUser();
  //     // const userId = user.data.user?.id;
  //     // if (!userId) {
  //     //   alert("You must be logged in to create a set.");
  //     //   setLoading(false);
  //     //   return;
  //     // }

  //     // Assigns unique ID for card set
  //     // Creates cardSet row within database
  //     const { data: cardSetData, error: cardSetError } = await supabase
  //       .from("cardSets")
  //       .insert([{ title, id: `cdst${crypto.randomUUID()}`, quantity: cards.length }])
  //       .select()
  //       .single();

  //     // Stores createdCardSetId into temp variable
  //     createdCardSetId = cardSetData.id;
  //     if (cardSetError) throw cardSetError;

  //     // Assigns ID, front & back, cardSet ID for every card
  //     const { error: cardsError } = await supabase.from("cards").insert(
  //       cards.map((card, i) => ({
  //         id: `cd${crypto.randomUUID()}`,
  //         front: card.front,
  //         back: card.back,
  //         cardSet: cardSetData.id,
  //         ai: null,
  //         index: i,
  //       }))
  //     );

  //     if (cardsError) throw cardsError;

  //     alert("Flashcard set created successfully!");

  //     // Resets title, front & back to blank
  //     setTitle("");
  //     setCards([{ front: "", back: "", _cid: crypto.randomUUID() }]);
  //   }

  //   // Catches error when they are thrown from try
  //   catch (error) {
  //     console.error(error);

  //     // Pulls ID of cardSet that triggers error
  //     if (createdCardSetId) {
  //       // Delete cards with that cardSet id
  //       await supabase.from("cards").delete().eq("cardSet", createdCardSetId);
  //       // Delete cardSet
  //       await supabase.from("cardSets").delete().eq("id", createdCardSetId);
  //     }
  //     alert("Error creating flashcard set.");
  //   }

  //   finally {
  //     setLoading(false);
  //     navigate('/')
  //   }
  // };

  // Delete cards
  const deleteCard = (index: number) => {
    if (cards.length === 1) {
      alert("You must have at least one card.");
      return;
    }
    const newCards = [...cards];
    newCards.splice(index, 1);
    setCards(newCards);
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const from = dragIndex;
    const to = index;
    if (from === null || to === null) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    if (from === to) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    setCards(prev => {
      const newCards = [...prev];
      const [moved] = newCards.splice(from, 1);
      newCards.splice(to, 0, moved);
      return newCards;
    });

    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="h-screen overflow-y-hidden">
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#88B1CA]">
        <div className="h-[95%] lg:min-w-[80%] md:min-w-[95%] min-w-[95%] flex flex-col items-center">
          <div className="flex flex-row justify-start w-full">
            <h1 className="lg:text-3xl md:text-2xl text-lg text-[#004D7C] font-semibold mb-3">Create New Set</h1>
          </div>
          <div className="h-[75%] w-full bg-white rounded-lg shadow-xl lg:p-3 md:p-3 p-2 flex flex-col items-center">
            <div className="mb-2 w-full">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-200 rounded-lg lg:p-2 md:p-2 p-1"
              />
              <span className="lg:text-lg md:text-lg text-sm font-semibold text-[#004D7C]">Title</span>
            </div>
            <div className="w-full flex flex-col items-center lg:px-4 md:px-1 overflow-scroll">
              {cards.map((card, index) => {
                const isDragging = index === dragIndex;
                const isDragOver = index === dragOverIndex;
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between w-full transition-shadow ${isDragOver ? "border-t-2" : ""
                      } ${isDragging ? "opacity-60" : "opacity-100"}`}>
                    <p className="lg:flex md:flex hidden w-[3%] justify-start items-center lg:text-lg md:text-lg text-sm font-semibold text-[#004D7C]">{index + 1}</p>
                    <div className="flex  flex-1 bg-[#88B1CA] rounded-lg shadow-md my-1">
                      <div 
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className="text-sm flex lg:flex-row md:flex-row
                        flex-col items-center justify-evenly text-zinc-300 lg:p-1 md:p-1">
                          <p className="lg:hidden md:hidden flex justify-start items-center lg:text-lg md:text-lg text-xs font-semibold text-[#004D7C]">{index + 1}</p>
                          <DensityMediumIcon className="lg:scale-100 md:scale-80 scale-60 hover:cursor-pointer"/>
                          <button
                      onClick={() => deleteCard(index)}
                      className="lg:hidden md:hidden block cursor-pointer z-1">
                      <DeleteForeverIcon
                        className="lg:scale-120 md:scale-100 scale-80 text-black hover:text-red-500" />
                    </button>
                        </div>
                      
                      <div className="flex lg:flex-row md:flex-row flex-col justify-between w-[90%] lg:gap-3 md:gap-3 gap-1 my-1">
                        <div className="flex-1 bg-white rounded-lg lg:p-2 md:p-2 p-1">
                          <textarea
                            value={card.front}
                            onChange={(e) => handleCardChange(index, "front", e.target.value)}
                            className="w-full bg-zinc-200 rounded p-1 lg:text-sm md:text-sm text-xs max-h-[200px] resize-none"
                          />
                          <span className="lg:text-sm md:text-sm text-xs font-semibold">Front</span>
                        </div>
                        <div className="flex-1 bg-white rounded-lg lg:p-2 md:p-2 p-1">
                          <textarea

                            value={card.back}
                            onChange={(e) => handleCardChange(index, "back", e.target.value)}
                            className=" w-full bg-zinc-200 rounded p-1 lg:text-sm md:text-sm text-xs max-h-[200px] resize-none"
                          />
                          <span className="lg:text-sm md:text-sm text-xs font-semibold">Back</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCard(index)}
                      className="lg:block md:block hidden cursor-pointer z-1">
                      <DeleteForeverIcon
                        className="lg:scale-120 md:scale-100 scale-80 hover:text-red-500" />
                    </button>
                  </div>
                )
              })}
            </div>
            <button
                onClick={addNewCard}
                className="lg:w-[70%] md:w-[70%] w-full border-3 border-[#88B1CA] rounded-lg text-[#88B1CA] lg:text-lg md:text-lg text-sm font-semibold p-1 mt-2 hover:bg-blue-200 cursor-pointer"
              >
                Add New +
              </button>
          </div>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="lg:w-[70%] md:w-[70%] w-full bg-[#004D7C] text-white lg:text-lg md:text-lg text-sm font-semibold rounded-lg shadow-xl mt-4 mb-8 p-1 hover:bg-white hover:text-[#004D7C] border-[#004D7C] disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
