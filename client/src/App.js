import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import About from "./pages/about.js";
import Home from "./pages/home.js";
import Account from "./pages/account.js";
import University from "./pages/university.js";
import Universities from "./pages/universities.js";
import Rating from "./pages/rating.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<Account />} />
        <Route path="/university" element={<University />} />
        <Route path="/universities" element={<Universities />} />
        <Route path="/rating" element={<Rating />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
