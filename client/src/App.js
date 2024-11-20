import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import About from "./pages/about.js";
import Home from "./pages/home.js";
import Account from "./pages/account.js";
import University from "./pages/university.js";
import Universities from "./pages/universities.js";
import Rating from "./pages/rating.js";
import Rankings from "./pages/rankings.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/client-about" element={<About />} />
        <Route path="/client-account" element={<Account />} />
        <Route path="/client-rankings" element={<Rankings />} />
        <Route path="/client-university/:id" element={<University />} />
        <Route path="/client-universities" element={<Universities />} />
        <Route path="/client-rating/:id" element={<Rating />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
