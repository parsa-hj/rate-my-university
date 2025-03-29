import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import DropDown from "../components/dropdown";
import { Star, MapPin, Building2 } from "lucide-react";
import { getUniversities, getUniversityAverages } from "../lib/api";
import { useSupabaseQuery } from "../hooks/useSupabaseQuery";
import ErrorMessage from "../components/ErrorMessage";
import { supabase } from "../lib/supabaseClient";

function Rankings() {
  const [selectedCategory, setSelectedCategory] = useState("StudentLife");
  const [scores, setScores] = useState([]);

  // Fetch universities
  const {
    data: universities,
    loading: universitiesLoading,
    error: universitiesError,
  } = useSupabaseQuery(() => getUniversities());

  // Replace the useSupabaseQuery for scores with useEffect
  useEffect(() => {
    const fetchScores = async () => {
      if (!universities) return;

      const averagesPromises = universities.map(async (university) => {
        try {
          const averages = await getUniversityAverages(university.universityid);
          return {
            universityid: university.universityid,
            avgstudentlife: averages?.avgstudentlife || 0,
            avgclassesteachers: averages?.avgclassesteachers || 0,
            avgcost: averages?.avgcost || 0,
            avgreturnoninvestment: averages?.avgreturnoninvestment || 0,
            avgdiningfood: averages?.avgdiningfood || 0,
            avgdormshousing: averages?.avgdormshousing || 0,
            avghealthsafety: averages?.avghealthsafety || 0,
            avgcitysetting: averages?.avgcitysetting || 0,
          };
        } catch (error) {
          console.error(
            `Error fetching averages for university ${university.universityid}:`,
            error
          );
          return null;
        }
      });
      const newScores = await Promise.all(averagesPromises);
      setScores(newScores.filter(Boolean));
    };

    fetchScores();
  }, [universities]);

  // Real-time subscription effect
  useEffect(() => {
    const subscription = supabase
      .channel("rating_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rating",
        },
        async () => {
          if (universities) {
            const newScores = await Promise.all(
              universities.map((university) =>
                getUniversityAverages(university.universityid)
              )
            );
            setScores(newScores.filter(Boolean));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [universities]);

  // Combine universities with scores
  const universitiesWithScores = useMemo(() => {
    if (!universities || !scores) return [];
    return universities.map((university) => {
      const score = scores.find(
        (score) => score.universityid === university.universityid
      );
      return {
        ...university,
        score: score ? score[`avg${selectedCategory.toLowerCase()}`] : 0,
      };
    });
  }, [universities, scores, selectedCategory]);

  // Sort universities
  const sortedUniversities = useMemo(() => {
    return universitiesWithScores.sort((a, b) => {
      if (a.score === null) return 1;
      if (b.score === null) return -1;
      return b.score - a.score;
    });
  }, [universitiesWithScores]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  // Handle loading state
  if (universitiesLoading || !scores.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">Loading universities...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Handle error state
  if (universitiesError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage
            message={universitiesError}
            onRetry={() => window.location.reload()}
          />
        </div>
        <Footer />
      </div>
    );
  }

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
                key={university.universityid}
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
                            to={`/client-university/${university.universityid}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </Link>
                          <Link
                            to={`/client-rating/${university.universityid}`}
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
              <p className="text-gray-500 text-lg">No universities found.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Rankings;
