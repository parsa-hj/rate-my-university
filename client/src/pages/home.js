import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import Navbar from "../components/navbar.js";
import Footer from "../components/footer.js";
import homepageImg from "../assets/images/homepage-img.png";
import {
  AcademicCapIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid"; // Importing Heroicons v2
import illustration1 from "../assets/images/illustration1.png";
import illustration2 from "../assets/images/illustration2.png";
import illustration3 from "../assets/images/illustration3.png";
import { Link } from "react-router-dom";

function Home() {
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search input
  const navigate = useNavigate();

  // Function to handle the search
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/universities?name=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        navigate(`/client-university/${data[0].UniversityID}`);
      } else {
        alert("University not found");
      }
    } catch (error) {
      console.error("Error fetching university data:", error);
    }
  };
  return (
    <>
      <Navbar />
      <div className="relative">
        <img
          src={homepageImg}
          alt="Homepage"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-white text-4xl font-bold mb-8">
            Find your University
          </h1>

          {/* Input Box */}
          <div className="relative w-full max-w-md">
            {/* University Icon */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <AcademicCapIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>

            {/* Input Field */}
            <input
              type="text"
              placeholder="University Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
              onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Trigger search on Enter key
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />

            {/* Search Icon */}
            <div
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onClick={handleSearch} // Trigger search on icon click
            >
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Illustrations Section */}
      <div className="flex justify-center space-x-40 mt-12">
        {" "}
        {/* Flex container for images */}
        {/* Illustration 1 */}
        <div className="flex flex-col items-center">
          <img
            src={illustration1}
            alt="Manage your ratings"
            className="h-68 w-auto"
          />{" "}
          {/* Set desired height */}
          <span className="font-bold mt-2 text-2xl">Manage your ratings</span>
        </div>
        {/* Illustration 2 */}
        <div className="flex flex-col items-center">
          <img
            src={illustration2}
            alt="Rate your university"
            className="h-68 w-auto"
          />{" "}
          {/* Set desired height */}
          <span className="font-bold mt-2 text-2xl">Rate your university</span>
        </div>
        {/* Illustration 3 */}
        <div className="flex flex-col items-center">
          <img
            src={illustration3}
            alt="Like or dislike reviews"
            className="h-68 w-auto mt-11"
          />{" "}
          {/* Set desired height */}
          <span className="font-bold mt-2 text-2xl">
            Like or dislike reviews
          </span>
        </div>
      </div>

      <div className="mt-20 flex justify-center">
        {" "}
        {/* Added flex and justify-center to center the button */}
        <button className="bg-[#3256E5] text-lg text-white font-bold py-4 px-8 py-2 px-4 rounded-lg hover:bg-[#2745B5] transition duration-300">
          <Link to="/client-account">My Ratings</Link>
        </button>
      </div>
      <Footer />
    </>
  );
}

export default Home;
