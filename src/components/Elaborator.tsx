import { useState } from 'react';

const FlashcardElaborator = () => {
  const [flashcardContent, setFlashcardContent] = useState('');
  const [elaboration, setElaboration] = useState('');
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      console.error("Error calling Supabase function:", error);
      setElaboration("Failed to get elaboration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto border rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-semibold">Flashcard</h2>
      <input
        type="text"
        value={flashcardContent}
        onChange={(e) => setFlashcardContent(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        onClick={() => handleElaborate(flashcardContent)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Elaborating...' : 'Elaborate with AI'}
      </button>
      {elaboration && (
        <div className="mt-4 p-3 border bg-gray-50 rounded">
          <h3 className="font-medium">Elaboration:</h3>
          <p>{elaboration}</p>
        </div>
      )}
    </div>
  );
};

export default FlashcardElaborator;
