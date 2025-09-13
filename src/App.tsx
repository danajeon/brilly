import './App.css'
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Flashcards from "./pages/Flashcards";
import CreateNewSet from './pages/CreateNewSet';
import LandingPage from './pages/LandingPage';
import AuthPage from "./pages/AuthPage";
import { NavBar } from './components/NavBar';
import { createClient } from '@supabase/supabase-js';
import { Footer } from './components/Footer';

// Info needed to connect to Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  const [isDemo, setIsDemo] = useState(() => {
    return localStorage.getItem("demo") === "true";
  });

  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    localStorage.setItem("demo", String(isDemo));
  }, [isDemo]);

  useEffect(() => {
    // check for existing session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    // listen to auth changes (sign in / sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <NavBar
        isDemo={isDemo}
        setIsDemo={setIsDemo}
        user={user}
        setUser={setUser}
      />

      <Routes>
        <Route path="/" element={<LandingPage setIsDemo={setIsDemo} />} />

        <Route path="/flashcards/:postId" element={<Flashcards isDemo={isDemo} />} />
        <Route path="/createnewset" element={<CreateNewSet isDemo={isDemo} user={user} />} />
        <Route path="/dashboard" element={<Dashboard isDemo={isDemo} user={user} />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
