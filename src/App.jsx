import {Routes, Route} from 'react-router'
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./pages/Home/Home.jsx";
import Collection from "./pages/Collection/Collection.jsx";
import GameDetails from "./pages/GameDetails/GameDetails.jsx";
import DeveloperDetails from "./pages/DeveloperDetails/DeveloperDetails.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/collection" element={<Collection/>} />
        <Route path="/games/:id" element={<GameDetails />} />
        <Route path="/developers/:id" element={<DeveloperDetails />} />
      </Routes>
    </>
  )
}

export default App
