import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/20/solid"; // Importing the trash icon from Heroicons

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
      <div className="flex justify-around mb-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="mr-2 text-2xl">Student Life:</span>
            <span className="ml-2 text-xl font-semibold">
              {averageRatings.StudentLife.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-2xl">Cost:</span>
            <span className="ml-2 text-xl font-semibold">
              {averageRatings.Cost.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-2xl">Dining and Food:</span>
            <span className="ml-2 text-xl font-semibold">
              {averageRatings.DiningFood.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-2xl">Dorms and Housing:</span>
            <span className="ml-2 text-xl font-semibold">
              {averageRatings.DormsHousing.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <span className="mr-2 text-2xl">Classes and Teachers:</span>
            <span className="ml-2 text-xl font-semibold">
              {averageRatings.ClassesTeachers.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-2xl">Return on Investment:</span>
            <span className="ml-2 text-xl font-semibold">
              {averageRatings.ReturnOnInvestment.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-2xl">Health and Safety:</span>
            <span className="ml-2 text-xl font-semibold">
              {averageRatings.HealthSafety.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-2xl">City Setting:</span>
            <span className="ml-2 text-xl font-semibold">
              {averageRatings.CitySetting.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      {/* Display Comments */}
      <div className="mt-20 ml-40">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {ratings.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating, index) => (
              <div
                key={index}
                className="border p-4 rounded-md shadow-md mr-20 relative"
              >
                {/* Delete button positioned on the top right */}
                <button
                  onClick={() => handleDelete(rating.RatingID)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-6 w-6" />
                </button>

                <p className="text-lg font-medium">Comment:</p>
                <p className="text-gray-700">{rating.RatingComment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmationVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this comment?
            </h3>
            <div className="space-x-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-black rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
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
