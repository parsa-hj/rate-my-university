import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import DropDown from "../components/dropdown";
import { Star, MapPin, Building2 } from "lucide-react";

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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                University Rankings
              </h1>
              <p className="text-gray-600">
                Discover top universities based on different criteria
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">
                Sort by:
              </span>
              <DropDown
                onSelect={handleCategorySelect}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>
        </div>

        {/* Universities List */}
        <div className="space-y-6">
          {sortedUniversities.length > 0 ? (
            sortedUniversities.map((university) => (
              <div
                key={university.UniversityID}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image Section */}
                  <div
                    className="w-full md:w-1/3 h-48 md:h-auto bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${
                        university.image_url || "/img/placeholder.jpg"
                      })`,
                    }}
                  ></div>

                  {/* Content Section */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {university.name}
                        </h2>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{university.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-4">
                          <Building2 className="w-4 h-4 mr-1" />
                          <span>{university.size}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 fill-current mr-2" />
                          <span className="text-xl font-bold text-blue-600">
                            {university.score !== null
                              ? university.score.toFixed(1)
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <Link
                            to={`/client-university/${university.UniversityID}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </Link>
                          <Link
                            to={`/client-rating/${university.UniversityID}`}
                            className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                          >
                            Rate
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-lg">Loading universities...</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Rankings;
