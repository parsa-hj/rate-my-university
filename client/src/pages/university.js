import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ConfirmationDialog from "../components/ConfirmationDialog";
import CommentsSection from "../components/CommentsSection";
import { MapPin, Building2, GraduationCap, Star } from "lucide-react";
import {
  getUniversityById,
  getRatings,
  getFacilities,
  deleteRating,
  updateRating,
  getUniversityAverages,
  updateCategoryAverages,
} from "../lib/api";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";

function University() {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [averageRatings, setAverageRatings] = useState({
    studentlife: 0,
    cost: 0,
    diningfood: 0,
    dormshousing: 0,
    classesteachers: 0,
    returnoninvestment: 0,
    healthsafety: 0,
    citysetting: 0,
  });
  const { user } = useAuth();

  // Fetch university data when the component mounts
  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const data = await getUniversityById(id);
        setUniversity(data);
      } catch (error) {
        console.error("Error fetching university data:", error);
      }
    };

    fetchUniversityData();
  }, [id]);

  // Fetch ratings for the university
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getRatings(id);
        setRatings(data);

        // Calculate and update averages
        const newAverages = calculateAverages(data);
        if (newAverages) {
          await updateCategoryAverages(parseInt(id), newAverages);
          setAverageRatings(newAverages);
        }
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchRatings();
  }, [id]);

  // Fetch facilities data when the component mounts
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await getFacilities();
        const universityFacilities = data.filter(
          (facility) => facility.universityid === parseInt(id)
        );
        setFacilities(universityFacilities);
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    };

    fetchFacilities();
  }, [id]);

  // Add new useEffect for fetching averages
  useEffect(() => {
    const fetchAverages = async () => {
      try {
        const data = await getUniversityAverages(id);
        if (data) {
          setAverageRatings({
            studentlife: data.avgstudentlife || 0,
            cost: data.avgcost || 0,
            diningfood: data.avgdiningfood || 0,
            dormshousing: data.avgdormshousing || 0,
            classesteachers: data.avgclassesteachers || 0,
            returnoninvestment: data.avgreturnoninvestment || 0,
            healthsafety: data.avghealthsafety || 0,
            citysetting: data.avgcitysetting || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching average ratings:", error);
      }
    };

    fetchAverages();
  }, [id]);

  // Modify the existing subscription useEffect
  useEffect(() => {
    const ratingSubscription = supabase
      .channel("rating_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rating",
          filter: `universityid=eq.${id}`,
        },
        async (payload) => {
          console.log("Rating change detected in University:", payload);
          // Fetch new ratings and recalculate averages
          const ratingsData = await getRatings(id);
          setRatings(ratingsData);

          const newAverages = calculateAverages(ratingsData);
          if (newAverages) {
            await updateCategoryAverages(parseInt(id), newAverages);
            setAverageRatings(newAverages);
          }
        }
      )
      .subscribe();

    return () => {
      ratingSubscription.unsubscribe();
    };
  }, [id]);

  const handleDelete = (ratingid) => {
    setConfirmationVisible(true);
    setCommentToDelete(ratingid);
  };

  const confirmDelete = async () => {
    try {
      await deleteRating(commentToDelete);
      setRatings(
        ratings.filter((rating) => rating.ratingid !== commentToDelete)
      );
      setConfirmationVisible(false);
      setCommentToDelete(null);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const cancelDelete = () => {
    setConfirmationVisible(false);
    setCommentToDelete(null);
  };

  const handleEdit = async (ratingid, updatedComment) => {
    try {
      await updateRating(ratingid, updatedComment);
      setRatings((prevRatings) =>
        prevRatings.map((rating) =>
          rating.ratingid === ratingid
            ? { ...rating, ratingcomment: updatedComment }
            : rating
        )
      );
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  // Add this function to calculate averages
  const calculateAverages = (ratings) => {
    if (!ratings.length) return null;

    const sums = ratings.reduce(
      (acc, rating) => ({
        studentlife: acc.studentlife + rating.studentlife,
        classesteachers: acc.classesteachers + rating.classesteachers,
        cost: acc.cost + rating.cost,
        returnoninvestment: acc.returnoninvestment + rating.returnoninvestment,
        diningfood: acc.diningfood + rating.diningfood,
        dormshousing: acc.dormshousing + rating.dormshousing,
        healthsafety: acc.healthsafety + rating.healthsafety,
        citysetting: acc.citysetting + rating.citysetting,
      }),
      {
        studentlife: 0,
        classesteachers: 0,
        cost: 0,
        returnoninvestment: 0,
        diningfood: 0,
        dormshousing: 0,
        healthsafety: 0,
        citysetting: 0,
      }
    );

    const count = ratings.length;
    return Object.keys(sums).reduce(
      (acc, key) => ({
        ...acc,
        [key]: Number((sums[key] / count).toFixed(1)),
      }),
      {}
    );
  };

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src={university.image_url}
          alt={university.name}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {university.name}
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{university.location}</span>
              </div>
              <div className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                <span>{university.size}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Ratings Display */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold">University Ratings</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Object.entries(averageRatings).map(([category, rating]) => (
              <div key={category} className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  {category.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-blue-600">
                    {rating.toFixed(1)}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-500">/ 5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Facilities Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <Building2 className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold">Popular Facilities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.length > 0 ? (
              facilities.map((facility) => (
                <div
                  key={facility.facilityid}
                  className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-gray-50"
                >
                  <h3 className="font-semibold text-lg text-blue-600 mb-3">
                    {facility.facilityname}
                  </h3>
                  <p className="text-gray-700">
                    {facility.facilitydescription ||
                      "Description not available"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-lg col-span-full text-center py-8">
                No facilities available for this university.
              </p>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <Star className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold">Student Reviews</h2>
          </div>
          <div className="max-h-[800px] overflow-y-auto pr-2">
            <CommentsSection
              ratings={ratings}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          </div>
        </div>

        {/* Rate Button */}
        <div className="flex justify-center mt-8">
          {user ? (
            <Link
              to={`/client-rating/${university.universityid}`}
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              <Star className="w-5 h-5 mr-2" />
              Rate this University
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              <Star className="w-5 h-5 mr-2" />
              Sign in to Rate
            </Link>
          )}
        </div>
      </div>

      {confirmationVisible && (
        <ConfirmationDialog onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}

      <Footer />
    </div>
  );
}

export default University;
