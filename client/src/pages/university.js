import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ConfirmationDialog from "../components/ConfirmationDialog";
import CommentsSection from "../components/CommentsSection";
import RatingsDisplay from "../components/RatingsDisplay";
import { MapPin, Building2, GraduationCap, Star } from "lucide-react";

function University() {
  const { id } = useParams();
  const [university, setUniversity] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [facilities, setFacilities] = useState([]);

  // Fetch university data when the component mounts
  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/universities/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUniversity(data); // Store the university data in state
      } catch (error) {
        console.error("Error fetching university data:", error);
      }
    };

    fetchUniversityData();
  }, [id]); // Fetch data when the ID changes

  // Fetch ratings for the university
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/universities/${id}/ratings`
        );
        const data = await response.json();
        setRatings(data);
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
        const response = await fetch("http://localhost:5000/facilities");
        const data = await response.json();
        // Filter facilities for the current university
        const universityFacilities = data.filter(
          (facility) => facility.UniversityID === parseInt(id)
        );
        setFacilities(universityFacilities);
      } catch (error) {
        console.error("Error fetching facilities:", error);
      }
    };

    fetchFacilities();
  }, [id]); // Fetch facilities when the university ID changes

  // Function to calculate average ratings
  const calculateAverageRatings = () => {
    const averages = {
      StudentLife: 0,
      Cost: 0,
      DiningFood: 0,
      DormsHousing: 0,
      ClassesTeachers: 0,
      ReturnOnInvestment: 0,
      HealthSafety: 0,
      CitySetting: 0,
    };

    if (ratings.length > 0) {
      ratings.forEach((rating) => {
        averages.StudentLife += parseFloat(rating.StudentLife) || 0;
        averages.Cost += parseFloat(rating.Cost) || 0;
        averages.DiningFood += parseFloat(rating.DiningFood) || 0;
        averages.DormsHousing += parseFloat(rating.DormsHousing) || 0;
        averages.ClassesTeachers += parseFloat(rating.ClassesTeachers) || 0;
        averages.ReturnOnInvestment +=
          parseFloat(rating.ReturnOnInvestment) || 0;
        averages.HealthSafety += parseFloat(rating.HealthSafety) || 0;
        averages.CitySetting += parseFloat(rating.CitySetting) || 0;
      });

      const totalRatings = ratings.length;
      for (const key in averages) {
        averages[key] /= totalRatings; // Calculate the average
      }
    }
    return averages;
  };

  const averageRatings = calculateAverageRatings();

  const handleDelete = (ratingID) => {
    setConfirmationVisible(true); // Show the confirmation dialog
    setCommentToDelete(ratingID); // Set the comment to delete
  };

  const confirmDelete = async () => {
    console.log("Deleting comment with ID:", commentToDelete); // Log for debugging

    try {
      // Construct the correct DELETE URL
      const deleteUrl = `http://localhost:5000/ratings/${commentToDelete}`;
      console.log("Sending DELETE request to:", deleteUrl); // Log the request URL for debugging

      // Make the DELETE request to the backend
      const response = await fetch(deleteUrl, {
        method: "DELETE",
      });

      console.log("Delete response:", response); // Log the response

      if (response.ok) {
        console.log("Comment deleted successfully.");
        // Filter out the deleted rating from the state
        setRatings(
          ratings.filter((rating) => rating.RatingID !== commentToDelete)
        );
        setConfirmationVisible(false); // Hide the confirmation dialog
        setCommentToDelete(null); // Clear the selected rating to delete
        updateCategoryTable(); // Recalculate and update category table
      } else {
        const error = await response.json();
        console.error(
          "Failed to delete comment:",
          error.message || response.status
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const cancelDelete = () => {
    setConfirmationVisible(false); // Hide the confirmation dialog without deleting
    setCommentToDelete(null); // Clear the selected rating to delete
  };

  // Update the category table with the new average values
  const updateCategoryTable = async () => {
    const averages = calculateAverageRatings();

    try {
      const updateUrl = `http://localhost:5000/categories/${id}`; // Assuming UniversityID is the same as the 'id' for the university
      const response = await fetch(updateUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          avgStudentLife: averages.StudentLife,
          avgCost: averages.Cost,
          avgDiningFood: averages.DiningFood,
          avgDormsHousing: averages.DormsHousing,
          avgClassesTeachers: averages.ClassesTeachers,
          avgReturnOnInvestment: averages.ReturnOnInvestment,
          avgHealthSafety: averages.HealthSafety,
          avgCitySetting: averages.CitySetting,
        }),
      });

      if (response.ok) {
        console.log("Category table updated successfully.");
      } else {
        const error = await response.json();
        console.error("Failed to update category table:", error.message);
      }
    } catch (error) {
      console.error("Error updating category table:", error);
    }
  };

  const handleEdit = async (ratingID, updatedComment) => {
    try {
      const response = await fetch(
        `http://localhost:5000/ratings/${ratingID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ RatingComment: updatedComment }),
        }
      );

      if (response.ok) {
        setRatings((prevRatings) =>
          prevRatings.map((rating) =>
            rating.RatingID === ratingID
              ? { ...rating, RatingComment: updatedComment }
              : rating
          )
        );
        console.log("Comment updated successfully.");
      } else {
        console.error("Failed to update comment.");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
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
                  key={facility.FacilityID}
                  className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-gray-50"
                >
                  <h3 className="font-semibold text-lg text-blue-600 mb-3">
                    {facility.FacilityName}
                  </h3>
                  <p className="text-gray-700">
                    {facility.FDescription || "Description not available"}
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
          <Link
            to={`/client-rating/${university.UniversityID}`}
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <Star className="w-5 h-5 mr-2" />
            Rate this University
          </Link>
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
