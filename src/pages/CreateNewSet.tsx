import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";

import { NavBar } from "../components/NavBar";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// Info needed to connect to Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Interface allows declaration merging
interface Card {
  front: string;
  back: string;
}

export default function CreateNewSet() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [cards, setCards] = useState<Card[]>([{ front: "", back: "" }]);
  const [loading, setLoading] = useState(false);

  const addNewCard = () => {
    setCards([...cards, { front: "", back: "" }]);
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
    setLoading(true);

    // Explicit declaration of current type vs anticipated type
    let createdCardSetId: string | null = null

    try {
      // Initiates user auth before creating sets

      // const user = await supabase.auth.getUser();
      // const userId = user.data.user?.id;
      // if (!userId) {
      //   alert("You must be logged in to create a set.");
      //   setLoading(false);
      //   return;
      // }

      // Assigns unique ID for card set
      // Creates cardSet row within database
      const { data: cardSetData, error: cardSetError } = await supabase
        .from("cardSets")
        .insert([{ title, id: `cdst${crypto.randomUUID()}`, quantity: cards.length }])
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
      setCards([{ front: "", back: "" }]);
    }

    // Catches error when they are thrown from try
    catch (error) {
      console.error(error);

      // Pulls ID of cardSet that triggers error
      if (createdCardSetId) {
        // Delete cards with that cardSet id
        await supabase.from("cards").delete().eq("cardSet", createdCardSetId);
        // Delete cardSet
        await supabase.from("cardSets").delete().eq("id", createdCardSetId);
      }
      alert("Error creating flashcard set.");
    }

    finally {
      setLoading(false);
      navigate('/')
    }
  };

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

  return (
    <div className="h-screen overflow-y-hidden">
      <NavBar />
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#88B1CA]">
        <div className="h-[95%] min-w-[75%]">
          <div className="flex flex-row justify-start">
            <h1 className="text-3xl text-[#004D7C] font-semibold mb-4">Create New Set</h1>
          </div>
          <div className="h-[70%] w-full bg-white rounded-lg shadow-xl p-6">
            <div className="mb-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-200 rounded-lg p-2"
              />
              <span className="text-lg font-semibold text-[#004D7C]">Title</span>
            </div>
            <div className="h-[80%] px-4 overflow-scroll">
              {cards.map((card, index) => (
                <div className="flex justify-between flex-row w-full">
                  <div key={index} className="flex flex-1 bg-[#88B1CA] rounded-lg shadow-md my-1">
                    <p className="flex w-[3%] justify-center items-center text-lg font-semibold text-[#004D7C] ml-3">{index + 1}</p>
                    <div className="flex justify-between w-[95%] gap-3 m-2">
                      <div className="w-[50%] flex-1 bg-white rounded-lg p-2">
                        <textarea
                          
                          value={card.front}
                          onChange={(e) => handleCardChange(index, "front", e.target.value)}
                          className="w-full bg-zinc-200 rounded p-1 text-sm max-h-[200px] resize-none"
                        />
                        <span className="text-sm font-semibold">Front</span>
                      </div>
                      <div className="w-[50%] flex-1 bg-white rounded-lg p-2">
                        <textarea
                          
                          value={card.back}
                          onChange={(e) => handleCardChange(index, "back", e.target.value)}
                          className=" w-full bg-zinc-200 rounded p-1 text-sm max-h-[200px] resize-none"
                        />
                        <span className="text-sm font-semibold">Back</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCard(index)}
                    className="cursor-pointer z-1">
                    <DeleteForeverIcon
                      fontSize="large"
                      className="hover:text-red-500 " />
                  </button>
                </div>
              ))}

              <button
                onClick={addNewCard}
                className="w-full border-3 border-[#88B1CA] rounded-lg text-[#88B1CA] text-lg font-semibold p-2 mt-4 mb-4 hover:bg-blue-200 cursor-pointer"
              >
                Add New +
              </button>
            </div>
          </div>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="w-full bg-[#004D7C] text-white text-lg font-semibold rounded-lg shadow-xl mt-4 mb-8 p-3 hover:bg-white hover:text-[#004D7C] border-[#004D7C] disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
