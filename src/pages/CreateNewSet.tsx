import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { createClient } from "@supabase/supabase-js";

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 p-4">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Create New Set</h1>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2 mb-4"
        />

        {cards.map((card, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <input
              type="text"
              placeholder="Front"
              value={card.front}
              onChange={(e) => handleCardChange(index, "front", e.target.value)}
              className="flex-1 border rounded p-2"
            />
            <input
              type="text"
              placeholder="Back"
              value={card.back}
              onChange={(e) => handleCardChange(index, "back", e.target.value)}
              className="flex-1 border rounded p-2"
            />
          </div>
        ))}

        <button
          onClick={addNewCard}
          className="w-full border rounded p-2 mb-4 text-blue-600 hover:bg-blue-50"
        >
          Add New +
        </button>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </div>
  );
}
