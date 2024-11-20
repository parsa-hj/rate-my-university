import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import mizzou from "../assets/images/mizzou.png"; // Use placeholder if image URLs are not available in API response
import { Link } from "react-router-dom";
import Footer from "../components/footer";

function Universities() {
  const [universities, setUniversities] = useState([]); // State to store fetched university data

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    const fetchUniversities = async () => {
      try {
        const response = await fetch("http://localhost:5000/universities");
        const data = await response.json();
        setUniversities(data); // Set the fetched data into the state
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchUniversities();
  }, []); // Empty dependency array to ensure this runs once when component mounts

  return (
    <div>
      <Navbar />
      <h1 className="text-2xl font-bold mt-12 ml-20">Results</h1>
      <div className="flex justify-center space-x-14 p-6 flex-wrap">
        {/* Map through the universities array and render a card for each university */}
        {universities.length > 0 ? (
          universities.map((university) => (
            <div
              key={university.UniversityID}
              className="border border-gray-200 shadow-lg rounded-lg p-4 max-w-xs mb-6"
            >
              <img
                src={university.image_url || mizzou} // Use the URL from the database, fallback to placeholder if not available
                alt={university.name}
                className="w-full h-auto mb-4 rounded-lg"
              />
              <h2 className="text-xl font-bold mb-2">{university.name}</h2>
              <p className="text-gray-500 mb-4">{university.location}</p>
              <div className="flex space-x-4">
                <button className="bg-[#3256E5] text-white py-2 px-4 rounded-md">
                  <Link to={`/client-university/${university.UniversityID}`}>
                    View
                  </Link>
                </button>
                <button className="border border-[#3256E5] text-[#3256E5] bg-white py-2 px-4 rounded-md">
                  <Link to={`/client-rating/${university.UniversityID}`}>
                    Rate
                  </Link>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Loading universities...</p>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Universities;
