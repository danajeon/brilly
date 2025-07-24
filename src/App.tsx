import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Flashcards from "./pages/Flashcards";
import CreateNewSet from './pages/CreateNewSet';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/flashcards/:postId" element={<Flashcards />} />
        <Route path="/createnewset" element={<CreateNewSet />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;