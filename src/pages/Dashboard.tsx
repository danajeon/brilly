import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Info needed to connect to Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Interface allows declaration merging
interface CardSet {
  id: string;
  title: string;
  user: string;
}

export default function Dashboard() {
  const [cardSetArray, setCardSetArray] = useState<CardSet[]>([]);

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

  return (
    <div className="min-h-screen p-4 bg-[hotpink]">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      <div className="space-y-2">
        {cardSetArray.length === 0 && (
          <p className="text-gray-700">No card sets found.</p>
        )}
        {cardSetArray.map((cardSet) => (
          <div
            key={cardSet.id}
            className="p-4 border border-fuchsia-500 rounded bg-white shadow"
          >
            <p className="text-lg font-medium">{cardSet.title}</p>
            <p className="text-sm text-gray-500">User: {cardSet.user}</p>
          </div>
        ))}
      </div>
    </div>
  );
}