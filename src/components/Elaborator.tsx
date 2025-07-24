import { useState, useEffect } from 'react';

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
    <div className="p-4 max-w-md mx-auto border rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Elaborate with AI</h2>
      {/* <input
        type="text"
        value={flashcardContent}
        onChange={(e) => setFlashcardContent(e.target.value)}
        className="w-full p-2 border rounded"
      /> */}
      <button
        onClick={() => handleElaborate(flashcardContent)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Running...' : 'Run'}
      </button>
        <div className="mt-4 p-3 border bg-gray-50 rounded">
          <h3 className="font-medium">Elaboration:</h3>
            {elaboration && (
              <p>{elaboration}</p>
            )}
            {!elaboration && (
              <p>No elaboration yet.</p>
            )}
        </div>
    </div>
  );
};

export default Elaborator;
