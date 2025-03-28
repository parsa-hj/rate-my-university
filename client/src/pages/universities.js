import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import mizzou from "../assets/images/mizzou.png"; // Use placeholder if image URLs are not available in API response
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import { MapPin, Building2 } from "lucide-react";

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
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Universities
            </h1>
            <p className="text-gray-600">
              Explore universities and find the perfect match for your academic
              journey
            </p>
          </div>
        </div>

        {/* Universities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.length > 0 ? (
            universities.map((university) => (
              <div
                key={university.UniversityID}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image Section */}
                <div className="relative h-48">
                  <img
                    src={university.image_url || mizzou} // Use the URL from the database, fallback to placeholder if not available
                    alt={university.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
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

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      to={`/client-university/${university.UniversityID}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/client-rating/${university.UniversityID}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                    >
                      Rate
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
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

export default Universities;
