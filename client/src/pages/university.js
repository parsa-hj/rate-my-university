import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ConfirmationDialog from "../components/ConfirmationDialog";
import CommentsSection from "../components/CommentsSection";
import RatingsDisplay from "../components/RatingsDisplay";
import { Link } from "react-router-dom";

function University() {
  const { id } = useParams(); // Get the university ID from the URL
  const [university, setUniversity] = useState(null); // State to store university data
  const [ratings, setRatings] = useState([]); // State to store ratings
  const [confirmationVisible, setConfirmationVisible] = useState(false); // State to show confirmation dialog
  const [commentToDelete, setCommentToDelete] = useState(null); // State to store the comment ID to be deleted

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

  if (!university) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div>
      <Navbar />
      <img
        src={university.image_url}
        alt={university.name}
        className="w-full h-80 object-cover mb-4"
      />
      <h1 className="text-3xl font-bold text-center mb-6 mt-10">
        {university.name}
      </h1>
      <RatingsDisplay averageRatings={averageRatings} />
      <CommentsSection ratings={ratings} onDelete={handleDelete} />

      {confirmationVisible && (
        <ConfirmationDialog onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}

      {/* Rate Button */}
      <div className="flex justify-center mt-10">
        <Link to={`/rating/${university.UniversityID}`}>
          <button className="text-white py-2 px-4 rounded-md bg-[#3256E5]">
            Rate this University
          </button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default University;
