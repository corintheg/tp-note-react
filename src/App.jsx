import {Routes, Route} from 'react-router'
import Home from "./pages/Home/Home.jsx";
import GameDetails from "./pages/GameDetails/GameDetails.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/games/:id" element={<GameDetails />} />
      </Routes>
    </>
  )
}

export default App
