import './App.css'
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Flashcards from "./pages/Flashcards";
import CreateNewSet from './pages/CreateNewSet';
import LandingPage from './pages/LandingPage';
import { NavBar } from './components/NavBar';

function App() {
  const [isDemo, setIsDemo] = useState(() => {
    return localStorage.getItem("demo") === "true";
  });

  useEffect(() => {
    localStorage.setItem("demo", String(isDemo));
  }, [isDemo]);

  return (
    <BrowserRouter>
      {/* pass isDemo to NavBar */}
      <NavBar isDemo={isDemo} setIsDemo={setIsDemo} />

      <Routes>
        {/* pass setIsDemo into LandingPage so the button can flip it */}
        <Route path="/" element={<LandingPage setIsDemo={setIsDemo} />} />

        <Route path="/flashcards/:postId" element={<Flashcards isDemo={isDemo} />} />
        <Route path="/createnewset" element={<CreateNewSet isDemo={isDemo} />} />
        <Route path="/dashboard" element={<Dashboard isDemo={isDemo} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;