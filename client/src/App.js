import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import About from "./pages/about.js";
import Home from "./pages/home.js";
import Account from "./pages/account.js";
import University from "./pages/university.js";
import Universities from "./pages/universities.js";
import Rating from "./pages/rating.js";
import Rankings from "./pages/rankings.js";
import Login from "./pages/login.js";
import SignUp from "./pages/signup.js";

function App() {
  const domain = "your-domain.us.auth0.com";
  const clientId = "your-client-id";
  const audience = "your-api-audience";

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience, // Optional if you have an API setup
        scope: "openid profile email",
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/client-about" element={<About />} />
          <Route path="/client-account" element={<Account />} />
          <Route path="/client-rankings" element={<Rankings />} />
          <Route path="/client-university/:id" element={<University />} />
          <Route path="/client-universities" element={<Universities />} />
          <Route path="/client-rating/:id" element={<Rating />} />
          <Route path="/client-login" element={<Login />} />
          <Route path="/client-signup" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  );
}

export default App;
