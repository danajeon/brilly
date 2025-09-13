import { useState, useEffect } from 'react';
import aiImg from "../assets/ai.png"

interface ElaboratorProps {
  flashcardContent: string;
  ai: string | null;
  cardId: string | undefined;
  onSaveElaboration: (cardId: string, elaborationText: string) => void; // Void indicates function does not return a value
}


const Elaborator = ({ flashcardContent, cardId, ai, onSaveElaboration }: ElaboratorProps) => {
  // const [flashcardContent, setFlashcardContent] = useState('');
  const [elaboration, setElaboration] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Reset elaboration & auto-show existing ai when card changes
  useEffect(() => {
    if (ai) {
      setElaboration(ai);
    } else {
      setElaboration(null);
    }
  }, [flashcardContent, ai]);

  const handleElaborate = async (text: string) => {
    setLoading(true);
    setElaboration('');

    try {
      const response = await fetch(
        "https://ugupuowsvbevrwufalri.supabase.co/functions/v1/elaborate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setElaboration(data.elaboration);

      // Save using the passed-in handler
      if (cardId) {
        onSaveElaboration(cardId, data.elaboration);
      }

    } catch (error) {
      console.error("Error calling Supabase function:", error);
      setElaboration("Failed to get elaboration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md space-y-4 p-2">
      <div className='flex justify-between items-center'>
        <h2 className="font-semibold text-[#004D7C] lg:text-md md:text-sm text-xs px-2">Learning Assistant</h2>
        <button
          onClick={() => handleElaborate(flashcardContent)}
          className="flex items-center bg-[#88B1CA] text-white text-xs rounded-2xl p-1 px-3 gap-2 hover:bg-zinc-200 hover:text-black"
          disabled={loading}
        >
          {loading ? 'Running...' : 'Elaborate with AI'}
          <div className='h-full'>
            <img
              src={aiImg}
              alt="aiImg"
              className='lg:h-[1.5rem] md:h-[1.4rem] h-[1.3rem]'
            />
          </div>
        </button>
      </div>
      <div className="min-h-[4rem] max-h-[9.5rem] bg-gray-50 rounded mt-4 p-3 overflow-scroll">
        {elaboration && (
          <p className='lg:text-sm md:text-sm text-xs'>{elaboration}</p>
        )}
        {!elaboration && (
          <p className='lg:text-sm md:text-sm text-xs'>No elaboration yet.</p>
        )}
      </div>
    </div>
  );
};

export default Elaborator;
