import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/navbar.js";
import Footer from "../components/footer.js";
import homepageImg from "../assets/images/homepage-img.png";
import illustration1 from "../assets/images/illustration1.png";
import illustration2 from "../assets/images/illustration2.png";
import illustration3 from "../assets/images/illustration3.png";
import { Search, ThumbsUp } from "lucide-react";
import { getUniversities } from "../lib/api";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const universities = await getUniversities(searchQuery);

      if (universities.length > 0) {
        navigate(`/client-university/${universities[0].universityid}`);
      } else {
        alert("University not found");
      }
    } catch (error) {
      console.error("Error fetching university data:", error);
      alert("Error searching for university");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative">
        <div className="w-full h-[500px] relative">
          <img
            src={homepageImg}
            alt="University Campus"
            className="w-full h-full object-cover brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-blue-900/30"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Find and Rate Your University
            </h1>
            <p className="text-xl text-white mb-8 max-w-2xl">
              Discover honest reviews and ratings from students about
              universities worldwide
            </p>
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search for your university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-4 rounded-full text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
                onClick={handleSearch}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-48 flex items-center justify-center">
                  <img
                    src={illustration3}
                    alt="Find your University"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  Find your University
                </h3>
                <p className="text-gray-600 text-lg">
                  Search and discover universities from our extensive database
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-48 flex items-center justify-center">
                  <img
                    src={illustration2}
                    alt="Rate your university"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  Rate your university
                </h3>
                <p className="text-gray-600 text-lg">
                  Share your experience by rating various aspects of your
                  university
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-48 flex items-center justify-center">
                  <img
                    src={illustration1}
                    alt="Manage your ratings"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-3">Manage your ratings</h3>
                <p className="text-gray-600 text-lg">
                  Keep track of all your ratings and update them as needed
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 h-48 flex items-center justify-center">
                  <ThumbsUp className="w-24 h-24 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">
                  Like or dislike reviews
                </h3>
                <p className="text-gray-600 text-lg">
                  Vote on reviews to help others find the most helpful
                  information
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to share your university experience?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are helping others make informed
            decisions about their education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base rounded-full inline-block"
            >
              Rate Your University
            </Link>
            <Link
              to="/client-universities"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 text-base rounded-full inline-block"
            >
              Browse Universities
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
