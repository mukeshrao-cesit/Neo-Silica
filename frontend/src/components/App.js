
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Draw  from './Draw.js'
import LoginScreen from "./Screens/LoginScreen.js";
import LandingScreen from "./Screens/LandingScreen.js";
import PaperScreen from "./Screens/PaperScreen.js";
function App() {
  return (

    <BrowserRouter>
      <Routes>
      <Route path="/diagram/:id" element={<PaperScreen />} />
        <Route path="/paper/:id" element={<Draw />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/" element={<LandingScreen />} />

       
      </Routes>
    </BrowserRouter>
  );
}

export default App;