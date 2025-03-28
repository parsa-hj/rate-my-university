import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import DropDown from "../components/dropdown";

function Rankings() {
  const [universities, setUniversities] = useState([]); // State to store fetched university data
  const [selectedCategory, setSelectedCategory] = useState("StudentLife"); // State to store selected category (default to StudentLife)
  const [scores, setScores] = useState([]); // State to store fetched scores data

  useEffect(() => {
    // Fetch universities data
    const fetchUniversities = async () => {
      try {
        const response = await fetch("http://localhost:5000/universities");
        const data = await response.json();
        setUniversities(data); // Set universities data
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    // Fetch average scores data
    const fetchScores = async () => {
      try {
        const response = await fetch("http://localhost:5000/avgscores");
        const data = await response.json();
        setScores(data); // Set scores data
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchUniversities();
    fetchScores();
  }, []);

  // Combine universities with scores, selecting the correct category dynamically
  const universitiesWithScores = useMemo(() => {
    return universities.map((university) => {
      const score = scores.find(
        (score) => score.UniversityID === university.UniversityID
      );
      return {
        ...university,
        score: score ? score[`Avg${selectedCategory}`] : null, // Dynamically access the score based on the selected category
      };
    });
  }, [universities, scores, selectedCategory]); // Recompute when universities, scores, or selectedCategory change

  // Sort universities based on the selected category
  const sortedUniversities = useMemo(() => {
    return universitiesWithScores.sort((a, b) => {
      if (a.score === null) return 1;
      if (b.score === null) return -1;
      return b.score - a.score; // Sort from highest to lowest score
    });
  }, [universitiesWithScores]); // Recompute only when universitiesWithScores change

  // Handle category selection from the dropdown
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Rankings</h1>
          <DropDown onSelect={handleCategorySelect} />
        </div>

        <div className="flex flex-col space-y-6">
          {sortedUniversities.length > 0 ? (
            sortedUniversities.map((university) => (
              <div
                key={university.UniversityID}
                className="flex border border-gray-200 shadow-lg rounded-lg p-4 w-full"
              >
                {/* Left side - Image */}
                <div
                  className="w-1/3 bg-cover rounded-l text-center overflow-hidden"
                  style={{
                    backgroundImage: `url(${
                      university.image_url || "/img/placeholder.jpg"
                    })`,
                  }}
                  title={university.name}
                ></div>

                {/* Right side - University Info */}
                <div className="flex flex-col justify-between p-4 w-2/3">
                  <h2 className="text-xl font-bold mb-2">{university.name}</h2>
                  <p className="text-gray-500 mb-2">{university.location}</p>
                  <p className="text-gray-600 mb-4">Size: {university.size}</p>
                  <p className="text-lg font-semibold text-gray-700">
                    Score:{" "}
                    {university.score !== null
                      ? university.score.toFixed(1)
                      : "Not Available"}
                  </p>
                  <div className="flex space-x-4 mt-4">
                    <Link
                      to={`/university/${university.UniversityID}`}
                      className="bg-[#3256E5] text-white py-2 px-4 rounded-md hover:bg-[#2744B8] transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      to={`/rating/${university.UniversityID}`}
                      className="border border-[#3256E5] text-[#3256E5] bg-white py-2 px-4 rounded-md hover:bg-[#3256E5] hover:text-white transition-colors"
                    >
                      Rate
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">Loading universities...</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Rankings;
