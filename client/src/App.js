import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import About from "./pages/about.js";
import Home from "./pages/home.js";
import Account from "./pages/account.js";
import University from "./pages/university.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<Account />} />
        <Route path="/university" element={<University />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
